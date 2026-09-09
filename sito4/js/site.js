(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  document.querySelectorAll(".nav-dropdown > button").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      if (window.matchMedia("(max-width: 760px)").matches) {
        e.preventDefault();
        btn.parentElement.classList.toggle("is-open");
      }
    });
  });
})();
