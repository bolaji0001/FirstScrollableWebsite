const menu= document.querySelector('#mobile-menu')
const menuLinks= document.querySelector('.navbar__menu');
const navLogo = document.querySelector('#navbar__logo');
const navbar = document.querySelector('.navbar');
let clickHighlighted = false; // Flag to track if highlight was set by click

// Make navbar sticky after scrolling past viewport height
const makeNavbarSticky = function() {
    const viewportHeight = window.innerHeight;
    const scrollPosition = window.scrollY;
    
    if (scrollPosition >= viewportHeight) {
        navbar.classList.add('sticky');
        document.body.classList.add('navbar-sticky');
    } else {
        navbar.classList.remove('sticky');
        document.body.classList.remove('navbar-sticky');
    }
};

window.addEventListener('scroll', makeNavbarSticky);
// Check on page load
makeNavbarSticky();

//Display mobile Menu
const mobileMenu = menu.addEventListener("click", function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

menu.addEventListener('click', mobileMenu);

//Show active menu when scrolling
const highlightMenu = function () {
    // Don't interfere if highlight was set by click
    if (clickHighlighted) return;
    
    const elem = document.querySelector('.highlight');
    const homeMenu = document.querySelector('#home-page');
    const aboutMenu = document.querySelector('#about-page');
    const servicesMenu = document.querySelector('#services-page');
    let scrollPos = window.scrollY
    // console.log(scrollPos);

    //adds the highlight class to my menu items 
    if(window.innerWidth > 960 && scrollPos < 600) {
        homeMenu.classList.add('highlight');
        aboutMenu.classList.remove('highlight');
        return
    }else if(window.innerWidth > 960 && scrollPos <1400 ) {
        aboutMenu.classList.add('highlight');
        homeMenu.classList.remove('highlight');
        servicesMenu.classList.remove('highlight');
        return
    }else if(window.innerWidth > 960 && scrollPos < 2345) {
        aboutMenu.classList.remove('highlight');
        servicesMenu.classList.add('highlight');
        return
    }
    if((elem && window.innerWidth < 960 && scrollPos < 600 ) || elem) {
        elem.classList.remove('highlight');
    }
    }

    window.addEventListener("scroll", highlightMenu);
    window.addEventListener("click", highlightMenu);

    //Close mobile-menu when clicking on a menu item 
    const hideMobileMenu = () => {
        const menuBars = document.querySelector('.is-active');
        if(window.innerWidth <= 768 && menuBars) {
            menu.classList.toogle('is-active')
            menuLinks.classList.remove('active')
        }
    }

    menuLinks.addEventListener("click", hideMobileMenu)
    navLogo.addEventListener("click", hideMobileMenu)

    // Add highlight class to clicked navbar link and handle smooth scrolling
    const navbarLinks = document.querySelectorAll('.navbar__item .navbar__links, .navbar__btn .button');
    const navbarHeight = 80; // Height of sticky navbar
    
    navbarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Prevent default anchor behavior
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                // Set flag to prevent other functions from removing highlight
                clickHighlighted = true;
                
                // Remove highlight from all links
                navbarLinks.forEach(l => l.classList.remove('highlight'));
                // Add highlight to clicked link
                this.classList.add('highlight');
                
                // Smooth scroll to section accounting for navbar height
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    let targetPosition;
                    
                    // For home section, scroll to top
                    if (href === '#home') {
                        targetPosition = 0;
                    } else {
                        // Use getBoundingClientRect for accurate position calculation
                        const rect = targetSection.getBoundingClientRect();
                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        // Calculate target position: current scroll + element position - navbar height
                        targetPosition = scrollTop + rect.top - navbarHeight;
                    }
                    
                    window.scrollTo({
                        top: Math.max(0, targetPosition), // Ensure we don't scroll to negative position
                        behavior: 'smooth'
                    });
                }
                
                // Allow IntersectionObserver to take over after scroll completes
                setTimeout(function() {
                    clickHighlighted = false;
                }, 1000);
            }
        });
    });

    // IntersectionObserver to observe sections and update highlight
    const sections = document.querySelectorAll('#home, #about, #services, #sign-up');
    const navLinks = {
        '#home': document.querySelector('#home-page'),
        '#about': document.querySelector('#about-page'),
        '#services': document.querySelector('#services-page'),
        '#sign-up': document.querySelector('#sign-up-btn')
    };

    let isScrolling = false;
    let scrollTimeout;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observerCallback = (entries) => {
        // Only update highlight if not actively scrolling and not set by click (to allow click highlights to show)
        if (isScrolling || clickHighlighted) return;
        
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = '#' + entry.target.id;
                const correspondingLink = navLinks[sectionId];
                
                if (correspondingLink) {
                    // Remove highlight from all links
                    navbarLinks.forEach(link => link.classList.remove('highlight'));
                    // Add highlight to the link corresponding to the visible section
                    correspondingLink.classList.add('highlight');
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });

    // Track scrolling state to prevent IntersectionObserver from overriding click highlights
    window.addEventListener('scroll', function() {
        isScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            isScrolling = false;
        }, 150);
    });