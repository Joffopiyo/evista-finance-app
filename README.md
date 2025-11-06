# 💰 Evista Finance - SDG Financial Literacy App

A comprehensive full-stack financial literacy application designed to help users master personal finance, budgeting, and investment through interactive courses and tools. Aligned with Sustainable Development Goals (SDG), this application promotes financial inclusion and education.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Demo Accounts](#-demo-accounts)
- [Security Features](#-security-features)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Authorization
- Secure user registration and login
- JWT-based authentication
- Role-based access control (User & Admin)
- Password hashing with bcrypt

### 💵 Budget Management
- **Income Tracking**: Record and monitor all income sources
- **Expense Management**: Categorize and track expenses
- **Visual Analytics**: Interactive charts and graphs for budget overview
- **Net Savings Calculation**: Real-time calculation of income vs expenses
- **Transaction History**: Complete log of all financial transactions

### 📚 Financial Courses
- Comprehensive financial literacy courses
- Course progress tracking
- Featured courses on homepage
- SDG-aligned content

### 📊 Analytics Dashboard
- User dashboard with financial overview
- Admin dashboard for system management
- Transaction analytics and insights
- Budget performance metrics

### 🛡️ Security
- Helmet.js for HTTP headers security
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration
- Secure password storage

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security middleware
- **express-rate-limit** - Rate limiting
- **dotenv** - Environment variables

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling
- **JavaScript (ES6+)** - Client-side logic
- **Bootstrap 5** - UI framework
- **Font Awesome** - Icons
- **Chart.js** - Data visualization (for budget charts)

### Development Tools
- **nodemon** - Development server with auto-reload

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher) or **yarn**
- **MongoDB** (v4.4 or higher) - [Download MongoDB](https://www.mongodb.com/try/download/community)
  - MongoDB can run locally or use MongoDB Atlas (cloud)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Financial Literacy app"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/evista
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/evista

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:4000
```

**⚠️ Important**: Replace `your_super_secret_jwt_key_here_change_in_production` with a strong, random secret key in production.

### 4. Start MongoDB

If using local MongoDB:

```bash
# On Windows
mongod

# On macOS/Linux
sudo systemctl start mongod
# OR
brew services start mongodb-community
```

### 5. Seed the Database (Optional)

Populate the database with initial data:

```bash
npm run seed
```

This will create:
- Demo admin account
- Demo user account
- Sample courses
- Sample transactions

### 6. Start the Application

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The application will be available at:
- **Frontend**: http://localhost:4000
- **API**: http://localhost:4000/api
- **Health Check**: http://localhost:4000/api/health

## ⚙️ Configuration

### MongoDB Connection

The application connects to MongoDB using the connection string from your `.env` file. By default, it connects to:
- **Local**: `mongodb://localhost:27017/evista`

To use MongoDB Atlas (cloud):
1. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get your connection string
3. Update `MONGODB_URI` in your `.env` file

### Port Configuration

Change the port by updating `PORT` in your `.env` file. Default is `4000`.

## 📱 Usage

### Getting Started

1. **Visit the Homepage**: Navigate to http://localhost:4000
2. **Register an Account**: Click "Get Started" or "Sign up here"
3. **Login**: Use your credentials or demo accounts (see below)
4. **Explore Features**:
   - Access your dashboard
   - Manage your budget
   - Enroll in courses
   - View analytics

### Available Pages

- **Homepage** (`/`): Landing page with features and course preview
- **Login** (`/login`): User authentication
- **User Dashboard** (`/user-dashboard`): Personal financial overview
- **Admin Dashboard** (`/admin-dashboard`): System administration (admin only)
- **Budget Management** (`/budget`): Track income and expenses

## 📁 Project Structure

```
Financial Literacy app/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection configuration
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication middleware
│   │   └── validation.js      # Input validation middleware
│   ├── models/
│   │   ├── User.js            # User model (email, password, role)
│   │   ├── Transaction.js    # Transaction model (income/expense)
│   │   └── Course.js         # Course model (financial courses)
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── transactions.js    # Transaction management routes
│   │   ├── courses.js         # Course routes
│   │   ├── analytics.js       # Analytics routes
│   │   └── admin.js           # Admin routes
│   ├── utils/
│   │   └── seed.js            # Database seeding utility
│   └── server.js              # Express server setup
├── Frontend/                  # Frontend static files (served by Express)
│   ├── css/
│   │   └── style.css          # Custom styles
│   ├── js/
│   │   ├── auth.js            # Authentication logic
│   │   ├── login.js           # Login page logic
│   │   ├── dashboard.js      # Dashboard functionality
│   │   ├── budget.js          # Budget management
│   │   └── admin.js           # Admin panel logic
│   ├── index.html             # Homepage
│   ├── login.html             # Login page
│   ├── user-dashboard.html    # User dashboard
│   ├── admin-dashboard.html   # Admin dashboard
│   └── budget.html            # Budget management page
├── .env                       # Environment variables (create this)
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Transactions
- `GET /api/transactions` - Get user transactions (requires auth)
- `POST /api/transactions` - Create new transaction (requires auth)
- `DELETE /api/transactions/:id` - Delete transaction (requires auth)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (admin only)
- `PUT /api/courses/:id` - Update course (admin only)
- `DELETE /api/courses/:id` - Delete course (admin only)

### Analytics
- `GET /api/analytics/overview` - Get financial overview (requires auth)
- `GET /api/analytics/trends` - Get spending trends (requires auth)

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/stats` - Get system statistics (admin only)

### Health Check
- `GET /api/health` - Server health status

## 👤 Demo Accounts

The application comes with pre-seeded demo accounts (if you ran `npm run seed`):

### Admin Account
- **Email**: `admin@example.com`
- **Password**: `Admin@123`
- **Role**: Admin (full system access)

### User Account
- **Email**: `user@example.com`
- **Password**: `User@123`
- **Role**: User (standard access)

**⚠️ Security Note**: Change these default credentials in production!

## 🔒 Security Features

### Implemented Security Measures

1. **Password Security**
   - bcrypt hashing with salt rounds
   - Passwords never stored in plain text

2. **Authentication**
   - JWT tokens with expiration
   - Secure token storage

3. **HTTP Security Headers**
   - Helmet.js for security headers
   - XSS protection
   - Content Security Policy

4. **Rate Limiting**
   - API rate limiting (100 requests per 15 minutes per IP)
   - Prevents brute force attacks

5. **Input Validation**
   - express-validator for request validation
   - Prevents injection attacks
   - Data sanitization

6. **CORS Configuration**
   - Restrictive CORS policies
   - Whitelist allowed origins

### Security Best Practices for Production

1. **Environment Variables**: Never commit `.env` files
2. **Strong JWT Secret**: Use a cryptographically strong secret
3. **HTTPS**: Always use HTTPS in production
4. **Database Security**: Use MongoDB authentication
5. **Regular Updates**: Keep dependencies updated
6. **Logging**: Implement proper error logging
7. **Backup**: Regular database backups

## 🧪 Development

### Available Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Seed database with sample data
npm run seed

# Run tests (when implemented)
npm test
```

### Development Tips

1. **Auto-reload**: Use `npm run dev` for automatic server restart
2. **MongoDB Compass**: Use MongoDB Compass to visualize your database
3. **API Testing**: Use Postman or similar tools to test API endpoints
4. **Browser DevTools**: Check browser console for client-side errors

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write clear commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Evista Tech**

## 🙏 Acknowledgments

- Bootstrap for the UI framework
- MongoDB for the database solution
- Express.js community for excellent documentation
- All contributors and users of this project

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

**Made with ❤️ for Financial Literacy Education**

