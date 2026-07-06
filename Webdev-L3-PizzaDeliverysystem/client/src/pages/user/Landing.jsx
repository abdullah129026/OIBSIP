import { Link } from 'react-router-dom';

import { PizzaCard } from '@/components/PizzaCard';
import '@/styles/landing.css';

const HERO_MINIS = [
  { name: 'Margherita Delight', price: '8.99', image: '/pizzas/p1.jpg' },
  { name: 'Veggie Supreme', price: '6.99', image: '/pizzas/p2.jpg' },
  { name: 'Pepperoni Feast', price: '10.99', image: '/pizzas/p3.jpg' },
  { name: 'BBQ Chicken Elies', price: '12.99', image: '/pizzas/p4.jpg' },
];

const FAVORITES = [
  {
    name: 'Classic Margherita',
    image: '/pizzas/p5.jpg',
    badge: 'Most Popular',
    rating: 4.7,
    reviews: 250,
    description:
      'Tender-grilled chicken, red onions, and our signature tangy BBQ sauce, topped with melted mozzarella.',
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
    name: 'BBQ Chicken Bliss',
    image: '/pizzas/p7.jpg',
    badge: 'Top Pick',
    rating: 4.9,
    reviews: 200,
    description:
      'A timeless classic with fresh mozzarella, large tomato sauce, and fragrant basil on a perfectly baked crust.',
    price: '13.99',
  },
];

const FLAVOURS = [
  { name: 'Pepperoni Classic', image: '/pizzas/p8.jpg', price: '12.49', desc: 'A fruity classic topped with spicy pepperoni shots and walnut cheese.' },
  { name: 'Farm Fresh Veggie', image: '/pizzas/p9.jpg', price: '9.49', desc: 'Bell peppers, onions, sweet corn, and mushrooms on a tangy tomato base.' },
  { name: 'Cheese Burst', image: '/pizzas/p10.jpg', price: '7.99', desc: 'A cheesy delight with gooey mozzarella in every bite.' },
  { name: 'Spicy Jalapeño & Corn', image: '/pizzas/p11.jpg', price: '9.99', desc: 'Jalapeños, sweet corn, and a spice kick on a thin crust.' },
  { name: 'Mushroom Fiesta', image: '/pizzas/p1.jpg', price: '8.49', desc: 'A feast of sautéed mushrooms, mozzarella, and fresh herbs.' },
  { name: 'Chicken Tikka Special', image: '/pizzas/p2.jpg', price: '11.99', desc: 'Tender chicken tikka pieces on a creamy base with a hint of spice.' },
  { name: 'Truffle Mushroom', image: '/pizzas/p3.jpg', price: '11.99', desc: 'Wild sautéed mushrooms, truffle cream sauce, mozzarella, and a hint of garlic.' },
  { name: 'Paneer Overload', image: '/pizzas/p4.jpg', price: '10.99', desc: 'Loaded with paneer, onions, and green peppers.' },
];

const FEATURES = [
  { icon: '🕒', label: 'Fast Delivery' },
  { icon: '🌿', label: '100% Fresh Ingredients' },
  { icon: '🔎', label: 'Track Your Order in Real-Time' },
];

const TESTIMONIALS = [
  {
    name: 'Jason T.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=faces',
    rating: 5,
    quote:
      'The Pepperoni Feast is hands down the best pizza I have ever had! The crust is perfectly crispy, and the toppings are so fresh. Delivery was fast too! Can’t wait to order again.',
  },
  {
    name: 'Mike L.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=faces',
    rating: 4,
    quote:
      'Loving the customized build-your-own option. It’s a game changer. Plus, the BBQ Chicken pizza absolutely shines. Great service and spot-on!',
  },
  {
    name: 'Emily R.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=faces',
    rating: 5,
    quote:
      'Fresh, hot, and bursting with flavor! The Veggie Supreme was loaded with toppings, and I could taste the care in every slice. Highly recommended.',
  },
  {
    name: 'Sarah M.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop&crop=faces',
    rating: 5,
    quote:
      'I was amazed by the fast delivery — my Margherita pizza was still hot when it arrived. The perfect balance of cheese and sauce. Definitely my new go-to place.',
  },
];

const Stars = ({ rating }) => (
  <span className="stars" aria-label={`${rating} out of 5`}>
    {'★★★★★'.slice(0, rating)}
    <span className="stars-empty">{'★★★★★'.slice(rating)}</span>
  </span>
);

export const Landing = () => (
  <>
    {/* Hero */}
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <h1 className="hero-title">
            Your favorite pizzas,
            <br />
            just a click away!
          </h1>
          <p className="hero-sub">Hot &amp; Fresh Pizza. Delivered Fast.</p>
          <div className="hero-actions">
            <Link to="/builder" className="btn btn-primary">
              Order Now
            </Link>
            <Link to="/menu" className="btn btn-secondary">
              View Menu
            </Link>
          </div>
        </div>

        <div className="hero-minis">
          {HERO_MINIS.map((m) => (
            <div key={m.name} className="hero-mini">
              <img className="hero-mini-img" src={m.image} alt={m.name} loading="lazy" />
              <div>
                <div className="hero-mini-name">{m.name}</div>
                <div className="price hero-mini-price">${m.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Today's Best Deals */}
    <section className="section deals-section">
      <div className="container">
        <div className="deals-banner">
          <div className="deals-head">
            <h2 className="deals-title">
              Today&apos;s Best Deals <span className="deals-limited">/Limited Offer</span>
            </h2>
            <p className="deals-hurry">Hurry! These deals are fresh out of the oven—only for today!</p>
          </div>

          <div className="deals-offers">
            <div className="deals-offer">
              <span className="deals-offer-text">Offer 1 : Classic Margherita (Buy One Get One Free)</span>
              <button className="btn deals-offer-btn">Order Now</button>
            </div>
            <div className="deals-offer">
              <span className="deals-offer-text">
                Offer 2 : Large Pepperoni Pizza + 2 Drinks <strong className="deals-price">$15.99</strong>
              </span>
              <button className="btn deals-offer-btn">Order Now</button>
            </div>
          </div>

          <div className="deals-decor" aria-hidden="true">
            <img className="deals-decor-img deals-decor-pizza" src="/pizzas/p8.jpg" alt="" />
            <img className="deals-decor-img deals-decor-drink1" src="/deals/drink.png" alt="" />
            <img className="deals-decor-img deals-decor-drink2" src="/deals/drink.png" alt="" />
            <img className="deals-decor-img deals-decor-ketchup" src="/deals/ketchup.png" alt="" />
            <img className="deals-decor-img deals-decor-sauce" src="/deals/sauce.png" alt="" />
          </div>
        </div>
      </div>
    </section>

    {/* Customer Favorites */}
    <section className="section favorites-section">
      <div className="container">
        <h2 className="section-title favorites-title">Customer Favorites</h2>
        <div className="favorites-grid">
          {FAVORITES.map((f) => (
            <PizzaCard key={f.name} {...f} />
          ))}
        </div>
        <div className="favorites-cta">
          <Link to="/menu" className="btn btn-primary">
            Explore all →
          </Link>
        </div>
      </div>
    </section>

    {/* Welcome to the Future of Pizza */}
    <section className="section future-section">
      <div className="container future-inner">
        <h2 className="section-title font-serif future-title">Welcome to the Future of Pizza!</h2>
        <p className="future-sub text-muted">
          Choose your crust, toppings, and sauces to make it just the way you love.
        </p>
        <div className="future-stage">
          <img className="future-pizza" src="/pizzas/p5.jpg" alt="Build your own pizza" loading="lazy" />
          <Link to="/builder" className="btn btn-gold future-btn">
            Explore Our World →
          </Link>
        </div>
      </div>
    </section>

    {/* Our Regular Flavoures */}
    <section className="section flavours-section">
      <div className="container">
        <h2 className="section-title flavours-title">Our Regular Flavoures</h2>
        <p className="flavours-sub text-muted">
          Discover our delicious range of regular pizzas, crafted with fresh ingredients and
          bold flavors you’ll love. Perfect for every craving and every occasion.
        </p>
        <div className="flavours-grid">
          {FLAVOURS.map((p) => (
            <article key={p.name} className="flavour-card">
              <div className="flavour-media">
                <img className="flavour-img" src={p.image} alt={p.name} loading="lazy" />
              </div>
              <h3 className="flavour-name">{p.name}</h3>
              <p className="flavour-desc text-muted">{p.desc}</p>
              <div className="flavour-foot">
                <span className="price flavour-price">Price: ${p.price}</span>
                <button className="btn btn-primary flavour-btn">Order</button>
              </div>
            </article>
          ))}
        </div>
        <div className="flavours-cta">
          <Link to="/menu" className="btn btn-secondary">
            View Full Menu
          </Link>
        </div>
      </div>
    </section>

    {/* Made with Love */}
    <section className="section love-section">
      <div className="container love-inner">
        <div className="love-copy">
          <h2 className="section-title love-title">
            Made with Love,
            <br />
            Delivered with Care!
          </h2>
          <p className="text-muted">
            At PizzaCrave, we’re passionate about quality — every pizza is handcrafted with fresh
            ingredients and baked to order to <strong>satisfy every craving</strong>.
          </p>
          <p className="text-muted">
            From our signature sauces to perfectly rendered mozzarella and hand-picked toppings, we
            obsess over every detail so each slice arrives hot, fresh, and unforgettable.
          </p>
          <p className="text-muted">
            At PizzaCrave, we deliver a premium experience with every order.
          </p>
          <Link to="/about" className="btn btn-gold love-btn">
            Learn More About Our Story →
          </Link>
        </div>
        <div className="love-media">
          <img className="love-img" src="/pizzas/p7.jpg" alt="Freshly made pizza on a board" loading="lazy" />
        </div>
      </div>
    </section>

    {/* From Our Oven to Your Door */}
    <section className="section oven-section">
      <div className="container">
        <h2 className="section-title oven-title">From Our Oven to Your Door in 30 Minutes!</h2>
        <div className="oven-inner">
          <ul className="oven-features">
            {FEATURES.map((f) => (
              <li key={f.label} className="oven-feature">
                <span className="oven-feature-icon" aria-hidden="true">{f.icon}</span>
                <span>{f.label}</span>
              </li>
            ))}
          </ul>

          <div className="oven-illus" role="img" aria-label="Delivery scooter">🛵</div>

          <div className="oven-copy">
            <p className="text-muted">
              Ordering your favorite pizza has never been easier! Choose your pizza, place your
              order, and relax while we prepare and deliver it fresh to your doorstep. Enjoy hot,
              delicious pizza, with just a few clicks!
            </p>
            <Link to="/about" className="btn btn-secondary oven-btn">
              How It Works →
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* What Our Customers Say */}
    <section className="section testimonials-section">
      <div className="container">
        <h2 className="section-title testimonials-title">What Our Customers Say</h2>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <article key={t.name} className="testimonial-card card">
              <span className="testimonial-quote-mark" aria-hidden="true">”</span>
              <div className="testimonial-head">
                <img className="testimonial-avatar" src={t.avatar} alt={t.name} loading="lazy" />
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <Stars rating={t.rating} />
                </div>
              </div>
              <p className="testimonial-quote text-muted">{t.quote}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  </>
);
