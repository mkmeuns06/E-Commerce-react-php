import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ThemeToggle from './ThemeToggle';

export default function NavbarComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Navbar bg="light" expand="lg" className="navbar-custom gradient-bg" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          🛒 E-Commerce
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Accueil</Nav.Link>
            <Nav.Link as={Link} to="/products">Produits</Nav.Link>
            <Nav.Link as={Link} to="/cart" className="position-relative">
              Panier
              {cart.count > 0 && (
                <Badge bg="danger" pill className="ms-2">
                  {cart.count}
                </Badge>
              )}
            </Nav.Link>

            </Nav>
            <ThemeToggle />
            <Nav>

            {isAuthenticated ? (
              <NavDropdown title={`👤 ${user?.prenom}`} id="user-dropdown">
                <NavDropdown.Item as={Link} to="/account">
                  Mon compte
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/orders">
                  Mes commandes
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Déconnexion
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Connexion</Nav.Link>
                <Nav.Link as={Link} to="/register">Inscription</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}