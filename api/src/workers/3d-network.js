import { Worker } from 'worker_threads'

export default (workerData) => new Promise((resolve, reject) => {
  const worker = new Worker(`
    const { parentPort } = require('worker_threads');
    const populateWithLayout = require('./src/utils/3d-network.js');
    parentPort.once('message',
      data => parentPort.postMessage(populateWithLayout(data)));
  `, { eval: true })
  worker.on('message', result => resolve(result));
  worker.on('error', reject);
  worker.on('exit', (code) => {
    if (code !== 0) {
      reject(new Error(`stopped with  ${code} exit code`));
    }
  })
  worker.postMessage(workerData);
})
