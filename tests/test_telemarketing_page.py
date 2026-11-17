"""Integration contracts for the Telemarketing page; run this file with Python."""
from html.parser import HTMLParser
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / 'sito/non-profit/mentor-crm/moduli-di-mentor/telemarketing'

class Document(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.nodes=[]
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        self.nodes.append((tag,dict(attrs)))

class TelemarketingPage(unittest.TestCase):
    def setUp(self):
        self.source=(PAGE/'index.html').read_text(encoding='utf-8')
        self.doc=Document(self.source)

    def test_feature_links_resolve_to_content_and_real_screenshot_crops(self):
        ids={a['id'] for _,a in self.doc.nodes if 'id' in a}
        for name in ['contatto','esito','follow-up','storico']:
            self.assertIn(name,ids)
            self.assertTrue(any(tag=='a' and a.get('href')=='#'+name for tag,a in self.doc.nodes))
        images=[a for tag,a in self.doc.nodes if tag=='img' and 'hvd-interface-base' in a.get('class','')]
        self.assertEqual(len(images),1)
        self.assertEqual((images[0]['width'],images[0]['height']),('1280','707'))
        self.assertTrue((PAGE/images[0]['src'].split('?')[0]).is_file())
        crops=[a for tag,a in self.doc.nodes if tag=='svg' and 'hvd-interface-panel' in a.get('class','')]
        self.assertGreaterEqual(len(crops),4)
        for a in crops:
            x,y,w,h=map(float,a['viewbox'].split())
            self.assertGreater(w,0);self.assertGreater(h,0)
            self.assertGreaterEqual(x,0);self.assertGreaterEqual(y,0)
            self.assertLessEqual(x+w,1280);self.assertLessEqual(y+h,707)

    def test_simplified_form_keeps_telemarketing_context_and_existing_preview_behavior(self):
        controls={a.get('name'):a for tag,a in self.doc.nodes if tag in ['input','textarea']}
        self.assertEqual(set(controls),{'interesse','organizzazione','email','messaggio','privacy'})
        self.assertEqual(controls['interesse'].get('type'),'hidden')
        self.assertEqual(controls['interesse'].get('value'),'Telemarketing')
        for name in ['organizzazione','email','privacy']:
            self.assertIn('required',controls[name])
        self.assertNotIn('required',controls['messaggio'])
        self.assertTrue(any(tag=='dialog' and a.get('aria-labelledby')=='dc-dialog-title' for tag,a in self.doc.nodes))
        self.assertTrue(any(tag=='script' and 'fundraising-shared/experience.js' in a.get('src','') for tag,a in self.doc.nodes))
        self.assertTrue(any(tag=='img' and a.get('src','').endswith('/elena-bontempi.jpg') for tag,a in self.doc.nodes))

if __name__=='__main__':unittest.main()
