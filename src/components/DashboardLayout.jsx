import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import './dashboardlayout.css';

export default function DashboardLayout({ title, navItems, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div className="dash-sidebar-logo">🍴 CampusEats</div>
        <div className="dash-sidebar-title">{title}</div>
        <nav>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => (isActive ? 'active' : '')}>
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <button className="dash-mobile-toggle" onClick={() => setOpen(true)} aria-label="Open dashboard menu">
        <FiMenu /> {title}
      </button>

      {open && (
        <div className="dash-drawer-backdrop" onClick={() => setOpen(false)}>
          <aside className="dash-sidebar dash-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="flex-between">
              <div className="dash-sidebar-logo">🍴 CampusEats</div>
              <button className="btn-icon btn-ghost" onClick={() => setOpen(false)}><FiX /></button>
            </div>
            <div className="dash-sidebar-title">{title}</div>
            <nav>
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>
                  {item.icon} {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <main className="dash-main">
        <div className="container">{children}</div>
      </main>
    </div>
  );
}
