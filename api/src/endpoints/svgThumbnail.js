import express from 'express';
import fs from 'fs';
import getSvgThumbnail from 'utils/2d-map';

const routes = express.Router();
const sharp = require('sharp');

routes.get('/:svgName', async (req, res) => {
  const { svgName } = req.params;
  const { model, version, width } = req.query;

  try {
    const min_w = 100;
    const max_w = 600;
    var w_thumb = 400;
    const isnum = /^\d+$/.test(width);
    if (!isnum) {
      res.status(400).send('Error! The value of width should an integer, but \''
        + width + '\' is given!' );
    } else {
      w_thumb =  parseInt(width) || 400;
      if (w_thumb < min_w || w_thumb > max_w){
        res.status(400).send('Error! The value of width should be between '
          + min_w + ' and ' + max_w
          + ' but \'' + width + '\' is given!' );
      }
    }
    const svgThumbnail = await getSvgThumbnail(svgName, w_thumb, model)
    res.type('png')
    res.send(svgThumbnail);
  } catch (e) {
    if (e.message === '404') {
      return res.sendStatus(404);
    }

    res.status(400).send(e.message);
  }
});

export default routes;
