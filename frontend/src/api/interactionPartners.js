import axios from 'axios';

const fetchInteractionPartners = async ({ id, model, version }) => {
  const params = { model, version };
  const { data } = await axios.get(`/interaction-partners/${id}`, { params });
  return { result: data.result, network: data.network };
};

const fetchInteractionPartnersExpansion = async ({ id, model, version, expanded }) => {
  const params = { model, version, expanded };
  const { data } = await axios.get(`/interaction-partners-expansion/${id}`, { params });
  return { result: data.result, network: data.network };
};

export default { fetchInteractionPartners, fetchInteractionPartnersExpansion };
