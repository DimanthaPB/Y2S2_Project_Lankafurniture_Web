# LankaFurniture.lk - Wood Based Solution (WBS) Management System

## Overview

LankaFurniture.lk is a comprehensive web-based platform designed to connect wood craftsmen, clients, product sellers, and delivery personnel through a single digital ecosystem. The platform modernizes Sri Lanka's woodworking industry by enabling craftsmen to showcase products and services, while allowing customers to easily discover, purchase, and request custom woodworking solutions.

The system was developed using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)** and follows Agile development practices.

---

## Features

### User Management

* Multi-role authentication and authorization
* Customer registration and login
* Service provider registration and verification
* Delivery personnel management
* Admin dashboard and controls

### Product Management

* Product listing and management
* Product categorization
* Search and filtering
* Product inventory tracking
* Product image uploads

### Order Management

* Shopping cart functionality
* Secure order placement
* Order status tracking
* Order history management
* Custom woodworking job requests

### Delivery Management

* Delivery assignment
* Real-time delivery status updates
* Delivery tracking
* Delivery confirmation management

### Inventory Management

* Stock monitoring
* Low-stock alerts
* Inventory reporting
* SKU management
* Bulk stock updates

### Financial Management

* Sales tracking
* Commission calculations
* Invoice generation
* Transaction history
* Financial reporting

### Dashboard & Analytics

* Admin dashboard
* Sales analytics
* User statistics
* Inventory insights
* Revenue monitoring

### Complaint Management

* Complaint submission
* Complaint tracking
* Issue resolution workflow
* User notifications

---

## Technology Stack

### Frontend

* React.js
* React Router
* Axios
* Context API

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JSON Web Tokens (JWT)
* bcrypt

### Additional Tools

* Multer (File Uploads)
* Nodemailer (Email Notifications)
* Git & GitHub

---

## System Architecture

```text
Frontend (React.js)
        |
        ▼
Backend API (Node.js + Express.js)
        |
        ▼
Database (MongoDB)
```

---

## Project Structure

```text
project-root/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   └── package.json
│
├── README.md
└── .env
```

---

## Prerequisites

Before running this project, make sure you have installed:

* Node.js (v18 or later recommended)
* npm or yarn
* MongoDB (Local Installation or MongoDB Atlas)
* Git

Check installations:

```bash
node -v
npm -v
git --version
```

---

# Installation Guide

## 1. Clone the Repository

```bash
git clone https://github.com/DimanthaPB/Y2S2_Project_Lankafurniture_Web.git
```

Navigate into the project:

```bash
cd Y2S2_Project_Lankafurniture_Web
```

---

## 2. Install Backend Dependencies

Navigate to backend folder:

```bash
cd backend
```

Install packages:

```bash
npm install
```

---

## 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
```

Install packages:

```bash
npm install
```

---

## 4. Configure Environment Variables

Create a `.env` file inside the backend folder.

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password

CLIENT_URL=http://localhost:3000
```

Replace the values with your actual credentials.

---

## 5. Start MongoDB

### Option 1: Local MongoDB

Ensure MongoDB service is running:

```bash
mongod
```

### Option 2: MongoDB Atlas

Use your Atlas connection string inside `.env`.

---

## 6. Run Backend Server

Inside backend folder:

```bash
npm start
```

or

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

## 7. Run Frontend Application

Inside frontend folder:

```bash
npm start
```

Frontend will run on:

```text
http://localhost:3000
```

---

## Running the Complete Application

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend
npm start
```

Open your browser:

```text
http://localhost:3000
```

---

## Testing

Run backend tests:

```bash
npm test
```

Run frontend tests:

```bash
npm test
```

---

## Future Enhancements

* Online payment gateway integration
* Real-time delivery tracking using maps
* Mobile application development
* AI-powered product recommendations
* Sinhala and Tamil language support
* Advanced analytics dashboard

---

## Contributors

| Name                     | Responsibility                                                    |
| ------------------------ | ----------------------------------------------------------------- |
| T.M.P.B. Dimantha        | Authentication, Employee Management, Salary Management, Dashboard |
| W.G.R.M.A.T.B. Wethalawa | Inventory Management, Reports, Email Notifications                |
| N.W.D.E. Randunu         | Custom Job Management, Service Provider Features                  |
| R.M.K.B. Rathnayake      | Order Management, Profile Management                              |
| K.L.S. Shyamal           | Delivery Management                                               |

---

## Academic Information

**Project:** Wood Based Solution (WBS) Management System

**Institution:** Sri Lanka Institute of Information Technology (SLIIT)

**Module:** IT2080 – Information Technology Project

**Academic Year:** 2025

---

## License

This project is developed for educational and academic purposes under SLIIT's Information Technology Project module.

---

### Repository

GitHub Repository:

https://github.com/DimanthaPB/Y2S2_Project_Lankafurniture_Web

---
