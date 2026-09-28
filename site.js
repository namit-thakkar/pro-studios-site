/* Paste your Apps Script web app URL here when it is ready. Leave blank until then. */
var SHEETS_WEB_APP_URL = "";

(function () {
  var header = document.querySelector(".site-header");
  var bar = document.getElementById("scroll-progress");
  var clip = document.querySelector(".menu-clip");
  var menuBtn = document.querySelector(".menu-btn");
  var scrim = document.querySelector(".scrim");
  var themeBtn = document.querySelector(".theme-btn");

  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
    if (bar) {
      var height = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (height > 0 ? window.scrollY / height : 0) + ")";
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function setMenu(open) {
    if (!clip) return;
    clip.classList.toggle("open", open);
    if (scrim) scrim.classList.toggle("open", open);
    if (menuBtn) {
      menuBtn.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (menuBtn) menuBtn.addEventListener("click", function () {
    setMenu(!clip.classList.contains("open"));
  });
  if (scrim) scrim.addEventListener("click", function () { setMenu(false); });
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  function currentTheme() {
    var explicit = document.documentElement.getAttribute("data-theme");
    if (explicit === "dark" || explicit === "light") return explicit;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function labelTheme(mode) {
    if (themeBtn) themeBtn.setAttribute("aria-label", mode === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }
  labelTheme(currentTheme());
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("pro-theme", next); } catch (e) {}
    labelTheme(next);
  });

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  }

  var form = document.querySelector("form.form");
  if (!form) return;
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = new FormData(form);
    var name = String(data.get("name") || "").trim();
    var email = String(data.get("email") || "").trim();
    var phone = String(data.get("phone") || "").trim();
    var website = String(data.get("website") || "").trim();
    var err = document.getElementById("form-error");
    var ok = document.getElementById("form-ok");
    var button = form.querySelector('button[type="submit"]');
    function showError(msg) {
      if (err) { err.hidden = false; err.textContent = msg; }
      if (ok) ok.hidden = true;
    }
    if (!name || !email || !phone || !website) {
      showError("Please complete name, email, phone and website.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("Enter a valid email address.");
      return;
    }
    if (err) err.hidden = true;
    var payload = {
      name: name,
      email: email,
      phone: phone,
      website: website,
      service: String(data.get("service") || "").trim(),
      budget: String(data.get("budget") || "").trim(),
      country: String(data.get("country") || "").trim(),
      submittedAt: new Date().toISOString()
    };
    function done() {
      if (ok) { ok.hidden = false; ok.textContent = "Received. We'll be in touch."; }
      form.reset();
      if (button) button.disabled = false;
    }
    if (!SHEETS_WEB_APP_URL) { done(); return; }
    if (button) button.disabled = true;
    fetch(SHEETS_WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(done).catch(function () {
      showError("Could not save that just now. Please try again.");
      if (button) button.disabled = false;
    });
  });
})();
