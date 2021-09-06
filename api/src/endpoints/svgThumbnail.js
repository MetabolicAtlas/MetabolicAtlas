import express from 'express';
import fs from 'fs';

const routes = express.Router();
const sharp = require('sharp');
let HPA_JSON = null;

routes.get('/:svgName', async (req, res) => {
  const { svgName } = req.params;
  const { model } = req.query;

  try {
    const svgFile = `/project/svg/${model}/${svgName}.svg`;
    var svgThumbnail
    await sharp(svgFile)
      .resize(400)
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .png()
      .toBuffer()
      .then(function(info) {
        svgThumbnail = info
      })
      .catch(function(err) {
        console.log(err)
      })
    res.send(svgThumbnail);
  } catch (e) {
    if (e.message === '404') {
      return res.sendStatus(404);
    }

    res.status(400).send(e.message);
  }
});

export default routes;
