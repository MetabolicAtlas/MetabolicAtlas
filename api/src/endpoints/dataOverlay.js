import express from 'express';
import { readFileSync } from 'fs';

const routes = express.Router();

routes.get('/:model', async (req, res) => {
  const { model } = req.params;
  try {
    const indexJson = readFileSync(
      `./dataOverlay/${model}/index.json`,
      'utf8',
    );
    res.json(JSON.parse(indexJson));
  } catch (e) {
    console.error(e.message);
    res.sendStatus(404);
  }
});

routes.get('/:model/:dataType/:filename', async (req, res) => {
  const { model, dataType, filename } = req.params;
  try {
    const dataSourceFile = readFileSync(
      `/project/dataOverlay/${model}/${dataType}/${filename}`,
      'utf8',
    );
    res.setHeader('Content-Type', 'text/tsv');
    res.send(dataSourceFile);
  } catch (e) {
    console.error(e.message);
    res.sendStatus(404);
  }
});

export default routes;
