class Dashboard {
  constructor() {
    this.chart = null;
    this.init();
  }

  async init() {
    if (!authService.isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    await this.loadAnalytics();
    await this.loadCourses();
  }

  async loadAnalytics() {
    try {
      const response = await fetch('/api/analytics/summary', {
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to load analytics');
      }

      const data = await response.json();
      this.updateDashboard(data);
      this.renderChart(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      this.showError('Failed to load dashboard data');
    }
  }

  async loadCourses() {
    try {
      const response = await fetch('/api/courses');
      const courses = await response.json();
      this.renderCourses(courses);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  }

  updateDashboard(data) {
    // Update summary cards
    const savingsValue = document.getElementById('savingsValue');
    const expensesValue = document.getElementById('expensesValue');
    const incomeValue = document.getElementById('incomeValue');
    const courseProgress = document.getElementById('courseProgress');

    if (savingsValue) savingsValue.textContent = `$${data.savings.toFixed(2)}`;
    if (expensesValue) expensesValue.textContent = `$${data.totalExpense.toFixed(2)}`;
    if (incomeValue) incomeValue.textContent = `$${data.totalIncome.toFixed(2)}`;
    
    // Calculate average course progress
    const avgProgress = data.coursesProgress.length > 0 
      ? data.coursesProgress.reduce((sum, course) => sum + course.progress, 0) / data.coursesProgress.length 
      : 0;
    
    if (courseProgress) courseProgress.textContent = `${Math.round(avgProgress)}%`;
  }

  renderChart(data) {
    const ctx = document.getElementById('financeChart');
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
          data: [data.totalIncome, data.totalExpense],
          backgroundColor: ['#4CAF50', '#F44336'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: $${context.raw.toFixed(2)}`;
              }
            }
          }
        }
      }
    });
  }

  renderCourses(courses) {
    const container = document.getElementById('coursesContainer');
    if (!container) return;

    container.innerHTML = courses.slice(0, 2).map(course => `
      <div class="mb-3">
        <h6>${course.title}</h6>
        <div class="progress mb-1">
          <div class="progress-bar" role="progressbar" 
               style="width: ${Math.floor(Math.random() * 100)}%">
          </div>
        </div>
        <small class="text-muted">${course.duration}</small>
      </div>
    `).join('');
  }

  showError(message) {
    alert('Error: ' + message);
  }
}

// Initialize dashboard when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  new Dashboard();
});