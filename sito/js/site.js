(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var reveals = document.querySelectorAll(".reveal");
  if (!reveals.length || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  reveals.forEach(function (el) {
    observer.observe(el);
  });
})();

(function () {
  function alignDeepLink() {
    var id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    var target = document.getElementById(id);
    if (!target || !target.classList.contains("module-item")) return;
    target.classList.add("is-targeted");
    target.scrollIntoView({
      block: window.matchMedia("(max-width: 760px)").matches ? "center" : "center",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  }

  window.addEventListener("load", function () {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        window.setTimeout(alignDeepLink, 80);
      });
    } else {
      window.setTimeout(alignDeepLink, 80);
    }
  });
  window.addEventListener("hashchange", alignDeepLink);
})();
