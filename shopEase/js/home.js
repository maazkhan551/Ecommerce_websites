/* ==========================================================================
   ShopEase — Home page logic
   Featured products + GSAP/ScrollTrigger reveal animations.
   ========================================================================== */

/* ---------------------------------------------------------------------- */
/* Featured products                                                       */
/* ---------------------------------------------------------------------- */
function mapApiProduct(p) {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    image: (p.images && p.images[0]) || p.thumbnail,
    category: p.category,
    rating: p.rating,
  };
}

function productCardHTML(p) {
  const inWishlist = getWishlist().includes(p.id);
  return `
    <article class="product-card reveal" data-id="${p.id}">
      <div class="product-media">
        <span class="badge">${p.category}</span>
        <button class="wishlist-btn ${inWishlist ? 'active' : ''}" data-wishlist="${p.id}" aria-label="Toggle wishlist">
          <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"></path></svg>
        </button>
        <img src="${p.image}" alt="${p.title}" loading="lazy">
      </div>
      <div class="product-cat">${p.category}</div>
      <h3 class="product-name">${p.title}</h3>
      <div class="product-rating">
        <span class="stars">${renderStars(p.rating || 4)}</span>
        <span>${(p.rating || 4).toFixed ? p.rating.toFixed(1) : p.rating}</span>
      </div>
      <div class="product-footer">
        <span class="product-price">${formatPrice(p.price)}</span>
        <button class="add-btn" data-add="${p.id}" aria-label="Add to cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </div>
    </article>`;
}

let featuredProducts = [];

async function loadFeaturedProducts() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  try {
    const res = await fetch('https://dummyjson.com/products?limit=6&skip=4');
    const data = await res.json();
    featuredProducts = data.products.map(mapApiProduct);
    grid.innerHTML = featuredProducts.map(productCardHTML).join('');
    bindFeaturedCardEvents();
    animateFeaturedCards();
  } catch (err) {
    grid.innerHTML = '<p style="color:var(--ink-600)">Could not load products right now. Please refresh.</p>';
  }
}

function bindFeaturedCardEvents() {
  document.querySelectorAll('#featured-grid [data-add]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.add);
      const product = featuredProducts.find((p) => p.id === id);
      if (product) {
        addToCart(product);
        showToast(`${truncate(product.title, 28)} added to cart`);
      }
    });
  });
  document.querySelectorAll('#featured-grid [data-wishlist]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.wishlist);
      const active = toggleWishlist(id);
      btn.classList.toggle('active', active);
    });
  });
}

function animateFeaturedCards() {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('#featured-grid .reveal').forEach((el) => (el.style.opacity = 1));
    return;
  }
  gsap.fromTo(
    '#featured-grid .product-card',
    { opacity: 0, y: 40, scale: 0.96 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#featured-grid',
        start: 'top 85%',
        toggleActions: 'restart none none none',
      },
    }
  );
}

/* ---------------------------------------------------------------------- */
/* GSAP ScrollTrigger reveal animations for static sections                */
/* ---------------------------------------------------------------------- */
function initScrollAnimations() {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('.reveal').forEach((el) => (el.style.opacity = 1));
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance (plays once on load, not scroll-triggered)
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .fromTo('.hero-copy .eyebrow', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 })
    .fromTo('.hero-copy h1', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
    .fromTo('.hero-copy p', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.35')
    .fromTo('.hero-actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
    .fromTo('.hero-stats', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
    .fromTo('.hero-visual', { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.8 }, '-=0.7');

  // Hero section GSAP
  gsap.from(".badge-1",{
    x:-600,
    opacity:0,
    duration:3
  })
  gsap.from(".badge-2",{
    x:400,
    opacity:0,
    duration:3
  })
 // CTA banner — scale + fade in as a whole, sparkles stagger in after
  gsap.from(
    '.cta-banner-section',
    { y: 40, scale: 0.57,
      duration:3,
      scrollTrigger: { trigger: '.cta-banner-section',start: 'top 62%',  toggleActions: 'restart none none none' }
     }
);
  gsap.fromTo(
    '.cta-tag, .cta-heart, .cta-sparkle',
    { opacity: 0, scale: 0.5 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      stagger: 0.1,
      delay: 0.3,
      ease: 'back.out(2)',
      scrollTrigger: { trigger: '.cta-banner', start: 'top 82%', toggleActions: 'restart none none none' },
    }
  );

  // Section headings — fade/slide up as they enter
  gsap.utils.toArray('.section-head').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'restart none none none' },
      }
    );
  });

  // Why choose us — staggered scale-in cards
  gsap.fromTo(
    '.why-card',
    { opacity: 0, y: 30, scale: 0.95 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.why-grid', start: 'top 85%', toggleActions: 'restart none none none' },
    }
  );

  // About section — split slide from left/right
  gsap.fromTo(
    '.about-visual',
    { opacity: 0, x: -50 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.about', start: 'top 75%', toggleActions: 'restart none none none' },
    }
  );
  gsap.fromTo(
    '.about-copy',
    { opacity: 0, x: 50 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.about', start: 'top 75%', toggleActions: 'restart none none none' },
    }
  );

  // Testimonials — stagger fade up
  gsap.fromTo(
    '.testi-card',
    { opacity: 0, y: 36 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.testi-grid', start: 'top 85%', toggleActions: 'restart none none none' },
    }
  );

  // Contact — form and info slide in
  gsap.fromTo(
    '.contact-info',
    { opacity: 0, x: -30 },
    {
      opacity: 1,
      x: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.contact', start: 'top 80%', toggleActions: 'restart none none none' },
    }
  );
  gsap.fromTo(
    '.contact-form',
    { opacity: 0, x: 30 },
    {
      opacity: 1,
      x: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.contact', start: 'top 80%', toggleActions: 'restart none none none' },
    }
  );
}

/* ---------------------------------------------------------------------- */
/* Contact form validation (front-end only, no backend)                    */
/* ---------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    ['name', 'email', 'message'].forEach((name) => {
      const input = form.querySelector(`[name="${name}"]`);
      const field = input.closest('.field');
      const isEmpty = !input.value.trim();
      const isBadEmail = name === 'email' && input.value.trim() && !/^\S+@\S+\.\S+$/.test(input.value);
      field.classList.toggle('invalid', isEmpty || isBadEmail);
      if (isEmpty || isBadEmail) valid = false;
    });
    if (valid) {
      showToast('Message sent — we\u2019ll be in touch soon!');
      form.reset();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadFeaturedProducts();
  initScrollAnimations();
  initContactForm();
});
