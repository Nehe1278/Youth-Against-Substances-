document.addEventListener("DOMContentLoaded", () => {
  // Header scroll effect
  const siteHeader = document.querySelector(".site-header");
  if (siteHeader) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        siteHeader.classList.add("scrolled");
      } else {
        siteHeader.classList.remove("scrolled");
      }
    });
  }

  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("nav-open");
      mobileMenuToggle.classList.toggle("active");
      document.body.classList.toggle("menu-open");
    });

    // Close menu when clicking on a link
    const navLinks = mainNav.querySelectorAll("a");
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("nav-open");
        mobileMenuToggle.classList.remove("active");
        document.body.classList.remove("menu-open");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mainNav.classList.remove("nav-open");
        mobileMenuToggle.classList.remove("active");
        document.body.classList.remove("menu-open");
      }
    });
  }

  // Scroll-triggered animations using Intersection Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll(".hero, .card, .page-header, .contact-section, .contact-info, .contact-note");
  animateElements.forEach(el => {
    el.classList.add("animate-on-scroll");
    observer.observe(el);
  });

  // Animated hero text on page load
  const heroText = document.querySelector(".hero-text");
  if (heroText) {
    setTimeout(() => {
      heroText.classList.add("hero-visible");
    }, 100);
  }

  // Contact form handling
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");

  if (form && status) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = form.elements["name"].value.trim();
      const email = form.elements["email"].value.trim();
      const message = form.elements["message"].value.trim();

      let error = "";
      if (!name || !email || !message) {
        error = "Please fill out your name, email, and message.";
      } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        error = "Please enter a valid email address.";
      }

      if (error) {
        status.textContent = error;
        status.classList.remove("success");
        status.classList.add("error");
        status.classList.add("fade-in");
        return;
      }

      // Simulate successful send
      status.textContent = "Thank you for reaching out! We will review your message soon.";
      status.classList.remove("error");
      status.classList.add("success");
      status.classList.add("fade-in");
      form.reset();

      // Remove fade-in class after animation
      setTimeout(() => {
        status.classList.remove("fade-in");
      }, 300);
    });
  }

  // Back-to-top button
  const backToTop = document.querySelector(".back-to-top");

  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 200) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Add ripple effect to back-to-top button
    backToTop.addEventListener("click", function(e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }

  // Button ripple effects
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach(button => {
    button.addEventListener("click", function(e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Enhanced card hover interactions
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    card.addEventListener("mouseenter", function() {
      this.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const href = this.getAttribute("href");
      if (href !== "#" && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  // Parallax effect for hero section
  const hero = document.querySelector(".hero");
  if (hero) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * 0.3;
      if (scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${parallax}px)`;
      }
    });
  }

  // Active navigation link highlighting based on scroll position
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".main-nav a[href^='#']");

  if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener("scroll", () => {
      let current = "";
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
          current = section.getAttribute("id");
        }
      });

      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active");
        }
      });
    });
  }

  // Typing animation for hero text (optional enhancement)
  const heroTitle = document.querySelector(".hero-text h2");
  if (heroTitle && window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/")) {
    const text = heroTitle.textContent;
    heroTitle.textContent = "";
    heroTitle.style.opacity = "1";
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    };
    // Uncomment to enable typing effect
    // setTimeout(typeWriter, 500);
  }
});


