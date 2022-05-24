import axios from 'axios';

const searchReferences = async queryIds => {
  const { data } = await axios.get(
    `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${queryIds}&resultType=core&format=json`
  );

  return data.resultList.result;
};

export default { searchReferences };
