import axios from 'axios';

const fetchGems = async () => {
  const { data } = await axios.get('repository/models/');
  return data;
};

export default { fetchGems };
