
/* =========================================================
   LIBERTY MOTORS USA — WEBSITE ENGINE
   GitHub Pages project-site compatible
   ========================================================= */

(function () {
  "use strict";

  const DATA = window.LIBERTY_DATA;

  if (!DATA) {
    console.error("Liberty Motors: data.js was not loaded.");
    return;
  }

  const app = document.getElementById("app");
  const content = document.getElementById("page-content");

  if (!app || !content) {
    console.error("Liberty Motors: required HTML elements are missing.");
    return;
  }

  const REPO = "/LIBERTYMOTORSUSA/";
  const EMAILS = DATA.emails || {};

  /* ---------------------------------------------------------
     HELPERS
  --------------------------------------------------------- */

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char];
    });
  }

  function formatPath(path) {
    const clean = String(path || "/").replace(/^\/+|\/+$/g, "");
    return REPO + (clean ? clean + "/" : "");
  }

  function currentRoute() {
    let path = window.location.pathname;

    if (path.startsWith(REPO)) {
      path = path.slice(REPO.length);
    }

    path = path.replace(/^\/+|\/+$/g, "");

    return path || "";
  }

  function navigate(path) {
    const url = formatPath(path);
    window.history.pushState({}, "", url);
    render();
    window.scrollTo(0, 0);
  }

  function emailAddress(category) {
    return EMAILS[category] || EMAILS.general || "";
  }

  function enquiryLink(item, category) {
    const email = emailAddress(category);

    const subject = encodeURIComponent(
      "Liberty Motors USA - Enquiry: " + (item.name || "General Enquiry")
    );

    const body = encodeURIComponent(
      "Hello Liberty Motors,\n\n" +
      "I am interested in: " + (item.name || "your services") + "\n\n" +
      "Please provide more information.\n\nThank you."
    );

    if (!email) {
      return 'href="' + formatPath("contact") + '"';
    }

    return 'href="mailto:' + encodeURIComponent(email) +
      '?subject=' + subject + '&body=' + body + '"';
  }

  function imageHTML(image, alt, className) {
    if (image) {
      return '<img class="' + escapeHTML(className || "") +
        '" src="' + escapeHTML(image) +
        '" alt="' + escapeHTML(alt) +
        '" loading="lazy">';
    }

    return '<div class="image-placeholder ' +
      escapeHTML(className || "") +
      '">LIBERTY MOTORS</div>';
  }

  function pageHero(title, description) {
    return `
      <section class="page-hero">
        <span class="eyebrow">LIBERTY MOTORS USA</span>
        <h1>${escapeHTML(title)}</h1>
        <p>${escapeHTML(description || "")}</p>
      </section>
    `;
  }

  function emptyState(message) {
    return `
      <div class="empty-state">
        <h3>${escapeHTML(message)}</h3>
        <p>Please contact our team for assistance.</p>
      </div>
    `;
  }

  /* ---------------------------------------------------------
     HEADER AND FOOTER
  --------------------------------------------------------- */

  function updateHeader() {
    const nav = document.getElementById("main-nav");

    if (!nav) return;

    nav.innerHTML = `
      <a href="${formatPath("")}">Home</a>
      <a href="${formatPath("cars")}">Vehicles</a>
      <a href="${formatPath("parts")}">Parts</a>
      <a href="${formatPath("services")}">Services</a>
      <a href="${formatPath("about")}">About</a>
      <a class="nav-contact" href="${formatPath("contact")}">Contact Us</a>
    `;

    const year = document.getElementById("current-year");

    if (year) {
      year.textContent = new Date().getFullYear();
    }
  }

  /* ---------------------------------------------------------
     PRODUCT CARD
  --------------------------------------------------------- */

  function productCard(item, category) {
    const path = category + "/" + item.id;

    return `
      <article class="product-card">
        <a href="${formatPath(path)}">
          ${imageHTML(item.image, item.name)}
        </a>

        <div class="product-card-content">
          <span class="eyebrow">${escapeHTML(item.brand || item.category || category)}</span>

          <h3>
            <a href="${formatPath(path)}">${escapeHTML(item.name)}</a>
          </h3>

          <p>${escapeHTML(item.description || "Contact us for more information.")}</p>

          <div class="product-price">${escapeHTML(item.price || "Contact for Price")}</div>

          <a class="product-link" href="${formatPath(path)}">
            VIEW DETAILS →
          </a>
        </div>
      </article>
    `;
  }

  function inventoryGrid(items, category) {
    if (!items.length) {
      return emptyState("No listings are currently available.");
    }

    return `
      <div class="product-grid">
        ${items.map(item => productCard(item, category)).join("")}
      </div>
    `;
  }

  /* ---------------------------------------------------------
     SEARCH
  --------------------------------------------------------- */

  function searchBox(category) {
    return `
      <div class="inventory-search">
        <input
          type="search"
          id="inventory-search"
          placeholder="Search ${category === "cars" ? "vehicles" : category}..."
          aria-label="Search inventory"
        >
        <span id="search-count"></span>
      </div>
    `;
  }

  function enableSearch(category, items) {
    const input = document.getElementById("inventory-search");
    const grid = document.getElementById("inventory-results");
    const count = document.getElementById("search-count");

    if (!input || !grid) return;

    function updateResults() {
      const term = input.value.trim().toLowerCase();

      const filtered = items.filter(item => {
        return JSON.stringify(item).toLowerCase().includes(term);
      });

      grid.innerHTML = inventoryGrid(filtered, category);

      if (count) {
        count.textContent = filtered.length + " result(s)";
      }
    }

    input.addEventListener("input", updateResults);
    updateResults();
  }

  /* ---------------------------------------------------------
     VEHICLES
  --------------------------------------------------------- */

  function renderCars() {
    const cars = DATA.cars || [];

    content.innerHTML = `
      ${pageHero(
        "Explore Our Vehicles",
        "Discover our collection of premium automobiles. Find your next vehicle with Liberty Motors USA."
      )}

      <section class="content-section">
        <div class="page-container">
          <div class="section-heading">
            <span class="eyebrow">OUR COLLECTION</span>
            <h2>Available Vehicles</h2>
          </div>

          ${searchBox("cars")}

          <div id="inventory-results"></div>
        </div>
      </section>
    `;

    enableSearch("cars", cars);
  }

  function renderCarDetails(id) {
    const car = (DATA.cars || []).find(item => item.id === id);

    if (!car) {
      renderNotFound();
      return;
    }

    const specifications = car.specifications || {};

    content.innerHTML = `
      ${pageHero(car.name, car.description)}

      <section class="content-section">
        <div class="page-container detail-layout">

          <div class="detail-image">
            ${imageHTML(car.image, car.name)}
          </div>

          <div class="detail-information">
            <span class="eyebrow">VEHICLE DETAILS</span>
            <h2>${escapeHTML(car.name)}</h2>

            <h3 class="product-price">${escapeHTML(car.price)}</h3>

            <p>${escapeHTML(car.description)}</p>

            <div class="specification-list">
              <div><strong>Year</strong><span>${escapeHTML(car.year)}</span></div>
              <div><strong>Brand</strong><span>${escapeHTML(car.brand)}</span></div>
              <div><strong>Model</strong><span>${escapeHTML(car.model)}</span></div>
              <div><strong>Condition</strong><span>${escapeHTML(car.condition)}</span></div>
              <div><strong>Mileage</strong><span>${escapeHTML(car.mileage)}</span></div>
              <div><strong>Transmission</strong><span>${escapeHTML(car.transmission)}</span></div>
              <div><strong>Fuel</strong><span>${escapeHTML(car.fuel)}</span></div>
              <div><strong>Availability</strong><span>${escapeHTML(car.availability)}</span></div>
            </div>

            <h3>Additional Specifications</h3>

            <div class="specification-list">
              ${Object.entries(specifications).map(([key, value]) => `
                <div>
                  <strong>${escapeHTML(key)}</strong>
                  <span>${escapeHTML(value)}</span>
                </div>
              `).join("")}
            </div>

            <h3>Features</h3>

            <ul class="feature-list">
              ${(car.features || []).map(feature =>
                `<li>${escapeHTML(feature)}</li>`
              ).join("")}
            </ul>

            <a class="btn btn-gold"
              ${enquiryLink(car, "sales")}>
              Enquire About This Vehicle
            </a>
          </div>

        </div>
      </section>
    `;
  }

  /* ---------------------------------------------------------
     PARTS
  --------------------------------------------------------- */

  function renderParts() {
    const parts = DATA.parts || [];

    content.innerHTML = `
      ${pageHero(
        "Automotive Parts",
        "Discover quality automotive components and upgrades."
      )}

      <section class="content-section">
        <div class="page-container">
          <div class="section-heading">
            <span class="eyebrow">PARTS COLLECTION</span>
            <h2>Explore Our Parts</h2>
          </div>

          ${searchBox("parts")}

          <div id="inventory-results"></div>
        </div>
      </section>
    `;

    enableSearch("parts", parts);
  }

  function renderPartDetails(id) {
    const part = (DATA.parts || []).find(item => item.id === id);

    if (!part) {
      renderNotFound();
      return;
    }

    content.innerHTML = `
      ${pageHero(part.name, part.description)}

      <section class="content-section">
        <div class="page-container detail-layout">

          <div class="detail-image">
            ${imageHTML(part.image, part.name)}
          </div>

          <div class="detail-information">
            <span class="eyebrow">AUTOMOTIVE PARTS</span>
            <h2>${escapeHTML(part.name)}</h2>

            <h3 class="product-price">${escapeHTML(part.price)}</h3>

            <p>${escapeHTML(part.description)}</p>

            <div class="specification-list">
              <div><strong>Category</strong><span>${escapeHTML(part.category)}</span></div>
              <div><strong>Compatibility</strong><span>${escapeHTML(part.compatibility)}</span></div>
              <div><strong>Availability</strong><span>${escapeHTML(part.availability)}</span></div>
            </div>

            <h3>Features</h3>

            <ul class="feature-list">
              ${(part.features || []).map(feature =>
                `<li>${escapeHTML(feature)}</li>`
              ).join("")}
            </ul>

            <a class="btn btn-gold"
              ${enquiryLink(part, "parts")}>
              Enquire About This Part
            </a>
          </div>

        </div>
      </section>
    `;
  }

  /* ---------------------------------------------------------
     SERVICES
  --------------------------------------------------------- */

  function renderServices() {
    const services = DATA.services || [];

    content.innerHTML = `
      ${pageHero(
        "Our Automotive Services",
        "Professional automotive solutions designed around your needs."
      )}

      <section class="content-section">
        <div class="page-container">
          <div class="section-heading">
            <span class="eyebrow">WHAT WE DO</span>
            <h2>Our Services</h2>
          </div>

          ${inventoryGrid(services, "services")}
        </div>
      </section>
    `;
  }

  function renderServiceDetails(id) {
    const service = (DATA.services || []).find(item => item.id === id);

    if (!service) {
      renderNotFound();
      return;
    }

    content.innerHTML = `
      ${pageHero(service.name, service.description)}

      <section class="content-section">
        <div class="page-container detail-information">
          <span class="eyebrow">LIBERTY MOTORS SERVICES</span>
          <h2>${escapeHTML(service.name)}</h2>
          <p>${escapeHTML(service.description)}</p>

          <div class="specification-list">
            <div><strong>Category</strong><span>${escapeHTML(service.category)}</span></div>
            <div><strong>Price</strong><span>${escapeHTML(service.price)}</span></div>
            <div><strong>Availability</strong><span>${escapeHTML(service.availability)}</span></div>
          </div>

          <a class="btn btn-gold"
            ${enquiryLink(service, "services")}>
            Enquire About This Service
          </a>
        </div>
      </section>
    `;
  }

  /* ---------------------------------------------------------
     ABOUT
  --------------------------------------------------------- */

  function renderAbout() {
    const page = DATA.pages?.about || {};

    content.innerHTML = `
      ${pageHero(
        page.title || "About Liberty Motors",
        page.description || DATA.business.description
      )}

      <section class="content-section">
        <div class="page-container detail-information">
          <span class="eyebrow">OUR STORY</span>
          <h2>Automotive Excellence Starts Here.</h2>

          <p>${escapeHTML(DATA.business.description)}</p>

          <p>
            At Liberty Motors USA, our focus is to provide customers
            with access to vehicles, automotive parts and solutions
            that meet their needs.
          </p>

          <a class="btn btn-gold" href="${formatPath("contact")}">
            Contact Our Team
          </a>
        </div>
      </section>
    `;
  }

  /* ---------------------------------------------------------
     CONTACT
  --------------------------------------------------------- */

  function renderContact() {
    const page = DATA.pages?.contact || {};

    content.innerHTML = `
      ${pageHero(
        page.title || "Contact Us",
        page.description || "We would love to hear from you."
      )}

      <section class="content-section">
        <div class="page-container">
          <div class="section-heading">
            <span class="eyebrow">GET IN TOUCH</span>
            <h2>How Can We Help?</h2>
          </div>

          <form class="contact-form" id="contact-form">

            <input
              type="text"
              id="contact-name"
              placeholder="Your full name"
              required
            >

            <input
              type="email"
              id="contact-email"
              placeholder="Your email address"
              required
            >

            <select id="contact-department" required>
              <option value="">Select a department</option>
              <option value="general">General Enquiry</option>
              <option value="sales">Vehicle Sales</option>
              <option value="parts">Automotive Parts</option>
              <option value="services">Services</option>
            </select>

            <textarea
              id="contact-message"
              placeholder="How can we help you?"
              required
            ></textarea>

            <button class="btn btn-gold" type="submit">
              Send Enquiry
            </button>

          </form>
        </div>
      </section>
    `;

    const form = document.getElementById("contact-form");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("contact-name").value.trim();
      const sender = document.getElementById("contact-email").value.trim();
      const department = document.getElementById("contact-department").value;
      const message = document.getElementById("contact-message").value.trim();

      const recipient = emailAddress(department);

      if (!recipient) {
        alert("Contact email is not configured yet. Please try again later.");
        return;
      }

      const subject = encodeURIComponent(
        "Website Enquiry from " + name
      );

      const body = encodeURIComponent(
        "Name: " + name + "\n" +
        "Email: " + sender + "\n\n" +
        "Message:\n" + message
      );

      window.location.href =
        "mailto:" + encodeURIComponent(recipient) +
        "?subject=" + subject + "&body=" + body;
    });
  }

  /* ---------------------------------------------------------
     NOT FOUND
  --------------------------------------------------------- */

  function renderNotFound() {
    content.innerHTML = `
      ${pageHero(
        "Page Not Found",
        "The page you are looking for could not be found."
      )}

      <section class="content-section">
        <div class="page-container">
          <a class="btn btn-gold" href="${formatPath("")}">
            Return Home
          </a>
        </div>
      </section>
    `;
  }

  /* ---------------------------------------------------------
     ROUTER
  --------------------------------------------------------- */

  function render() {
    updateHeader();

    const route = currentRoute();
    const parts = route.split("/").filter(Boolean);

    if (!route) {
      // Homepage is already in index.html.
      return;
    }

    if (parts[0] === "cars" && parts.length === 1) {
      renderCars();
    } else if (parts[0] === "cars" && parts.length === 2) {
      renderCarDetails(parts[1]);
    } else if (parts[0] === "parts" && parts.length === 1) {
      renderParts();
    } else if (parts[0] === "parts" && parts.length === 2) {
      renderPartDetails(parts[1]);
    } else if (parts[0] === "services" && parts.length === 1) {
      renderServices();
    } else if (parts[0] === "services" && parts.length === 2) {
      renderServiceDetails(parts[1]);
    } else if (route === "about") {
      renderAbout();
    } else if (route === "contact") {
      renderContact();
    } else {
      renderNotFound();
    }
  }

  /* ---------------------------------------------------------
     INTERNAL LINK NAVIGATION
  --------------------------------------------------------- */

  document.addEventListener("click", function (event) {
    const link = event.target.closest("a");

    if (!link) return;

    const href = link.getAttribute("href");

    if (
      !href ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("http") ||
      href.startsWith("#") ||
      link.target === "_blank"
    ) {
      return;
    }

    const destination = new URL(href, window.location.href);

    if (destination.origin !== window.location.origin) return;

    event.preventDefault();

    const path = destination.pathname.startsWith(REPO)
      ? destination.pathname.slice(REPO.length)
      : destination.pathname;

    navigate(path);
  });

  /* ---------------------------------------------------------
     MOBILE MENU
  --------------------------------------------------------- */

  document.addEventListener("click", function (event) {
    const toggle = event.target.closest("#menu-toggle");
    const nav = document.getElementById("main-nav");

    if (toggle && nav) {
      nav.classList.toggle("active");
      return;
    }

    if (nav && !event.target.closest("#main-nav")) {
      nav.classList.remove("active");
    }
  });

  /* ---------------------------------------------------------
     BROWSER BACK / FORWARD
  --------------------------------------------------------- */

  window.addEventListener("popstate", function () {
    render();
    window.scrollTo(0, 0);
  });

  /* ---------------------------------------------------------
     INITIALIZE
  --------------------------------------------------------- */

  render();

})();

