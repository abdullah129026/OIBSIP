import '@/styles/pizzacard.css';

const Stars = ({ rating }) => {
  const full = Math.round(rating);
  return (
    <span className="pizzacard-stars" aria-label={`${rating} out of 5`}>
      {'★★★★★'.slice(0, full)}
      <span className="pizzacard-stars-empty">{'★★★★★'.slice(full)}</span>
    </span>
  );
};

export const PizzaCard = ({
  name,
  image,
  badge,
  rating,
  reviews,
  description,
  price,
  onOrder,
}) => (
  <article className="pizzacard">
    <div className="pizzacard-media">
      <img className="pizzacard-image" src={image} alt={name} loading="lazy" />
      {badge && <span className="badge badge-veg pizzacard-badge">🌿 {badge}</span>}
    </div>

    <div className="pizzacard-body">
      <h3 className="pizzacard-title">{name}</h3>

      {rating != null && (
        <div className="pizzacard-rating">
          <Stars rating={rating} />
          <span className="text-muted">
            {rating}/5 ({reviews} reviews)
          </span>
        </div>
      )}

      {description && <p className="pizzacard-desc text-muted">{description}</p>}

      <div className="pizzacard-foot">
        <span className="price pizzacard-price">${price}</span>
        <button className="btn btn-secondary pizzacard-btn" onClick={onOrder}>
          Order Now
        </button>
      </div>
    </div>
  </article>
);
