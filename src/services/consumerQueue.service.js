"use strict";

const { connectToRabbitMQ, consumerQueue } = require("../dbs/init.rabbit");

const messageService = {
  consumerToQueue: async () => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      await consumerQueue(channel, "test-queue");
    } catch (error) {
      console.error(error);
    }
  },

  consumerToQueueNormal: async () => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const notificationQueue = "notification-queue";

      setTimeout(() => {
        channel.consume(notificationQueue, (msg) => {
          console.log(
            `[x] Received ${msg.content.toString()} - Normal Exchange`
          );
        }, {
          noAck: true
        });
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  },

  consumerToQueueFail: async () => {
    try {
      const { channel, connection } = await connectToRabbitMQ();

      const notificationRExchangeDLX = "notification-exchange-dlx";
      const notificationRoutingKeyDLX = "notification_routing_key_dlx";
      const notificationHandlerQueue = "notification-handler-queue";

      await channel.assertExchange(notificationRExchangeDLX, "direct", {
        durable: true,
      });

      const queueResult = await channel.assertQueue(notificationHandlerQueue, {
        exclusive: false
      });

      await channel.bindQueue(queueResult.queue, notificationRExchangeDLX, notificationRoutingKeyDLX);

      channel.consume(queueResult.queue, (msg) => {
        console.log(`[x] This notification for hotfix ${msg.content.toString()} - Fail Exchange`);
      }, {
        noAck: true
      });
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = messageService;
