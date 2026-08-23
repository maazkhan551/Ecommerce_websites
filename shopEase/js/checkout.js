/* ==========================================================================
   ShopEase — Checkout page logic
   Renders order summary from cart + validates & "submits" checkout form.
   ========================================================================== */

const orderLinesEl = document.getElementById('order-lines');
const checkoutForm = document.getElementById('checkout-form');

function orderLineHTML(item) {
  return `
    <div class="order-line">
      <img src="${item.image}" alt="${item.title}">
      <div class="order-line-info">
        <h5>${item.title}</h5>
        <span>Qty ${item.qty} &times; ${formatPrice(item.price)}</span>
      </div>
      <div class="order-line-price">${formatPrice(item.price * item.qty)}</div>
    </div>`;
}

function renderOrderSummary() {
  const cart = getCart();
  if (cart.length === 0) {
    // Nothing to check out — send back to products
    window.location.href = 'products.html';
    return;
  }
  orderLinesEl.innerHTML = cart.map(orderLineHTML).join('');
  const { subtotal, shipping, total } = getCartTotals();
  document.getElementById('co-subtotal').textContent = formatPrice(subtotal);
  document.getElementById('co-shipping').textContent = shipping === 0 ? 'Free' : formatPrice(shipping);
  document.getElementById('co-total').textContent = formatPrice(total);
}

/* ---------------------------------------------------------------------- */
/* Payment method toggle                                                   */
/* ---------------------------------------------------------------------- */
function initPaymentMethods() {
  const methods = document.querySelectorAll('.pay-method');
  const cardFields = document.getElementById('card-fields');
  methods.forEach((m) => {
    m.addEventListener('click', () => {
      methods.forEach((x) => x.classList.remove('active'));
      m.classList.add('active');
      const radio = m.querySelector('input[type="radio"]');
      radio.checked = true;
      if (cardFields) cardFields.style.display = radio.value === 'card' ? 'grid' : 'none';
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Form validation                                                         */
/* ---------------------------------------------------------------------- */
function validateField(input) {
  const field = input.closest('.field');
  if (!field) return true;
  let valid = true;

  if (input.hasAttribute('required') && !input.value.trim()) valid = false;

  if (input.type === 'email' && input.value.trim() && !/^\S+@\S+\.\S+$/.test(input.value)) valid = false;

  if (input.name === 'cardNumber' && input.value.trim()) {
    const digits = input.value.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(digits)) valid = false;
  }
  if (input.name === 'cardExpiry' && input.value.trim()) {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(input.value.trim())) valid = false;
  }
  if (input.name === 'cardCvc' && input.value.trim()) {
    if (!/^\d{3,4}$/.test(input.value.trim())) valid = false;
  }
  if (input.name === 'zip' && input.value.trim()) {
    if (!/^[A-Za-z0-9\- ]{3,10}$/.test(input.value.trim())) valid = false;
  }

  field.classList.toggle('invalid', !valid);
  return valid;
}

function initFormValidation() {
  const inputs = checkoutForm.querySelectorAll('input[required], input[name="cardNumber"], input[name="cardExpiry"], input[name="cardCvc"]');
  inputs.forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
  });

  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const isCard = checkoutForm.querySelector('input[name="payment"]:checked')?.value === 'card';
    const requiredInputs = Array.from(checkoutForm.querySelectorAll('input[required]')).filter((input) => {
      const isCardOnlyField = ['cardNumber', 'cardExpiry', 'cardCvc', 'cardName'].includes(input.name);
      return isCard || !isCardOnlyField;
    });

    let allValid = true;
    requiredInputs.forEach((input) => {
      if (!validateField(input)) allValid = false;
    });

    if (!allValid) {
      showToast('Please check the highlighted fields');
      checkoutForm.querySelector('.field.invalid input')?.focus();
      return;
    }

    placeOrder();
  });
}

function placeOrder() {
  const btn = document.getElementById('place-order-btn');
  btn.disabled = true;
  btn.textContent = 'Placing order…';

  setTimeout(() => {
    clearCart();
    showOrderConfirmation();
  }, 900);
}

function showOrderConfirmation() {
  const main = document.querySelector('.checkout-main');
  const orderNumber = 'SE-' + Math.floor(100000 + Math.random() * 900000);
  main.innerHTML = `
    <div class="neu-panel text-center" style="padding:70px 30px; max-width:560px; margin:40px auto;">
      <div style="width:74px;height:74px;border-radius:50%;background:var(--blue-100);display:grid;place-items:center;margin:0 auto 26px;">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--blue-600)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <h2 style="margin-bottom:14px;">Order confirmed!</h2>
      <p style="color:var(--ink-600); margin-bottom:8px;">Thank you for shopping with ShopEase.</p>
      <p style="color:var(--ink-600); margin-bottom:32px;">Your order <strong style="color:var(--navy-950)">${orderNumber}</strong> is being prepared and you'll receive a confirmation email shortly.</p>
      <a href="products.html" class="btn btn-primary">Continue Shopping</a>
    </div>`;
  document.getElementById('checkout-summary')?.remove();
}

document.addEventListener('DOMContentLoaded', () => {
  if (!checkoutForm) return;
  renderOrderSummary();
  initPaymentMethods();
  initFormValidation();
});
