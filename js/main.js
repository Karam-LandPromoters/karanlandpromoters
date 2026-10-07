(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Sticky header shadow on scroll */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Mobile nav toggle */
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.querySelector(".main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Home hero slideshow */
  var slides = document.querySelectorAll(".hero-slide");
  var dots = document.querySelectorAll(".hero-dots button");
  if (slides.length && dots.length) {
    var current = 0;
    var setSlide = function (index) {
      slides[current].classList.remove("active");
      dots[current].classList.remove("active");
      current = index;
      slides[current].classList.add("active");
      dots[current].classList.add("active");
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { setSlide(i); });
    });
    if (!reduceMotion) {
      setInterval(function () {
        setSlide((current + 1) % slides.length);
      }, 3000);
    }
  }

  /* Scroll reveal for .reveal groups (one orchestrated entrance) */
  var revealGroups = document.querySelectorAll(".reveal");
  if (revealGroups.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealGroups.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      revealGroups.forEach(function (el) { io.observe(el); });
    }
  }

  /* Projects filter */
  var filterButtons = document.querySelectorAll(".filter-btn");
  var projectCards = document.querySelectorAll(".project-card");
  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterButtons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var filter = btn.getAttribute("data-filter");
        projectCards.forEach(function (card) {
          var match = filter === "all" || card.getAttribute("data-category") === filter;
          card.classList.toggle("is-hidden", !match);
        });
      });
    });
  }

  /* Contact form: pre-fill from a Careers "Apply" link (?role=...) */
  var interestSelect = document.getElementById("interest");
  var messageField = document.getElementById("message");
  if (interestSelect && messageField) {
    var params = new URLSearchParams(window.location.search);
    var roleParam = params.get("role");
    var roleTitles = {
      land: "Land Acquisition Executive",
      project: "Project Coordinator — Renewable Energy",
      sales: "Farmhouse Sales Consultant",
      site: "Site Supervisor"
    };
    if (roleParam && roleTitles[roleParam]) {
      interestSelect.value = "career";
      messageField.value = "Applying for: " + roleTitles[roleParam] + "\n\n";
      messageField.focus();
      var len = messageField.value.length;
      messageField.setSelectionRange(len, len);
    }
  }

  /* Contact form: build a pre-filled email to info@karamlandpromoters.in */
  var contactForm = document.querySelector(".contact-form form");
  if (contactForm) {
    var CONTACT_EMAIL = "info@karamlandpromoters.in";
    var interestLabels = {
      land: "Land only (we provide the land)",
      solar: "Land + solar development",
      wind: "Land + wind development",
      farmhouse: "Land + farmhouse development",
      career: "Career / job application",
      other: "Other"
    };
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (document.getElementById("name") || {}).value || "";
      var phone = (document.getElementById("phone") || {}).value || "";
      var interestEl = document.getElementById("interest");
      var interest = interestEl ? (interestLabels[interestEl.value] || interestEl.value) : "";
      var message = (document.getElementById("message") || {}).value || "";

      var subject = "Website inquiry — " + (name || "New lead") + " (" + interest + ")";
      var body =
        "Name: " + name + "\n" +
        "Phone: " + phone + "\n" +
        "Interested in: " + interest + "\n\n" +
        "Message:\n" + message;

      var mailtoUrl =
        "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailtoUrl;

      var successMsg = contactForm.querySelector(".form-success");
      if (successMsg) {
        successMsg.hidden = false;
        successMsg.textContent = "Opening your email app to send this to us — if nothing opens, write to info@karamlandpromoters.in directly.";
        successMsg.setAttribute("role", "status");
      }
      contactForm.reset();
    });
  }
})();
