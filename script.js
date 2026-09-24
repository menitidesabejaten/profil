document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. DARK MODE TOGGLE (Fix for Online / GitHub Pages) ---
    const htmlElement = document.documentElement;
    // Load saved theme on load
    try {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            htmlElement.setAttribute("data-theme", "dark");
            const iconTheme = document.querySelector("#theme-toggle i");
            if (iconTheme) {
                iconTheme.classList.remove("fa-moon");
                iconTheme.classList.add("fa-sun");
            }
        }
    } catch (e) {
        console.warn("localStorage tidak dapat diakses", e);
    }
    
    // Event delegation approach avoids missing bindings when rendered online
    document.addEventListener("click", function(e) {
        const themeToggleBtn = e.target.closest("#theme-toggle");
        if (!themeToggleBtn) return;
        
        e.preventDefault(); 
        const currentTheme = htmlElement.getAttribute("data-theme");
        const iconTheme = themeToggleBtn.querySelector("i");
        
        if (currentTheme === "dark") {
            htmlElement.removeAttribute("data-theme");
            if (iconTheme) {
                iconTheme.classList.remove("fa-sun");
                iconTheme.classList.add("fa-moon");
            }
            try { localStorage.setItem("theme", "light"); } catch(err) {}
        } else {
            htmlElement.setAttribute("data-theme", "dark");
            if (iconTheme) {
                iconTheme.classList.remove("fa-moon");
                iconTheme.classList.add("fa-sun");
            }
            try { localStorage.setItem("theme", "dark"); } catch(err) {}
        }
    });
    // --- 1.5 ADMIN LOGIN MODAL ---
    const btnAdmin = document.getElementById("btn-admin");
    const adminModal = document.getElementById("admin-modal");
    const adminClose = document.getElementById("admin-close");
    const adminSubmit = document.getElementById("admin-submit");
    const adminError = document.getElementById("admin-error");
    btnAdmin.addEventListener("click", (e) => {
        e.preventDefault();
        adminModal.classList.add("show");
        if (window.innerWidth > 850) { document.body.style.overflow = "hidden"; }
        
        adminError.style.display = "none";
        document.getElementById("admin-user").value = "";
        document.getElementById("admin-pass").value = "";
    });
    adminClose.addEventListener("click", () => {
        adminModal.classList.remove("show");
        if (window.innerWidth > 850) { document.body.style.overflow = "auto"; }
    });
    adminSubmit.addEventListener("click", () => {
        adminError.style.display = "block";
    });
    adminModal.addEventListener("click", (e) => {
        if(e.target === adminModal) {
            adminModal.classList.remove("show");
            if (window.innerWidth > 850) { document.body.style.overflow = "auto"; }
        }
    });
    // --- 2. HAMBURGER MENU & DROPDOWN ---
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.querySelector(".nav-links");
    const dropdowns = document.querySelectorAll(".dropdown");
    const navRight = document.querySelector(".nav-right");
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        navRight.classList.toggle("mobile-active");
        const isIconMenu = hamburger.querySelector("i").classList.contains("fa-bars");
        if(isIconMenu){
            hamburger.querySelector("i").classList.replace("fa-bars", "fa-times");
        } else {
            hamburger.querySelector("i").classList.replace("fa-times", "fa-bars");
        }
    });
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("click", function(e) {
            if(window.innerWidth <= 850) {
                if(e.target.classList.contains("fa-chevron-down") || e.target.parentElement.classList.contains("dropdown")){
                    e.preventDefault();
                    this.classList.toggle("open");
                }
            }
        });
    });
    // --- 3. NAVBAR SCROLL EFFECT ---
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.style.padding = "0.5rem 1.5%";
            navbar.style.boxShadow = "var(--shadow-md)";
        } else {
            navbar.style.padding = "0 1.5%";
            navbar.style.boxShadow = "var(--shadow-sm)";
        }
    });
    // --- 4. SCROLL ANIMATION (INTERSECTION OBSERVER) ---
    const faders = document.querySelectorAll('.fade-up');
    const appearOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        });
    }, appearOptions);
    faders.forEach(fader => appearOnScroll.observe(fader));
    // --- 5. LUARAN DASHBOARD: FILTER & MODAL FULL DETAIL ---
    const filterBtns = document.querySelectorAll('.btn-filter');
    const luaranCards = document.querySelectorAll('.luaran-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            
            luaranCards.forEach(card => {
                if(filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    const luaranModal = document.getElementById('luaran-modal');
    const modalClose = document.getElementById('modal-close');
    const modalCloseMob = document.getElementById('modal-close-mob');
    
    luaranCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.getAttribute('data-title');
            const indDesc = card.getAttribute('data-ind-desc');
            const target = card.getAttribute('data-target');
            const realisasi = card.getAttribute('data-realisasi');
            const capaian = card.getAttribute('data-capaian');
            const capaianBar = card.getAttribute('data-capaian-bar');
            const status = card.getAttribute('data-status');
            const luaranDesc = card.getAttribute('data-luaran-desc');
            const luaranRaw = card.getAttribute('data-luaran-list');
            
            document.getElementById('m-title').textContent = title;
            document.getElementById('m-ind-desc').textContent = indDesc;
            document.getElementById('m-target').textContent = target;
            document.getElementById('m-realisasi').textContent = realisasi;
            
            document.getElementById('m-capaian').textContent = capaian;
            setTimeout(() => { document.getElementById('m-capaian-bar').style.width = capaianBar + '%'; }, 100);
            document.getElementById('m-status').textContent = status;
            
            document.getElementById('m-luaran-desc').textContent = luaranDesc;
            
            const luaranListElem = document.getElementById('m-luaran-list');
            luaranListElem.innerHTML = ''; 
            
            if(luaranRaw && luaranRaw.trim() !== "") {
                const luaranItems = luaranRaw.split('|');
                luaranItems.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    luaranListElem.appendChild(li);
                });
            } else {
                luaranListElem.innerHTML = '<li>-</li>';
            }
            
            luaranModal.classList.add('show');
            if (window.innerWidth > 850) { document.body.style.overflow = 'hidden'; }
        });
    });
    const closeLuaranModal = () => {
        luaranModal.classList.remove('show');
        if (window.innerWidth > 850) { document.body.style.overflow = 'auto'; }
        document.getElementById('m-capaian-bar').style.width = '0%';
    };
    modalClose.addEventListener('click', closeLuaranModal);
    modalCloseMob.addEventListener('click', closeLuaranModal);
    
    luaranModal.addEventListener('click', (e) => {
        if(e.target === luaranModal) closeLuaranModal();
    });
    // =========================================
    //  INTERACTIVE OWL MASCOT SYSTEM
    // =========================================
    const OWL_IMAGES = [
        'https://res.cloudinary.com/drxc5e7gf/image/upload/q_auto,f_auto/v1787852921/Desain_tanpa_judul-removebg-preview_rg07lx.png',
        'https://res.cloudinary.com/drxc5e7gf/image/upload/q_auto,f_auto/v1787880579/Gemini_Generated_Image_2id6wx2id6wx2id6-removebg-preview_olwtbr.png',
        'https://res.cloudinary.com/drxc5e7gf/image/upload/q_auto,f_auto/v1787880580/Gemini_Generated_Image_cc0pxrcc0pxrcc0p-removebg-preview_ttafa4.png',
        'https://res.cloudinary.com/drxc5e7gf/image/upload/q_auto,f_auto/v1787880581/Gemini_Generated_Image_iihwgkiihwgkiihw-removebg-preview_idqap9.png',
        'https://res.cloudinary.com/drxc5e7gf/image/upload/q_auto,f_auto/v1787880580/Gemini_Generated_Image_kginynkginynkgin-removebg-preview_iunykg.png'
    ];
    
    const OWL_EFFECTS = [ ' ✨ ', ' ❓ ', ' ❗ ', ' ☁️ ', ' 💨 ', '' ];
    let currentOwlIndex = 0;
    
    const sysContainer = document.getElementById('owl-system');
    const wrap = document.getElementById('owl-wrapper');
    const img = document.getElementById('owl-img');
    const fx = document.getElementById('owl-fx');
    
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rand = (min, max) => Math.random() * (max - min) + min;
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    function runOwlCycle() {
        if (isReducedMotion || !sysContainer) return;
        
        img.src = OWL_IMAGES[currentOwlIndex];
        currentOwlIndex = (currentOwlIndex + 1) % OWL_IMAGES.length;
        
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const owlSize = vw < 768 ? 90 : 120;
        
        img.style.width = owlSize + 'px';
        img.style.height = owlSize + 'px';
        
        let side = randInt(0, 3);
        
        let startX, startY, endX, endY, rot;
        let scaleX = 1;
        const marginPadding = rand(20, 150);
        const edgeMargin = 15;
        
        if (side === 0) {
            startX = rand(marginPadding, vw - owlSize - marginPadding); startY = -owlSize - 50; endX = startX; endY = edgeMargin; rot = 180;
        } else if (side === 1) {
            startX = vw + 50; startY = rand(marginPadding, vh - owlSize - marginPadding); endX = vw - owlSize - edgeMargin; endY = startY; rot = -90; scaleX = -1; 
        } else if (side === 2) {
            startX = rand(marginPadding, vw - owlSize - marginPadding); startY = vh + 50; endX = startX; endY = vh - owlSize - edgeMargin; rot = 0;
        } else if (side === 3) {
            startX = -owlSize - 50; startY = rand(marginPadding, vh - owlSize - marginPadding); endX = edgeMargin; endY = startY; rot = 90; scaleX = -1; 
        }
        
        const animDuration = 600; 
        const holdDuration = 3500; 
        const delayBeforeNext = 3500; 
        
        wrap.style.transition = 'none'; 
        wrap.style.transform = `translate(${startX}px, ${startY}px)`; 
        wrap.style.opacity = '0'; 
        wrap.classList.remove('owl-sway');
        img.style.transform = `scaleX(${scaleX}) rotate(${rot}deg)`; 
        fx.className = ''; fx.innerHTML = '';
        
        void wrap.offsetWidth;
        
        wrap.style.transition = `all ${animDuration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`; 
        wrap.style.transform = `translate(${endX}px, ${endY}px)`; 
        wrap.style.opacity = '1';
        
        const chosenFx = OWL_EFFECTS[randInt(0, OWL_EFFECTS.length - 1)];
        if (chosenFx !== '') { setTimeout(() => { fx.innerHTML = chosenFx; fx.style.top = (side === 2) ? '10%' : '80%'; fx.className = 'owl-fx-pop'; }, animDuration / 2); }
        
        setTimeout(() => { wrap.classList.add('owl-sway'); }, animDuration);
        
        setTimeout(() => {
            wrap.classList.remove('owl-sway'); 
            wrap.style.transition = `all ${animDuration}ms ease-in`; 
            wrap.style.transform = `translate(${startX}px, ${startY}px)`;
            wrap.style.opacity = '0';
            
            setTimeout(runOwlCycle, animDuration + delayBeforeNext);
        }, animDuration + holdDuration);
    }
    setTimeout(runOwlCycle, 2000);
});
// =========================================
//  FITUR STRICT MOBILE BLOCKER (Responsive Mode)
// =========================================
document.addEventListener("DOMContentLoaded", function() {
    function applyBlocker() {
        const isMobileUA = /Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isSmallWindow = window.innerWidth <= 767;
        
        if (isMobileUA && isSmallWindow) {
            document.body.classList.add("force-block");
        } else {
            document.body.classList.remove("force-block");
        }
    }
    applyBlocker();
    window.addEventListener("resize", applyBlocker);
});