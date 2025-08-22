import redisConfig from "../../config/redisConfig";
import Bull from "bull";

export async function queueServiceFactory(queueName) {
  const queue = new Bull(queueName, {
    redis: redisConfig,
  });

  await queue.isReady();
  return queue;
}

export default queueServiceFactory;
