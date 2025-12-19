import { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    code_postal: '',
    password: '',
    password_confirm: ''
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

    if (formData.password !== formData.password_confirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Card className="shadow">
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <div style={{ fontSize: '4rem' }}></div>
              <h2>Inscription</h2>
              <p className="text-muted">Créez votre compte gratuitement</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nom *</Form.Label>
                    <Form.Control
                      type="text"
                      name="nom"
                      placeholder="Dupont"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Prénom *</Form.Label>
                    <Form.Control
                      type="text"
                      name="prenom"
                      placeholder="Jean"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Téléphone</Form.Label>
                <Form.Control
                  type="tel"
                  name="telephone"
                  placeholder="06 12 34 56 78"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Adresse *</Form.Label>
                <Form.Control
                  type="text"
                  name="adresse"
                  placeholder="123 Rue de la Paix"
                  value={formData.adresse}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ville *</Form.Label>
                    <Form.Control
                      type="text"
                      name="ville"
                      placeholder="Paris"
                      value={formData.ville}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Code postal *</Form.Label>
                    <Form.Control
                      type="text"
                      name="code_postal"
                      placeholder="75001"
                      value={formData.code_postal}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Mot de passe *</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                />
                <Form.Text className="text-muted">
                  Minimum 6 caractères
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Confirmer le mot de passe *</Form.Label>
                <Form.Control
                  type="password"
                  name="password_confirm"
                  placeholder="••••••••"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  minLength={6}
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
                {loading ? 'Inscription...' : 'Créer mon compte'}
              </Button>
            </Form>

            <hr className="my-4" />

            <div className="text-center">
              <p className="text-muted">Vous avez déjà un compte ?</p>
              <Button 
                as={Link} 
                to="/login"
                variant="outline-primary">
                  Se connecter
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}