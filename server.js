"use strict";

const { consumerToQueue, consumerToQueueNormal, consumerToQueueFail } = require("./src/services/consumerQueue.service");
const queueName = "test-queue";

// consumerToQueue(queueName)
//   .then(() => {
//     console.log("Consumer started");
//   })
//   .catch((err) => console.log(err));


consumerToQueueNormal().then(() => console.log("Consumer started - normal")).catch((err) => console.log(err));
consumerToQueueFail().then(() => console.log("Consumer started fail")).catch((err) => console.log(err));