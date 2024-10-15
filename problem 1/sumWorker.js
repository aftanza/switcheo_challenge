const { parentPort } = require("worker_threads");

// Using a O(1) function
parentPort.on("message", (n) => {
    const sum = ((1 + n) * n) / 2;
    parentPort.postMessage(sum);
});
