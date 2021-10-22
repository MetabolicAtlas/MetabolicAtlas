import express from 'express';
import gemsRepoJson from 'data/gemsRepository.json';
import integratedGemsRepoJson from 'data/integratedModels.json';
import {
  getGeneCount,
  getReactionCount,
  getMetaboliteCount,
} from 'neo4j/index';

const routes = express.Router();

routes.get('/integrated_models', async (req, res) => {
  try {
    const models = integratedGemsRepoJson.map(model => ({
      ...model,
      apiName: model.short_name.split('-').map(s => s[0] + s.slice(1).toLowerCase()).join(''),
      apiVersion: model.version.split('.').join('_'),
    }));

    for ( const model of models ){
      model.gene_count = await getGeneCount(model.apiName, model.apiVersion);
      model.reaction_count = await getReactionCount(model.apiName, model.apiVersion);
      model.metabolite_count = await getMetaboliteCount(model.apiName, model.apiVersion);
    }

    res.json(models);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

routes.get('/integrated_models/:name', async (req, res) => {
  const { name } = req.params;

  try {
    const gem = integratedGemsRepoJson.filter(g => g.short_name.toLowerCase() === name.toLowerCase())[0];
    if (!!gem) {
      res.json(gem);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

routes.get('/models', async (req, res) => {
  try {
    res.json(gemsRepoJson);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

routes.use('/models', express.static('repository'));

export default routes;
