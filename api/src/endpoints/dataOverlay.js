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

routes.get('/:dataType/example', async (req, res) => {
  const { dataType } = req.params;
  try {
    let exampleFile = '';
    switch (dataType) {
      case 'genes':
        exampleFile =
          'id\theart\tliver\n' +
          'ENSG00000177666\t0.484\t0.349\n' +
          'ENSG00000175535\t0.564\t0\n' +
          'ENSG00000187021\t0.114\t0';
        break;
      case 'reactions':
        exampleFile =
          'id\tadipose\ttissue_t-cells_9\n' +
          'MAR03905\t0.484\t0.349\n' +
          'MAR03907\t0.564\t0\n' +
          'MAR04097\t0.114\t0';
        break;
      default:
        res.sendStatus(404);
    }

    res.set('Content-Type', 'text/tab-separated-values');
    res.set(
      'Content-Disposition',
      `attachment; filename=${dataType}-example.tsv`
    );
    res.send(exampleFile);
  } catch (e) {
    console.error(e.message);
    res.sendStatus(404);
  }
});

export default routes;
