import express from 'express';
import { getCompound, getEc, getReaction, getEnzymes } from 'gotEnzymes/index';

const gotEnzymesRoutes = express.Router();

gotEnzymesRoutes.get('/compounds/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const compound = await getCompound(id);
    if (compound) {
      res.json(compound);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    console.error(e.message);
    res.sendStatus(500);
  }
});

gotEnzymesRoutes.get('/ecs/:value', async (req, res) => {
  const { value } = req.params;

  try {
    const ec = await getEc(value);
    if (ec) {
      res.json(ec);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    console.error(e.message);
    res.sendStatus(500);
  }
});

gotEnzymesRoutes.get('/reactions/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const reaction = await getReaction(id);
    if (reaction) {
      res.json(reaction);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    console.error(e.message);
    res.sendStatus(500);
  }
});

gotEnzymesRoutes.get('/enzymes', async (req, res) => {
  const { filters, pagination } = req.query;

  try {
    const enzymes = await getEnzymes({ filters, pagination });
    res.json(enzymes);
  } catch (e) {
    console.error(e.message);
    res.sendStatus(500);
  }
});

export default gotEnzymesRoutes;
