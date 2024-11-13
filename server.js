import app from './app.js';
import { connectDB } from './config/database.js';
import express from 'express';
import http from 'http';

connectDB();

// Create HTTP server

// Initialize Socket.IO
