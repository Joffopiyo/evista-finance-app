class BudgetManager {
  constructor() {
    this.transactions = [];
    this.chart = null;
    this.init();
  }

  async init() {
    if (!authService.isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    await this.loadTransactions();
    this.setupEventListeners();
  }

  async loadTransactions() {
    try {
      const response = await fetch('/api/transactions', {
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to load transactions');
      }

      this.transactions = await response.json();
      this.renderTransactions();
      this.updateTotals();
      this.renderChart();
    } catch (error) {
      console.error('Error loading transactions:', error);
      this.showError('Failed to load transactions');
    }
  }

  async addTransaction(description, amount, type) {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify({ description, amount: parseFloat(amount), type }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add transaction');
      }

      const newTransaction = await response.json();
      this.transactions.unshift(newTransaction);
      this.renderTransactions();
      this.updateTotals();
      this.renderChart();
      
      // Clear form
      document.getElementById('transactionForm').reset();
      this.hideModal();
      
      this.showSuccess('Transaction added successfully');
    } catch (error) {
      console.error('Error adding transaction:', error);
      this.showError(error.message);
    }
  }

  async deleteTransaction(id) {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      this.transactions = this.transactions.filter(t => t._id !== id);
      this.renderTransactions();
      this.updateTotals();
      this.renderChart();
      
      this.showSuccess('Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      this.showError('Failed to delete transaction');
    }
  }

  renderTransactions() {
    const container = document.getElementById('transactionsList');
    if (!container) return;

    if (this.transactions.length === 0) {
      container.innerHTML = '<tr><td colspan="5" class="text-center">No transactions found</td></tr>';
      return;
    }

    container.innerHTML = this.transactions.map(transaction => `
      <tr>
        <td>${transaction.description}</td>
        <td class="${transaction.type === 'income' ? 'text-success' : 'text-danger'}">
          $${transaction.amount.toFixed(2)}
        </td>
        <td>
          <span class="badge ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'}">
            ${transaction.type}
          </span>
        </td>
        <td>${new Date(transaction.createdAt).toLocaleDateString()}</td>
        <td>
          <button class="btn btn-sm btn-outline-danger" 
                  onclick="budgetManager.deleteTransaction('${transaction._id}')">
            Delete
          </button>
        </td>
      </tr>
    `).join('');
  }

  updateTotals() {
    const totalIncome = this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const savings = totalIncome - totalExpense;

    document.getElementById('totalIncome').textContent = totalIncome.toFixed(2);
    document.getElementById('totalExpense').textContent = totalExpense.toFixed(2);
    document.getElementById('netSavings').textContent = savings.toFixed(2);
  }

  renderChart() {
    const ctx = document.getElementById('budgetChart');
    if (!ctx) return;

    const income = this.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = this.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Income', 'Expenses', 'Savings'],
        datasets: [{
          label: 'Amount ($)',
          data: [income, expense, income - expense],
          backgroundColor: ['#4CAF50', '#F44336', '#2196F3'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  setupEventListeners() {
    const form = document.getElementById('transactionForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const type = document.getElementById('type').value;

        this.addTransaction(description, amount, type);
      });
    }
  }

  hideModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('transactionModal'));
    modal.hide();
  }

  showError(message) {
    alert('Error: ' + message);
  }

  showSuccess(message) {
    alert('Success: ' + message);
  }
}

// Global budget manager instance
const budgetManager = new BudgetManager();