from playwright.sync_api import sync_playwright
V=[('s1',1280,800),('s2',1280,800),('s3',1280,800),('s4',1280,800),('tile',440,280),('marquee',1400,560)]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome")
    for l in ('es','en'):
        for v,w,h in V:
            pg=b.new_page(viewport={"width":w,"height":h}); pg.goto(f"file:///tmp/store/store.html?v={v}&l={l}"); pg.wait_for_timeout(400)
            pg.screenshot(path=f"/tmp/store/out-{v}-{l}.png"); pg.close()
    b.close()
