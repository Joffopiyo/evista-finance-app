class LoginManager {
  constructor() {
    this.init();
  }

  init() {
    const form = document.getElementById('loginForm');
    if (form) {
      form.addEventListener('submit', this.handleLogin.bind(this));
    }

    // Check if already logged in
    if (authService.isAuthenticated()) {
      this.redirectToDashboard();
    }
  }

  async handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('loginBtn');
    const errorDiv = document.getElementById('errorMessage');

    // Reset error state
    errorDiv.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Logging in...';

    try {
      await authService.login(email, password);
      this.redirectToDashboard();
    } catch (error) {
      errorDiv.textContent = error.message;
      errorDiv.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  }

  redirectToDashboard() {
    const user = authService.user;
    if (user.role === 'admin') {
      window.location.href = '/admin-dashboard.html';
    } else {
      window.location.href = '/user-dashboard.html';
    }
  }
}

// Initialize login manager when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  new LoginManager();
});