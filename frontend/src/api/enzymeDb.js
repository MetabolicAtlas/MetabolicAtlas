import axios from 'axios';

const fetchReaction = async reactionId => {
  const { data } = await axios.get(`/enzymedb/reactions/${reactionId}`);
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

  const { data } = await axios.get(`/enzymedb/enzymes${queryString}`);
  return data;
};

export default { fetchReaction, fetchEnzymes };
