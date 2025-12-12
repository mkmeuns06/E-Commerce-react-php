import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import StarRating from './StarRating';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  // ... existing code ...

  return (
    <Card className="product-card shadow-sm">
      {/* Image */}
      {product.image_url ? (
        <Card.Img 
          variant="top" 
          src={product.image_url} 
          alt={product.nom}
          style={{ height: '200px', objectFit: 'cover' }}
        />
      ) : (
        <div 
          className="gradient-bg d-flex align-items-center justify-content-center"
          style={{ height: '200px', fontSize: '4rem' }}
        >
          📦
        </div>
      )}

      <Card.Body className="d-flex flex-column">
        {/* Catégorie */}
        <Badge bg="primary" className="mb-2 align-self-start">
          {product.categorie_nom}
        </Badge>

        {/* Titre */}
        <Card.Title>{product.nom}</Card.Title>

        {/* ⭐ AJOUTER ICI LA NOTATION */}
        <StarRating rating={parseFloat(product.note)} count={product.nb_avis} />

        {/* Description */}
        <Card.Text className="text-muted flex-grow-1">
          {product.description.substring(0, 80)}...
        </Card.Text>

        {/* Prix et stock */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-primary mb-0">
            {parseFloat(product.prix).toFixed(2)} €
          </h4>
          <Badge bg={product.stock > 0 ? 'success' : 'danger'}>
            {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
          </Badge>
        </div>

        {/* Boutons */}
        <div className="d-grid gap-2">
          <Button 
            as={Link} 
            to={`/products/${product.id}`}
            variant="outline-primary"
          >
            Voir les détails
          </Button>
          <Button 
            variant="primary" 
            className="btn-gradient"
            onClick={() => handleAddToCart(product.id)}
            disabled={product.stock === 0}
          >
            🛒 Ajouter au panier
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}