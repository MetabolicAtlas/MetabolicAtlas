import { Worker } from 'worker_threads';

// The purpose of this worker is to wrap a potentially long running
// process of generating 3D networks in a new thread so it does not
// block the main thread, which is responsible for accepting other
// requests and should ideally respond as quickly as possible.

export default workerData =>
  new Promise((resolve, reject) => {
    // Create a Worker thread that waits for a message that inclues
    // an object of the shape `{ nodes, links }`. Once received, it
    // generates the 3D network layout and replies to the main thread.
    const worker = new Worker(
      `
    const { parentPort } = require('worker_threads');
    const populateWithLayout = require('./src/utils/3d-network.js');
    parentPort.once('message',
      data => parentPort.postMessage(populateWithLayout(data)));
  `,
      { eval: true }
    );
    worker.on('message', result => resolve(result));
    worker.on('error', reject);
    worker.on('exit', code => {
      if (code !== 0) {
        reject(new Error(`stopped with  ${code} exit code`));
      }
    });

    // Once the worker is created and setup. Post a message to it
    // from the main thread.
    worker.postMessage(workerData);
  });
