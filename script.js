document.addEventListener("DOMContentLoaded", () => {
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
        return;
      }

      // Simulate successful send
      status.textContent = "Thank you for reaching out! We will review your message soon.";
      status.classList.remove("error");
      status.classList.add("success");
      form.reset();
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
  }
});


