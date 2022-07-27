import axios from 'axios';

const fetchCompound = async keggId => {
  const { data } = await axios.get(`/gotenzymes/compounds/${keggId}`);
  return data;
};

const fetchDomain = async keggId => {
  const { data } = await axios.get(`/gotenzymes/domains/${keggId}`);
  return data;
};

const fetchEC = async ecValue => {
  const { data } = await axios.get(`/gotenzymes/ecs/${ecValue}`);
  return data;
};

const fetchGene = async keggId => {
  const { data } = await axios.get(`/gotenzymes/genes/${keggId}`);
  return data;
};

const fetchOrganism = async keggId => {
  const { data } = await axios.get(`/gotenzymes/organisms/${keggId}`);
  return data;
};

const fetchReaction = async keggId => {
  const { data } = await axios.get(`/gotenzymes/reactions/${keggId}`);
  return data;
};

const createQueryString = params => {
  const parts = [];

  Object.entries(params).forEach(([key, obj]) => {
    Object.entries(obj).forEach(([childKey, v]) => {
      const value = typeof v === 'object' ? JSON.stringify(v) : v;
      parts.push(`${key}[${childKey}]=${encodeURIComponent(value)}`);
    });
  });

  return `?${parts.join('&')}`;
};

const fetchEnzymes = async params => {
  const queryString = createQueryString(params);

  const { data } = await axios.get(`/gotenzymes/enzymes${queryString}`);
  return data;
};

const search = async searchTerm => {
  const { data } = await axios.get(`/gotenzymes/search/${searchTerm}`);
  return data;
};

export default { fetchCompound, fetchDomain, fetchGene, fetchEC, fetchEnzymes, fetchReaction, fetchOrganism, search };
