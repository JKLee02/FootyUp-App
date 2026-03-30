import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { auth } from '../../utils/auth';

function ProtectedRoute({ children }) {
  if (!auth.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;