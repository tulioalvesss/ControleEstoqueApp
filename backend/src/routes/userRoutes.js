const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  getUsers,
  updateUser,
  deleteUser,
  getUserById
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Rotas públicas
router.post('/register', register);
router.post('/login', login);

// Rotas protegidas
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Novas rotas
router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, authorize('admin'), getUserById);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
