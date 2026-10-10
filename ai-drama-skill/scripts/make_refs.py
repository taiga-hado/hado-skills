#!/usr/bin/env python3
# 参照画像を gpt-image-2 で作る。使い方: python3 make_refs.py out.png "<prompt>"  （OPENAI_API_KEY は ~/.zshrc から）
import sys,os,json,base64,urllib.request,subprocess
key=os.environ.get("OPENAI_API_KEY") or subprocess.run("grep OPENAI_API_KEY ~/.zshrc | sed -E 's/.*OPENAI_API_KEY=//; s/[\"'\\'']//g' | tr -d ' '",shell=True,capture_output=True,text=True).stdout.strip()
out,prompt=sys.argv[1],sys.argv[2]
body={"model":"gpt-image-2","prompt":prompt,"size":"1024x1536","n":1}
r=urllib.request.Request("https://api.openai.com/v1/images/generations",data=json.dumps(body).encode(),headers={"Authorization":"Bearer "+key,"Content-Type":"application/json"})
d=json.load(urllib.request.urlopen(r,timeout=600))
open(out,"wb").write(base64.b64decode(d["data"][0]["b64_json"])); print("saved",out)
