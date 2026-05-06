import sqlite3, json, sys
sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('e:/VINFAST/Mielove/backend/mielove.db')
cur = conn.cursor()
cur.execute("SELECT config_data FROM weddings WHERE slug='pham-liem-tra-my-2026-04-25'")
cfg = json.loads(cur.fetchone()[0])
els = [e for e in cfg['canvas']['elements'] if e.get('type') == 'element_text' and e.get('y', 0) < 1000]
for e in els[:5]:
    print(e.get('props', {}).get('text'))

cd = [e for e in cfg['canvas']['elements'] if e.get('type') == 'element_countdown']
if cd:
    print("Countdown targetDate:", cd[0]['props'].get('targetDate'))

conn.close()
