import axios from 'axios';

const fetchIndex = async model => {
  const { data } = await axios.get(`/data-overlay/${model}`);
  return data;
};

const fetchFile = async ({ model, type, filename }) => {
  const { data } = await axios.get(`/data-overlay/${model}/${type}/${filename}`);
  return new Blob([data]);
};

const fetchDataSets = async ({ model, type, filename }) => {
  const { data } = await axios.get(`/data-overlay/${model}/${type}/${filename}/data-sets`);
  return data;
};

const fetchDataSet = async ({ model, type, filename, dataSet }) => {
  const { data } = await axios.get(
    `/data-overlay/${model}/${type}/${filename}/data-sets/${dataSet}`,
  );
  return data;
};

export default { fetchIndex, fetchFile, fetchDataSets, fetchDataSet };
