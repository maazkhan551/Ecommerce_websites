/* ==========================================================================
   ShopEase — Products page logic
   Fetches from https://dummyjson.com/products, supports search, category
   filter, sort, and pagination. Cards are neumorphic with wishlist + add.
   ========================================================================== */

const PAGE_SIZE = 9;

const state = {
  page: 1,
  total: 0,
  query: '',
  category: '',
  sort: 'default',
  products: [],
};

const grid = document.getElementById('products-grid');
const paginationEl = document.getElementById('pagination');
const resultsCountEl = document.getElementById('results-count');
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');
const sortSelect = document.getElementById('sort-select');

/* ---------------------------------------------------------------------- */
/* Data mapping                                                            */
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

/* ---------------------------------------------------------------------- */
/* Fetching                                                                 */
/* ---------------------------------------------------------------------- */
async function fetchCategories() {
  try {
    const res = await fetch('https://dummyjson.com/products/categories');
    const cats = await res.json();
    categorySelect.innerHTML =
      '<option value="">All Categories</option>' +
      cats.map((c) => `<option value="${c.slug}">${c.name}</option>`).join('');
  } catch (err) {
    /* silently ignore — filter is a progressive enhancement */
  }
}

function buildUrl() {
  const skip = (state.page - 1) * PAGE_SIZE;
  if (state.query) {
    return `https://dummyjson.com/products/search?q=${encodeURIComponent(state.query)}&limit=${PAGE_SIZE}&skip=${skip}`;
  }
  if (state.category) {
    return `https://dummyjson.com/products/category/${state.category}?limit=${PAGE_SIZE}&skip=${skip}`;
  }
  return `https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=${skip}`;
}

async function fetchProducts() {
  showLoading();
  try {
    const res = await fetch(buildUrl());
    const data = await res.json();
    let products = data.products.map(mapApiProduct);
    products = sortProducts(products, state.sort);
    state.products = products;
    state.total = data.total || products.length;
    renderProducts();
    renderPagination();
    renderResultsCount();
  } catch (err) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <h3>Something went wrong</h3>
        <p>We couldn't load products. Please check your connection and try again.</p>
      </div>`;
  }
}

function sortProducts(products, sort) {
  const arr = [...products];
  switch (sort) {
    case 'price-asc': return arr.sort((a, b) => a.price - b.price);
    case 'price-desc': return arr.sort((a, b) => b.price - a.price);
    case 'rating': return arr.sort((a, b) => b.rating - a.rating);
    case 'name': return arr.sort((a, b) => a.title.localeCompare(b.title));
    default: return arr;
  }
}

/* ---------------------------------------------------------------------- */
/* Rendering                                                               */
/* ---------------------------------------------------------------------- */
function showLoading() {
  grid.innerHTML = `<div class="spinner-wrap" style="grid-column:1/-1"><div class="spinner"></div></div>`;
  paginationEl.innerHTML = '';
}

function renderResultsCount() {
  resultsCountEl.textContent = `${state.total} product${state.total !== 1 ? 's' : ''} found`;
}

function productCardHTML(p) {
  const inWishlist = getWishlist().includes(p.id);
  return `
    <article class="product-card" data-id="${p.id}">
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
        <span>${p.rating ? p.rating.toFixed(1) : '4.0'}</span>
      </div>
      <div class="product-footer">
        <span class="product-price">${formatPrice(p.price)}</span>
        <button class="add-btn" data-add="${p.id}" aria-label="Add to cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </div>
    </article>`;
}

function renderProducts() {
  if (state.products.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <h3>No products found</h3>
        <p>Try a different search term or category.</p>
      </div>`;
    return;
  }
  grid.innerHTML = state.products.map(productCardHTML).join('');
  bindCardEvents();
  animateGrid();
}

function bindCardEvents() {
  grid.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.add);
      const product = state.products.find((p) => p.id === id);
      if (product) {
        addToCart(product);
        showToast(`${truncate(product.title, 28)} added to cart`);
      }
    });
  });
  grid.querySelectorAll('[data-wishlist]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.wishlist);
      const active = toggleWishlist(id);
      btn.classList.toggle('active', active);
    });
  });
}

function animateGrid() {
  if (typeof gsap === 'undefined') return;
  gsap.fromTo(
    '#products-grid .product-card',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' }
  );
}

/* ---------------------------------------------------------------------- */
/* Pagination                                                              */
/* ---------------------------------------------------------------------- */
function renderPagination() {
  const totalPages = Math.max(1, Math.ceil(state.total / PAGE_SIZE));
  if (totalPages <= 1) {
    paginationEl.innerHTML = '';
    return;
  }

  let html = `<button class="page-btn" data-page="prev" ${state.page === 1 ? 'disabled' : ''} aria-label="Previous page">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
  </button>`;

  const pages = getPageRange(state.page, totalPages);
  pages.forEach((p) => {
    if (p === '...') {
      html += `<span class="page-dots">&hellip;</span>`;
    } else {
      html += `<button class="page-btn ${p === state.page ? 'active' : ''}" data-page="${p}">${p}</button>`;
    }
  });

  html += `<button class="page-btn" data-page="next" ${state.page === totalPages ? 'disabled' : ''} aria-label="Next page">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
  </button>`;

  paginationEl.innerHTML = html;

  paginationEl.querySelectorAll('.page-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.page;
      const totalPages = Math.max(1, Math.ceil(state.total / PAGE_SIZE));
      if (val === 'prev') state.page = Math.max(1, state.page - 1);
      else if (val === 'next') state.page = Math.min(totalPages, state.page + 1);
      else state.page = Number(val);
      fetchProducts();
      document.getElementById('products-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function getPageRange(current, total) {
  const range = [];
  const delta = 1;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    } else if (range[range.length - 1] !== '...') {
      range.push('...');
    }
  }
  return range;
}

/* ---------------------------------------------------------------------- */
/* Filters (search / category / sort)                                      */
/* ---------------------------------------------------------------------- */
let searchDebounce;
function initFilters() {
  searchInput?.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      state.query = searchInput.value.trim();
      state.category = '';
      if (categorySelect) categorySelect.value = '';
      state.page = 1;
      fetchProducts();
    }, 400);
  });

  categorySelect?.addEventListener('change', () => {
    state.category = categorySelect.value;
    state.query = '';
    if (searchInput) searchInput.value = '';
    state.page = 1;
    fetchProducts();
  });

  sortSelect?.addEventListener('change', () => {
    state.sort = sortSelect.value;
    state.products = sortProducts(state.products, state.sort);
    renderProducts();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (!grid) return;
  fetchCategories();
  initFilters();
  fetchProducts();
});
