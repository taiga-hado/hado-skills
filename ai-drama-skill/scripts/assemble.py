# v4: 生成クリップ3本をそのまま連結（テキスト焼き込みなし）。音量だけ整える。
import subprocess,os
W,H=720,1280
parts=[]
os.makedirs("seg",exist_ok=True)
for k in ["sceneA","sceneB","sceneC"]:
    src=f"gen/{k}.mp4"
    if not os.path.exists(src): continue
    out=f"seg/{k}.mp4"
    subprocess.run(["ffmpeg","-v","error","-y","-i",src,"-vf",f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps=30,format=yuv420p","-r","30","-c:v","libx264","-crf","18","-c:a","aac","-ar","48000","-ac","2",out],check=True)
    parts.append(out)
open("seg/list.txt","w").write("".join(f"file '{os.path.abspath(p)}'\n" for p in parts))
subprocess.run(["ffmpeg","-v","error","-y","-f","concat","-safe","0","-i","seg/list.txt","-c:v","copy","-af","loudnorm=I=-14:TP=-1.5:LRA=11","-c:a","aac","-b:a","192k","-movflags","+faststart","final_v4.mp4"],check=True)
print("final_v4.mp4",subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0","final_v4.mp4"],capture_output=True,text=True).stdout.strip())
