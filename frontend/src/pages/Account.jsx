import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import api from '../services/api';
import Loader from '../components/Loader';

export default function Account() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [profileData, setProfileData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    code_postal: ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || '',
        adresse: user.adresse || '',
        ville: user.ville || '',
        code_postal: user.code_postal || ''
      });
    }
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      const data = await orderService.getOrderHistory();
      setOrders(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/user/edit-profile', profileData);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
      setEditMode(false);
      window.location.reload();
    } catch (error) {
      setMessage({ type: 'danger', text: error.response?.data?.message || 'Erreur lors de la mise à jour' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'danger', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    try {
      await api.post('/user/change-password', passwordData);
      setMessage({ type: 'success', text: 'Mot de passe modifié avec succès' });
      setPasswordMode(false);
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      setMessage({ type: 'danger', text: error.response?.data?.message || 'Erreur lors du changement de mot de passe' });
    }
  };

  const getStatusBadge = (statut) => {
    const badges = {
      'en_attente': '⏳ En attente',
      'payee': '✅ Payée',
      'expediee': '📦 Expédiée',
      'livree': '🎉 Livrée',
      'annulee': '❌ Annulée'
    };
    return badges[statut] || statut;
  };

  if (loading) return <Loader />;

  return (
    <Container className="py-4">
      <div className="page-header">
        <h1>Mon Compte</h1>
      </div>

      {message.text && (
        <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
          {message.text}
        </Alert>
      )}

      <Row>
        {/* Sidebar */}
        <Col lg={3}>
          <Card className="shadow-sm mb-4">
            <Card.Body className="text-center">
              <div 
                className="gradient-bg text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: '100px', height: '100px', fontSize: '3rem' }}
              >
                {user?.prenom?.charAt(0).toUpperCase()}
              </div>
              <h5 className="mb-1">{user?.prenom} {user?.nom}</h5>
              <p className="text-muted small mb-3">{user?.email}</p>
              
              <div className="d-grid gap-2">
                <Button as={Link} to="/account" variant="primary" className="btn-gradient">
                  Tableau de bord
                </Button>
                <Button as={Link} to="/orders" variant="outline-primary">
                  Mes commandes
                </Button>
                <Button variant="outline-danger" onClick={logout}>
                  Déconnexion
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Content */}
        <Col lg={9}>
          {/* Statistiques */}
          <Row className="mb-4">
            <Col md={4}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <h2 className="text-primary mb-2">{orders.length}</h2>
                  <p className="text-muted mb-0">Commandes</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <h2 className="text-primary mb-2">
                    {orders.reduce((sum, o) => sum + parseFloat(o.montant_total), 0).toFixed(2)} €
                  </h2>
                  <p className="text-muted mb-0">Total dépensé</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <h2 className="text-primary mb-2">
                    {orders.filter(o => o.statut === 'en_attente' || o.statut === 'payee').length}
                  </h2>
                  <p className="text-muted mb-0">En cours</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Informations personnelles */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Informations personnelles</h5>
              {!editMode && (
                <Button variant="outline-primary" size="sm" onClick={() => setEditMode(true)}>
                  Modifier
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {editMode ? (
                <Form onSubmit={handleProfileSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                          type="text"
                          name="nom"
                          value={profileData.nom}
                          onChange={handleProfileChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Prénom</Form.Label>
                        <Form.Control
                          type="text"
                          name="prenom"
                          value={profileData.prenom}
                          onChange={handleProfileChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Téléphone</Form.Label>
                    <Form.Control
                      type="tel"
                      name="telephone"
                      value={profileData.telephone}
                      onChange={handleProfileChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Adresse</Form.Label>
                    <Form.Control
                      type="text"
                      name="adresse"
                      value={profileData.adresse}
                      onChange={handleProfileChange}
                    />
                  </Form.Group>
                  <Row>
                    <Col md={8}>
                      <Form.Group className="mb-3">
                        <Form.Label>Ville</Form.Label>
                        <Form.Control
                          type="text"
                          name="ville"
                          value={profileData.ville}
                          onChange={handleProfileChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Code postal</Form.Label>
                        <Form.Control
                          type="text"
                          name="code_postal"
                          value={profileData.code_postal}
                          onChange={handleProfileChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex gap-2">
                    <Button type="submit" variant="primary" className="btn-gradient">
                      Enregistrer
                    </Button>
                    <Button variant="outline-secondary" onClick={() => setEditMode(false)}>
                      Annuler
                    </Button>
                  </div>
                </Form>
              ) : (
                <div className="bg-light p-3 rounded">
                  <p className="mb-2"><strong>Nom complet :</strong> {user?.prenom} {user?.nom}</p>
                  <p className="mb-2"><strong>Email :</strong> {user?.email}</p>
                  <p className="mb-2"><strong>Téléphone :</strong> {user?.telephone || 'Non renseigné'}</p>
                  <p className="mb-2"><strong>Adresse :</strong> {user?.adresse}</p>
                  <p className="mb-2"><strong>Ville :</strong> {user?.code_postal} {user?.ville}</p>
                  <p className="mb-0"><strong>Pays :</strong> {user?.pays || 'France'}</p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Changer le mot de passe */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Mot de passe</h5>
              {!passwordMode && (
                <Button variant="outline-primary" size="sm" onClick={() => setPasswordMode(true)}>
                  Changer
                </Button>
              )}
            </Card.Header>
            {passwordMode && (
              <Card.Body>
                <Form onSubmit={handlePasswordSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mot de passe actuel</Form.Label>
                    <Form.Control
                      type="password"
                      name="current_password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Nouveau mot de passe</Form.Label>
                    <Form.Control
                      type="password"
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      minLength={6}
                      required
                    />
                    <Form.Text className="text-muted">Minimum 6 caractères</Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirm_password"
                      value={passwordData.confirm_password}
                      onChange={handlePasswordChange}
                      minLength={6}
                      required
                    />
                  </Form.Group>
                  <div className="d-flex gap-2">
                    <Button type="submit" variant="primary" className="btn-gradient">
                      Changer le mot de passe
                    </Button>
                    <Button variant="outline-secondary" onClick={() => setPasswordMode(false)}>
                      Annuler
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            )}
          </Card>

          {/* Dernières commandes */}
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">📦 Dernières commandes</h5>
            </Card.Header>
            <Card.Body>
              {orders.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted mb-3">Vous n'avez pas encore passé de commande.</p>
                  <Button as={Link} to="/products" variant="primary" className="btn-gradient">
                    Découvrir nos produits
                  </Button>
                </div>
              ) : (
                <>
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                      <div>
                        <strong>Commande {order.numero_commande}</strong>
                        <p className="text-muted small mb-1">
                           {new Date(order.date_commande).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-muted small mb-0">
                          {getStatusBadge(order.statut)}
                        </p>
                      </div>
                      <div className="text-end">
                        <h5 className="text-primary mb-2">
                          {parseFloat(order.montant_total).toFixed(2)} €
                        </h5>
                        <Button 
                          as={Link} 
                          to={`/orders/${order.id}`}
                          variant="outline-primary"
                          size="sm"
                        >
                          Voir détails →
                        </Button>
                      </div>
                    </div>
                  ))}
                  {orders.length > 5 && (
                    <Button as={Link} to="/orders" variant="outline-secondary" className="w-100">
                      Voir toutes mes commandes ({orders.length})
                    </Button>
                  )}
                </>
              )}
            </Card.Body>
          </Card>

          {/* Avantages */}
          <Card className="gradient-bg text-white shadow-sm mt-4">
            <Card.Body>
              <h5 className="mb-3">Vos avantages</h5>
              <ul className="list-unstyled mb-0" style={{ lineHeight: '2' }}>
                <li>✓ Livraison gratuite sur toutes vos commandes</li>
                <li>✓ Suivi en temps réel de vos colis</li>
                <li>✓ Service client disponible 7j/7</li>
                <li>✓ Satisfait ou remboursé sous 30 jours</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}