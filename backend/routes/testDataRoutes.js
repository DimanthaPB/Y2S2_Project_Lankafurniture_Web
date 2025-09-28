const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Project = require('../models/Project');
const Transaction = require('../models/Transaction');
const Rating = require('../models/Rating');
const Job = require('../models/job');

// Helper: simple DB status used in responses below
function getDbStatus() {
  const state = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting', 4: 'uninitialized' };
  return {
    status: states[state] || 'unknown',
    database: mongoose.connection?.db?.databaseName || 'default',
  };
}

// Simple database connection test
router.get('/test-db', (req, res) => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    4: 'uninitialized'
  };
  
  // Get list of collections in the test database
  mongoose.connection.db.listCollections().toArray((err, collections) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch collections',
        error: err.message
      });
    }
    
    res.json({
      status: 'success',
      database: {
        name: mongoose.connection?.db?.databaseName || 'test',
        state: states[state] || 'unknown',
        collections: collections.map(c => c.name)
      }
    });
  });
});

// Removed legacy /test-connection route

// Add test project
router.post('/projects', async (req, res) => {
    try {
        console.log('Received project data:', req.body);
        
        const { title, description, status, category } = req.body;
        
        if (!title || !description) {
            console.error('Validation failed: Title and description are required');
            return res.status(400).json({ 
                success: false, 
                message: 'Title and description are required',
                dbStatus: getDbStatus()
            });
        }
        
        const projectData = {
            providerId: req.body.providerId || ('test-provider-' + Math.random().toString(36).substr(2, 9)),
            title: title.trim(),
            description: description.trim(),
            status: status || 'Ongoing',
            category: category || 'General',
            startDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        console.log('Creating project with data:', projectData);
        
        const project = new Project(projectData);
        const savedProject = await project.save();
        
        console.log('Project saved successfully:', savedProject);
        
        res.status(201).json({
            success: true,
            message: 'Test project created successfully',
            data: savedProject,
            dbStatus: getDbStatus()
        });
        
    } catch (error) {
        console.error('Error creating test project:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating test project',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            dbStatus: getDbStatus()
        });
    }
});

// Add test transaction
router.post('/transactions', async (req, res) => {
    try {
        console.log('Received transaction data:', req.body);
        
        const { amount, type, description } = req.body;
        
        if (typeof amount === 'undefined' || !type) {
            console.error('Validation failed: Amount and type are required');
            return res.status(400).json({ 
                success: false, 
                message: 'Amount and type are required',
                dbStatus: getDbStatus()
            });
        }
        
        const amountValue = parseFloat(amount);
        if (isNaN(amountValue) || amountValue < 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be a positive number',
                dbStatus: getDbStatus()
            });
        }
        
        const transactionData = {
            providerId: req.body.providerId || ('test-provider-' + Math.random().toString(36).substr(2, 9)),
            amount: amountValue,
            type: type.toLowerCase(),
            status: 'completed',
            description: description || 'Test transaction',
            date: new Date(),
            reference: 'TXN-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        console.log('Creating transaction with data:', transactionData);
        
        const transaction = new Transaction(transactionData);
        const savedTransaction = await transaction.save();
        
        console.log('Transaction saved successfully:', savedTransaction);
        
        res.status(201).json({
            success: true,
            message: 'Test transaction created successfully',
            data: savedTransaction,
            dbStatus: getDbStatus()
        });
        
    } catch (error) {
        console.error('Error creating test transaction:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating test transaction',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            dbStatus: getDbStatus()
        });
    }
});

// Add test rating
router.post('/ratings', async (req, res) => {
    try {
        console.log('Received rating data:', req.body);
        
        const { rating, comment } = req.body;
        
        // Validate rating
        const ratingValue = parseInt(rating, 10);
        if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
            console.error('Validation failed: Rating must be between 1 and 5');
            return res.status(400).json({ 
                success: false, 
                message: 'Rating must be a number between 1 and 5',
                dbStatus: getDbStatus()
            });
        }
        
        const ratingData = {
            providerId: req.body.providerId || ('test-provider-' + Math.random().toString(36).substr(2, 9)),
            customerId: req.body.customerId || ('test-customer-' + Math.random().toString(36).substr(2, 9)),
            customerName: req.body.customerName || ('Test Customer ' + Math.floor(Math.random() * 1000)),
            rating: ratingValue,
            comment: comment || `Test rating ${ratingValue} stars`,
            date: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        console.log('Creating rating with data:', ratingData);
        
        const newRating = new Rating(ratingData);
        const savedRating = await newRating.save();
        
        console.log('Rating saved successfully:', savedRating);
        
        res.status(201).json({
            success: true,
            message: 'Test rating created successfully',
            data: savedRating,
            dbStatus: getDbStatus()
        });
        
    } catch (error) {
        console.error('Error creating test rating:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating test rating',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            dbStatus: getDbStatus()
        });
    }
});

// Add test job
router.post('/jobs', async (req, res) => {
    try {
        console.log('Received job data:', req.body);
        
        const { title, description, customerName, customerEmail, customerLocation, category, budget } = req.body;
        
        if (!title || !description) {
            console.error('Validation failed: Title and description are required');
            return res.status(400).json({ 
                success: false, 
                message: 'Title and description are required',
                dbStatus: getDbStatus()
            });
        }
        
        const jobData = {
            title: title.trim(),
            description: description.trim(),
            customerName: customerName || ('Test Customer ' + Math.floor(Math.random() * 1000)),
            customerEmail: customerEmail || (`test${Math.floor(Math.random() * 1000)}@example.com`),
            customerLocation: customerLocation || 'Test Location',
            category: category || 'Other',
            status: 'New',
            priority: ['Low', 'Medium', 'High', 'Urgent'][Math.floor(Math.random() * 4)],
            budget: parseFloat(budget) || Math.floor(Math.random() * 1000) + 100,
            skillsRequired: ['Test Skill 1', 'Test Skill 2'],
            providerId: req.body.providerId || ('test-provider-' + Math.random().toString(36).substr(2, 9)),
            postedDate: new Date(),
            startDate: new Date(Date.now() + 86400000), // Tomorrow
            endDate: new Date(Date.now() + 86400000 * 7), // One week from now
            estimatedHours: Math.floor(Math.random() * 40) + 1,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        console.log('Creating job with data:', jobData);
        
        const job = new Job(jobData);
        const savedJob = await job.save();
        
        console.log('Job saved successfully:', savedJob);
        
        res.status(201).json({
            success: true,
            message: 'Test job created successfully',
            data: savedJob,
            dbStatus: getDbStatus()
        });
        
    } catch (error) {
        console.error('Error creating test job:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating test job',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            dbStatus: getDbStatus()
        });
    }
});

module.exports = router;
