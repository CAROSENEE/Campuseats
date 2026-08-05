import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiMail } from 'react-icons/fi';
import './footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="navbar-logo">🍴 CampusEats</div>
          <p className="muted" style={{ maxWidth: 280, marginTop: 8 }}>
            Food delivery for university campuses, hostels and messes — made by students, for students.
          </p>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a href="#">About</a>
          <a href="#">Careers</a>
          <a href="#">Contact</a>
        </div>
        <div className="footer-col">
          <h4>Dashboards (Demo)</h4>
          <Link to="/restaurant-dashboard">Restaurant Panel</Link>
          <Link to="/rider-dashboard">Rider Panel</Link>
          <Link to="/admin-dashboard">Admin Panel</Link>
        </div>
        <div className="footer-col">
          <h4>Follow us</h4>
          <div className="flex gap-12">
            <FiInstagram /> <FiFacebook /> <FiMail />
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">© 2026 CampusEats — University Project Demo. Not a real service.</div>
      </div>
    </footer>
  );
}
