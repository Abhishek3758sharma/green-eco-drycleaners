# Green Eco Drycleaners

A modern cloud-native dry cleaning and laundry management platform built with React, TypeScript, Supabase, and designed for deployment on Microsoft Azure using Infrastructure as Code (Terraform).

## Project Overview

Green Eco Drycleaners provides an online platform where customers can:

* Book dry cleaning services
* Schedule laundry pickup requests
* Submit contact inquiries
* View service information and pricing

Administrators can:

* Manage customer bookings
* Process counter orders
* Track order status
* Monitor business operations through a secure dashboard

---

## Architecture

```text
Customer Browser
       │
       ▼
React + TypeScript Frontend
       │
       ▼
Supabase Backend
├── PostgreSQL Database
├── Authentication
└── Storage

       │
       ▼
Microsoft Azure
├── Azure App Service
├── Azure Storage
├── Azure Monitor
└── Azure Networking

Infrastructure Provisioned Using Terraform
```

---

## Technology Stack

### Frontend

* React
* TypeScript
* TanStack Start
* TanStack Router
* Vite
* Tailwind CSS
* Shadcn UI

### Backend Services

* Supabase Authentication
* Supabase PostgreSQL Database

### Cloud & DevOps

* Microsoft Azure
* Terraform
* GitHub
* CI/CD Ready

---

## Features

### Customer Features

* Online Booking System
* Contact Form
* Service Listing
* Responsive Design

### Admin Features

* Secure Login
* Booking Management
* Order Tracking
* Dashboard Analytics

---

## Local Development Setup

### Clone Repository

```bash
git clone <repository-url>
cd green-eco-drycleaners
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create:

```text
.env.local
```

Example:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### Run Development Server

```bash
npm run dev
```

Application runs on:

```text
http://localhost:3000
```

---

## Build Project

```bash
npm run build
```

---

## Infrastructure Deployment

Infrastructure is managed using Terraform.

### Terraform Components

* Resource Group
* App Service Plan
* Azure App Service
* Storage Resources
* Monitoring Resources

### Deploy Infrastructure

```bash
terraform init
terraform plan
terraform apply
```

---

## Azure Deployment Workflow

```text
GitHub
   │
   ▼
Terraform
   │
   ▼
Azure Infrastructure
   │
   ▼
Application Deployment
   │
   ▼
Production Environment
```

---

## Security

* Environment variables stored securely
* Secrets excluded through .gitignore
* Authentication managed through Supabase
* Infrastructure managed using Infrastructure as Code

---

## Future Enhancements

* Payment Gateway Integration
* Real-Time Order Tracking
* Email Notifications
* SMS Notifications
* Customer Dashboard
* Mobile Application

---

## Author

Abhishek Sharma

B.Tech Computer Science & Engineering

Galgotias University

---

## License

This project is intended for educational, portfolio, and business demonstration purposes.
