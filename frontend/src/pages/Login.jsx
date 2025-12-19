import { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <Card className="shadow">
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <div style={{ fontSize: '4rem' }}></div>
              <h2>Connexion</h2>
              <p className="text-muted">Connectez-vous à votre compte</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                className="w-100 btn-gradient"
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </Form>

            <hr className="my-4" />

            <div className="text-center">
              <p className="text-muted">Pas encore de compte ?</p>
              <Button 
                as={Link} 
                to="/register" 
                variant="outline-primary"
              >
                Créer un compte
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Identifiants de test */}
        <Card className="mt-3 bg-light">
          <Card.Body>
            <small className="text-muted d-block mb-2">
              <strong>Identifiants de test :</strong>
            </small>
            <small className="text-muted d-block">
              Email : jean.dupont@email.com
            </small>
            <small className="text-muted d-block">
              Mot de passe : password
            </small>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}