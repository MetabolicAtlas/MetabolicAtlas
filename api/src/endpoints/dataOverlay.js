import express from 'express';
import { readFile } from 'fs/promises';
import models from 'data/integratedModels.json';

const VALID_MODELS = models.map((m) => m.short_name);

const routes = express.Router();

routes.get('/:model', async (req, res) => {
  const { model } = req.params;
  try {
    if (!VALID_MODELS.includes(model)) {
      throw new Error(`Invalid model provided: ${model}.`);
    }

    const indexJson = await readFile(
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
    if (!VALID_MODELS.includes(model)) {
      throw new Error(`Invalid model provided: ${model}.`);
    }

    const folderRegex = /^([a-zA-Z0-9][^*/><?\"|:]*)$/;
    if (!dataType.match(folderRegex)) {
      throw new Error(`Invalid data type provided: ${dataType}.`);
    }

    const fileRegex = /^[\w\-. ]+\.tsv$/i;
    if (!filename.match(fileRegex)) {
      throw new Error(`Invalid filename provided: ${filename}.`);
    }

    const dataSourceFile = await readFile(
      `./dataOverlay/${model}/${dataType}/${filename}`,
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
