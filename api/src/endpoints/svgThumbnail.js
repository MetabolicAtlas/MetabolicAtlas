import express from 'express';
import fs from 'fs';

const routes = express.Router();
let HPA_JSON = null;

routes.get('/:svgName', async (req, res) => {
  const { svgName } = req.params;
  const { model } = req.query;

  try {
    const svgFile = `/project/svg/${model}/${svgName}.svg`;
    const svg = fs.readFileSync(svgFile, { encoding: 'utf8', flag: 'r' });
    const svgThumbnail = svg;
    res.json(svgThumbnail);
  } catch (e) {
    if (e.message === '404') {
      return res.sendStatus(404);
    }

    res.status(400).send(e.message);
  }
});

export default routes;
