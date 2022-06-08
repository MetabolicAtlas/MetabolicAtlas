import express from 'express';
import { getReaction } from 'enzymeDb/index';

const enzymeDbRoutes = express.Router();

enzymeDbRoutes.get('/reaction/:id', async (req, res) => {
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

export default enzymeDbRoutes;
