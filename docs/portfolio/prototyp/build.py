# Składa arkusz.html z szablonu, danych i obrazów (obrazy jako data URI, jeden plik).
# Użycie: python build.py [plik_wyjściowy]
import base64, json, pathlib, sys
here = pathlib.Path(__file__).parent
projects = json.loads((here / 'projekty.json').read_text(encoding='utf8'))
for i, p in enumerate(projects):
    p['n'] = f'{i + 1:02d}'
images = {p['img']: 'data:image/jpeg;base64,' + base64.b64encode((here / 'img' / p['img']).read_bytes()).decode() for p in projects}
html = (here / 'arkusz_template.html').read_text(encoding='utf8')
html = html.replace('/*PROJECTS*/[]', json.dumps(projects, ensure_ascii=False)).replace('/*IMAGES*/{}', json.dumps(images))
out = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else here / 'arkusz.html'
out.write_text(html, encoding='utf8')
print(out, round(len(html) / 1024), 'KB')
