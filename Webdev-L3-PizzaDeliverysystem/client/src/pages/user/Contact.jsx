import { useState } from 'react';

import { validateRequired, validateEmail } from '@/utils/validate';
import '@/styles/contact.css';

const EMPTY = { name: '', email: '', subject: '', message: '' };

export const Contact = () => {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ error: null, success: null });

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const invalid =
      validateRequired(form.name, 'Full name') ||
      validateEmail(form.email) ||
      validateRequired(form.subject, 'Subject') ||
      validateRequired(form.message, 'Message');
    if (invalid) {
      setStatus({ error: invalid, success: null });
      return;
    }
    setForm(EMPTY);
    setStatus({ error: null, success: "Thanks for reaching out! We'll get back to you soon." });
  };

  return (
  <div className="contact-page">
    <header className="contact-hero">
      <div className="container">
        <p className="contact-eyebrow">Get in Touch</p>
        <h1 className="contact-heading">We&apos;d Love to Hear From You</h1>
        <p className="contact-sub text-muted">
          Whether you have a question about your order, our ingredients, or just want to say hi, drop us a message.
        </p>
      </div>
    </header>

    <section className="section">
      <div className="container">
        <div className="contact-grid">
          {/* Form Column */}
          <div className="contact-form-col card">
            <h2 className="contact-section-title">Send a Message</h2>
            <form className="contact-form" onSubmit={onSubmit} noValidate>
              {status.error && <div className="auth-alert auth-alert-error">{status.error}</div>}
              {status.success && <div className="auth-alert auth-alert-success">{status.success}</div>}
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input type="text" id="name" className="input" placeholder="John Doe" value={form.name} onChange={update('name')} />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input type="email" id="email" className="input" placeholder="john@example.com" value={form.email} onChange={update('email')} />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subject">Subject</label>
                <input type="text" id="subject" className="input" placeholder="Order inquiry..." value={form.subject} onChange={update('subject')} />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">Message</label>
                <textarea id="message" className="input contact-textarea" placeholder="How can we help?" rows="5" value={form.message} onChange={update('message')}></textarea>
              </div>

              <button type="submit" className="btn btn-primary contact-submit">
                Send Message
              </button>
            </form>
          </div>

          {/* Details Column */}
          <div className="contact-details-col">
            <h2 className="contact-section-title">Contact Information</h2>
            <p className="text-muted contact-info-desc">
              Our support team is available during regular store hours to assist you.
            </p>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <h3 className="contact-info-title">Email</h3>
                <p className="text-muted">support@pizzacrave.com</p>
              </div>
              
              <div className="contact-info-item">
                <h3 className="contact-info-title">Phone</h3>
                <p className="text-muted">+1 (555) 123-4567</p>
              </div>
              
              <div className="contact-info-item">
                <h3 className="contact-info-title">Support Hours</h3>
                <p className="text-muted">Mon-Sun: 10:00 AM - 11:00 PM</p>
              </div>
            </div>

            <div className="contact-social card-cream card">
              <h3 className="contact-info-title">Follow Us</h3>
              <p className="text-muted">Stay connected for deals and updates.</p>
              <div className="contact-social-links">
                <span className="social-icon">📸</span>
                <span className="social-icon">🐦</span>
                <span className="social-icon">📘</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  );
};
