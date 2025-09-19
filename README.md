# ⚙️ E-Commerce Backend (Node.js + Express + MongoDB)

A powerful backend API for the **E-Commerce Website & Admin/Seller Dashboard**.  
Built with **Node.js, Express, and MongoDB**, the backend handles authentication, business logic, and email integrations.

---

## 🚀 Tech Stack
- **Node.js** – Runtime
- **Express.js** – Web framework for building REST APIs
- **MongoDB** – NoSQL database
- **Mongoose** – ODM for MongoDB
- **Nodemailer** – Email notifications
- **JWT (JSON Web Tokens)** – Authentication & Authorization
- **BCrypt** – Password hashing

---

## ⚙️ Features

### 🔐 Authentication & Users
- User registration & login with JWT  
- Role-based access: **Admin, Seller, Customer, Employee**  
- Profile management  
- Email verification & password reset via **Nodemailer**  

### 🛍️ E-Commerce Core
- Manage **categories, subcategories, and products**  
- Product details with images, stock, and pricing  
- Cart & checkout APIs  
- Order management (create, update, track)  
- Payment integration-ready structure  

### 👨‍💼 Admin Features
- Manage **employees** with role-based **permissions**  
- Manage **customers, sellers, categories, subcategories**  
- Approve/reject sellers & products  
- View **sales reports and analytics**  
- Financial details overview  

### 🛒 Seller Features
- Add/manage products (pending admin approval)  
- Manage own sales & orders  
- View financial insights of own sales  

### 📊 Dashboard Support
- Provide analytics data (sales, revenue, users, products)  
- API endpoints for dashboard charts & reports  

### 📧 Emails
- Order confirmation emails  
- Seller approval/rejection notifications  
- Password reset & account verification  

---

## 📂 Project Structure

```bash
src/
│── config/        # Database, email, and environment configuration
│── controllers/   # Handle requests and responses (business logic)
│── models/        # Mongoose schemas (User, Product, Order, Category...)
│── routes/        # Express routes (API endpoints)
│── middlewares/   # Auth, error handling, request validation
│── services/      # External services (email, payment integration)
│── utils/         # Helper functions (tokens, formatters...)
│
└── index.js       # Entry point of the app

