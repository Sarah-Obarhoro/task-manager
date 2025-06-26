const express = require('express');
const { body, param } = require('express-validator');
const tasksController = require('../controllers/tasks');
const { authenticateToken } = require('../middleware/authJwt');

const router = express.Router();

const statusOptions = ['to-do', 'progress', 'done'];

router.use(authenticateToken);

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('status')
      .isIn(statusOptions)
      .withMessage(`Status must be one of: ${statusOptions.join(', ')}`),
    body('details')
      .optional()
      .isString()
      .withMessage('Details must be a string'),
    body('dueDate')
      .optional()
      .isISO8601()
      .toDate()
      .withMessage('dueDate must be a valid date')
  ],
  tasksController.createTask
);

router.get('/', tasksController.getTasks);

router.get(
  '/:id',
  [
    param('id').isInt().withMessage('Task ID must be an integer')
  ],
  tasksController.getTaskById
);

router.put(
  '/:id',
  [
    param('id').isInt().withMessage('Task ID must be an integer'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('status')
      .optional()
      .isIn(statusOptions)
      .withMessage(`Status must be one of: ${statusOptions.join(', ')}`),
    body('details')
      .optional()
      .isString()
      .withMessage('Details must be a string'),
    body('dueDate')
      .optional()
      .isISO8601()
      .toDate()
      .withMessage('dueDate must be a valid date')
  ],
  tasksController.updateTask
);

router.delete(
  '/:id',
  [
    param('id').isInt().withMessage('Task ID must be an integer')
  ],
  tasksController.deleteTask
);

module.exports = router;