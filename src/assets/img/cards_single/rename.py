from os import walk
from shutil import copyfile
d0 = "."
d1 = "out"




f = []
for (dirpath, dirnames, filenames) in walk("."):
    f.extend(filenames)
    break

pngs = [int(fn[5:-4]) for fn in f if fn.endswith("png")]
pngs.sort()
print(pngs)
colors=['C','S','D','H']
values = ['A','K','Q','J','10','9','8','7','6','5','4','3','2']

c = 0
v = 0
for i in range(1,53):
    print(i,colors[c],values[v])
    copyfile(f"{d0}/slice{i}.png", f"{d1}/{colors[c]}{values[v]}.png" )
    v = v+1
    if v == len(values):
        c = c+1
        v = 0
    

