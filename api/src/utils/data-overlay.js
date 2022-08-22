import { readFile } from 'fs/promises';
import models from 'data/integratedModels.json';

const VALID_MODELS = models.map(m => m.short_name);

const cachedDataSourceFiles = {};

const getDataSourceFile = async (model, dataType, filename) => {
  const key = `${model}_${dataType}_${filename}`;
  if (cachedDataSourceFiles[key]) {
    return cachedDataSourceFiles[key];
  }

  if (!VALID_MODELS.includes(model)) {
    throw new Error(`Invalid model provided: ${model}.`);
  }

  const folderRegex = /^([a-zA-Z0-9][^*/><?\"|:]*)$/;
  if (!dataType.match(folderRegex)) {
    throw new Error(`Invalid data type provided: ${dataType}.`);
  }

  const fileRegex = /^[\w\-. ]+\.tsv$/i;
  if (!filename.match(fileRegex)) {
    throw new Error(`Invalid filename provided: ${filename}.`);
  }

  const dataSourceFile = await readFile(
    `./dataOverlay/${model}/${dataType}/${filename}`,
    'utf8'
  );

  cachedDataSourceFiles[key] = dataSourceFile;
  return dataSourceFile;
};

export { getDataSourceFile, VALID_MODELS };
