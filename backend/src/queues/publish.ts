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
  action: "BAN" | "UNBAN" | string,
  targetId: number
): Promise<void> {
  const ch = await initAmqp();

  const payload = {
    actorId,
    action,
    targetId,
    ts: Date.now()
  };

  ch.publish(
    EXCHANGE,
    "",                                      
    Buffer.from(JSON.stringify(payload)),      
    { persistent: true }
  );
}
