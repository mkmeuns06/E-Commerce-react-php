import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Badge, Form } from 'react-bootstrap';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import StarRating from '../components/StarRating';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await productService.getById(id);
      setProduct(data);
    } catch (error) {
      console.error('Erreur:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  if (loading) return <Loader />;
  if (!product) return null;

  return (
    <Container className="py-4">
      <Button 
        variant="link" 
        onClick={() => navigate(-1)}
        className="mb-3 text-decoration-none"
      >
        ← Retour aux produits
      </Button>

      <Row>
        <Col md={6}>
          <Card>
            <div style={{ 
              height: '400px', 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {product.image_url ? (
                <Card.Img 
                  src={product.image_url} 
                  alt={product.nom}
                  style={{ height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ fontSize: '8rem' }}>📦</div>
              )}
            </div>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              {product.categorie_nom && (
                <Badge bg="secondary" className="mb-3">
                  {product.categorie_nom}
                </Badge>
              )}

              <h1 className="mb-3">{product.nom}</h1>
              <StarRating rating={parseFloat(product.note)} count={product.nb_avis} />
              
              <p className="text-muted" style={{ lineHeight: '1.8' }}>
                {product.description || 'Aucune description disponible.'}
              </p>

              <div className="my-4">
                <h2 className="text-primary fw-bold">
                  {parseFloat(product.prix).toFixed(2)} €
                </h2>
              </div>

              {product.stock > 0 ? (
                <>
                  <div className="alert alert-success">
                    ✅ En stock ({product.stock} disponible{product.stock > 1 ? 's' : ''})
                  </div>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Quantité :</Form.Label>
                    <div className="d-flex align-items-center gap-2">
                      <Button 
                        variant="outline-secondary"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        style={{ width: '80px' }}
                        className="text-center"
                      />
                      <Button 
                        variant="outline-secondary"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
                      >
                        +
                      </Button>
                    </div>
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-100 btn-gradient"
                    onClick={handleAddToCart}
                  >
                    🛒 Ajouter au panier
                  </Button>
                </>
              ) : (
                <>
                  <div className="alert alert-danger">
                    ❌ Produit en rupture de stock
                  </div>
                  <Button variant="secondary" size="lg" className="w-100" disabled>
                    Indisponible
                  </Button>
                </>
              )}

              <hr className="my-4" />

              <h5 className="mb-3">📋 Informations complémentaires</h5>
              <ul className="list-unstyled" style={{ lineHeight: '2' }}>
                <li><strong>Référence :</strong> #{product.id}</li>
                <li><strong>Prix unitaire :</strong> {parseFloat(product.prix).toFixed(2)} €</li>
                <li><strong>Disponibilité :</strong> {product.stock > 0 ? 'En stock' : 'Rupture de stock'}</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}