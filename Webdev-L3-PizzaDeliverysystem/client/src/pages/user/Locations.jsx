import '@/styles/locations.css';

const STORES = [
  {
    name: 'Downtown HQ',
    address: '123 Main Street, City Center',
    hours: '10:00 AM - 11:00 PM',
    phone: '(555) 123-4567',
    features: ['Dine-in', 'Takeaway', 'Delivery']
  },
  {
    name: 'Westside Branch',
    address: '456 West Avenue, Near Mall',
    hours: '11:00 AM - 10:00 PM',
    phone: '(555) 987-6543',
    features: ['Takeaway', 'Delivery']
  },
  {
    name: 'Northgate Station',
    address: '789 North Blvd, Retail Park',
    hours: '10:00 AM - 12:00 AM',
    phone: '(555) 246-8135',
    features: ['Dine-in', 'Takeaway', 'Delivery', 'Drive-thru']
  }
];

export const Locations = () => (
  <div className="locations-page">
    <header className="locations-hero">
      <div className="container">
        <p className="locations-eyebrow">Find a Store</p>
        <h1 className="locations-heading">Where to Find Us</h1>
        <p className="locations-sub text-muted">
          We&apos;re expanding fast! Find the closest PizzaCrave to grab a slice or get it delivered piping hot.
        </p>
      </div>
    </header>

    <section className="section">
      <div className="container">
        <div className="locations-layout">
          {/* List Column */}
          <div className="locations-list">
            <h2 className="locations-section-title">Our Stores</h2>
            <div className="locations-grid">
              {STORES.map((store) => (
                <div key={store.name} className="location-card card">
                  <h3 className="location-name">{store.name}</h3>
                  <p className="location-address text-muted">📍 {store.address}</p>
                  <p className="location-detail text-muted">🕒 {store.hours}</p>
                  <p className="location-detail text-muted">📞 {store.phone}</p>
                  <div className="location-features">
                    {store.features.map(f => (
                      <span key={f} className="badge badge-soft">{f}</span>
                    ))}
                  </div>
                  <button className="btn btn-secondary location-btn">Order from here</button>
                </div>
              ))}
            </div>
          </div>

          {/* Map Column (Placeholder) */}
          <div className="locations-map-col">
            <div className="locations-map-placeholder card">
              <div className="map-icon">🗺️</div>
              <h3 className="map-title">Interactive Map</h3>
              <p className="text-muted">Map integration will be available soon.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);
