// Interactive Features: Search, Filter, Expand/Collapse, Share, Favorites, Load More

document.addEventListener("DOMContentLoaded", () => {
  // ========== SEARCH AND FILTER FUNCTIONALITY ==========
  const searchInput = document.querySelector(".search-input");
  const filterTags = document.querySelectorAll(".filter-tag");
  const cards = document.querySelectorAll(".card");

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase().trim();
      filterCards(searchTerm, getActiveFilter());
    });
  }

  // Filter tag functionality
  filterTags.forEach(tag => {
    tag.addEventListener("click", () => {
      tag.classList.toggle("active");
      const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
      filterCards(searchTerm, getActiveFilter());
    });
  });

  function getActiveFilter() {
    const activeTags = Array.from(filterTags)
      .filter(tag => tag.classList.contains("active"))
      .map(tag => tag.getAttribute("data-filter"));
    return activeTags;
  }

  function filterCards(searchTerm, activeFilters) {
    let visibleCount = 0;
    cards.forEach(card => {
      const cardText = card.textContent.toLowerCase();
      const cardDataFilter = card.getAttribute("data-filter");
      
      let matchesSearch = !searchTerm || cardText.includes(searchTerm);
      let matchesFilter = activeFilters.length === 0 || 
        (cardDataFilter && activeFilters.includes(cardDataFilter)) ||
        (!cardDataFilter && activeFilters.includes("all"));
      
      if (matchesSearch && matchesFilter) {
        card.classList.remove("hidden");
        visibleCount++;
      } else {
        card.classList.add("hidden");
      }
    });

    // Show/hide "no results" message
    let noResultsMsg = document.querySelector(".no-results");
    if (visibleCount === 0 && cards.length > 0) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement("div");
        noResultsMsg.className = "no-results";
        noResultsMsg.textContent = "No results found. Try adjusting your search or filters.";
        const cardsGrid = document.querySelector(".cards-grid") || document.querySelector("main");
        if (cardsGrid) {
          cardsGrid.appendChild(noResultsMsg);
        }
      }
    } else if (noResultsMsg) {
      noResultsMsg.remove();
    }
  }

  // ========== EXPANDABLE CARDS (Read More/Less) ==========
  const expandableCards = document.querySelectorAll(".card-expandable");
  
  expandableCards.forEach(card => {
    const shortContent = card.querySelector(".card-short-content");
    const fullContent = card.querySelector(".card-full-content");
    const toggleBtn = card.querySelector(".card-expand-toggle");
    
    if (shortContent && toggleBtn) {
      let isExpanded = false;
      
      // Check if card has both short and full content
      if (fullContent) {
        // Initially show short, hide full
        fullContent.style.display = "none";
        
        toggleBtn.addEventListener("click", () => {
          isExpanded = !isExpanded;
          
          if (isExpanded) {
            shortContent.style.display = "none";
            fullContent.style.display = "block";
            toggleBtn.textContent = "Read less";
          } else {
            shortContent.style.display = "block";
            fullContent.style.display = "none";
            toggleBtn.textContent = "Read more";
          }
        });
      } else {
        // Single content block - use height expansion
        const originalHeight = shortContent.scrollHeight;
        const maxHeight = window.getComputedStyle(shortContent).maxHeight;
        const isOverflowing = originalHeight > parseInt(maxHeight) || maxHeight === "none";
        
        if (isOverflowing && parseInt(maxHeight) > 0) {
          toggleBtn.addEventListener("click", () => {
            isExpanded = !isExpanded;
            
            if (isExpanded) {
              shortContent.classList.add("expanded");
              toggleBtn.textContent = "Read less";
            } else {
              shortContent.classList.remove("expanded");
              toggleBtn.textContent = "Read more";
            }
          });
        } else {
          // No need for expand/collapse, hide button
          toggleBtn.style.display = "none";
        }
      }
    }
  });

  // ========== SHARE BUTTONS FUNCTIONALITY ==========
  const shareButtons = document.querySelectorAll(".share-btn");
  
  shareButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const shareType = btn.getAttribute("data-share");
      const card = btn.closest(".card");
      
      if (card) {
        const cardTitle = card.querySelector("h3")?.textContent || "";
        const cardUrl = window.location.href;
        const cardDescription = card.querySelector("p")?.textContent || "";
        
        shareContent(shareType, cardTitle, cardDescription, cardUrl);
      }
    });
  });

  function shareContent(shareType, title, description, url) {
    const shareText = `${title} - ${description}`;
    const encodedTitle = encodeURIComponent(title);
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(url);

    switch (shareType) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
          "_blank",
          "width=550,height=420"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          "_blank",
          "width=550,height=420"
        );
        break;
      case "email":
        window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`;
        break;
      case "copy":
        copyToClipboard(url);
        break;
      default:
        // Fallback to Web Share API if available
        if (navigator.share) {
          navigator.share({
            title: title,
            text: description,
            url: url
          }).catch(err => console.log("Error sharing:", err));
        }
    }
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast("Link copied to clipboard!");
      }).catch(err => {
        console.error("Failed to copy:", err);
        fallbackCopyToClipboard(text);
      });
    } else {
      fallbackCopyToClipboard(text);
    }
  }

  function fallbackCopyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      showToast("Link copied to clipboard!");
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }
    document.body.removeChild(textArea);
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: #1f2937;
      color: #ecfeff;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      z-index: 10001;
      animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Add CSS for toast animation if not exists
  if (!document.getElementById("toast-styles")) {
    const style = document.createElement("style");
    style.id = "toast-styles";
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ========== FAVORITES/BOOKMARKS FUNCTIONALITY ==========
  const favoriteButtons = document.querySelectorAll(".fav-btn");
  
  // Load saved favorites from localStorage
  const savedFavorites = JSON.parse(localStorage.getItem("yas_favorites") || "[]");
  
  favoriteButtons.forEach(btn => {
    const card = btn.closest(".card");
    if (card) {
      const cardId = card.getAttribute("data-card-id") || 
                    generateCardId(card);
      card.setAttribute("data-card-id", cardId);
      
      // Check if already favorited
      if (savedFavorites.includes(cardId)) {
        btn.classList.add("active");
      }
      
      btn.addEventListener("click", () => {
        toggleFavorite(cardId, btn);
      });
    }
  });

  function generateCardId(card) {
    const title = card.querySelector("h3")?.textContent || "";
    const url = window.location.pathname;
    return `${url}_${title.replace(/\s+/g, "_")}`;
  }

  function toggleFavorite(cardId, btn) {
    let favorites = JSON.parse(localStorage.getItem("yas_favorites") || "[]");
    
    if (favorites.includes(cardId)) {
      favorites = favorites.filter(id => id !== cardId);
      btn.classList.remove("active");
    } else {
      favorites.push(cardId);
      btn.classList.add("active");
    }
    
    localStorage.setItem("yas_favorites", JSON.stringify(favorites));
    
    // Dispatch event for other parts of the app to react to favorites changes
    window.dispatchEvent(new CustomEvent("favoritesUpdated", {
      detail: { favorites, cardId }
    }));
  }

  // ========== DYNAMIC CONTENT LOADING (Load More) ==========
  const loadMoreBtn = document.querySelector(".load-more-btn");
  const itemsPerPage = 6; // Number of items to show per page
  
  if (loadMoreBtn && cards.length > 0) {
    let currentItems = itemsPerPage;
    
    // Initially hide items beyond the first page
    const allCards = Array.from(cards);
    allCards.forEach((card, index) => {
      if (index >= currentItems) {
        card.classList.add("hidden");
      }
    });
    
    loadMoreBtn.addEventListener("click", () => {
      // Show loading state
      loadMoreBtn.classList.add("loading");
      loadMoreBtn.disabled = true;
      
      // Simulate loading delay for smooth animation
      setTimeout(() => {
        const hiddenCards = allCards.filter(card => card.classList.contains("hidden"));
        const nextBatch = hiddenCards.slice(0, itemsPerPage);
        
        nextBatch.forEach(card => {
          card.classList.remove("hidden");
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";
          
          // Animate in
          setTimeout(() => {
            card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 10);
        });
        
        currentItems += nextBatch.length;
        
        // Hide button if all items are shown
        if (currentItems >= allCards.length) {
          loadMoreBtn.style.display = "none";
        }
        
        // Remove loading state
        loadMoreBtn.classList.remove("loading");
        loadMoreBtn.disabled = false;
      }, 300);
    });
    
    // Hide button initially if all items fit on first page
    if (allCards.length <= itemsPerPage) {
      loadMoreBtn.style.display = "none";
    }
  }
});

