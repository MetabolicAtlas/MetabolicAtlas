import axios from 'axios';

const fetchRandomComponents = async ({ model, version, componentTypes }) => {
  const params = { model, version };

  if (componentTypes) {
    params.componentTypes = JSON.stringify(componentTypes);
  }

  const { data } = await axios.get('/random-components', { params });
  return data;
};

export default { fetchRandomComponents };
