import neo4j from 'neo4j-driver';

const uri = 'bolt://neo4j';
// To access on host computer (i.e. outside Docker container) use below uri
// const uri = 'bolt://127.0.0.1:7687';

const driver = neo4j.driver(
  uri,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD),
  { disableLosslessIntegers: true }
);
// https://github.com/neo4j/neo4j-javascript-driver#enabling-native-numbers

process.on('exit', async () => {
  await driver.close();
});

export default driver;
