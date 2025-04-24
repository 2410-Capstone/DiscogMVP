import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <nav className='mobile-nav'>
      <button className='hamburger' onClick={() => setOpen((prev) => !prev)} aria-label='Toggle navigation'>
        ☰
      </button>
      {open && (
        <div className='mobile-menu menu-animate' ref={menuRef}>
          <Link to='/' onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link to='/'>DiscogMVP</Link>
          <Link to='/account' onClick={() => setOpen(false)}>
            Account
          </Link>
          <Link to='/cart' onClick={() => setOpen(false)}>
            Cart
          </Link>
          <Link to='/login' onClick={() => setOpen(false)}>
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default MobileNav;
// potential CSS change anything necessary
//.menu-animate {
//   animation: fadeSlideDown 0.25s ease;
// }

// @keyframes fadeSlideDown {
//   from {
//     opacity: 0;
//     transform: translateY(-16px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }
