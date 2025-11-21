class AuthService {
  constructor() {
    this.token = localStorage.getItem('evista_token');
    this.user = JSON.parse(localStorage.getItem('evista_user') || 'null');
  }

  async signup(email, password) {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      this.setAuthData(data.token, data.user);
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      this.setAuthData(data.token, data.user);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    if (!this.token) {
      return null;
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        this.clearAuthData();
        return null;
      }

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        return null;
      }

      this.user = data.user;
      localStorage.setItem('evista_user', JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      this.clearAuthData();
      return null;
    }
  }

  setAuthData(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('evista_token', token);
    localStorage.setItem('evista_user', JSON.stringify(user));
  }

  clearAuthData() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('evista_token');
    localStorage.removeItem('evista_user');
  }

  isAuthenticated() {
    return !!this.token;
  }

  isAdmin() {
    return this.user && this.user.role === 'admin';
  }

  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }
}

// Global auth instance
const authService = new AuthService();

// UI management
function updateUIBasedOnAuth() {
  const token = authService.token;
  const user = authService.user;

  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userEmail = document.getElementById('userEmail');
  const adminLink = document.getElementById('adminLink');

  if (token && user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (userEmail) {
      userEmail.textContent = user.email;
      userEmail.style.display = 'inline';
    }
    if (adminLink && user.role === 'admin') {
      adminLink.style.display = 'block';
    }
  } else {
    if (loginBtn) loginBtn.style.display = 'block';
    if (userEmail) userEmail.style.display = 'none';
    if (adminLink) adminLink.style.display = 'none';
  }
}

function logout() {
  authService.clearAuthData();
  updateUIBasedOnAuth();
  window.location.href = '/';
}

// Initialize auth state when DOM loads
document.addEventListener('DOMContentLoaded', async () => {
  if (authService.isAuthenticated()) {
    await authService.getCurrentUser();
  }
  updateUIBasedOnAuth();
});