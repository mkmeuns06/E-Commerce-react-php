import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-custom py-4 mt-5">
      <Container>
        <Row>
          <Col md={4}>
            <h5>🛒 E-Commerce</h5>
            <p className="text-light">
              Votre boutique en ligne de confiance pour tous vos achats.
            </p>
          </Col>
          <Col md={4}>
            <h5>Liens rapides</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light text-decoration-none">Accueil</Link></li>
              <li><Link to="/products" className="text-light text-decoration-none">Produits</Link></li>
              <li><Link to="/cart" className="text-light text-decoration-none">Panier</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact</h5>
            <p className="text-light mb-1">📧 contact@ecommerce.com</p>
            <p className="text-light mb-1">📱 01 23 45 67 89</p>
            <p className="text-light">📍 Paris, France</p>
          </Col>
        </Row>
        <hr className="bg-light" />
        <Row>
          <Col className="text-center text-light">
            <p className="mb-0">&copy; {new Date().getFullYear()} E-Commerce - Tous droits réservés</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}