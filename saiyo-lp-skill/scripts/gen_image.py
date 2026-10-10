#!/usr/bin/env python3
"""Generate an image with gpt-image-2.
usage: gen_image.py OUT.png "prompt" [--size 1024x1536] [--ref ref.png ...]
With --ref, uses the edits endpoint so the reference images guide the result."""
import argparse, base64, json, os, re, subprocess, sys, urllib.request

def api_key():
    k = os.environ.get("OPENAI_API_KEY")
    if k: return k
    rc = open(os.path.expanduser("~/.zshrc")).read()
    m = re.findall(r'^\s*export\s+OPENAI_API_KEY=["\']?([^"\'\s#]+)', rc, re.M)
    if not m: sys.exit("OPENAI_API_KEY not found")
    return m[-1]

ap = argparse.ArgumentParser()
ap.add_argument("out"); ap.add_argument("prompt")
ap.add_argument("--size", default="1024x1536")
ap.add_argument("--quality", default="high")
ap.add_argument("--ref", nargs="*", default=[])
a = ap.parse_args()
key = api_key()
if a.ref:
    cmd = ["curl", "-s", "https://api.openai.com/v1/images/edits", "-H", f"Authorization: Bearer {key}",
           "-F", "model=gpt-image-2", "-F", f"prompt={a.prompt}", "-F", f"size={a.size}", "-F", f"quality={a.quality}"]
    for r in a.ref: cmd += ["-F", f"image[]=@{r}"]
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode != 0: sys.exit(f'curl failed (exit {r.returncode}) for {a.out}')
    raw = r.stdout
else:
    req = urllib.request.Request("https://api.openai.com/v1/images/generations",
        data=json.dumps({"model": "gpt-image-2", "prompt": a.prompt, "size": a.size, "quality": a.quality, "n": 1}).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    raw = urllib.request.urlopen(req, timeout=600).read()
d = json.loads(raw)
if "data" not in d: sys.exit(json.dumps(d)[:600])
os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
open(a.out, "wb").write(base64.b64decode(d["data"][0]["b64_json"]))
print(a.out)
