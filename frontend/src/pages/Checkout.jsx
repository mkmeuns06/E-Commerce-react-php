import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    adresse: '',
    ville: '',
    code_postal: '',
    pays: 'France'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cart.items.length === 0) {
      navigate('/cart');
      return;
    }

    setFormData({
      adresse: user.adresse || '',
      ville: user.ville || '',
      code_postal: user.code_postal || '',
      pays: user.pays || 'France'
    });
  }, [user, cart, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await orderService.createOrder(formData);
      await clearCart();
      navigate(`/orders/confirmation/${response.data.id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <div className="page-header">
        <h1>Validation de la commande</h1>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col lg={8}>
          {/* Informations de livraison */}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">📦 Informations de livraison</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3 p-3 bg-light rounded">
                <strong>Client :</strong> {user?.prenom} {user?.nom}<br />
                <strong>Email :</strong> {user?.email}
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Adresse *</Form.Label>
                  <Form.Control
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    required
                    placeholder="123 Rue de la Paix"
                  />
                </Form.Group>

                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ville *</Form.Label>
                      <Form.Control
                        type="text"
                        name="ville"
                        value={formData.ville}
                        onChange={handleChange}
                        required
                        placeholder="Paris"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Code postal *</Form.Label>
                      <Form.Control
                        type="text"
                        name="code_postal"
                        value={formData.code_postal}
                        onChange={handleChange}
                        required
                        placeholder="75001"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Pays</Form.Label>
                  <Form.Control
                    type="text"
                    name="pays"
                    value={formData.pays}
                    onChange={handleChange}
                    placeholder="France"
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>

          {/* Articles commandés */}
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Articles commandés ({cart.items.length})</h5>
            </Card.Header>
            <Card.Body>
              {cart.items.map((item) => (
                <div key={item.product_id} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                  <div className="d-flex gap-3">
                    <div style={{ 
                      width: '60px', 
                      height: '60px', 
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {item.product.image_url ? (
                        <img 
                          src={item.product.image_url} 
                          alt={item.product.nom}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      ) : (
                        <span style={{ fontSize: '1.5rem' }}>📦</span>
                      )}
                    </div>
                    <div>
                      <h6 className="mb-1">{item.product.nom}</h6>
                      <small className="text-muted">
                        {item.quantity} × {parseFloat(item.product.prix).toFixed(2)} €
                      </small>
                    </div>
                  </div>
                  <strong className="text-primary">
                    {parseFloat(item.subtotal).toFixed(2)} €
                  </strong>
                </div>
              ))}
            </Card.Body>
          </Card>

          {/* Méthode de paiement */}
          <Card className="mt-4 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Méthode de paiement</h5>
            </Card.Header>
            <Card.Body>
              <Alert variant="warning">
                <strong>Mode démonstration</strong>
                <p className="mb-0 mt-2">
                  Aucun paiement réel ne sera effectué. Cette commande est enregistrée à titre d'exemple.
                </p>
              </Alert>
            </Card.Body>
          </Card>
        </Col>

        {/* Récapitulatif */}
        <Col lg={4}>
          <Card className="shadow-sm sticky-top" style={{ top: '20px' }}>
            <Card.Header className="gradient-bg text-white">
              <h5 className="mb-0">Récapitulatif</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Sous-total ({cart.items.length} articles)</span>
                <span>{parseFloat(cart.total).toFixed(2)} €</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Livraison</span>
                <span className="text-success fw-bold">Gratuite</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>TVA (20%)</span>
                <span>{(cart.total * 0.20).toFixed(2)} €</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <strong>Total TTC</strong>
                <strong className="h4 text-primary mb-0">
                  {(cart.total * 1.20).toFixed(2)} €
                </strong>
              </div>

              <Button 
                variant="primary" 
                size="lg" 
                className="w-100 btn-gradient mb-2"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Traitement...' : '🎉 Confirmer la commande'}
              </Button>

              <Button 
                variant="outline-secondary" 
                className="w-100"
                onClick={() => navigate('/cart')}
              >
                Modifier mon panier
              </Button>

              <div className="mt-3 p-3 bg-light rounded">
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