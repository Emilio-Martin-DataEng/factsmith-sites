// Adds .play to each .motion / .seedling block when it scrolls into view, so its animation runs once.
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('play'); io.unobserve(e.target); } }), { threshold: .3 });
document.querySelectorAll('.motion, .seedling').forEach(el => io.observe(el));
