"use strict";

const { consumerToQueue, consumerToQueueNormal, consumerToQueueFail } = require("./src/services/consumerQueue.service");
const queueName = "test-queue";

// consumerToQueue(queueName)
//   .then(() => {
//     console.log("Consumer started");
//   })
//   .catch((err) => console.log(err));


consumerToQueueNormal().then(() => console.log("Normal Consumer started")).catch((err) => console.log(err));
consumerToQueueFail().then(() => console.log("Hotfix Consumer started")).catch((err) => console.log(err));