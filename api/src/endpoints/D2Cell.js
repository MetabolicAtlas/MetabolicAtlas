import express from 'express';
import {
    getDoiDataFromDB,
    getGeneDataFromDB,
    getOrganismDataFromDB,
    getProductDataFromDB,
    search,
} from 'D2Cell/index';

const D2CellRoutes = express.Router();

D2CellRoutes.get('/paper/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const paper_info = await getDoiDataFromDB(id);
        res.json(paper_info);
    } catch (e) {
        console.error(e.message);
        res.sendStatus(404);
    }
});

D2CellRoutes.get('/gene/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const gene = await getGeneDataFromDB(name);
        res.json(gene);
    } catch (e) {
        console.error(e.message);
        res.sendStatus(404);
    }
});

D2CellRoutes.get('/organism/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const organism = await getOrganismDataFromDB(name);
        res.json(organism);
    } catch (e) {
        console.error(e.message);
        res.sendStatus(404);
    }
});

D2CellRoutes.get('/product/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const product = await getProductDataFromDB(name);
        res.json(product);
    } catch (e) {
        console.error(e.message);
        res.sendStatus(404);
    }
});

D2CellRoutes.get('/search/:term', async (req, res) => {
    const { term } = req.params;

    try {
      const results = await search(term);
      res.json(results);
    } catch (e) {
      console.error(e.message);
      res.sendStatus(400);
    }
});

export default D2CellRoutes;
