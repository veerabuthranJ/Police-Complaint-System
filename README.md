# Online Police Case Registration System

A full-stack application built with React, Node.js, Express, and MongoDB.

## Features
- **Authentication**: JWT-based login/signup for both Users and Police Officers.
- **User Dashboard**:
  - File complaints with Aadhaar/Voter ID and incident image uploads.
  - Emergency Alert System with real-time location and auto-assignment.
  - Track complaint status and assigned officer.
- **Police Dashboard**:
  - View all registered complaints.
  - Assign cases to available officers.
  - Real-time view of emergency alerts.
  - Update case status (Pending -> Investigating -> Solved).

## Tech Stack
- **Frontend**: React, Axios, React Router, Lucide Icons.
- **Backend**: Node.js, Express, JWT, bcrypt, Multer.
- **Database**: MongoDB.

## Prerequisites
- Node.js (v14+)
- MongoDB (Running locally or a cloud URI)

## Installation & Setup

### 1. Backend Setup
```bash
cd backend
npm install
```
- Create a `.env` file in the `backend` folder (one is provided by default).
- Ensure MongoDB is running on `mongodb://localhost:27017/police_case_system` or update the URI in `.env`.
- Start the server:
```bash
npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- The frontend will run on `http://localhost:5173`.

## Usage
1. **Register as User**: Fill in address and phone details.
2. **Register as Police**: Use your email.
3. **Emergency Alert**: Click the button on User Dashboard to trigger a high-priority alert.
4. **Complaint**: Upload proofs and images via the form.
5. **Manage**: Police can assign and update statuses from their dashboard.
