import { initAmqp } from "./amqp";

const EXCHANGE = "admin.events";

/**
 *
 * @param actorId  
 * @param action    
 * @param targetId  
 */
export async function publishAdminEvent(
  actorId: number,
  action:  string,
  targetId: number | null = null,
  meta:    Record<string, any> | null = null
){
  const ch = await initAmqp();
  const payload = JSON.stringify({ actorId, action, targetId, meta });
  ch.publish("admin.events", "", Buffer.from(payload), { persistent: true });
}
