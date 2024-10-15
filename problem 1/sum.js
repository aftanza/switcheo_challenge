// IMPORTANT: Assuming this input will always produce a result lesser than Number.MAX_SAFE_INTEGER.

let sum_to_n_a = function (n) {
    return ((1 + n) * n) / 2;
    // Complexity of O(1).
};

let sum_to_n_b = function (n) {
    if (n == 1) return 1;
    return n + sum_to_n_b(n - 1);
    // Complexity of O(n). Need big space as well. Not reccommended.
};

const { Worker } = require("worker_threads");
const path = require("path");
let sum_to_n_c = function (n) {
    // Offload it to another thread. This function itself is O(1).
    // The worker function is also O(1). Total complexity is O(1).

    return new Promise((resolve, reject) => {
        const sumWorker = new Worker(path.resolve(__dirname, "sumWorker.js"));
        sumWorker.postMessage(n);
        sumWorker.on("message", (result) => {
            resolve(result);
            // Garbage collect
            sumWorker.terminate();
        });
        sumWorker.on("error", (err) => {
            reject(err);
        });

        sumWorker.on("exit", (code) => {
            if (code !== 0) {
                reject(new Error(`Exit code: ${code}`));
            }
        });
    });
};

let num = 22;
console.log("Sum a: ", sum_to_n_a(num));
console.log("Sum b: ", sum_to_n_b(num));
sum_to_n_c(num).then((res) => console.log("Sum c: ", res));
