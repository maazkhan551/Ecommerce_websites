import { useState } from 'react';

function QuantitySelector({ initialQuantity = 1, min = 1, max = 10, onChange }) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const updateQuantity = (newQty) => {
    // Clamp between min and max so it never goes out of bounds
    const clamped = Math.min(Math.max(newQty, min), max);
    setQuantity(clamped);
    if (onChange) onChange(clamped);
  };

  return (
    <div className="inline-flex items-center border border-navy/20 rounded-md overflow-hidden">
      <button
        onClick={() => updateQuantity(quantity - 1)}
        disabled={quantity <= min}
        className="px-3 py-1.5 text-navy hover:bg-navy hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-navy"
        aria-label="Decrease quantity"
      >
        −
      </button>

      <span className="px-4 py-1.5 min-w-12 text-center text-navy font-medium">
        {quantity}
      </span>

      <button
        onClick={() => updateQuantity(quantity + 1)}
        disabled={quantity >= max}
        className="px-3 py-1.5 text-navy hover:bg-electric hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-electric/0 disabled:hover:text-navy"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

export default QuantitySelector;