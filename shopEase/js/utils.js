/* ==========================================================================
   ShopEase — Shared utilities
   Loaded on every page. Handles cart persistence, navbar behavior, and
   small reusable helpers used across Home / Products / Cart / Checkout.
   ========================================================================== */

const CART_KEY = 'shopease_cart';
const WISHLIST_KEY = 'shopease_wishlist';
const SHIPPING_FLAT = 6.99;
const FREE_SHIPPING_THRESHOLD = 100;
const TAX_RATE = 0.0; // kept configurable; disabled by default

/* ---------------------------------------------------------------------- */
/* Formatting                                                              */
/* ---------------------------------------------------------------------- */
function formatPrice(value) {
  return '$' + Number(value).toFixed(2);
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n).trim() + '…' : str;
}

/* ---------------------------------------------------------------------- */
/* Cart storage                                                            */
/* cart = [{ id, title, price, image, category, qty }]                     */
/* ---------------------------------------------------------------------- */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      qty: qty,
    });
  }
  saveCart(cart);
  return cart;
}

function removeFromCart(id) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
  return cart;
}

function updateQty(id, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return cart;
  item.qty += delta;
  if (item.qty < 1) item.qty = 1;
  saveCart(cart);
  return cart;
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = cart.length === 0 ? 0 : (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}

/* ---------------------------------------------------------------------- */
/* Wishlist storage (visual toggle persisted across sessions)              */
/* ---------------------------------------------------------------------- */
function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function toggleWishlist(id) {
  let list = getWishlist();
  if (list.includes(id)) {
    list = list.filter((x) => x !== id);
  } else {
    list.push(id);
  }
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  return list.includes(id);
}

/* ---------------------------------------------------------------------- */
/* Navbar: mobile toggle + active link + cart badge                        */
/* ---------------------------------------------------------------------- */
function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'grid' : 'none';
}

function initNavbar() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
      })
    );
  }

  // Highlight the active nav link based on current page
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  updateCartBadge();
}

/* ---------------------------------------------------------------------- */
/* Toast notification                                                      */
/* ---------------------------------------------------------------------- */
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span></span>';
    document.body.appendChild(toast);
  }
  toast.querySelector('span').textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2400);
}

/* ---------------------------------------------------------------------- */
/* Star rating renderer (returns HTML string of 5 stars)                   */
/* ---------------------------------------------------------------------- */
function renderStars(rating) {
  const rounded = Math.round(rating);
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<svg viewBox="0 0 20 20" class="${i <= rounded ? 'filled' : ''}"><path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.2 1.3 6-5.4-3.1-5.4 3.1 1.3-6L1.3 7.7l6.1-.6L10 1.5z"/></svg>`;
  }
  return html;
}

/* ---------------------------------------------------------------------- */
/* Init on every page load                                                 */
/* ---------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.remove('no-js');
  initNavbar();

  // Newsletter form (footer) — present on every page
  const nlForm = document.querySelector('.newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = nlForm.querySelector('input');
      if (input.value.trim()) {
        showToast('Thanks for subscribing!');
        input.value = '';
      }
    });
  }
});
