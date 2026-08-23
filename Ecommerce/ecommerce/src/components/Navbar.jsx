import { useState } from 'react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const navLinks = ['Home', 'Products', 'Cart', 'Wishlist', 'Login'];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <a href="#" className="text-2xl font-bold text-white">
          ShopEase
        </a>

        {/* Hamburger - only visible below md breakpoint */}
        <button
          onClick={toggleMenu}
          aria-label="Toggle menu"
          className="flex flex-col justify-between w-7 h-5 md:hidden"
        >
          <span className="h-0.5 w-full rounded bg-white"></span>
          <span className="h-0.5 w-full rounded bg-white"></span>
          <span className="h-0.5 w-full rounded bg-white"></span>
        </button>

        {/* Desktop links */}
        <ul className="hidden gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link}> 
              <a
                href="#"
                className="text-white transition-colors hover:text-red-400"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile dropdown */}
      <ul
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          isOpen ? 'max-h-72 mt-4' : 'max-h-0'
        }`}
      >
        {navLinks.map((link) => (
          <li
            key={link}
            className="border-t border-white/10 text-center py-3"
          > 
            <a
              href="#"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-red-400"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
