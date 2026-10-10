# 生成動画の音声をWhisperで文字起こし→字幕イベント(subs.json)を作る。台本の行と突き合わせて文言は台本側を採用。
import sys,json,subprocess,os,re,urllib.request
key=subprocess.run("grep OPENAI_API_KEY ~/.zshrc | sed -E 's/.*OPENAI_API_KEY=//; s/[\"'\\'']//g' | tr -d ' '",shell=True,capture_output=True,text=True).stdout.strip()
def transcribe(mp4):
    wav=mp4.replace(".mp4",".wav"); subprocess.run(["ffmpeg","-v","error","-y","-i",mp4,"-vn","-ac","1","-ar","16000",wav])
    r=subprocess.run(["curl","-s","https://api.openai.com/v1/audio/transcriptions","-H","Authorization: Bearer "+key,"-F",f"file=@{wav}","-F","model=whisper-1","-F","language=ja","-F","response_format=verbose_json","-F","timestamp_granularities[]=segment"],capture_output=True,text=True)
    return json.loads(r.stdout)
if __name__=="__main__":
    d=transcribe(sys.argv[1])
    for s in d.get("segments",[]): print(f"{s['start']:6.2f}-{s['end']:6.2f} {s['text']}")
