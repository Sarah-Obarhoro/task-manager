const { validationResult } = require('express-validator');
const Task = require('../models/taskModel');

exports.createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       const details = errors.array().map(e => ({
          field: e.param,
          message: e.msg
       }));
       const error = new Error('Validation failed');
       error.status = 400;
       error.details = details;
       return next(error);
    }

    const { title, status, details, dueDate } = req.body;
    const userId = req.user.id;

    const newTask = await Task.create({ userId, title, status, details, dueDate });
    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.findAllByUser(userId);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const task = await Task.findById(taskId, userId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       const details = errors.array().map(e => ({
          field: e.param,
          message: e.msg
       }));
       const error = new Error('Validation failed');
       error.status = 400;
       error.details = details;
       return next(error);
    }

    const taskId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const { title, status, details, dueDate } = req.body;

    const updated = await Task.update(taskId, userId, { title, status, details, dueDate });
    if (!updated) {
      return res.status(404).json({ message: 'Task not found or no changes' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const deleted = await Task.delete(taskId, userId);

    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted', id: deleted.id });
  } catch (err) {
    next(err);
  }
};