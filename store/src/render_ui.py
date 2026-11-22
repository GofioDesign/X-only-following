import json,re,sys
from playwright.sync_api import sync_playwright
EXT='/home/claude/repo/extension'
def page(kind,lang,url,fbshares=False):
    src=open(f'{EXT}/{"popup/popup" if kind=="popup" else "options/options"}.html').read()
    base='popup' if kind=='popup' else 'options'
    src=re.sub(r'(href|src)="\.\./',lambda m:f'{m.group(1)}="file://{EXT}/',src)
    src=re.sub(r'(href|src)="(?!file:|http|#)([^"]+)"',lambda m:f'{m.group(1)}="file://{EXT}/{base}/{m.group(2)}"',src)
    M=json.load(open(f'{EXT}/_locales/{lang}/messages.json'))
    S={'fb_shares':True} if fbshares else {}
    stub=('<script>const M=%s;const S=%s;const L={uses:1,installDate:Date.now()};window.chrome={i18n:{getMessage:k=>(M[k]||{}).message||"",getUILanguage:()=>"%s"},'
          'tabs:{query:async()=>[{url:%s}],create(){}},runtime:{openOptionsPage(){},getURL:p=>p},'
          'storage:{sync:{get:async d=>Object.assign({},typeof d==="object"&&d?d:{},S),set:async o=>Object.assign(S,o)},'
          'local:{get:async d=>Object.assign({},typeof d==="object"&&d?d:{},L),set:async o=>Object.assign(L,o)}}};</script>')%(json.dumps(M),json.dumps(S),lang,json.dumps(url))
    src=src.replace('<script src=',stub+'<script src=',1)
    out=f'/tmp/store/{kind}-{lang}-{url.split("//")[1].split(".")[1] if url else "full"}.html'
    open(out,'w').write(src); return out
jobs=[]
for lang in ('es','en'):
    jobs.append((page('popup',lang,'https://www.facebook.com/',True),360,f'ui-fb-{lang}.png'))
    jobs.append((page('popup',lang,'https://www.youtube.com/'),360,f'ui-yt-{lang}.png'))
    jobs.append((page('options',lang,''),640,f'ui-full-{lang}.png'))
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome",args=['--allow-file-access-from-files'])
    for f,w,o in jobs:
        pg=b.new_page(viewport={"width":w,"height":600},device_scale_factor=2)
        pg.on('pageerror',lambda e:print('ERR',e))
        pg.goto('file://'+f); pg.wait_for_timeout(600)
        pg.screenshot(path=o,full_page=True); print(o,pg.evaluate('document.body.scrollHeight')); pg.close()
    b.close()
