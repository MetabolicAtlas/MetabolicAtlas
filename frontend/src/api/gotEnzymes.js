import axios from 'axios';

const fetchReaction = async keggId => {
  const { data } = await axios.get(`/gotenzymes/reactions/${keggId}`);
  return data;
};

const fetchCompound = async keggId => {
  const { data } = await axios.get(`/gotenzymes/compounds/${keggId}`);
  return data;
};

const fetchEC = async ecValue => {
  const { data } = await axios.get(`/gotenzymes/ecs/${ecValue}`);
  return data;
};

const createQueryString = params => {
  const parts = [];

  Object.entries(params).forEach(([key, obj]) => {
    Object.entries(obj).forEach(([childKey, v]) => {
      parts.push(`${key}[${childKey}]=${encodeURIComponent(v)}`);
    });
  });

  return `?${parts.join('&')}`;
};

const fetchEnzymes = async params => {
  const queryString = createQueryString(params);

  const { data } = await axios.get(`/gotenzymes/enzymes${queryString}`);
  return data;
};

export default { fetchReaction, fetchCompound, fetchEC, fetchEnzymes };
