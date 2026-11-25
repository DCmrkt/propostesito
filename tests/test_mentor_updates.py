import unittest

from test_routes import ROOT, parse


class MentorUpdates(unittest.TestCase):
    def test_mentor_navigation_leads_to_updates_and_webinar(self):
        mentor = ROOT / 'sito/non-profit/mentor-crm'
        self.assertIn('nuove-funzionalita/', parse(mentor / 'index.html').links)
        page = parse(mentor / 'nuove-funzionalita/index.html')
        self.assertIn('../#contatti', page.links)
        self.assertEqual(page.headings, 1)
        self.assertIn('webinar', page.ids)
        self.assertIn('media/mentor-updater-webinar-1080p.mp4', page.links)
        self.assertIn('media/mentor-updater-webinar.it.vtt', page.links)

    def test_legacy_mentor_url_preserves_deep_links(self):
        redirect = ROOT / 'sito/mentor-crm/nuove-funzionalita/index.html'
        content = redirect.read_text(encoding='utf-8')
        self.assertIn('../../non-profit/mentor-crm/nuove-funzionalita/', parse(redirect).links)
        self.assertIn('location.search + location.hash', content)
