import express from 'express';
import { getCompound, getEc, getReaction, getEnzymes } from 'enzymeDb/index';

const enzymeDbRoutes = express.Router();

enzymeDbRoutes.get('/compounds/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const compound = await getCompound(id);
    if (compound) {
      res.json(compound);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

enzymeDbRoutes.get('/ecs/:value', async (req, res) => {
  const { value } = req.params;

  try {
    const ec = await getEc(value);
    if (ec) {
      res.json(ec);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

enzymeDbRoutes.get('/reactions/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const reaction = await getReaction(id);
    if (reaction) {
      res.json(reaction);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

enzymeDbRoutes.get('/enzymes', async (req, res) => {
  const { filters, pagination } = req.query;

  try {
    const enzymes = await getEnzymes({ filters, pagination });
    if (enzymes) {
      res.json(enzymes);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export default enzymeDbRoutes;
