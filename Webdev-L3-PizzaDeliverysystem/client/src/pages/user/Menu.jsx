import { PizzaCard } from '@/components/PizzaCard';
import '@/styles/menu.css';

const CLASSIC = [
  {
    name: 'Classic Margherita',
    image: '/pizzas/p5.jpg',
    badge: 'Most Popular',
    rating: 4.7,
    reviews: 250,
    description: 'Fresh mozzarella, tangy tomato sauce, and fragrant basil on a perfectly baked crust.',
    price: '8.99',
  },
  {
    name: 'Spicy Pepperoni',
    image: '/pizzas/p6.jpg',
    badge: 'New',
    rating: 4.8,
    reviews: 200,
    description: 'Crispy pepperoni with chilli flakes, mozzarella, and our special tomato base.',
    price: '12.49',
  },
  {
    name: 'Farm Fresh Veggie',
    image: '/pizzas/p9.jpg',
    badge: 'Top Pick',
    rating: 4.6,
    reviews: 180,
    description: 'Bell peppers, onions, sweet corn, and mushrooms on a tangy tomato base.',
    price: '9.49',
  },
  {
    name: 'Cheese Burst',
    image: '/pizzas/p10.jpg',
    rating: 4.5,
    reviews: 160,
    description: 'A cheesy delight with gooey mozzarella melted in every single bite.',
    price: '7.99',
  },
];

const SPECIALTY = [
  {
    name: 'BBQ Chicken Bliss',
    image: '/pizzas/p7.jpg',
    badge: 'Top Pick',
    rating: 4.9,
    reviews: 220,
    description: 'Tender grilled chicken, red onions, and signature tangy BBQ sauce with mozzarella.',
    price: '13.99',
  },
  {
    name: 'Truffle Mushroom',
    image: '/pizzas/p3.jpg',
    rating: 4.7,
    reviews: 140,
    description: 'Wild sautéed mushrooms, truffle cream sauce, mozzarella, and a hint of garlic.',
    price: '11.99',
  },
  {
    name: 'Chicken Tikka Special',
    image: '/pizzas/p2.jpg',
    badge: 'New',
    rating: 4.8,
    reviews: 175,
    description: 'Tender chicken tikka on a creamy base with a warm hint of spice.',
    price: '11.99',
  },
  {
    name: 'Paneer Overload',
    image: '/pizzas/p4.jpg',
    rating: 4.6,
    reviews: 150,
    description: 'Generously loaded with paneer, onions, and crisp green peppers.',
    price: '10.99',
  },
];

const SIDES = [
  { name: 'Garlic Breadsticks', desc: 'Golden, buttery, brushed with garlic and herbs.', price: '4.49', tag: 'Side' },
  { name: 'Cheesy Dip Fries', desc: 'Crispy fries served with warm molten cheese dip.', price: '5.29', tag: 'Side' },
  { name: 'Stuffed Jalapeño Poppers', desc: 'Spicy jalapeños stuffed with creamy cheese.', price: '5.99', tag: 'Side' },
  { name: 'Classic Cola', desc: 'Chilled fizzy cola to wash it all down.', price: '1.99', tag: 'Drink' },
  { name: 'Fresh Lime Soda', desc: 'Zesty lime with a sparkling soda kick.', price: '2.49', tag: 'Drink' },
  { name: 'Iced Peach Tea', desc: 'Refreshing peach-infused iced tea.', price: '2.99', tag: 'Drink' },
];

const CATEGORIES = ['All', 'Classic', 'Specialty', 'Sides & Drinks'];

export const Menu = () => (
  <div className="menu-page">
    <header className="menu-hero">
      <div className="container">
        <p className="menu-eyebrow">est. 2024 · Fresh, hot, and delicious</p>
        <h1 className="menu-heading">Our Full Menu</h1>
        <p className="menu-sub text-muted">
          Handcrafted pizzas, loaded sides, and cold drinks — every item baked and prepped to order.
        </p>
        <div className="menu-tabs">
          {CATEGORIES.map((c, i) => (
            <button key={c} className={`menu-tab${i === 0 ? ' active' : ''}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
    </header>

    <section className="section">
      <div className="container">
        <h2 className="menu-section-title">Classic Pizzas</h2>
        <p className="menu-section-sub text-muted">The timeless favorites everyone comes back for.</p>
        <div className="menu-grid">
          {CLASSIC.map((p) => (
            <PizzaCard key={p.name} {...p} />
          ))}
        </div>
      </div>
    </section>

    <section className="section menu-alt">
      <div className="container">
        <h2 className="menu-section-title">Specialty Pizzas</h2>
        <p className="menu-section-sub text-muted">Bold, chef-crafted combinations for the adventurous.</p>
        <div className="menu-grid">
          {SPECIALTY.map((p) => (
            <PizzaCard key={p.name} {...p} />
          ))}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <h2 className="menu-section-title">Sides &amp; Drinks</h2>
        <p className="menu-section-sub text-muted">Round out your order with something extra.</p>
        <div className="menu-sides-grid">
          {SIDES.map((s) => (
            <article key={s.name} className="menu-side card">
              <div className="menu-side-head">
                <h3 className="menu-side-name">{s.name}</h3>
                <span className="badge badge-soft menu-side-tag">{s.tag}</span>
              </div>
              <p className="menu-side-desc text-muted">{s.desc}</p>
              <div className="menu-side-foot">
                <span className="price">${s.price}</span>
                <button className="btn btn-secondary menu-side-btn">Add</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="section menu-cta-section">
      <div className="container">
        <div className="menu-cta card-cream card">
          <h2 className="menu-cta-title">Can&apos;t decide? Build your own.</h2>
          <p className="text-muted">Pick your base, sauce, cheese, and veggies in our 4-step builder.</p>
          <a href="/builder" className="btn btn-primary">
            Start Building →
          </a>
        </div>
      </div>
    </section>
  </div>
);
