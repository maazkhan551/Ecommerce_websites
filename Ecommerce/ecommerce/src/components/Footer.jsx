function Footer() {
  return (
    <footer className="bg-navy text-white mt-16">
      <div className="mx-auto max-w-6xl px-6 py-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <h3 className="text-xl font-bold mb-3">
            Shop<span className="text-electric">Ease</span>
          </h3>
          <p className="text-sm text-white/60">
            Everything you need, in one cart.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-electric">Shop</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">Products</a></li>
            <li><a href="#" className="hover:text-white">Cart</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-electric">Account</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><a href="#" className="hover:text-white">Login</a></li>
            <li><a href="#" className="hover:text-white">Wishlist</a></li>
            <li><a href="#" className="hover:text-white">Orders</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-electric">Follow</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><a href="#" className="hover:text-white">Instagram</a></li>
            <li><a href="#" className="hover:text-white">Twitter</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} ShopEase. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;