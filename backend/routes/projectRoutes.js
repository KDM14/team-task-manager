const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// Get all projects
router.get('/', requireAuth, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        tasks: true
      }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single project
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        tasks: {
          include: {
            assignedTo: { select: { id: true, name: true, email: true } }
          }
        }
      }
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create project (Admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const project = await prisma.project.create({
      data: { name, description }
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project (Admin only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { name, description } = req.body;
  try {
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { name, description }
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete project (Admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
