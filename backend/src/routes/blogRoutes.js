const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  getBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  getBlogStats,
  getCategories,
  getPopularTags
} = require('../controllers/blogController');

// Public routes
router.get('/', getBlogs);                    // GET /api/blog
router.get('/categories', getCategories);     // GET /api/blog/categories
router.get('/tags', getPopularTags);         // GET /api/blog/tags
router.get('/:slug', getBlogBySlug);         // GET /api/blog/:slug

// Admin routes (protected)
router.post('/', adminMiddleware, createBlog);           // POST /api/blog
router.get('/admin/stats', adminMiddleware, getBlogStats); // GET /api/blog/admin/stats
router.get('/admin/:id', adminMiddleware, getBlogById); // GET /api/blog/admin/:id (for editing)
router.put('/:id', adminMiddleware, updateBlog);         // PUT /api/blog/:id
router.delete('/:id', adminMiddleware, deleteBlog);      // DELETE /api/blog/:id
router.put('/:id/publish', adminMiddleware, publishBlog); // PUT /api/blog/:id/publish

module.exports = router; 