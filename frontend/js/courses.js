class CoursesManager {
    constructor() {
        this.init();
    }

    async init() {
        if (!authService.isAuthenticated()) {
            window.location.href = '/login.html';
            return;
        }

        await this.loadCourses();
    }

    async loadCourses() {
        try {
            const response = await fetch('/api/courses');
            const courses = await response.json();
            this.renderCourses(courses);
        } catch (error) {
            console.error('Error loading courses:', error);
            this.showError('Failed to load courses');
        }
    }

    renderCourses(courses) {
        const container = document.getElementById('coursesContainer');
        if (!container) return;

        container.innerHTML = courses.map(course => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card course-card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${course.title}</h5>
                        <p class="card-text">${course.description}</p>
                        <div class="mb-3">
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" 
                                     style="width: ${Math.floor(Math.random() * 100)}%">
                                </div>
                            </div>
                            <small class="text-muted">Progress: ${Math.floor(Math.random() * 100)}%</small>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">
                                <i class="fas fa-clock me-1"></i>${course.duration}
                            </small>
                            <button class="btn btn-primary btn-sm" onclick="coursesManager.startCourse('${course._id}')">
                                Start Course
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    startCourse(courseId) {
        // For now, just show an alert. You can expand this to show course content
        alert('Course starting feature coming soon! This would show course lessons and content.');

        // Future implementation could:
        // 1. Show course modules
        // 2. Track progress
        // 3. Show videos/articles
        // 4. Add quizzes
    }

    showError(message) {
        alert('Error: ' + message);
    }
}

// Global courses manager instance
const coursesManager = new CoursesManager();