import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { updateCart, removeFromCart } = useCart();
  const product = item.product;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0 && newQuantity <= product.stock) {
      updateCart(product.id, newQuantity);
    }
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Row className="align-items-center">
          <Col md={2}>
            <div style={{ 
              width: '100%', 
              height: '80px', 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.nom}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                />
              ) : (
                <span style={{ fontSize: '2rem' }}>📦</span>
              )}
            </div>
          </Col>
          <Col md={4}>
            <h5 className="mb-1">{product.nom}</h5>
            <p className="text-muted small mb-0">
              Prix unitaire : {parseFloat(product.prix).toFixed(2)} €
            </p>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label className="small">Quantité</Form.Label>
              <div className="d-flex align-items-center">
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                >
                  -
                </Button>
                <Form.Control
                  type="number"
                  min="1"
                  max={product.stock}
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  className="mx-2 text-center"
                  style={{ width: '60px' }}
                />
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={item.quantity >= product.stock}
                >
                  +
                </Button>
              </div>
            </Form.Group>
          </Col>
          <Col md={2} className="text-center">
            <div className="h4 mb-0 text-primary fw-bold">
              {parseFloat(item.subtotal).toFixed(2)} €
            </div>
          </Col>
          <Col md={2} className="text-end">
            <Button 
              variant="danger" 
              size="sm"
              onClick={() => removeFromCart(product.id)}
            >
              🗑️ Supprimer
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}