import axios from 'axios';

const fetchInteractionPartners = async ({ id, model, version }) => {
  const params = { model, version };
  const { data } = await axios.get(`/interaction-partners/${id}`, { params });
  return { result: data.result, network: data.network };
};

export default { fetchInteractionPartners };
