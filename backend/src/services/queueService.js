import redisConfig from '../config/redisConfig';
import Bull from 'bull';

export async function queueServiceFactory(queueName) {
	try {
		const queue = new Bull(queueName, {
			redis: redisConfig,
		});

		await queue.isReady();
		console.log(`Queue "${queueName}" is ready.`);
		return queue;
	} catch (error) {
		console.error('Error creating queue service:', error);
		throw error;
	}
}

export default queueServiceFactory;
