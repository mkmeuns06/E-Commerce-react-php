import { useState, useEffect } from 'react';
import { Container, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import Loader from '../components/Loader';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

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

  const getStatusBadge = (statut) => {
    const badges = {
      'en_attente': { bg: 'warning', text: '⏳ En attente' },
      'payee': { bg: 'success', text: '✅ Payée' },
      'expediee': { bg: 'info', text: '📦 Expédiée' },
      'livree': { bg: 'success', text: '🎉 Livrée' },
      'annulee': { bg: 'danger', text: '❌ Annulée' }
    };
    const badge = badges[statut] || { bg: 'secondary', text: statut };
    return <Badge bg={badge.bg}>{badge.text}</Badge>;
  };

  if (loading) return <Loader />;

  return (
    <Container className="py-4">
      <div className="page-header">
        <h1>Historique de mes commandes</h1>
      </div>

      {orders.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <div style={{ fontSize: '5rem' }}>📦</div>
            <h3 className="mb-3">Aucune commande</h3>
            <p className="text-muted mb-4">Vous n'avez pas encore passé de commande.</p>
            <Button as={Link} to="/products" variant="primary" className="btn-gradient">
              Découvrir nos produits
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <p className="text-muted mb-4">
            Vous avez passé {orders.length} commande(s)
          </p>

          {orders.map((order) => (
            <Card key={order.id} className="mb-3 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                  <div>
                    <h5 className="mb-2">Commande {order.numero_commande}</h5>
                    <p className="text-muted mb-2 small">
                       {new Date(order.date_commande).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <div className="mb-2">
                      {getStatusBadge(order.statut)}
                    </div>
                    <p className="text-muted small mb-0">
                       Paiement effectué
                    </p>
                  </div>
                  <div className="text-end">
                    <h4 className="text-primary mb-3">
                      {parseFloat(order.montant_total).toFixed(2)} €
                    </h4>
                    <Button 
                      as={Link} 
                      to={`/orders/${order.id}`}
                      variant="outline-primary"
                      size="sm"
                    >
                      Voir les détails
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </>
      )}
    </Container>
  );
}