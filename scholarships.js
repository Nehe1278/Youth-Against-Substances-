document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");

      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-selected", "false");
      });
      tabContents.forEach((content) => {
        content.classList.remove("active");
      });

      // Add active class to clicked button and corresponding content
      button.classList.add("active");
      button.setAttribute("aria-selected", "true");
      const targetContent = document.getElementById(targetTab);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });
});

