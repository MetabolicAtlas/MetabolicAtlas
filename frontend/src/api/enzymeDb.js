import axios from 'axios';

const fetchReaction = async reactionId => {
  const { data } = await axios.get(`/enzymedb/reactions/${reactionId}`);
  return data;
};

export default { fetchReaction };
