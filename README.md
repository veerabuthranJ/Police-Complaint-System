# 🚔 Police Complaint Management System

A full-stack web application that allows citizens to file complaints, track case status, and enables police officers to manage and respond to incidents efficiently.

---

## 📌 Project Overview

The **Police Complaint Management System** is designed to digitize and streamline the complaint handling process. It provides:

* A platform for users to register and submit complaints
* Real-time tracking of complaint status
* A system for police officers to manage and respond to cases
* Secure authentication and role-based access

---

## 🎯 Why This Project?

Traditional complaint systems are:

* Manual and time-consuming
* Lack transparency
* Difficult to track progress

This project solves those problems by:

* Providing a **centralized digital platform**
* Enabling **real-time updates**
* Improving **efficiency and accountability**
* Ensuring **secure communication between users and authorities**

---

## 🏗️ Architecture Overview

The application is deployed on AWS using a **secure and scalable architecture**:

* **Frontend** hosted on EC2 (Public Subnet) using Nginx
* **Backend** hosted on EC2 (Private Subnet) using Node.js
* **Internet Gateway** for public access
* **NAT Gateway** for backend outbound communication
* **Reverse Proxy (Nginx)** to connect frontend and backend securely

---

## 🔄 Application Workflow

### 1. User Interaction

* User accesses the application via browser
* Request is routed through Internet Gateway

### 2. Frontend Handling

* Nginx serves static frontend files (React/Vite)
* UI is displayed to the user

### 3. API Communication

* Frontend sends API requests (`/api/...`)
* Nginx forwards these requests to backend (private IP)

### 4. Backend Processing

* Node.js (Express) handles:

  * Authentication
  * Complaint management
  * Emergency handling
  * Police assignment
* Business logic and validations are applied

### 5. Response Flow

* Backend sends response to Nginx
* Nginx forwards response to frontend
* UI updates accordingly

### 6. External Access

* Backend uses NAT Gateway for:

  * Installing packages
  * Accessing external APIs

---

## 🔐 Security Design

* Backend is deployed in **Private Subnet (not publicly accessible)**
* API access restricted via **Security Groups**
* Authentication middleware protects sensitive routes
* Nginx acts as a secure reverse proxy

---

## ⚙️ Tech Stack

### Frontend:

* HTML, CSS, JavaScript
* React / Vite

### Backend:

* Node.js
* Express.js

### Database:

* MongoDB (Mongoose)

### Deployment:

* AWS EC2
* Nginx
* PM2 (Process Manager)

---

## 📁 Project Structure

```
Police-Complaint-System/
│
├── frontend/        # UI (React/Vite)
├── backend/         # Server (Node.js + Express)
│   ├── routes/      # API routes
│   ├── models/      # Database schemas
│   ├── middleware/  # Auth & validation
│   └── server.js    # Main entry point
```

---

## 🚀 Features

* 🔐 User Authentication (JWT-based)
* 📝 Complaint Registration
* 📊 Complaint Tracking
* 👮 Police Dashboard
* 🚨 Emergency Handling
* 🔄 Real-time updates (Socket.io)

---

## 🧪 How to Run Locally

### 1. Clone Repository

```
git clone https://github.com/veerabuthranJ/Police-Complaint-System.git
```

### 2. Install Dependencies

#### Frontend:

```
cd frontend
npm install
npm run dev
```

#### Backend:

```
cd backend
npm install
npm start
```

---

## 🌐 Deployment

* Frontend served via **Nginx on EC2 (Public)**
* Backend runs on **EC2 (Private) using PM2**
* Reverse proxy used for API communication
* Secure VPC architecture implemented

---

## 📈 Future Enhancements

* Add Load Balancer (ALB)
* Implement HTTPS with SSL
* Use S3 + CloudFront for frontend
* Add CI/CD using GitHub Actions
* Improve UI/UX

---

## 👨‍💻 Author

**Veera Buthran**

---

## ⭐ Conclusion

This project demonstrates:

* Real-world cloud deployment using AWS
* Secure architecture design (Public + Private Subnet)
* Full-stack development skills
* Scalable and maintainable system design

---





# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
