import unittest

from test_routes import ROOT, parse


class MentorUpdates(unittest.TestCase):
    def test_mentor_navigation_leads_to_updater_and_video(self):
        mentor = ROOT / 'sito/non-profit/mentor-crm'
        self.assertIn('nuove-funzionalita/', parse(mentor / 'index.html').links)
        path = mentor / 'nuove-funzionalita/index.html'
        page = parse(path)
        self.assertIn('../#contatti', page.links)
        self.assertEqual(page.headings, 1)
        self.assertIn('video-updater', page.ids)
        self.assertIn('media/mentor-updater-1080p.mp4', page.links)
        self.assertIn('media/mentor-updater.it.vtt', page.links)
        content = path.read_text(encoding='utf-8')
        self.assertIn('<h1 id="updates-title"><span>Updater</span></h1>', content)
        self.assertNotIn('webinar', content.lower())
        self.assertNotIn('updates-motion-button', content)
        self.assertNotIn('Controllo dei record e dei campi', content)

    def test_legacy_mentor_url_preserves_deep_links(self):
        redirect = ROOT / 'sito/mentor-crm/nuove-funzionalita/index.html'
        content = redirect.read_text(encoding='utf-8')
        self.assertIn('../../non-profit/mentor-crm/nuove-funzionalita/', parse(redirect).links)
        self.assertIn('location.search + location.hash', content)

    def test_word_guide_follows_video_with_motion_and_anchored_steps(self):
        path = ROOT / 'sito/non-profit/mentor-crm/nuove-funzionalita/index.html'
        content = path.read_text(encoding='utf-8')
        page = parse(path)
        self.assertLess(content.index('id="video-updater"'), content.index('id="come-funziona"'))
        for step in ('apertura', 'estrattore-query-builder', 'campo-valore', 'modalita-file', 'conferma-esito', 'domande-frequenti'):
            with self.subTest(step=step):
                self.assertIn(step, page.ids)
                self.assertIn(f'#{step}', page.links)
        self.assertEqual(content.count('data-scroll-motion'), 9)
        self.assertIn('<caption>Come cambia il campo Valore', content)
        self.assertTrue((path.parent / 'media/ricerca-campagne-dettaglio.webp').is_file())
