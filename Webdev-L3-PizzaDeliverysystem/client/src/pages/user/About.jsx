import '@/styles/about.css';

export const About = () => (
  <div className="about-page">
    <header className="about-hero">
      <div className="container">
        <p className="about-eyebrow">Our Story</p>
        <h1 className="about-heading">Crafting the Perfect Slice</h1>
        <p className="about-sub text-muted">
          From a small brick oven to a city-wide favorite, PizzaCrave is built on passion, fresh ingredients, and a lot of cheese.
        </p>
      </div>
    </header>

    <section className="section">
      <div className="container">
        <div className="about-grid">
          <div className="about-text-content">
            <h2 className="about-section-title">It Started With a Craving</h2>
            <p className="text-muted">
              Back in 2024, we realized that getting a great, customized pizza delivered fast was harder than it should be. The options were either fast-food quality or sit-down restaurants that took hours. We wanted the best of both worlds.
            </p>
            <p className="text-muted">
              So, we built our own kitchen. We sourced the freshest tomatoes, hand-stretched our dough daily, and perfected our signature cheese blend. Today, PizzaCrave stands for quality without the wait.
            </p>
          </div>
          <div className="about-image-wrapper">
            <img src="/pizzas/p1.jpg" alt="Our pizza oven" className="about-image" />
          </div>
        </div>
      </div>
    </section>

    <section className="section about-alt">
      <div className="container">
        <h2 className="about-section-title text-center">Our Food Philosophy</h2>
        <div className="about-features-grid">
          <div className="about-feature card">
            <h3 className="about-feature-title">Fresh Ingredients</h3>
            <p className="text-muted">No frozen dough, no artificial flavors. We source locally whenever possible.</p>
          </div>
          <div className="about-feature card">
            <h3 className="about-feature-title">Hand-Stretched</h3>
            <p className="text-muted">Every base is hand-tossed to order, ensuring the perfect crust every time.</p>
          </div>
          <div className="about-feature card">
            <h3 className="about-feature-title">Wood-Fired Taste</h3>
            <p className="text-muted">Our high-temperature ovens replicate that authentic wood-fired blister.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="section about-cta-section">
      <div className="container">
        <div className="about-cta card-cream card">
          <h2 className="about-cta-title">Join Our Community</h2>
          <p className="text-muted">Stay up to date with new flavors and secret menu items.</p>
          <a href="/register" className="btn btn-primary">
            Create an Account →
          </a>
        </div>
      </div>
    </section>
  </div>
);
