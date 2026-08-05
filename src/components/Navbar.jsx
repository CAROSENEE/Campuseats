import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiShoppingBag, FiMapPin, FiUser } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocations } from '../context/LocationContext';
import './navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();
  const { user } = useAuth();
  const { activeLocation } = useLocations();
  const navigate = useNavigate();

  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/restaurants', label: 'Restaurants' },
    { to: '/orders', label: 'Orders' },
  ];

  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <button className="navbar-hamburger" onClick={() => setOpen(true)} aria-label="Open menu">
          <FiMenu size={22} />
        </button>

        <NavLink to="/" className="navbar-logo" onClick={close}>
          🍴 <span>CampusEats</span>
        </NavLink>

        <nav className="navbar-links">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-right">
          <button className="navbar-location" onClick={() => navigate('/locations')}>
            <FiMapPin size={16} />
            <span>{activeLocation?.label || 'Set location'}</span>
          </button>

          <button className="navbar-cart" onClick={() => navigate('/cart')} aria-label="Cart">
            <FiShoppingBag size={20} />
            {itemCount > 0 && <span className="navbar-cart-badge">{itemCount}</span>}
          </button>

          {user ? (
            <button className="navbar-profile" onClick={() => navigate('/profile')}>
              <img src={user.avatar} alt={user.name} />
            </button>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>
              Login
            </button>
          )}
        </div>

        <button className="navbar-cart navbar-cart-mobile" onClick={() => navigate('/cart')} aria-label="Cart">
          <FiShoppingBag size={20} />
          {itemCount > 0 && <span className="navbar-cart-badge">{itemCount}</span>}
        </button>
      </div>

      {open && (
        <div className="navbar-drawer-backdrop" onClick={close}>
          <div className="navbar-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="flex-between">
              <span className="navbar-logo">🍴 CampusEats</span>
              <button className="btn-icon btn-ghost" onClick={close} aria-label="Close menu">
                <FiX size={20} />
              </button>
            </div>

            <nav className="navbar-drawer-links">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} end={l.end} onClick={close} className={({ isActive }) => (isActive ? 'active' : '')}>
                  {l.label}
                </NavLink>
              ))}
              <NavLink to="/locations" onClick={close}><FiMapPin /> Saved Locations</NavLink>
              {user ? (
                <NavLink to="/profile" onClick={close}><FiUser /> Profile</NavLink>
              ) : (
                <NavLink to="/login" onClick={close}><FiUser /> Login / Register</NavLink>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
