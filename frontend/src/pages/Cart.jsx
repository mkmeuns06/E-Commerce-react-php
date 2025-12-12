import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';

export default function Cart() {
  const { cart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (cart.items.length === 0) {
    return (
      <Container className="py-5">
        <Card className="text-center py-5">
          <Card.Body>
            <div style={{ fontSize: '5rem' }}>🛒</div>
            <h2 className="mb-3">Votre panier est vide</h2>
            <p className="text-muted mb-4">
              Découvrez nos produits et ajoutez-les à votre panier !
            </p>
            <Button as={Link} to="/products" variant="primary" className="btn-gradient" size="lg">
              Voir les produits
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="page-header d-flex justify-content-between align-items-center">
        <h1>🛒 Mon Panier</h1>
        <Button 
          variant="outline-danger" 
          onClick={() => {
            if (window.confirm('Vider tout le panier ?')) {
              clearCart();
            }
          }}
        >
          Vider le panier
        </Button>
      </div>

      <Row>
        <Col lg={8}>
          <Card className="mb-3 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                {cart.items.length} article(s) dans le panier
              </h5>
            </Card.Header>
            <Card.Body>
              {cart.items.map((item) => (
                <CartItem key={item.product_id} item={item} />
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm sticky-top" style={{ top: '20px' }}>
            <Card.Header className="gradient-bg text-white">
              <h5 className="mb-0">📊 Récapitulatif</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Sous-total</span>
                <span>{parseFloat(cart.total).toFixed(2)} €</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Livraison</span>
                <span className="text-success fw-bold">Gratuite</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <strong>Total</strong>
                <strong className="h4 text-primary mb-0">
                  {parseFloat(cart.total).toFixed(2)} €
                </strong>
              </div>

              {isAuthenticated ? (
                <Button 
                  as={Link} 
                  to="/checkout" 
                  variant="primary" 
                  size="lg" 
                  className="w-100 btn-gradient"
                >
                  ✅ Valider la commande
                </Button>
              ) : (
                <>
                  <Alert variant="warning" className="mb-3">
                    Vous devez être connecté pour commander
                  </Alert>
                  <Button 
                    as={Link} 
                    to="/login" 
                    variant="primary" 
                    size="lg" 
                    className="w-100 btn-gradient"
                  >
                    Se connecter
                  </Button>
                </>
              )}

              <Button 
                as={Link} 
                to="/products" 
                variant="outline-secondary" 
                className="w-100 mt-2"
              >
                Continuer mes achats
              </Button>

              <div className="mt-4 p-3 bg-light rounded">
                <small className="text-muted d-block">✓ Paiement sécurisé</small>
                <small className="text-muted d-block">✓ Livraison gratuite</small>
                <small className="text-muted d-block">✓ Satisfait ou remboursé</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}