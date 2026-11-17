const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const file = path.join(__dirname, '../sito/non-profit/mentor-crm/moduli-di-mentor/telemarketing/telemarketing-hero.js');
const source = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';

function mount({ userAgent = 'AppleWebKit/537.36 Chrome/131.0', hidden = false, observer = true } = {}) {
  const events = () => {
    const handlers = new Map();
    return { addEventListener(name, callback) {
      if (!handlers.has(name)) handlers.set(name, []);
      handlers.get(name).push(callback);
    }, emit(name) { for (const callback of handlers.get(name) || []) callback(); } };
  };
  let top = 150;
  let intersect;
  const video = Object.assign(events(), {
    paused: true, currentTime: 6.4, muted: false, autoplay: true, src: '',
    getBoundingClientRect: () => ({ top, bottom: top + 500 }),
    querySelector: () => ({ src: 'http://localhost/media/mentor-hero.mp4' }),
    load() {}, play() { this.paused = false; return Promise.resolve(); },
    pause() { this.paused = true; }
  });
  const document = Object.assign(events(), { hidden, querySelector: () => video });
  const window = Object.assign(events(), { innerHeight: 900 });
  if (observer) window.IntersectionObserver = class {
    constructor(callback) { intersect = callback; }
    observe() {}
  };
  vm.runInNewContext(source, { window, document, navigator: { userAgent }, IntersectionObserver: window.IntersectionObserver });
  return { video, document, window, move(y) {
    top = y;
    intersect?.([{ isIntersecting: top < 1100 && top + 500 > -200 }]);
    window.emit('scroll');
  } };
}

test('Telemarketing plays muted and resumes at the same frame after leaving the viewport', () => {
  const page = mount();
  assert.equal(page.video.paused, false);
  assert.equal(page.video.muted, true);
  page.move(-3000);
  assert.equal(page.video.paused, true);
  page.video.emit('loadeddata');
  assert.equal(page.video.paused, true);
  page.move(150);
  assert.equal(page.video.paused, false);
  assert.equal(page.video.currentTime, 6.4);
});

test('hidden tabs pause the video and return without resetting the story', () => {
  const page = mount({ hidden: true });
  assert.equal(page.video.paused, true);
  page.document.hidden = false;
  page.document.emit('visibilitychange');
  assert.equal(page.video.paused, false);
  page.window.emit('pagehide');
  assert.equal(page.video.paused, true);
  page.window.emit('pageshow');
  assert.equal(page.video.paused, false);
  assert.equal(page.video.currentTime, 6.4);
});

test('Safari and iOS Chromium use the purple MP4 when VP9 alpha is unverified', () => {
  for (const userAgent of ['AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15', 'AppleWebKit/605.1.15 CriOS/131.0 Mobile']) {
    assert.equal(mount({ userAgent }).video.src, 'http://localhost/media/mentor-hero.mp4');
  }
  assert.equal(mount().video.src, '');
});

test('visibility fallback works without IntersectionObserver', () => {
  const page = mount({ observer: false });
  assert.equal(page.video.paused, false);
  page.move(-3000);
  assert.equal(page.video.paused, true);
  page.move(150);
  assert.equal(page.video.paused, false);
});
