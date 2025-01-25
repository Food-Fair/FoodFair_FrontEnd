import { Navigate } from 'react-router-dom';
import UserService from '../services/UserService';

const AdminRoute = ({ children }) => {
  const userType = localStorage.getItem('user_type');
  
  if (userType !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;