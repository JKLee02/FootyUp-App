import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { auth } from '../../utils/auth';

function AdminProtectedRoute({ children }) {
  if (!auth.isAdminAuthenticated()) {
    return <Navigate to="/adminlogin" replace />;
  }
  return children;
}

AdminProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminProtectedRoute;