CREATE DATABASE IF NOT EXISTS aidocs4u;
USE aidocs4u;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  subscription_tier ENUM('free', 'pro', 'enterprise') DEFAULT 'free'
);

CREATE INDEX idx_email ON users(email);