import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Footer from '../components/Footer';
import heroPerfume from '../assets/hero-perfume-2.jpg'

const INITIAL_VISIBLE = 8; // 2 rows x 4 cols on large screens

// Falling drop config: left position, size, fall duration, start delay.
// Values are arbitrary/hand-picked for a natural, non-uniform rain effect.
const HERO_DROPS = [
  { left: '8%',  size: 5, duration: '7s',   delay: '0s' },
  { left: '18%', size: 4, duration: '9s',   delay: '1.5s' },
  { left: '30%', size: 6, duration: '6.5s', delay: '0.8s' },
  { left: '45%', size: 4, duration: '8s',   delay: '2.2s' },
  { left: '58%', size: 6, duration: '7.5s', delay: '0.3s' },
  { left: '70%', size: 4, duration: '10s',  delay: '1s' },
  { left: '82%', size: 5, duration: '8.5s', delay: '2.8s' },
  { left: '92%', size: 4, duration: '7s',   delay: '1.2s' },
];

const WHY_CHOOSE_US = [
  {
    icon: '🌿',
    title: 'Ethically Sourced',
    description: 'Every oil and absolute is traced back to a grower we trust — no shortcuts, no fillers.',
  },
  {
    icon: '⚡',
    title: 'Fast, Free Shipping',
    description: 'Orders over $50 ship free and typically arrive within 3 business days.',
  },
  {
    icon: '🔒',
    title: 'Secure Checkout',
    description: 'Encrypted payments end to end. We never store your card details.',
  },
  {
    icon: '💬',
    title: '24/7 Support',
    description: 'Real people, real answers — no scripts, no bots, no waiting till Monday.',
  },
];

// Fires `visible = true` once, the first time the referenced element
// scrolls into the viewport. Used to trigger reveal animations for
// content below the fold (a load-time animation wouldn't be seen).
function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // animate in once, don't replay on scroll
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const [whyRef, whyVisible] = useReveal();
  const [contactRef, contactVisible] = useReveal();

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      });
  }, []);

  // Reset visible count whenever the search term changes,
  // otherwise "See More" state carries over into a new search
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [searchTerm]);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-navy text-white px-6 md:px-10 py-24 md:py-32 overflow-hidden">
        {/* ambient glow blobs in the electric accent */}
        <div className="absolute -top-24 -left-16 w-80 h-80 bg-electric/25 rounded-full blur-3xl animate-hero-drift" />
        <div
          className="absolute -bottom-28 -right-10 w-96 h-96 bg-electric/15 rounded-full blur-3xl animate-hero-drift"
          style={{ animationDelay: '2s' }}
        />

        {/* faint grid texture for depth */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* falling perfume drops */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {HERO_DROPS.map((drop, i) => (
            <span
              key={i}
              className="absolute top-0 rounded-full bg-electric/40 blur-[1px] animate-drop-fall"
              style={{
                left: drop.left,
                width: `${drop.size}px`,
                height: `${drop.size * 1.6}px`,
                animationDuration: drop.duration,
                animationDelay: drop.delay,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div>
            <p
              className="opacity-0 animate-hero-fade-up uppercase tracking-[0.3em] text-xs text-electric mb-5"
              style={{ animationDelay: '0.1s' }}
            >
              The Autumn Collection
            </p>

            <h1
              className="font-display opacity-0 animate-hero-fade-up text-4xl md:text-6xl leading-[1.1] font-semibold mb-6"
              style={{ animationDelay: '0.25s' }}
            >
              A scent is the one thing
              <br className="hidden md:block" /> people remember
              <br className="hidden md:block" /> after they forget your name.
            </h1>

            <p
              className="opacity-0 animate-hero-fade-up text-slate-300 text-base md:text-lg mb-9 max-w-md"
              style={{ animationDelay: '0.4s' }}
            >
              Small-batch fragrances, hand-finished with rare oud, amber, and
              citrus absolutes. Find the one that becomes yours.
            </p>

            <div
              className="opacity-0 animate-hero-fade-up max-w-md mb-8"
              style={{ animationDelay: '0.55s' }}
            >
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>

            <div
              className="opacity-0 animate-hero-fade-up flex items-center gap-6"
              style={{ animationDelay: '0.7s' }}
            >
              <button className="px-8 py-3 rounded-sm bg-electric text-white font-medium tracking-wide hover:brightness-110 hover:scale-[1.03] active:scale-100 transition-all duration-200">
                Shop the Collection
              </button>
              <a
                href="#products"
                className="text-sm text-slate-300 underline decoration-electric/50 underline-offset-4 hover:text-electric transition-colors"
              >
                See best sellers
              </a>
            </div>
          </div>

          {/* Right: product image */}
          <div
            className="relative opacity-0 animate-hero-fade-up flex justify-center"
            style={{ animationDelay: '0.5s' }}
          >
            {/* pulsing accent rings behind the bottle */}
            <span className="absolute w-64 h-64 rounded-full border border-electric/40 animate-ring-pulse" />
            <span
              className="absolute w-64 h-64 rounded-full border border-electric/40 animate-ring-pulse"
              style={{ animationDelay: '1s' }}
            />

            <div className="relative animate-img-float">
              {/* glow disc behind the bottle so its edges dissolve into
                  the section background instead of sitting as a hard-edged JPG */}
              <div className="absolute inset-0 -z-10 rounded-full bg-linear-to from-electric/30 via-navy to-navy blur-2xl scale-110" />
              <img
                src={heroPerfume}
                alt="Signature fragrance bottle"
                className="relative w-64 md:w-80 h-auto object-contain drop-shadow-[0_25px_45px_rgba(0,102,255,0.35)]  mask-[radial-gradient(circle_at_center,black_60%,transparent_92%)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm text-slate-600">
          <div>🚚 Free shipping over $50</div>
          <div>↩️ 30-day easy returns</div>
          <div>🔒 Secure checkout</div>
        </div>
      </section>

      <main id="products" className="flex-1 max-w-6xl mx-auto w-full px-4 py-14">
        <div className="mb-8">
          <p className="uppercase tracking-[0.25em] text-xs text-electric mb-2">
            Featured
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-navy">
            This week's fragrances
          </h2>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisibleCount((c) => c + INITIAL_VISIBLE)}
                  className="px-6 py-2.5 rounded-sm border border-electric/40 text-slate-700 hover:border-electric hover:text-electric transition-colors duration-200"
                >
                  See More Products
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Why Choose Us */}
      <section
        id="why-us"
        ref={whyRef}
        className="bg-white px-4 py-20 border-t border-slate-100"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="uppercase tracking-[0.25em] text-xs text-electric mb-2">
              Why Choose Us
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-navy">
              Small batches. Big standards.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_CHOOSE_US.map((item, i) => (
              <div
                key={item.title}
                className={`text-center p-6 rounded-md border border-slate-100 hover:border-electric/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-700 ${
                  whyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: whyVisible ? `${i * 120}ms` : '0ms' }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-display text-lg text-navy mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        ref={contactRef}
        className="relative bg-navy text-white px-6 md:px-10 py-20 overflow-hidden"
      >
        <div className="absolute -top-16 -right-20 w-80 h-80 bg-electric/20 rounded-full blur-3xl animate-hero-drift" />
        <div
          className="absolute -bottom-20 -left-16 w-72 h-72 bg-electric/15 rounded-full blur-3xl animate-hero-drift"
          style={{ animationDelay: '3s' }}
        />

        <div
          className={`relative max-w-6xl mx-auto grid md:grid-cols-2 gap-16 transition-all duration-700 ${
            contactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Left: info */}
          <div>
            <p className="uppercase tracking-[0.25em] text-xs text-electric mb-2">
              Contact
            </p>
            <h2 className="font-display text-2xl md:text-3xl mb-6">
              Get in touch
            </h2>
            <p className="text-slate-300 mb-8 max-w-sm">
              Questions about a scent, an order, or a gift? Our fragrance
              consultants reply within one business day.
            </p>

            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <span className="text-electric">📍</span> 12 Bloom Street, Lahore, Pakistan
              </li>
              <li className="flex items-center gap-3">
                <span className="text-electric">✉️</span> hello@shopease.com
              </li>
              <li className="flex items-center gap-3">
                <span className="text-electric">📞</span> +92 300 1234567
              </li>
            </ul>
          </div>

          {/* Right: static contact form (no state/logic yet) */}
          <form className="bg-white/5 border border-white/10 rounded-md p-6 space-y-4 backdrop-blur-sm">
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-300 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full bg-transparent border border-white/20 rounded-sm px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent border border-white/20 rounded-sm px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-300 mb-1">
                Message
              </label>
              <textarea
                rows="4"
                placeholder="How can we help?"
                className="w-full bg-transparent border border-white/20 rounded-sm px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-colors duration-200"
              />
            </div>
            <button
              type="button"
              className="w-full px-6 py-2.5 rounded-sm bg-electric text-white font-medium tracking-wide hover:brightness-110 hover:scale-[1.02] active:scale-100 transition-all duration-200"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;