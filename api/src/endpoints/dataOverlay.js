import express from 'express';
import { readFile } from 'fs/promises';
import { getDataSourceFile, VALID_MODELS } from 'utils/data-overlay';

const routes = express.Router();

routes.get('/:model', async (req, res) => {
  const { model } = req.params;
  try {
    if (!VALID_MODELS.includes(model)) {
      throw new Error(`Invalid model provided: ${model}.`);
    }

    const indexJson = await readFile(
      `./dataOverlay/${model}/index.json`,
      'utf8'
    );
    res.json(JSON.parse(indexJson));
  } catch (e) {
    if (e.code === 'ENOENT') {
      res.json({});
    } else {
      console.error(e.message);
      res.sendStatus(404);
    }
  }
});

routes.get('/:model/:dataType/:filename/data-sets', async (req, res) => {
  const { model, dataType, filename } = req.params;
  try {
    const dataSourceFile = await getDataSourceFile(model, dataType, filename);
    const [, ...dataSets] = dataSourceFile.split(/\r?\n/)[0].split('\t');

    res.json(dataSets);
  } catch (e) {
    console.error(e.message);
    res.sendStatus(404);
  }
});

routes.get(
  '/:model/:dataType/:filename/data-sets/:dataSetName',
  async (req, res) => {
    const { model, dataType, filename, dataSetName } = req.params;
    try {
      const dataSourceFile = await getDataSourceFile(model, dataType, filename);

      const lines = dataSourceFile.split(/\r?\n/);
      const header = lines[0].split('\t');
      const dataSetIndex = header.indexOf(dataSetName);
      const [, ...dataSets] = header;

      const values = {};
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].split('\t');
        const value = line[dataSetIndex];
        values[line[0]] = value;
      }
      res.json(values);
    } catch (e) {
      console.error(e.message);
      res.sendStatus(404);
    }
  }
);

// Currently used to serve these two files:
// - /api/v2/data-overlay/Human-GEM/reaction/HPA_single-cell_reactions.tsv/raw-data-sets
// - /api/v2/data-overlay/Human-GEM/gene/hpaRna.tsv/raw-data-sets
routes.get('/:model/:dataType/:filename/raw-data-sets', async (req, res) => {
  const { model, dataType, filename } = req.params;
  try {
    const dataSourceFile = await getDataSourceFile(model, dataType, filename);
    res.set('Content-Type', 'text/tab-separated-values');
    res.set('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(dataSourceFile);
  } catch (e) {
    console.error(e.message);
    res.sendStatus(404);
  }
});

export default routes;
