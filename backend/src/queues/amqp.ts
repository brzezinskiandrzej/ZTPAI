// src/queues/amqp.ts
import amqp from "amqplib";

const RABBIT_URL = process.env.RABBIT_URL ?? "amqp://localhost";

let channel: amqp.Channel | null = null;

export async function initAmqp(): Promise<amqp.Channel> {
  if (channel) return channel;

  const conn = await amqp.connect(RABBIT_URL);


  channel = await conn.createChannel();

  conn.on("close", () => {
    channel = null;
  });

  return channel;
}

export const getChannel = initAmqp;
