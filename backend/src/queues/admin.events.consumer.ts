// src/queues/admin.events.consumer.ts
import { initAmqp }       from "./amqp";
import { AppDataSource }   from "../database/config/data-source";
import { AdminLog }       from "../models/AdminLog"
import { ConsumeMessage }  from "amqplib";

export async function startAdminConsumer() {
  const ch   = await initAmqp();
  const QUEUE = "admin.events.q";       

  await ch.assertQueue(QUEUE, { durable: true });

  ch.consume(QUEUE, async (msg: ConsumeMessage | null) => {
    if (!msg) return;

    try {
      const { actorId, action, targetId, meta  } = JSON.parse(msg.content.toString());

      await AppDataSource.getRepository(AdminLog).save(
        AppDataSource.getRepository(AdminLog).create({
          actor   : { user_id: actorId } as any,
          action,
          targetId : targetId,
          meta
        })
      );

      ch.ack(msg);
    } catch (err) {
      ch.nack(msg, false, false); 
    }
  });

}
