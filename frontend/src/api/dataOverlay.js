import axios from 'axios';

const fetchIndex = async (model) => {
  const { data } = await axios.get(`/data-overlay/${model}`);
  return data;
};

const fetchFile = async ({ model, type, filename }) => {
  const { data } = await axios.get(
    `/data-overlay/${model}/${type}/${filename}`,
  );
  return data;
};

export default { fetchIndex, fetchFile };
