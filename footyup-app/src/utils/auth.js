const USER_SESSION_KEYS = ['token', 'refreshToken', 'userId', 'user_firstname'];
const ADMIN_SESSION_KEYS = ['adminToken', 'adminRefreshToken', 'admin_name'];

export const auth = {
  getUserToken: () => localStorage.getItem('token'),
  
  getUserId: () => localStorage.getItem('userId'),
  
  getUserName: () => localStorage.getItem('user_firstname'),
  
  isAuthenticated: () => !!localStorage.getItem('token'),
  
  setUserSession: (data) => {
    if (data.accessToken) localStorage.setItem('token', data.accessToken);
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    if (data.user_id) localStorage.setItem('userId', data.user_id);
    if (data.user_firstname) localStorage.setItem('user_firstname', data.user_firstname);
  },
  
  clearUserSession: () => {
    USER_SESSION_KEYS.forEach(key => localStorage.removeItem(key));
  },

  getAdminToken: () => localStorage.getItem('adminToken'),
  
  getAdminName: () => localStorage.getItem('admin_name'),
  
  isAdminAuthenticated: () => !!localStorage.getItem('adminToken'),
  
  setAdminSession: (data) => {
    if (data.accessToken) localStorage.setItem('adminToken', data.accessToken);
    if (data.refreshToken) localStorage.setItem('adminRefreshToken', data.refreshToken);
    if (data.admin_name) localStorage.setItem('admin_name', data.admin_name);
  },
  
  clearAdminSession: () => {
    ADMIN_SESSION_KEYS.forEach(key => localStorage.removeItem(key));
  },
};