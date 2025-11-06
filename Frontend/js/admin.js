class AdminDashboard {
  constructor() {
    this.users = [];
    this.init();
  }

  async init() {
    if (!authService.isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    if (!authService.isAdmin()) {
      window.location.href = '/user-dashboard';
      return;
    }

    await this.loadUsers();
    this.setupEventListeners();
  }

  async loadUsers() {
    try {
      const response = await fetch('/api/admin/users', {
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to load users');
      }

      this.users = await response.json();
      this.renderUsers();
    } catch (error) {
      console.error('Error loading users:', error);
      this.showError('Failed to load users');
    }
  }

  async updateUserRole(userId, newRole) {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      await this.loadUsers(); // Reload users
      this.showSuccess('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      this.showError('Failed to update user role');
    }
  }

  renderUsers() {
    const container = document.getElementById('usersTable');
    if (!container) return;

    if (this.users.length === 0) {
      container.innerHTML = '<tr><td colspan="5" class="text-center">No users found</td></tr>';
      return;
    }

    container.innerHTML = this.users.map(user => `
      <tr>
        <td>${user.email}</td>
        <td>
          <span class="badge ${user.role === 'admin' ? 'bg-primary' : 'bg-secondary'}">
            ${user.role}
          </span>
        </td>
        <td>${new Date(user.createdAt).toLocaleDateString()}</td>
        <td>${user._id}</td>
        <td>
          <select class="form-select form-select-sm" onchange="adminDashboard.updateUserRole('${user._id}', this.value)">
            <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
          </select>
        </td>
      </tr>
    `).join('');
  }

  setupEventListeners() {
    const refreshBtn = document.getElementById('refreshUsers');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.loadUsers();
      });
    }
  }

  showError(message) {
    alert('Error: ' + message);
  }

  showSuccess(message) {
    alert('Success: ' + message);
  }
}

// Global admin dashboard instance
const adminDashboard = new AdminDashboard();