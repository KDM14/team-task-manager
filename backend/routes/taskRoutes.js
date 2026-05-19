const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// Get all tasks
router.get('/', requireAuth, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        project: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true, email: true } }
      }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create task (Admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { title, description, projectId, assignedToId, dueDate, status } = req.body;
  if (!title || !projectId) return res.status(400).json({ error: 'Title and projectId are required' });

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assignedToId: assignedToId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: status || 'TODO'
      }
    });
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update task status or assignment
router.put('/:id', requireAuth, async (req, res) => {
  const { title, description, status, assignedToId, dueDate } = req.body;
  try {
    const existingTask = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!existingTask) return res.status(404).json({ error: 'Task not found' });

    // Members can only update status of their assigned tasks, or admin can update anything
    if (req.user.role !== 'ADMIN') {
      if (existingTask.assignedToId !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden: Can only update your own tasks' });
      }
      // Members can only update status
      const updatedTask = await prisma.task.update({
        where: { id: req.params.id },
        data: { status }
      });
      return res.json(updatedTask);
    }

    // Admin update
    const updatedTask = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        status,
        assignedToId: assignedToId || null,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete task (Admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
