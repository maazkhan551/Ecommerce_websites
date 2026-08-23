/* ==========================================================================
   ShopEase — Cart page logic
   Renders cart from localStorage, handles qty changes, removal, and
   recalculates subtotal / shipping / total dynamically.
   ========================================================================== */

const cartItemsEl = document.getElementById('cart-items');
const cartCountLabel = document.getElementById('cart-count-label');
const emptyCartEl = document.getElementById('empty-cart');
const cartLayoutEl = document.getElementById('cart-layout');

function cartItemHTML(item) {
  return `
    <div class="cart-item reveal" data-id="${item.id}" style="opacity:1">
      <div class="cart-item-media"><img src="${item.image}" alt="${item.title}"></div>
      <div class="cart-item-info">
        <div class="ci-cat">${item.category}</div>
        <h4>${item.title}</h4>
        <div class="ci-price">${formatPrice(item.price)}</div>
      </div>
      <div class="qty-control">
        <button data-decrease="${item.id}" aria-label="Decrease quantity">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
        <span>${item.qty}</span>
        <button data-increase="${item.id}" aria-label="Increase quantity">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </div>
      <button class="remove-btn" data-remove="${item.id}" aria-label="Remove item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>
      </button>
    </div>`;
}

function renderCart() {
  const cart = getCart();

  if (cart.length === 0) {
    cartLayoutEl.style.display = 'none';
    emptyCartEl.style.display = 'block';
    return;
  }
  cartLayoutEl.style.display = '';
  emptyCartEl.style.display = 'none';

  cartItemsEl.innerHTML = cart.map(cartItemHTML).join('');
  if (cartCountLabel) {
    const count = getCartCount();
    cartCountLabel.textContent = `${count} item${count !== 1 ? 's' : ''} in your cart`;
  }
  bindCartEvents();
  renderSummary();
}

function bindCartEvents() {
  cartItemsEl.querySelectorAll('[data-increase]').forEach((btn) =>
    btn.addEventListener('click', () => {
      updateQty(Number(btn.dataset.increase), 1);
      renderCart();
    })
  );
  cartItemsEl.querySelectorAll('[data-decrease]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.decrease);
      const item = getCart().find((i) => i.id === id);
      if (item && item.qty === 1) {
        removeFromCart(id);
      } else {
        updateQty(id, -1);
      }
      renderCart();
    })
  );
  cartItemsEl.querySelectorAll('[data-remove]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const card = btn.closest('.cart-item');
      const id = Number(btn.dataset.remove);
      if (typeof gsap !== 'undefined' && card) {
        gsap.to(card, {
          opacity: 0,
          x: -30,
          height: 0,
          padding: 0,
          margin: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            removeFromCart(id);
            renderCart();
          },
        });
      } else {
        removeFromCart(id);
        renderCart();
      }
      showToast('Item removed from cart');
    })
  );
}

function renderSummary() {
  const { subtotal, shipping, total } = getCartTotals();
  document.getElementById('sum-subtotal').textContent = formatPrice(subtotal);
  document.getElementById('sum-shipping').textContent = shipping === 0 ? 'Free' : formatPrice(shipping);
  document.getElementById('sum-total').textContent = formatPrice(total);

  const note = document.getElementById('free-shipping-note');
  if (note) {
    const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
    if (remaining > 0) {
      note.style.display = 'flex';
      note.querySelector('span').textContent = `Add ${formatPrice(remaining)} more for free shipping`;
    } else {
      note.style.display = 'flex';
      note.querySelector('span').textContent = 'You\u2019ve unlocked free shipping!';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!cartItemsEl) return;
  renderCart();

  const checkoutBtn = document.getElementById('checkout-btn');
  checkoutBtn?.addEventListener('click', () => {
    if (getCart().length === 0) {
      showToast('Your cart is empty');
      return;
    }
    window.location.href = 'checkout.html';
  });
});
