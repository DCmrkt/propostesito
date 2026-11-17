const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname,
  '../sito/non-profit/mentor-crm/moduli-di-mentor/high-value-donors/hvd-hero.js'), 'utf8');

// Browser boundaries only: execute the shipped script, then exercise its lifecycle.
function mount({ top = 200, observer = true, hidden = false } = {}) {
  const events = () => {
    const listeners = new Map();
    return {
      addEventListener(name, callback) {
        if (!listeners.has(name)) listeners.set(name, []);
        listeners.get(name).push(callback);
      },
      emit(name) { for (const callback of listeners.get(name) || []) callback(); }
    };
  };
  const video = Object.assign(events(), {
    paused: true, currentTime: 4.2, muted: true, autoplay: true,
    getBoundingClientRect: () => ({ top, bottom: top + 450 }),
    removeAttribute() {},
    play() { this.paused = false; return Promise.resolve(); },
    pause() { this.paused = true; }
  });
  const document = Object.assign(events(), { hidden, querySelector: () => video });
  const window = Object.assign(events(), { innerHeight: 1000, location: { search: '' } });
  let intersect;
  if (observer) window.IntersectionObserver = class {
    constructor(callback) { intersect = callback; }
    observe() {}
  };
  vm.runInNewContext(source, { window, document, navigator: { userAgent: 'Chrome/' },
    URLSearchParams, IntersectionObserver: window.IntersectionObserver });
  return {
    video, window, document,
    move(nextTop) {
      top = nextTop;
      intersect?.([{ isIntersecting: top < 1200 && top + 450 > -200 }]);
      window.emit('scroll');
    }
  };
}

test('hero stops offscreen and resumes at the same frame on return', () => {
  const page = mount();
  assert.equal(page.video.paused, false);
  page.move(-3500);
  assert.equal(page.video.paused, true);
  page.video.emit('loadeddata');
  assert.equal(page.video.paused, true, 'late loading must not restart an offscreen video');
  page.move(200);
  assert.equal(page.video.paused, false);
  assert.equal(page.video.currentTime, 4.2);
});

test('a deep-link load keeps the hero paused until it approaches the viewport', () => {
  const page = mount({ top: -3500 });
  assert.equal(page.video.paused, true);
  page.window.emit('pageshow');
  assert.equal(page.video.paused, true);
  page.move(200);
  assert.equal(page.video.paused, false);
});

test('hidden pages and page-cache departures stop decoding', () => {
  const page = mount({ hidden: true });
  assert.equal(page.video.paused, true);
  page.document.hidden = false;
  page.document.emit('visibilitychange');
  assert.equal(page.video.paused, false);
  page.document.hidden = true;
  page.document.emit('visibilitychange');
  assert.equal(page.video.paused, true);
  page.document.hidden = false;
  page.window.emit('pageshow');
  assert.equal(page.video.paused, false);
  page.window.emit('pagehide');
  assert.equal(page.video.paused, true);
});

test('visibility gating also works without IntersectionObserver', () => {
  const page = mount({ observer: false });
  page.move(-3500);
  assert.equal(page.video.paused, true);
  page.move(200);
  assert.equal(page.video.paused, false);
});
