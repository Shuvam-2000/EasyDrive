# 🚗 Car Rental Application – Backend

## 📌 Overview

This is the **backend service** for the Car Rental Application. The system follows an **RBAC (Role-Based Access Control)** architecture with a **separate backend**, a **customer-facing frontend**, and an **owner portal**.

The backend provides APIs for **customer operations, owner operations, car rentals, payments, and AI-powered features**. It is built for scalability, security, and seamless integration with third-party services.

---

## ✨ Features

### 🗂 Models

* **Customers** – Manage authentication and booking history
* **Cars** – Store car details, availability, and rental information
* **Owners** – Manage car registrations and status updates
* **Rentals** – Track booking details, payments, and rental status

---

### 🎮 Controllers

#### 🔹 Customer-Side Features

* **Authentication** – Login & Signup for customers
* **Car Management**

  * Fetch all cars
  * Get car by ID
  * Find cars by location
* **Rentals & Payments**

  * Rent a car
  * Pay online with **Razorpay** (with payment verification)
  * Pay offline later (Cash on Delivery equivalent)
  * Get booking info
* **AI Features**

  * Get **relevant car recommendations** based on car details

#### 🔹 Owner-Side Features

* **Authentication** – Login & Signup for owners
* **Car Management**

  * Register a car
  * Delete a registered car
  * Get all cars registered by owner
  * Update car availability status
* **Rental Management**

  * Update booked car status
* **AI Features**

  * Generate a **short description automatically** while registering a car

---

### 🔒 Middleware

* **Customer Authentication Middleware** – Protects customer-only routes
* **Owner Authentication Middleware** – Protects owner-only routes

---

## 🛠 Tech Stack

* **Node.js** – Backend runtime environment
* **Express.js** – Web framework for APIs
* **MongoDB** – Database for storing users, cars, and rentals
* **ImageKit** – For car image uploads & optimization
* **Razorpay** – Payment gateway for secure online transactions
* **Google Gemini API** – AI features (car recommendations & description generation)

---

## 🚀 Summary

The backend powers the **Car Rental Application** with **secure authentication**, **separate role-based access**, **AI-powered features**, and **online/offline payment handling**. It serves as the foundation for the customer-facing frontend and the owner portal.

