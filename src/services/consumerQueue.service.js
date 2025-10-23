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

      // setTimeout(() => {
      //   channel.consume(notificationQueue, (msg) => {
      //     console.log(
      //       `[x] Received ${msg.content.toString()} - Normal Exchange`
      //     );
      //   }, {
      //     noAck: true
      //   });
      // }, 5000);

      channel.consume(notificationQueue, (msg) => {
        try {
          const test_number = Math.random();
          console.log(test_number);
          if (test_number < 0.8) {
            throw new Error("Error");
          }
          console.log(
            `[x] Received ${msg.content.toString()} - Normal Exchange`
          );
          channel.ack(msg);
        } catch (error) {
          channel.nack(msg, false, false);
          // nack : nagetive ack
          // param 2 : do you want to requeue the message
          // pramm 3 : do you want to reject all the messages
        }
      });
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
        exclusive: false,
      });

      await channel.bindQueue(
        queueResult.queue,
        notificationRExchangeDLX,
        notificationRoutingKeyDLX
      );

      channel.consume(
        queueResult.queue,
        (msg) => {
          console.log(
            `[x] This notification for hotfix ${msg.content.toString()} - Fail Exchange`
          );
        },
        {
          noAck: true,
        }
      );
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = messageService;
