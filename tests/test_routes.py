"""Static-site integration checks: run python -m unittest discover -s tests -v."""
from html.parser import HTMLParser
from pathlib import Path
from functools import lru_cache
import re
import unittest
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
EDITORIA = ('abbonamenti-e-servizi', 'periodici-e-quotidiani', 'direct-reader',
            'abbonamenti-it', 'analisi', 'abbonamenti-b2b')
EDITORIA_REDIRECTS = {
    'e-commerce': ('abbonamenti-it', ''),
    'collezioni': ('periodici-e-quotidiani', 'collezioni'),
    'consulenza-marketing': ('analisi', 'consulenza-marketing'),
}


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.links, self.ids, self.headings, self.service_links = [], set(), 0, []
        self.feed(path.read_text(encoding='utf-8'))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        if tag == 'h1':
            self.headings += 1
        if tag == 'a' and 'ed-service-card' in attrs.get('class', '').split():
            self.service_links.append(attrs.get('href'))
        for key in ('href', 'src', 'action', 'poster'):
            if attrs.get(key):
                self.links.append(attrs[key])


@lru_cache(maxsize=None)
def parse(path):
    return Page(path)


class Routes(unittest.TestCase):
    def test_gateway_links_to_both_divisions(self):
        path = ROOT / 'sito/index.html'
        self.assertEqual(parse(path).service_links, ['editoria/', 'non-profit/'])
        text = path.read_text(encoding='utf-8')
        self.assertIn('>Fundraising</h2>', text)

    def test_both_divisions_have_real_content_and_navigation(self):
        for rel in ['sito/index.html', 'sito/non-profit/index.html', 'sito/editoria/index.html']:
            with self.subTest(path=rel):
                path = ROOT / rel
                self.assertTrue(path.is_file(), f'Missing {rel}')
                if not path.is_file():
                    continue
                page = parse(path)
                self.assertEqual(page.headings, 1)
                self.assertTrue('Divisioni' in path.read_text(encoding='utf-8'), 'Missing division navigation')

    def test_editoria_has_all_service_pages(self):
        overview = parse(ROOT / 'sito/editoria/index.html')
        self.assertEqual(overview.service_links, [f'{slug}/' for slug in EDITORIA])
        for slug in EDITORIA:
            with self.subTest(slug=slug):
                path = ROOT / 'sito/editoria' / slug / 'index.html'
                self.assertTrue(path.is_file(), f'Missing service: {slug}')
                if path.is_file():
                    self.assertEqual(parse(path).headings, 1)
                    self.assertGreater(len(re.sub('<[^>]+>', '', path.read_text(encoding='utf-8'))), 1600)

    def test_consolidated_editoria_urls_have_a_canonical_destination(self):
        for old, (new, fragment) in EDITORIA_REDIRECTS.items():
            with self.subTest(old=old):
                path = ROOT / 'sito/editoria' / old / 'index.html'
                text = path.read_text(encoding='utf-8')
                self.assertIn(f' rel="canonical" href="../{new}/"', text)
                self.assertIn('location.search', text)
                self.assertIn('location.hash', text)
                destination = f'../{new}/' + (f'#{fragment}' if fragment else '')
                self.assertIn(destination, parse(path).links)

    def test_canonical_pages_have_no_broken_local_destinations(self):
        files = [ROOT / 'sito/index.html']
        for division in ('editoria', 'non-profit'):
            files.extend((ROOT / 'sito' / division).rglob('*.html'))
        self.assertGreater(len(files), 20)
        for path in files:
            for link in parse(path).links:
                url = urlsplit(link)
                if url.scheme or url.netloc:
                    continue
                target = (path.parent / unquote(url.path)).resolve() if url.path else path
                if target.is_dir():
                    target = target / 'index.html'
                with self.subTest(page=str(path.relative_to(ROOT)), link=link):
                    self.assertTrue(target.is_file(), f'Broken destination: {target}')
                    if target.is_file() and target.suffix == '.html' and url.fragment:
                        self.assertIn(unquote(url.fragment), parse(target).ids)

    def test_legacy_redirects_preserve_queries_and_fragments(self):
        pages = [p for p in (ROOT / 'sito').rglob('index.html')
                 if not any(x in ('editoria', 'non-profit') for x in p.relative_to(ROOT / 'sito').parts)
                 and p != ROOT / 'sito/index.html']
        self.assertGreater(len(pages), 15)
        for path in pages:
            text = path.read_text(encoding='utf-8')
            with self.subTest(page=str(path.relative_to(ROOT))):
                self.assertTrue('location.search' in text, 'Redirect must preserve query parameters')
                self.assertTrue('location.hash' in text, 'Redirect must preserve fragments')
                self.assertTrue('rel="canonical"' in text, 'Redirect must identify its canonical page')


if __name__ == '__main__':
    unittest.main()
