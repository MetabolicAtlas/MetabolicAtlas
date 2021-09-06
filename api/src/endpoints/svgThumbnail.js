import express from 'express';
import fs from 'fs';
import getSvgThumbnail from 'utils/2d-map';

const routes = express.Router();
const sharp = require('sharp');
let HPA_JSON = null;

routes.get('/:svgName', async (req, res) => {
  const { svgName } = req.params;
  const { model } = req.query;

  try {
    const svgThumbnail = await getSvgThumbnail(svgName, model)
    res.send(svgThumbnail);
  } catch (e) {
    if (e.message === '404') {
      return res.sendStatus(404);
    }

    res.status(400).send(e.message);
  }
});

export default routes;
