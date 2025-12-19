import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getLatest(8),
        categoryService.getAll()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      {/* Hero Section */}
      <div className="gradient-bg text-white py-5 mb-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-3">
                Bienvenue sur notre boutique en ligne
              </h1>
              <p className="lead mb-4">
                Découvrez nos meilleurs produits à prix imbattables
              </p>
              <Button as={Link} to="/products" variant="light" size="lg">
                Voir tous les produits
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {/* Catégories */}
        {categories.length > 0 && (
          <section className="mb-5">
            <h2 className="text-center mb-4">Nos catégories</h2>
            <Row>
              {categories.map((category) => (
                <Col md={4} key={category.id} className="mb-3">
                  <Card className="h-100 shadow-sm text-center" style={{ cursor: 'pointer' }}>
                    <Card.Body as={Link} to={`/products?category=${category.id}`} className="text-decoration-none">
                      <Card.Title className="text-primary">{category.nom}</Card.Title>
                      {category.description && (
                        <Card.Text className="text-muted small">
                          {category.description}
                        </Card.Text>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>
        )}

        {/* Produits en vedette */}
        <section>
          <h2 className="text-center mb-4">Produits en vedette</h2>
          {products.length === 0 ? (
            <Card className="text-center py-5">
              <Card.Body>
                <p className="text-muted">Aucun produit disponible pour le moment.</p>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              {products.map((product) => (
                <Col md={6} lg={3} key={product.id} className="mb-4">
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}
        </section>

        {/* Avantages */}
        <section className="my-5 py-5 bg-light rounded">
          <Container>
            <Row className="text-center">
              <Col md={3}>
                <div style={{ fontSize: '3rem' }}></div>
                <h5 className="mt-3">Livraison gratuite</h5>
                <p className="text-muted">Sur toutes vos commandes</p>
              </Col>
              <Col md={3}>
                <div style={{ fontSize: '3rem' }}></div>
                <h5 className="mt-3">Paiement sécurisé</h5>
                <p className="text-muted">Transactions 100% sécurisées</p>
              </Col>
              <Col md={3}>
                <div style={{ fontSize: '3rem' }}></div>
                <h5 className="mt-3">Satisfait ou remboursé</h5>
                <p className="text-muted">30 jours de garantie</p>
              </Col>
              <Col md={3}>
                <div style={{ fontSize: '3rem' }}></div>
                <h5 className="mt-3">Service client</h5>
                <p className="text-muted">Disponible 7j/7</p>
              </Col>
            </Row>
          </Container>
        </section>
      </Container>
    </>
  );
}