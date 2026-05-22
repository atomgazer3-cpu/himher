/* ==========================================
   OUR LEGENDARY LOVE STORY - APPLICATION LOGIC
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Ensure GSAP plugins are registered
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 1. Initial State & Configuration Loading
  const startDate = new Date(CONFIG.couple.relationshipStart);
  
  // Update Names in Page Footer/Headers/Hero
  document.getElementById("couple-title").textContent = `${CONFIG.couple.partner1} ❤️ ${CONFIG.couple.partner2}`;
  document.getElementById("footer-p1").textContent = CONFIG.couple.partner1;
  document.getElementById("footer-p2").textContent = CONFIG.couple.partner2;

  // Initialize Background Music Elements
  const bgMusic = document.getElementById("bg-music");
  const btnPlayPause = document.getElementById("btn-play-pause");
  const musicIcon = document.getElementById("music-icon");
  const musicTitle = document.getElementById("music-title");
  const musicArtist = document.getElementById("music-artist");
  
  bgMusic.src = CONFIG.music.url;
  musicTitle.textContent = CONFIG.music.title;
  musicArtist.textContent = CONFIG.music.artist;

  // 2. Preloader and Autoplay Unlock (Opening Screen)
  const loadingScreen = document.getElementById("loading-screen");
  const loadingSpinner = document.getElementById("loading-spinner");
  const btnEnter = document.getElementById("btn-enter");
  const openingCountdown = document.getElementById("opening-countdown");

  // Step-by-step sequential text reveals for the opening page
  const sequentialTexts = [
    "A love story written by destiny...",
    "Before the world knew us...",
    `There was ${CONFIG.couple.partner1}.`,
    `There was ${CONFIG.couple.partner2}.`,
    "And then... forever began ❤️"
  ];

  let textIndex = 0;
  const sequentialTextEl = document.getElementById("sequential-text");

  function revealSequentialText() {
    if (textIndex < sequentialTexts.length) {
      sequentialTextEl.style.opacity = "0";
      sequentialTextEl.style.transform = "translateY(15px)";
      
      setTimeout(() => {
        sequentialTextEl.textContent = sequentialTexts[textIndex];
        sequentialTextEl.style.opacity = "1";
        sequentialTextEl.style.transform = "translateY(0)";
        
        textIndex++;
        // The last line or names stay visible longer
        const delay = textIndex === sequentialTexts.length ? 3500 : 2500;
        setTimeout(revealSequentialText, delay);
      }, 500);
    } else {
      // Fade out the sequential text element and show the main opening countdown and button
      sequentialTextEl.style.opacity = "0";
      setTimeout(() => {
        sequentialTextEl.classList.add("hidden");
        loadingSpinner.classList.add("hidden");
        openingCountdown.classList.remove("hidden");
        btnEnter.classList.remove("hidden");
        setTimeout(() => {
          openingCountdown.classList.add("opacity-100", "translate-y-0");
          btnEnter.classList.add("opacity-100", "translate-y-0");
        }, 50);
      }, 1000);
    }
  }

  // Start the text sequence
  revealSequentialText();

  // Entrance Countdown logic
  function updateEntranceCountdown() {
    const now = new Date();
    const target = new Date(CONFIG.countdownTargetDate);
    const diffMs = target - now;

    if (diffMs <= 0) {
      document.getElementById("entrance-days").textContent = "00";
      document.getElementById("entrance-hours").textContent = "00";
      document.getElementById("entrance-minutes").textContent = "00";
      document.getElementById("entrance-seconds").textContent = "00";
      return;
    }

    const diffSecs = Math.floor(diffMs / 1000);
    const days = Math.floor(diffSecs / (3600 * 24));
    const hours = Math.floor((diffSecs % (3600 * 24)) / 3600);
    const minutes = Math.floor((diffSecs % 3600) / 60);
    const seconds = diffSecs % 60;

    document.getElementById("entrance-days").textContent = String(days).padStart(2, "0");
    document.getElementById("entrance-hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("entrance-minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("entrance-seconds").textContent = String(seconds).padStart(2, "0");
  }

  setInterval(updateEntranceCountdown, 1000);
  updateEntranceCountdown();

  // Click Enter button to unlock music and start site experience
  btnEnter.addEventListener("click", () => {
    // Play audio
    bgMusic.play().then(() => {
      updatePlayIcon(true);
      startVisualizer();
    }).catch(err => {
      console.log("Audio autoplay was restricted: ", err);
    });

    // Confetti blast on open
    triggerOpeningConfetti();

    // Fade out preloader/opening screen
    loadingScreen.style.opacity = "0";
    setTimeout(() => {
      loadingScreen.style.visibility = "hidden";
      loadingScreen.classList.add("hidden");
    }, 1500);

    // Trigger Hero reveals
    setTimeout(() => {
      document.querySelectorAll(".hero-reveal").forEach((el, index) => {
        setTimeout(() => {
          el.classList.add("active");
        }, index * 400);
      });
    }, 400);
  });

  // 3. Audio Player Logic
  let isPlaying = false;
  let visualizerInterval;

  function updatePlayIcon(playing) {
    isPlaying = playing;
    if (playing) {
      musicIcon.setAttribute("data-lucide", "pause");
    } else {
      musicIcon.setAttribute("data-lucide", "play");
    }
    lucide.createIcons();
  }

  btnPlayPause.addEventListener("click", () => {
    if (isPlaying) {
      bgMusic.pause();
      updatePlayIcon(false);
      stopVisualizer();
    } else {
      bgMusic.play().then(() => {
        updatePlayIcon(true);
        startVisualizer();
      }).catch(err => console.log(err));
    }
  });

  function startVisualizer() {
    const bars = document.querySelectorAll("#visualizer div");
    clearInterval(visualizerInterval);
    visualizerInterval = setInterval(() => {
      bars.forEach(bar => {
        const height = Math.random() * 20 + 4; // 4px to 24px
        bar.style.height = `${height}px`;
      });
    }, 120);
  }

  function stopVisualizer() {
    clearInterval(visualizerInterval);
    const bars = document.querySelectorAll("#visualizer div");
    bars.forEach(bar => {
      bar.style.height = "4px";
    });
  }

  // 4. Live Love Timer Calculations (Together Since...)
  function updateLoveTimer() {
    const now = new Date();
    const diffMs = now - startDate;

    if (diffMs < 0) {
      document.getElementById("timer-days").textContent = "00";
      document.getElementById("timer-hours").textContent = "00";
      document.getElementById("timer-minutes").textContent = "00";
      document.getElementById("timer-seconds").textContent = "00";
      return;
    }

    const diffSecs = Math.floor(diffMs / 1000);
    const days = Math.floor(diffSecs / (3600 * 24));
    const hours = Math.floor((diffSecs % (3600 * 24)) / 3600);
    const minutes = Math.floor((diffSecs % 3600) / 60);
    const seconds = diffSecs % 60;

    document.getElementById("timer-days").textContent = String(days).padStart(2, "0");
    document.getElementById("timer-hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("timer-minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("timer-seconds").textContent = String(seconds).padStart(2, "0");

    // Also update dynamic "Days Together" stat card if it exists
    const daysStatValue = document.getElementById("stat-days-val");
    if (daysStatValue) {
      daysStatValue.textContent = days;
    }

    // Calculate exact age of relationship in Years, Months, and Days
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let daysDiff = now.getDate() - startDate.getDate();

    if (daysDiff < 0) {
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      daysDiff += lastMonth.getDate();
      months--;
    }

    if (months < 0) {
      months += 12;
      years--;
    }

    const yrText = years === 1 ? "Year" : "Years";
    const moText = months === 1 ? "Month" : "Months";
    const dyText = daysDiff === 1 ? "Day" : "Days";

    const ageEl = document.getElementById("relationship-age");
    if (ageEl) {
      ageEl.textContent = `${years} ${yrText} • ${months} ${moText} • ${daysDiff} ${dyText}`;
    }
  }

  // Future Milestone Countdowns
  function updateCountdowns() {
    const now = new Date();
    
    // Calculate Next Monthly Anniversary
    const day = startDate.getDate();
    let nextMonthly = new Date(now.getFullYear(), now.getMonth(), day, startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());
    if (nextMonthly <= now) {
      nextMonthly = new Date(now.getFullYear(), now.getMonth() + 1, day, startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());
    }
    const diffMonthly = nextMonthly - now;
    
    // Calculate Next Yearly Anniversary
    const month = startDate.getMonth();
    let nextYearly = new Date(now.getFullYear(), month, day, startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());
    if (nextYearly <= now) {
      nextYearly = new Date(now.getFullYear() + 1, month, day, startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());
    }
    const diffYearly = nextYearly - now;

    // Display countdown digits
    renderCountCards("countdown-monthly", diffMonthly);
    renderCountCards("countdown-yearly", diffYearly);

    // Set dynamic labels
    const diffMonths = (nextMonthly.getFullYear() - startDate.getFullYear()) * 12 + (nextMonthly.getMonth() - startDate.getMonth());
    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    document.getElementById("countdown-monthly-label").textContent = `${getOrdinal(diffMonths)} Monthly Anniversary`;
    
    const diffYears = nextYearly.getFullYear() - startDate.getFullYear();
    const getOrdinalSuffix = (num) => {
      if (num === 1) return 'st';
      if (num === 2) return 'nd';
      if (num === 3) return 'rd';
      return 'th';
    };
    document.getElementById("countdown-yearly-label").textContent = `Our ${diffYears}${getOrdinalSuffix(diffYears)} Anniversary`;
  }

  function renderCountCards(containerId, ms) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (ms <= 0) {
      container.querySelectorAll(".count-val").forEach(el => el.textContent = "00");
      return;
    }

    const diffSecs = Math.floor(ms / 1000);
    const d = Math.floor(diffSecs / (3600 * 24));
    const h = Math.floor((diffSecs % (3600 * 24)) / 3600);
    const m = Math.floor((diffSecs % 3600) / 60);
    const s = diffSecs % 60;

    container.querySelector(".val-days").textContent = String(d).padStart(2, "0");
    container.querySelector(".val-hours").textContent = String(h).padStart(2, "0");
    container.querySelector(".val-mins").textContent = String(m).padStart(2, "0");
    container.querySelector(".val-secs").textContent = String(s).padStart(2, "0");
  }

  // Start Interval timers
  setInterval(updateLoveTimer, 1000);
  setInterval(updateCountdowns, 1000);
  updateLoveTimer();
  updateCountdowns();

  // 5. Memories Gallery Management & Rendering
  let allMemories = [];
  const SUGGESTED_CAPTIONS = [
    "The smile that stole my peace ❤️",
    "My favorite chaos ✨",
    "One photo, infinite heartbeats 🔮",
    "Us, in our own universe 💓",
    "My favorite place is inside your hug 🤗",
    "Every moment with you is a fairytale 👑",
    "Forever isn't long enough with you ⏳",
    "My heart beats only for you 💓"
  ];

  function loadMemories() {
    const stored = localStorage.getItem('anniv_uploads');
    let uploaded = [];
    if (stored) {
      try {
        uploaded = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse uploaded images", e);
      }
    }
    allMemories = [...uploaded, ...CONFIG.memories];
  }

  // Load memories initially
  loadMemories();

  // Carousel Elements
  const carouselTrack = document.getElementById("carousel-track");
  const carouselDots = document.getElementById("carousel-dots");
  const carouselDate = document.getElementById("carousel-date");
  const carouselCaption = document.getElementById("carousel-caption");
  let currentSlide = 0;

  function renderCarousel() {
    carouselTrack.innerHTML = "";
    carouselDots.innerHTML = "";

    const featuredCount = Math.min(6, allMemories.length);
    const featuredMemories = allMemories.slice(0, featuredCount);

    if (featuredCount === 0) {
      carouselDate.textContent = "";
      carouselCaption.textContent = "No moments captured yet.";
      return;
    }

    featuredMemories.forEach((mem, index) => {
      const slide = document.createElement("div");
      slide.className = "w-full h-full flex-shrink-0 relative";
      slide.innerHTML = `<img class="w-full h-full object-cover" src="${mem.url}" alt="${mem.caption}">`;
      carouselTrack.appendChild(slide);

      const dot = document.createElement("button");
      dot.className = `w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-gold w-6" : "bg-gray-600 hover:bg-gray-400"}`;
      dot.setAttribute("data-slide", index);
      carouselDots.appendChild(dot);
    });

    if (currentSlide >= featuredCount) {
      currentSlide = 0;
    }
    updateCarousel();
  }

  function updateCarousel() {
    const featuredCount = Math.min(6, allMemories.length);
    if (featuredCount === 0) return;
    
    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    const dots = carouselDots.querySelectorAll("button");
    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.className = "w-6 h-2 rounded-full bg-gold transition-all duration-300";
      } else {
        dot.className = "w-2 h-2 rounded-full bg-gray-600 hover:bg-gray-400 transition-all duration-300";
      }
    });

    const mem = allMemories[currentSlide];
    if (mem) {
      carouselDate.textContent = mem.date;
      carouselCaption.textContent = mem.caption;
    }
  }

  // Carousel Controls
  document.getElementById("carousel-next").addEventListener("click", () => {
    const featuredCount = Math.min(6, allMemories.length);
    if (featuredCount > 0) {
      currentSlide = (currentSlide + 1) % featuredCount;
      updateCarousel();
      resetCarouselTimer();
    }
  });

  document.getElementById("carousel-prev").addEventListener("click", () => {
    const featuredCount = Math.min(6, allMemories.length);
    if (featuredCount > 0) {
      currentSlide = (currentSlide - 1 + featuredCount) % featuredCount;
      updateCarousel();
      resetCarouselTimer();
    }
  });

  carouselDots.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      currentSlide = parseInt(e.target.getAttribute("data-slide"));
      updateCarousel();
      resetCarouselTimer();
    }
  });

  // Carousel autoplay timer
  let carouselAutoplayInterval;
  function startCarouselTimer() {
    clearInterval(carouselAutoplayInterval);
    carouselAutoplayInterval = setInterval(() => {
      const featuredCount = Math.min(6, allMemories.length);
      if (featuredCount > 1) {
        currentSlide = (currentSlide + 1) % featuredCount;
        updateCarousel();
      }
    }, 5000);
  }

  function resetCarouselTimer() {
    startCarouselTimer();
  }

  // Grid Gallery Rendering
  const gridGallery = document.getElementById("grid-gallery");
  
  function renderGridGallery() {
    gridGallery.innerHTML = "";
    allMemories.forEach((mem, index) => {
      const isCustom = mem.isUserUploaded ? true : false;
      const itemHTML = `
        <div class="gallery-item group relative overflow-hidden rounded-xl glass-panel border border-white/5 cursor-pointer break-inside-avoid block mb-4 md:mb-6" data-index="${index}">
          <img class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" src="${mem.url}" alt="${mem.caption}" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-royal-dark via-royal-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4 text-left">
            <p class="text-xs text-white font-medium font-playfair italic pr-6 leading-relaxed">"${mem.caption}"</p>
          </div>
          ${isCustom ? `
            <button class="delete-mem-btn absolute top-3 right-3 p-2 bg-red-600/80 hover:bg-red-700 text-white rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100 z-20 shadow-md" data-id="${mem.id}" title="Delete Memory">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          ` : ''}
        </div>
      `;
      gridGallery.insertAdjacentHTML("beforeend", itemHTML);
    });
    lucide.createIcons();
  }

  // Drag & Drop Upload Zone
  const dragDropZone = document.getElementById("drag-drop-zone");
  const fileInput = document.getElementById("file-input");
  const customCaptionInput = document.getElementById("custom-caption-input");
  const uploadError = document.getElementById("upload-error");

  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  }

  async function handleFiles(files) {
    uploadError.textContent = "";
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      uploadError.textContent = 'Please select a valid image file.';
      return;
    }

    try {
      const compressedBase64 = await compressImage(file);
      const customCap = customCaptionInput.value.trim();
      const captionText = customCap || SUGGESTED_CAPTIONS[Math.floor(Math.random() * SUGGESTED_CAPTIONS.length)];
      
      const newMemory = {
        url: compressedBase64,
        caption: captionText,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        isUserUploaded: true,
        id: 'user_' + Date.now()
      };

      const stored = localStorage.getItem('anniv_uploads');
      let uploaded = [];
      if (stored) {
        try {
          uploaded = JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
      
      uploaded = [newMemory, ...uploaded];
      localStorage.setItem('anniv_uploads', JSON.stringify(uploaded));
      
      customCaptionInput.value = '';
      loadMemories();
      renderCarousel();
      renderGridGallery();
    } catch (e) {
      console.error(e);
      uploadError.textContent = 'Failed to process image. Try a smaller image.';
    }
  }

  dragDropZone.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  });

  dragDropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dragDropZone.classList.add("border-gold", "bg-gold/10", "scale-[1.01]", "shadow-[0_0_20px_rgba(218,165,32,0.15)]");
  });

  dragDropZone.addEventListener("dragleave", () => {
    dragDropZone.classList.remove("border-gold", "bg-gold/10", "scale-[1.01]", "shadow-[0_0_20px_rgba(218,165,32,0.15)]");
  });

  dragDropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dragDropZone.classList.remove("border-gold", "bg-gold/10", "scale-[1.01]", "shadow-[0_0_20px_rgba(218,165,32,0.15)]");
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  });

  // Lightbox Modal Logic
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxDate = document.getElementById("lightbox-date");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxDeleteBtn = document.getElementById("lightbox-delete-btn");
  let activeLightboxIndex = 0;

  function openLightbox(index) {
    if (index < 0 || index >= allMemories.length) return;
    activeLightboxIndex = index;
    const mem = allMemories[index];
    lightboxImg.src = mem.url;
    lightboxDate.textContent = mem.date;
    lightboxCaption.textContent = mem.caption;
    
    if (mem.isUserUploaded) {
      lightboxDeleteBtn.classList.remove("hidden");
      lightboxDeleteBtn.setAttribute("data-id", mem.id);
    } else {
      lightboxDeleteBtn.classList.add("hidden");
    }
    
    lightbox.classList.add("active");
  }

  gridGallery.addEventListener("click", (e) => {
    const delBtn = e.target.closest(".delete-mem-btn");
    if (delBtn) {
      e.stopPropagation();
      const id = delBtn.getAttribute("data-id");
      deleteMemory(id);
      return;
    }

    const item = e.target.closest(".gallery-item");
    if (item) {
      const index = parseInt(item.getAttribute("data-index"));
      openLightbox(index);
    }
  });

  function deleteMemory(id) {
    const stored = localStorage.getItem('anniv_uploads');
    if (!stored) return;

    try {
      let uploaded = JSON.parse(stored);
      uploaded = uploaded.filter(mem => mem.id !== id);
      localStorage.setItem('anniv_uploads', JSON.stringify(uploaded));
      loadMemories();
      renderCarousel();
      renderGridGallery();
      lightbox.classList.remove("active");
    } catch (err) {
      console.error("Failed to delete memory", err);
    }
  }

  lightboxDeleteBtn.addEventListener("click", () => {
    const id = lightboxDeleteBtn.getAttribute("data-id");
    if (id) {
      deleteMemory(id);
    }
  });

  document.getElementById("lightbox-close").addEventListener("click", () => {
    lightbox.classList.remove("active");
  });

  document.getElementById("lightbox-next").addEventListener("click", () => {
    activeLightboxIndex = (activeLightboxIndex + 1) % allMemories.length;
    openLightbox(activeLightboxIndex);
  });

  document.getElementById("lightbox-prev").addEventListener("click", () => {
    activeLightboxIndex = (activeLightboxIndex - 1 + allMemories.length) % allMemories.length;
    openLightbox(activeLightboxIndex);
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove("active");
    }
  });

  window.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") lightbox.classList.remove("active");
    if (e.key === "ArrowRight") {
      activeLightboxIndex = (activeLightboxIndex + 1) % allMemories.length;
      openLightbox(activeLightboxIndex);
    }
    if (e.key === "ArrowLeft") {
      activeLightboxIndex = (activeLightboxIndex - 1 + allMemories.length) % allMemories.length;
      openLightbox(activeLightboxIndex);
    }
  });

  // Render initially
  renderCarousel();
  startCarouselTimer();
  renderGridGallery();

  // 7. Love Facts & Stats Counting
  const statsGrid = document.getElementById("stats-grid");
  
  CONFIG.stats.forEach(stat => {
    const isDays = stat.id === "stat-days";
    const cardHTML = `
      <div class="stat-card glass-panel border border-white/5 hover:border-gold/20 p-6 text-center transition-all duration-500 hover:scale-105 relative group overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
        <h4 class="text-xs uppercase tracking-widest text-gray-400 mb-2">${stat.label}</h4>
        <div class="font-cinzel text-3xl font-bold text-gradient-gold">
          <span>${stat.prefix || ""}</span>
          <span class="stat-number" id="${isDays ? "stat-days-val" : stat.id}" data-target="${stat.value || 0}">0</span>
          <span>${stat.suffix || ""}</span>
        </div>
      </div>
    `;
    statsGrid.insertAdjacentHTML("beforeend", cardHTML);
  });

  // GSAP Counter Animation trigger on scroll
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    document.querySelectorAll(".stat-number").forEach(el => {
      const target = parseFloat(el.getAttribute("data-target"));
      if (el.id === "stat-days-val") return; // calculated dynamically in updateLoveTimer
      
      gsap.fromTo(el, { textContent: 0 }, {
        textContent: target,
        duration: 2.5,
        ease: "power2.out",
        snap: { textContent: target % 1 === 0 ? 1 : 0.1 },
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none"
        },
        onUpdate: function() {
          if (target % 1 !== 0) {
            el.textContent = parseFloat(el.textContent).toFixed(1);
          }
        }
      });
    });
  }

  // 8. Reasons Section Generation
  const reasonsGrid = document.getElementById("reasons-grid");
  
  CONFIG.reasons.forEach(reason => {
    const cardHTML = `
      <div class="flip-card cursor-pointer">
        <div class="flip-card-inner">
          <!-- Front Side -->
          <div class="flip-card-front flex flex-col justify-center items-center p-6 text-center">
            <span class="text-4xl mb-4 animate-bounce" style="animation-duration: 3s;">${reason.emoji}</span>
            <h3 class="font-cinzel text-lg font-bold tracking-widest text-white mb-2">${reason.title}</h3>
            <span class="text-[10px] uppercase tracking-wider text-gold/60 mt-4 group-hover:text-gold">Tap / Hover to reveal</span>
          </div>
          <!-- Back Side -->
          <div class="flip-card-back flex flex-col justify-center items-center p-6 text-center">
            <h3 class="font-cinzel text-base font-bold tracking-widest text-gold mb-3">${reason.title}</h3>
            <p class="text-xs md:text-sm text-gray-300 leading-relaxed font-light font-playfair italic">
              "${reason.description}"
            </p>
          </div>
        </div>
      </div>
    `;
    reasonsGrid.insertAdjacentHTML("beforeend", cardHTML);
  });

  // Enable click flips for mobile/tablets
  document.querySelectorAll(".flip-card").forEach(card => {
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });
  });

  // 9. Typewriter Love Letter
  const letterSection = document.getElementById("letter");
  const letterSalutation = document.getElementById("letter-salutation");
  const letterParagraphsContainer = document.getElementById("letter-paragraphs");
  const letterValediction = document.getElementById("letter-valediction");
  const letterSignature = document.getElementById("letter-signature");
  
  let typewriterStarted = false;

  function typeText(element, text, speed = 40) {
    return new Promise(resolve => {
      let index = 0;
      element.classList.add("typewriter-cursor");
      
      const timer = setInterval(() => {
        if (index < text.length) {
          element.textContent += text.charAt(index);
          index++;
        } else {
          clearInterval(timer);
          element.classList.remove("typewriter-cursor");
          resolve();
        }
      }, speed);
    });
  }

  async function runLoveLetterTypewriter() {
    typewriterStarted = true;
    
    // Type Salutation
    await typeText(letterSalutation, CONFIG.letter.paragraphs[0], 40);
    await new Promise(r => setTimeout(r, 600));

    // Type Paragraphs sequentially (starting from index 1 since index 0 is salutation in CONFIG.letter)
    for (let i = 1; i < CONFIG.letter.paragraphs.length; i++) {
      const p = document.createElement("p");
      p.className = "mb-4";
      letterParagraphsContainer.appendChild(p);
      await typeText(p, CONFIG.letter.paragraphs[i], 20);
      await new Promise(r => setTimeout(r, 800));
    }

    // Type Valediction
    await typeText(letterValediction, CONFIG.letter.valediction, 45);
    await new Promise(r => setTimeout(r, 500));

    // Type Signature
    await typeText(letterSignature, CONFIG.letter.signature, 60);
  }

  // Scroll observer to trigger typewriter once
  const letterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !typewriterStarted) {
        runLoveLetterTypewriter();
      }
    });
  }, { threshold: 0.25 });

  letterObserver.observe(letterSection);

  // 10. Secret Locked Message Panel
  const secretLockForm = document.getElementById("secret-lock-form");
  const secretUnlockedContainer = document.getElementById("secret-unlocked-container");
  const passcodePrompt = document.getElementById("passcode-prompt");
  const lockError = document.getElementById("lock-error");
  const lockIcon = document.getElementById("lock-icon");
  const secretPasswordInput = document.getElementById("secret-password-input");
  const btnTogglePassword = document.getElementById("btn-toggle-password");
  const eyeIcon = document.getElementById("eye-icon");

  // Set prompt text
  if (passcodePrompt) {
    passcodePrompt.textContent = CONFIG.secret.lockedMessage;
  }

  // Toggle password visibility
  if (btnTogglePassword && secretPasswordInput && eyeIcon) {
    btnTogglePassword.addEventListener("click", () => {
      const isPassword = secretPasswordInput.type === "password";
      secretPasswordInput.type = isPassword ? "text" : "password";
      eyeIcon.setAttribute("data-lucide", isPassword ? "eye-off" : "eye");
      lucide.createIcons();
    });
  }

  // Check sessionStorage on load
  const isUnlockedSession = sessionStorage.getItem('love_story_unlocked') === 'true';
  if (isUnlockedSession) {
    revealSecretMessage(true);
  }

  function revealSecretMessage(immediate = false) {
    if (immediate) {
      if (secretLockForm) secretLockForm.classList.add("hidden");
      if (secretUnlockedContainer) {
        secretUnlockedContainer.classList.remove("hidden", "scale-95", "opacity-0");
        secretUnlockedContainer.classList.add("scale-100", "opacity-100");
        document.getElementById("unlocked-title").textContent = CONFIG.secret.unlockedTitle;
        document.getElementById("unlocked-text").textContent = CONFIG.secret.unlockedText;
      }
    } else {
      if (lockIcon) {
        lockIcon.setAttribute("data-lucide", "unlock");
        lucide.createIcons();
      }
      if (secretLockForm) {
        secretLockForm.classList.add("scale-95", "opacity-0");
      }
      setTimeout(() => {
        if (secretLockForm) secretLockForm.classList.add("hidden");
        if (secretUnlockedContainer) {
          secretUnlockedContainer.classList.remove("hidden");
          document.getElementById("unlocked-title").textContent = CONFIG.secret.unlockedTitle;
          document.getElementById("unlocked-text").textContent = CONFIG.secret.unlockedText;
          setTimeout(() => {
            secretUnlockedContainer.classList.remove("scale-95", "opacity-0");
            secretUnlockedContainer.classList.add("scale-100", "opacity-100");
          }, 50);
        }
      }, 500);
    }
  }

  if (secretLockForm) {
    secretLockForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const enteredCode = secretPasswordInput.value.trim();
      
      if (enteredCode === CONFIG.secret.passcode) {
        if (lockError) lockError.classList.add("opacity-0");
        sessionStorage.setItem('love_story_unlocked', 'true');
        
        // Confetti explosion
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#f59e0b', '#ef4444', '#dc2626', '#ffffff']
        });

        revealSecretMessage(false);
      } else {
        if (lockError) lockError.classList.remove("opacity-0");
        
        // Shake animation
        secretLockForm.classList.add("animate-shake");
        setTimeout(() => {
          secretLockForm.classList.remove("animate-shake");
        }, 500);

        secretPasswordInput.value = "";
      }
    });
  }

  // 11. Custom Particle Canvas Animation Engine
  const canvas = document.getElementById("canvas-particles");
  const ctx = canvas.getContext("2d");

  let stars = [];
  let hearts = [];
  let sparkles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Initialize background stars
  function initStars() {
    stars = [];
    const count = Math.min(60, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005
      });
    }
  }

  initStars();

  // Spawns rising hearts
  function spawnRisingHeart() {
    if (hearts.length < 20) {
      hearts.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 20,
        vy: -(Math.random() * 1.2 + 0.5),
        size: Math.random() * 14 + 6,
        alpha: Math.random() * 0.35 + 0.15,
        angle: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        wobbleDist: Math.random() * 1.5 + 0.5
      });
    }
  }

  // Draw 2D Canvas Heart
  function drawHeart(x, y, size, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    ctx.quadraticCurveTo(x, y, x + size / 4, y);
    ctx.quadraticCurveTo(x + size / 2, y, x + size / 2, y + size / 4);
    ctx.quadraticCurveTo(x + size / 2, y, x + (size * 3) / 4, y);
    ctx.quadraticCurveTo(x + size, y, x + size, y + size / 4);
    ctx.quadraticCurveTo(x + size, y + size / 2, x + (size * 3) / 4, y + (size * 3) / 4);
    ctx.lineTo(x + size / 2, y + size);
    ctx.lineTo(x + size / 4, y + (size * 3) / 4);
    ctx.quadraticCurveTo(x, y + size / 2, x, y + size / 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Draw 4-point star for sparkles
  function drawSparkle(x, y, size, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size * 0.3, y - size * 0.3);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x + size * 0.3, y + size * 0.3);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x - size * 0.3, y + size * 0.3);
    ctx.lineTo(x - size, y);
    ctx.lineTo(x - size * 0.3, y - size * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Mouse Move sparkle triggers
  window.addEventListener("mousemove", (e) => {
    if (Math.random() < 0.25) {
      sparkles.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 0.5,
        size: Math.random() * 5 + 3,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015
      });
    }
  });

  // Particle render ticks
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Twinkling Stars
    stars.forEach(star => {
      ctx.fillStyle = `rgba(251, 191, 36, ${star.alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();

      // Twinkle logic
      star.alpha += star.twinkleSpeed;
      if (star.alpha > 0.8 || star.alpha < 0.2) {
        star.twinkleSpeed = -star.twinkleSpeed;
      }
    });

    // 2. Draw Rising Hearts
    if (Math.random() < 0.05) spawnRisingHeart();
    
    hearts.forEach((heart, idx) => {
      heart.y += heart.vy;
      heart.angle += heart.wobbleSpeed;
      const drawX = heart.x + Math.sin(heart.angle) * heart.wobbleDist;
      
      drawHeart(drawX, heart.y, heart.size, heart.alpha);

      // Remove out of bounds hearts
      if (heart.y < -30) {
        hearts.splice(idx, 1);
      }
    });

    // 3. Draw cursor sparkles
    sparkles.forEach((sp, idx) => {
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.alpha -= sp.decay;

      drawSparkle(sp.x, sp.y, sp.size, sp.alpha);

      if (sp.alpha <= 0) {
        sparkles.splice(idx, 1);
      }
    });

    requestAnimationFrame(drawParticles);
  }

  // Launch particle loop
  drawParticles();

  // 12. Confetti Generators
  function triggerOpeningConfetti() {
    const duration = 3.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#fbbf24", "#ef4444", "#ffffff"]
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#fbbf24", "#ef4444", "#ffffff"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }

  // 13. Dynamic Navigation Scroll Spy and Sticky Header
  const header = document.querySelector("header");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  const sections = document.querySelectorAll("section");

  window.addEventListener("scroll", () => {
    // Add border and background to navbar on scroll
    if (window.scrollY > 50) {
      header.classList.add("bg-royal-dark/90", "backdrop-blur-md", "border-b-gold/15");
      header.style.paddingTop = "12px";
      header.style.paddingBottom = "12px";
    } else {
      header.classList.remove("bg-royal-dark/90", "backdrop-blur-md", "border-b-gold/15");
      header.style.paddingTop = "20px";
      header.style.paddingBottom = "20px";
    }

    // Scroll spy active tab indicator
    let currentActiveSectionId = "";
    sections.forEach(section => {
      const top = section.offsetTop - 150;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        currentActiveSectionId = section.getAttribute("id");
      }
    });

    if (currentActiveSectionId) {
      navLinks.forEach(link => {
        link.classList.remove("text-gold", "nav-active");
        if (link.getAttribute("href") === `#${currentActiveSectionId}`) {
          link.classList.add("text-gold");
          // Custom underline indicator
          const underline = link.querySelector(".nav-underline");
          if (underline) underline.classList.remove("scale-x-0");
        } else {
          const underline = link.querySelector(".nav-underline");
          if (underline) underline.classList.add("scale-x-0");
        }
      });
      mobileNavLinks.forEach(link => {
        link.classList.remove("text-gold");
        if (link.getAttribute("href") === `#${currentActiveSectionId}`) {
          link.classList.add("text-gold");
        }
      });
    }
  });

  // Mobile Hamburger Menu toggle
  const btnMobileMenu = document.getElementById("btn-mobile-menu");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuIcon = document.getElementById("mobile-menu-icon");

  btnMobileMenu.addEventListener("click", () => {
    const isHidden = mobileMenu.classList.contains("hidden");
    if (isHidden) {
      mobileMenu.classList.remove("hidden");
      mobileMenuIcon.setAttribute("data-lucide", "x");
    } else {
      mobileMenu.classList.add("hidden");
      mobileMenuIcon.setAttribute("data-lucide", "menu");
    }
    lucide.createIcons();
  });

  // Close mobile menu on links clicks
  mobileNavLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      mobileMenuIcon.setAttribute("data-lucide", "menu");
      lucide.createIcons();
    });
  });

  // Run Lucide Init
  lucide.createIcons();
});
