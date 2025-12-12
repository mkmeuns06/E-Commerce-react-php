import { useState, useEffect } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import Loader from '../components/Loader';

export default function OrderConfirmation() {
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
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!orderData) return null;

  const { order, items } = orderData;

  return (
    <Container className="py-5">
      <Card className="shadow text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card.Body className="p-5">
          <div style={{ fontSize: '5rem' }}>✅</div>
          
          <h1 className="text-success mb-3">Commande confirmée !</h1>
          
          <p className="text-muted lead mb-4">
            Merci pour votre commande. Un email de confirmation a été envoyé à<br />
            <strong>{order.client_email}</strong>
          </p>

          <Alert variant="info" className="mb-4">
            <h4>📋 Commande n° {order.numero_commande}</h4>
          </Alert>

          <Card className="mb-4 text-start">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Détails de la commande</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <strong>Date :</strong>
                <span>{new Date(order.date_commande).toLocaleDateString('fr-FR', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <strong>Statut :</strong>
                <span className="text-warning fw-bold">
                  {order.statut === 'en_attente' ? '⏳ En attente' : order.statut}
                </span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <strong>Nombre d'articles :</strong>
                <span>{items.length}</span>
              </div>
              <div className="d-flex justify-content-between py-3 mt-2" style={{ fontSize: '1.2rem' }}>
                <strong>Total TTC :</strong>
                <strong className="text-primary">
                  {parseFloat(order.montant_total).toFixed(2)} €
                </strong>
              </div>
            </Card.Body>
          </Card>

          <Alert variant="info">
            <strong>📦 Livraison estimée :</strong> 3-5 jours ouvrés
          </Alert>

          <h5 className="mt-4 mb-3">Articles commandés</h5>
          
          {items.map((item) => (
            <div key={item.id} className="d-flex justify-content-between align-items-center mb-2 p-3 bg-light rounded">
              <div className="d-flex gap-3 align-items-center">
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.produit_nom}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }}
                    />
                  ) : (
                    <span style={{ fontSize: '1.2rem' }}>📦</span>
                  )}
                </div>
                <div className="text-start">
                  <strong>{item.produit_nom}</strong>
                  <p className="text-muted mb-0 small">
                    {item.quantite} × {parseFloat(item.prix_unitaire).toFixed(2)} €
                  </p>
                </div>
              </div>
              <strong className="text-primary">
                {(item.quantite * parseFloat(item.prix_unitaire)).toFixed(2)} €
              </strong>
            </div>
          ))}

          <div className="d-flex gap-2 justify-content-center mt-4">
            <Button as={Link} to="/orders" variant="primary" className="btn-gradient">
              Voir mes commandes
            </Button>
            <Button as={Link} to="/products" variant="outline-secondary">
              Continuer mes achats
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}