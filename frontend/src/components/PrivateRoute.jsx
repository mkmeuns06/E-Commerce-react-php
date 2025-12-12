import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // ✅ Afficher un loader pendant la vérification
  if (loading) {
    return <Loader />;
  }

  // ✅ Rediriger vers login SEULEMENT si pas authentifié
  return isAuthenticated ? children : <Navigate to="/login" />;
}