import { Link } from 'react-router-dom';

import '@/styles/footer.css';

const TAGLINE = 'est. 2024 · Fresh, hot, and delicious · delivered to your door!';

const FooterA = () => (
  <footer className="footer footer-a">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-col">
          <div className="footer-wordmark">PizzaCrave</div>
          <p className="footer-tagline">{TAGLINE}</p>
          <button className="btn btn-gold" style={{ marginTop: '16px' }}>
            Order Pizza
          </button>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/locations">Locations</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li>hello@pizzacrave.test</li>
            <li>+1 (555) 010-2024</li>
            <li>Open daily · 11am–11pm</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Stay in the Loop!</h4>
          <p className="footer-tagline">Deals and fresh drops, straight to your inbox.</p>
          <div className="footer-newsletter">
            <input className="input" type="email" placeholder="Your email" />
            <button className="btn btn-gold">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
    <div className="footer-bottom">© 2024 PizzaCrave. All rights reserved.</div>
  </footer>
);

const FooterB = () => (
  <footer className="footer footer-b">
    <div className="container footer-strip">
      <div className="footer-social">
        <span>ⓕ</span>
        <span>ⓘ</span>
        <span>ⓧ</span>
      </div>
      <div className="footer-wordmark">PizzaCrave</div>
      <div className="footer-tagline">
        © 2024 · Our Story · Careers · FAQs · T&amp;Cs
      </div>
    </div>
  </footer>
);

export const Footer = ({ variant = 'A' }) => (variant === 'B' ? <FooterB /> : <FooterA />);
