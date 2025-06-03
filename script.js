// Initialize Lenis
const lenis = new Lenis({
  autoRaf: true,
  duration: 2
});

// Listen for the scroll event and log the event data
lenis.on('scroll', (e) => {
  console.log(e);
});