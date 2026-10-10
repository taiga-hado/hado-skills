#!/usr/bin/env python3
# 生成クリップの検品: コマ分解タイル(JPG)＋Whisper文字起こし。使い方: python3 check_clip.py gen/sceneA.mp4
import sys,os,json,subprocess
from subs_from_audio import transcribe
mp4=sys.argv[1]; base=os.path.splitext(mp4)[0]
dur=float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",mp4],capture_output=True,text=True).stdout)
cols=10; rows=max(1,int(dur//cols)+1)
subprocess.run(["ffmpeg","-v","error","-y","-i",mp4,"-vf",f"fps=1,scale=150:-1,tile={cols}x{rows}","-frames:v","1",base+"_tile.jpg"])
print("tile:",base+"_tile.jpg","(Readで開いて目視)")
d=transcribe(mp4)
print("transcript:")
for s in d.get("segments",[]): print(f"  {s['start']:6.2f}-{s['end']:6.2f} {s['text']}")
print("→ 台本の全行が入っているか／ブランド名の読みが合っているか を確認。落ちた行があればそのシーンだけ再生成")
