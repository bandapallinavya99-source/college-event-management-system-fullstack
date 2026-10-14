# College Event Management System

A starter full-stack college event management project using React + Vite, Node.js + Express, and MySQL.

## Requirements
- Node.js 20+
- MySQL 8+

## 1. Database
Run `database/schema.sql` in MySQL Workbench.

## 2. Backend
```bash
cd backend
npm install
```
Copy `.env.example` to `.env` and set your MySQL credentials, then run:
```bash
npm run dev
```
API defaults to http://localhost:5000. Health check: http://localhost:5000/api/health

## 3. Frontend
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal (usually http://localhost:5173).

Never commit `.env` or real credentials.
