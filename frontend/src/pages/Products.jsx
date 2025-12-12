import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Pagination } from 'react-bootstrap';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // ⭐ États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12); // Nombre de produits par page

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = selectedCategory 
        ? await productService.getAll(parseInt(selectedCategory))
        : await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        setLoading(true);
        const data = await productService.search(searchTerm);
        setProducts(data);
        setSelectedCategory('');
        setCurrentPage(1); // Reset à la page 1 après recherche
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setCurrentPage(1);
    loadProducts();
  };

  // ⭐ LOGIQUE DE PAGINATION
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Fonction pour changer de page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll vers le haut
  };

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Nombre max de boutons de page à afficher

    if (totalPages <= maxPagesToShow) {
      // Si peu de pages, afficher toutes
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Logique pour afficher ... entre les pages
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  if (loading) return <Loader />;

  return (
    <Container className="py-4">
      <div className="page-header">
        <h1>🛍️ Nos Produits</h1>
      </div>

      {/* Barre de recherche et filtres */}
      <Row className="mb-4">
        <Col md={6}>
          <Form onSubmit={handleSearch}>
            <Form.Group className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="🔍 Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" variant="primary" className="btn-gradient">
                Rechercher
              </Button>
            </Form.Group>
          </Form>
        </Col>
        <Col md={4}>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1); // Reset à la page 1 après changement de catégorie
            }}
          >
            <option value="">📂 Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nom}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button variant="outline-secondary" className="w-100" onClick={handleReset}>
            ↻ Réinitialiser
          </Button>
        </Col>
      </Row>

      {/* Informations sur les résultats */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="text-muted mb-0">
          <strong>{products.length}</strong> produit(s) trouvé(s)
          {products.length > productsPerPage && (
            <span> - Page <strong>{currentPage}</strong> sur <strong>{totalPages}</strong></span>
          )}
        </p>
        <p className="text-muted mb-0">
          Affichage de <strong>{indexOfFirstProduct + 1}</strong> à{' '}
          <strong>{Math.min(indexOfLastProduct, products.length)}</strong> sur{' '}
          <strong>{products.length}</strong>
        </p>
      </div>

      {/* Grille de produits */}
      {currentProducts.length === 0 ? (
        <div className="text-center py-5">
          <h3>😕 Aucun produit trouvé</h3>
          <p className="text-muted">Essayez de modifier vos critères de recherche</p>
          <Button variant="primary" className="btn-gradient" onClick={handleReset}>
            Voir tous les produits
          </Button>
        </div>
      ) : (
        <>
          <Row>
            {currentProducts.map((product) => (
              <Col md={6} lg={3} key={product.id} className="mb-4">
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>

          {/* ⭐ PAGINATION */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                {/* Bouton Premier */}
                <Pagination.First 
                  onClick={() => paginate(1)} 
                  disabled={currentPage === 1}
                />

                {/* Bouton Précédent */}
                <Pagination.Prev 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                />

                {/* Numéros de page */}
                {getPageNumbers().map((number, index) => {
                  if (number === '...') {
                    return <Pagination.Ellipsis key={`ellipsis-${index}`} disabled />;
                  }
                  return (
                    <Pagination.Item
                      key={number}
                      active={number === currentPage}
                      onClick={() => paginate(number)}
                    >
                      {number}
                    </Pagination.Item>
                  );
                })}

                {/* Bouton Suivant */}
                <Pagination.Next 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                />

                {/* Bouton Dernier */}
                <Pagination.Last 
                  onClick={() => paginate(totalPages)} 
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </Container>
  );
}