import express from 'express';
import getSvgThumbnail from 'utils/2d-map';
import models from 'data/integratedModels.json';

const VALID_MODELS = models.map((m) => m.short_name);

const routes = express.Router();

routes.get('/:svgName', async (req, res) => {
  const { svgName } = req.params;
  const { model, version, width } = req.query;

  try {
    if (!VALID_MODELS.includes(model)) {
      throw new Error(`Invalid model provided: ${model}.`);
    }

    const min_w = 100;
    const max_w = 600;
    var w_thumb = 400;
    const isnum = /^\d+$/.test(width);
    if (!isnum) {
      throw new Error(`Invalid width provided: ${width}. It should be an integer between ${min_w} and ${max_w}.`);
    } else {
      w_thumb =  parseInt(width);
      if (w_thumb < min_w || w_thumb > max_w){
        throw new Error(`Invalid width provided: ${width}. It should be between ${min_w} and ${max_w}.`);
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
