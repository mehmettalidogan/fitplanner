const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  updateUser,
  toggleUserStatus,
  deleteUser,
  getSystemInfo
} = require('../controllers/adminController');

// All routes require admin privileges
router.use(adminMiddleware);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);      // GET /api/admin/dashboard/stats

// User Management
router.get('/users', getAllUsers);                      // GET /api/admin/users
router.get('/users/:userId', getUserDetails);           // GET /api/admin/users/:userId
router.put('/users/:userId', updateUser);               // PUT /api/admin/users/:userId
router.patch('/users/:userId/toggle', toggleUserStatus); // PATCH /api/admin/users/:userId/toggle
router.delete('/users/:userId', deleteUser);            // DELETE /api/admin/users/:userId

// System
router.get('/system/info', getSystemInfo);              // GET /api/admin/system/info

module.exports = router; 