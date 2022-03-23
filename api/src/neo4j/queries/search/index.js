import { modelSearch } from 'neo4j/queries/search/modelSearch';
import { globalSearch } from 'neo4j/queries/search/globalSearch';

const search = async params =>
  params.model ? modelSearch(params) : globalSearch(params);

export { search };
