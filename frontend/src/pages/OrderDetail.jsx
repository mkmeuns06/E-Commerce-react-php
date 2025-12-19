import { useState, useEffect } from 'react';
import { Container, Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import Loader from '../components/Loader';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await orderService.getOrderById(id);
      setOrderData(data);
    } catch (error) {
      console.error('Erreur:', error);
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (statut) => {
    const badges = {
      'en_attente': { bg: 'warning', text: '⏳ En attente' },
      'payee': { bg: 'success', text: '✅ Payée' },
      'expediee': { bg: 'info', text: '📦 Expédiée' },
      'livree': { bg: 'success', text: '🎉 Livrée' },
      'annulee': { bg: 'danger', text: '❌ Annulée' }
    };
    const badge = badges[statut] || { bg: 'secondary', text: statut };
    return <Badge bg={badge.bg} className="fs-6">{badge.text}</Badge>;
  };

  if (loading) return <Loader />;
  if (!orderData) return null;

  const { order, items } = orderData;

  return (
    <Container className="py-4">
      <Button 
        variant="link" 
        onClick={() => navigate('/orders')}
        className="mb-3 text-decoration-none"
      >
        ← Retour à mes commandes
      </Button>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
            <div>
              <h1 className="mb-2">Commande {order.numero_commande}</h1>
              <p className="text-muted mb-2">
                Passée le {new Date(order.date_commande).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              {getStatusBadge(order.statut)}
            </div>
          </div>

          <Row>
            <Col md={6}>
              <Card className="bg-light mb-3">
                <Card.Body>
                  <h6 className="text-primary mb-3">Client</h6>
                  <p className="mb-1"><strong>{order.client_prenom} {order.client_nom}</strong></p>
                  <p className="text-muted mb-0">{order.client_email}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="bg-light mb-3">
                <Card.Body>
                  <h6 className="text-primary mb-3">Montant total</h6>
                  <h3 className="mb-1">{parseFloat(order.montant_total).toFixed(2)} €</h3>
                  <p className="text-muted mb-0 small">TTC, livraison incluse</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="bg-light">
            <Card.Body>
              <h6 className="text-primary mb-3">📍 Adresse de livraison</h6>
              <p className="mb-0">
                {order.adresse_livraison}<br />
                {order.code_postal_livraison} {order.ville_livraison}<br />
                {order.pays_livraison}
              </p>
            </Card.Body>
          </Card>

          {order.statut === 'en_attente' && (
            <div className="alert alert-warning mt-3 mb-0">
              <strong>⏳ En cours de traitement</strong>
              <p className="mb-0 mt-2 small">
                Votre commande est en cours de préparation. Livraison estimée sous 3-5 jours ouvrés.
              </p>
            </div>
          )}

          {order.statut === 'livree' && (
            <div className="alert alert-success mt-3 mb-0">
              <strong>✅ Commande livrée</strong>
              <p className="mb-0 mt-2 small">
                Cette commande a été livrée avec succès.
              </p>
            </div>
          )}
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="mb-0">Articles commandés ({items.length})</h5>
        </Card.Header>
        <Card.Body>
          {items.map((item) => (
            <div key={item.id} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
              <div className="d-flex gap-3">
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.produit_nom}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  ) : (
                    <span style={{ fontSize: '2rem' }}>📦</span>
                  )}
                </div>
                <div>
                  <h5 className="mb-1">{item.produit_nom}</h5>
                  {item.description && (
                    <p className="text-muted small mb-2">
                      {item.description.substring(0, 100)}...
                    </p>
                  )}
                  <p className="text-muted mb-0">
                    Quantité : <strong>{item.quantite}</strong> × {parseFloat(item.prix_unitaire).toFixed(2)} €
                  </p>
                </div>
              </div>
              <div className="text-end">
                <h4 className="text-primary mb-0">
                  {(item.quantite * parseFloat(item.prix_unitaire)).toFixed(2)} €
                </h4>
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-between align-items-center pt-3 border-top">
            <h4 className="mb-0">Total de la commande :</h4>
            <h3 className="text-primary mb-0">
              {parseFloat(order.montant_total).toFixed(2)} €
            </h3>
          </div>
        </Card.Body>
      </Card>

      <div className="text-center mt-4">
        <Button as={Link} to="/products" variant="outline-secondary">
          Continuer mes achats
        </Button>
      </div>
    </Container>
  );
}