export default function StarRating({ rating, count }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="d-flex align-items-center gap-1 my-2">
      <div className="d-flex">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            style={{ 
              color: i < fullStars ? '#ffc107' : (i === fullStars && hasHalfStar ? '#ffc107' : '#dee2e6'),
              fontSize: '1.1rem'
            }}
          >
            {i < fullStars ? '⭐' : (i === fullStars && hasHalfStar ? '⭐' : '☆')}
          </span>
        ))}
      </div>
      <small className="text-muted ms-1">
        <strong>{rating}</strong> ({count} avis)
      </small>
    </div>
  );
}