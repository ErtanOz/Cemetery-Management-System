from PIL import Image
import numpy as np,json, pathlib, shutil
root=pathlib.Path(__file__).parent; out=root/'dist'
im=np.array(Image.open(root/'source.png').convert('RGB')).astype(int)
r,g,b=im[:,:,0],im[:,:,1],im[:,:,2]
masks={'ink':(im.max(2)<205)&(im.max(2)-im.min(2)<65),'green':(g>r*1.25)&(g>b*1.15)&(g<230),'purple':(r>g*1.3)&(b>g*1.2)&(g<150)}
def simplify(p,eps=.55):
 if len(p)<3:return p
 a=np.array(p[0]); z=np.array(p[-1]);v=z-a
 if np.dot(v,v)==0:d=np.linalg.norm(np.array(p)-a,axis=1)
 else:
  t=np.clip((np.array(p)-a)@v/np.dot(v,v),0,1);d=np.linalg.norm(np.array(p)-(a+t[:,None]*v),axis=1)
 i=int(d.argmax())
 return simplify(p[:i+1],eps)[:-1]+simplify(p[i:],eps) if d[i]>eps else [p[0],p[-1]]
def trace(mask):
 edges={}; h,w=mask.shape
 def add(a,z):edges.setdefault(a,[]).append(z)
 for y,x in zip(*np.where(mask)):
  if y==0 or not mask[y-1,x]:add((int(x),int(y)),(int(x+1),int(y)))
  if x==w-1 or not mask[y,x+1]:add((int(x+1),int(y)),(int(x+1),int(y+1)))
  if y==h-1 or not mask[y+1,x]:add((int(x+1),int(y+1)),(int(x),int(y+1)))
  if x==0 or not mask[y,x-1]:add((int(x),int(y+1)),(int(x),int(y)))
 paths=[]
 while edges:
  start=next(iter(edges));p=[start];cur=start
  while True:
   nxt=edges[cur].pop()
   if not edges[cur]:del edges[cur]
   p.append(nxt);cur=nxt
   if cur==start:break
  if len(p)>4:
   q=simplify(p); paths.append('M'+'L'.join(f'{x},{y}' for x,y in q[:-1])+'Z')
 return ''.join(paths)
paths={k:trace(v) for k,v in masks.items()}
(root/'traces.json').write_text(json.dumps(paths))
colors={'ink':'#27312e','green':'#07853c','purple':'#902775'}
svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 888"><title>Melaten, vektorisierter Übersichtsplan</title><desc>Konturvektorisierung der bereitgestellten Rastervorlage. Bildkoordinaten, nicht georeferenziert. Keine Einzelgrabgrenzen.</desc><rect width="800" height="888" fill="white"/>'
for k,p in paths.items():svg+=f'<path id="{k}" fill="{colors[k]}" fill-rule="evenodd" d="{p}"/>'
svg+='</svg>';(out/'melaten-vektor.svg').write_text(svg)
print('Vector SVG',len(svg),'bytes')
