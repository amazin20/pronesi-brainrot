#!/usr/bin/env python3
"""Lossless visual-size pass for embedded-texture GLB files.

- Geometry/accessor bytes are copied byte-for-byte.
- Embedded PNG/JPEG textures are converted to lossless WebP.
- Every converted image is decoded and compared pixel-for-pixel before output.
- EXT_texture_webp is written as required so modern GLTFLoader builds can load it.

Usage:
  python tools/glb-lossless-webp.py input.glb output.glb
"""
from __future__ import annotations
import io, json, struct, sys
from pathlib import Path
from PIL import Image

JSON_CHUNK=0x4E4F534A
BIN_CHUNK=0x004E4942

def read_glb(path: Path):
    raw=path.read_bytes()
    magic,version,total=struct.unpack_from('<4sII',raw,0)
    if magic!=b'glTF' or version!=2 or total!=len(raw):
        raise ValueError('Expected a valid glTF 2.0 GLB')
    off=12; doc=None; blob=None
    while off<total:
        ln,typ=struct.unpack_from('<II',raw,off); off+=8
        data=raw[off:off+ln]; off+=ln
        if typ==JSON_CHUNK: doc=json.loads(data.decode('utf-8').rstrip(' \t\r\n\0'))
        elif typ==BIN_CHUNK: blob=data
    if doc is None or blob is None: raise ValueError('GLB must contain JSON and BIN chunks')
    return doc,blob

def write_glb(doc, blob: bytes, path: Path):
    j=json.dumps(doc,separators=(',',':'),ensure_ascii=False).encode('utf-8')
    j+=b' '*((-len(j))%4); blob+=b'\0'*((-len(blob))%4)
    total=12+8+len(j)+8+len(blob)
    out=bytearray(struct.pack('<4sII',b'glTF',2,total))
    out+=struct.pack('<II',len(j),JSON_CHUNK)+j
    out+=struct.pack('<II',len(blob),BIN_CHUNK)+blob
    path.write_bytes(out)

def optimize(src: Path,dst: Path):
    original_doc,original_bin=read_glb(src)
    doc=json.loads(json.dumps(original_doc))
    bvs=doc.get('bufferViews',[]); replacements={}; rows=[]
    for idx,image in enumerate(doc.get('images',[])):
        bvi=image.get('bufferView')
        if bvi is None: continue
        bv=bvs[bvi]; off=bv.get('byteOffset',0); ln=bv['byteLength']
        source=original_bin[off:off+ln]
        im=Image.open(io.BytesIO(source)); mode='RGBA' if im.mode=='RGBA' else 'RGB'; im=im.convert(mode)
        before=im.tobytes(); out=io.BytesIO()
        im.save(out,'WEBP',lossless=True,quality=100,method=4)
        webp=out.getvalue(); check=Image.open(io.BytesIO(webp)).convert(mode)
        if check.size!=im.size or check.tobytes()!=before:
            raise RuntimeError(f'Lossless verification failed for image {idx}')
        replacements[bvi]=webp; image['mimeType']='image/webp'; image.pop('uri',None)
        rows.append((idx,len(source),len(webp),im.size))

    rebuilt=bytearray()
    for i,bv in enumerate(bvs):
        rebuilt+=b'\0'*((-len(rebuilt))%4)
        old_off=bv.get('byteOffset',0); old_len=bv['byteLength']
        data=replacements.get(i,original_bin[old_off:old_off+old_len])
        bv['byteOffset']=len(rebuilt); bv['byteLength']=len(data); rebuilt+=data

    used=set(doc.get('extensionsUsed',[])); required=set(doc.get('extensionsRequired',[]))
    used.add('EXT_texture_webp'); required.add('EXT_texture_webp')
    doc['extensionsUsed']=sorted(used); doc['extensionsRequired']=sorted(required)
    for tex in doc.get('textures',[]):
        if 'source' in tex:
            s=tex.pop('source'); tex.setdefault('extensions',{})['EXT_texture_webp']={'source':s}
    if doc.get('buffers'): doc['buffers'][0]['byteLength']=len(rebuilt)
    write_glb(doc,bytes(rebuilt),dst)

    # Exact verification for every non-image bufferView.
    out_doc,out_bin=read_glb(dst)
    for i,old_bv in enumerate(original_doc.get('bufferViews',[])):
        if i in replacements: continue
        a=old_bv.get('byteOffset',0); old=original_bin[a:a+old_bv['byteLength']]
        new_bv=out_doc['bufferViews'][i]; b=new_bv.get('byteOffset',0); new=out_bin[b:b+new_bv['byteLength']]
        if old!=new: raise RuntimeError(f'Geometry/bufferView {i} changed')

    print(f'{src.name}: {src.stat().st_size:,} -> {dst.stat().st_size:,} bytes')
    for i,a,b,size in rows: print(f'  texture {i} {size}: {a:,} -> {b:,} bytes (pixel-exact)')

if __name__=='__main__':
    if len(sys.argv)!=3: raise SystemExit('usage: glb-lossless-webp.py input.glb output.glb')
    optimize(Path(sys.argv[1]),Path(sys.argv[2]))
