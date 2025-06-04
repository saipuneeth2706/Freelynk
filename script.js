// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 2
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Header button functionality
const headerButton = document.querySelector('.header_button');
const headerPage = document.querySelector('.header_page');
const headerPageClose = document.querySelector('.header_page_close');

headerButton.addEventListener('click', () => {
  headerPage.classList.add('active');
});

headerPageClose.addEventListener('click', () => {
  headerPage.classList.remove('active');
});

// Smooth scroll function
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    lenis.scrollTo(section, {
      offset: 0,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
    headerPage.classList.remove('active');
  }
}