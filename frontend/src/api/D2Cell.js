import axios from 'axios';

const fetchPaper = async paperID => {
  console.log(paperID)
  const { data } = await axios.get(`/d2cell/paper/${paperID}`);
  return data;
};

const fetchGene = async gene => {
  const { data } = await axios.get(`/d2cell/gene/${gene}`);
  return data;
};

const fetchOrganism = async organism => {
  const { data } = await axios.get(`/d2cell/organism/${organism}`);
  return data;
};

const fetchProduct = async product => {
  const { data } = await axios.get(`/d2cell/product/${product}`);
  return data;
};

const search = async searchTerm => {
  const { data } = await axios.get(`/d2cell/search/${searchTerm}`);
  return data;
};

export default {
  fetchPaper,
  fetchGene,
  fetchOrganism,
  fetchProduct,
  search,
};
