import express from 'express';
import gemsRepoJson from 'data/gemsRepository.json';
import integratedGemsRepoJson from 'data/integratedModels.json';
import {
  getGeneCount,
  getReactionCount,
  getMetaboliteCount,
} from 'neo4j/index';

const routes = express.Router();

const addCountToModel = async (model) => {
  const { apiName, apiVersion } = model;

  const [gene_count, reaction_count, metabolite_count] = await Promise.all([
    getGeneCount(apiName, apiVersion),
    getReactionCount(apiName, apiVersion),
    getMetaboliteCount(apiName, apiVersion),
  ]);

  return {
    ...model,
    gene_count,
    reaction_count,
    metabolite_count,
  };
};

routes.get('/integrated_models', async (req, res) => {
  try {
    const models = integratedGemsRepoJson.map(model => ({
      ...model,
      apiName: model.short_name.split('-').map(s => s[0] + s.slice(1).toLowerCase()).join(''),
      apiVersion: model.version.split('.').join('_'),
    }));

    const modelsWithCount = await Promise.all(models.map(m => addCountToModel(m)));
    res.json(modelsWithCount);
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
