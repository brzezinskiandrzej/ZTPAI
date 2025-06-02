// src/queues/index.ts
import { getChannel } from "./amqp";

export async function initQueues() {
  const ch = await getChannel();


  await ch.assertExchange("admin.events", "fanout", { durable: true });
  await ch.assertQueue   ("admin.events.q",         { durable: true });
  await ch.bindQueue     ("admin.events.q", "admin.events", "");

  
}
