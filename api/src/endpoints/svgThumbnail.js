import express from 'express';
import fs from 'fs';
import rateLimit from 'express-rate-limit';
import sanitize from 'sanitize-filename';
import getSvgThumbnail from 'utils/2d-map';
import models from 'data/integratedModels.json';

const VALID_MODELS = models.map(m => m.short_name);

const routes = express.Router();

const limiter = rateLimit({
  windowMs: 1 * 1000, // 1 second
  max: 200, // proteinatlas.org shows max 50 thumbnail images per page
});

function getDimension(dimensionString) {
  const minDim = 100;
  const maxDim = 600;
  if (dimensionString) {
    var myDimension = parseInt(dimensionString) || null;
    if (
      !/^\d+$/.test(dimensionString) ||
      myDimension < minDim ||
      myDimension > maxDim
    ) {
      throw new Error(
        `Invalid dimension provided: ${dimensionString}. The width and/or height parameters should be an integer between ${minDim} and ${maxDim}.`,
      );
    }
  }
  return myDimension || null;
}

routes.get('/:svgName', limiter, async (req, res) => {
  const { svgName } = req.params;
  const { model, version, width, height } = req.query;
  try {
    if (!VALID_MODELS.includes(model)) {
      throw new Error(`Invalid model provided: ${model}.`);
    }
    const svgFile = `/project/svg/${sanitize(model)}/${sanitize(svgName)}.svg`;
    if (!fs.existsSync(svgFile)) {
      throw new Error(`2D map does not exist for ${svgName} in ${model}.`);
    }
    const resizeParams = {
      width: getDimension(width),
      height: getDimension(height),
      fit: 'cover',
    };
    const svgThumbnail = await getSvgThumbnail(svgName, resizeParams, model);
    res.type('png');
    res.send(svgThumbnail);
  } catch (e) {
    if (e.message === '404') {
      return res.sendStatus(404);
    }

    res.status(400).send(escape(e.message));
  }
});

export default routes;
