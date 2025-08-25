import queueServiceFactory from '../../src/services/queueService';
import workerServiceFactory from '../../src/services/workerService';
import dbClientFactory from '../../src/common/db';
import { afterAll, describe, it, jest } from '@jest/globals';
import userRepositoryFactory from '../../src/repositories/userRepository';
import journeyRepositoryFactory from '../../src/repositories/journeyRepository';
import { v4 as uuidv4 } from 'uuid';

describe('workerService', () => {
	let queueService;
	let workerService;
	let dbClient;
	let journeyRepository;
	let userRepository;

	beforeAll(async () => {
		queueService = await queueServiceFactory('queue');
		dbClient = await dbClientFactory('test');
		journeyRepository = {
			create: jest.fn(),
			getById: jest.fn(),
			getActionsListAtOffset: jest.fn(),
		};

		workerService = workerServiceFactory({ queueService, journeyRepository });
		userRepository = userRepositoryFactory(dbClient);
	});

	afterAll(async () => {
		await dbClient.close();
		await queueService.obliterate({ force: true });
		await queueService.close();
	});

	describe('buildJob', () => {
		it('should build a job', async () => {
			const userId = uuidv4();
			const action = {
				type: 'email',
				name: 'Sign up to platforms',
				runsAt: '10:00:00',
			};
			const journeyStartDate = '2025-01-01';
			const expectedJobData = {
				job: {
					jobType: 'action',
					userId,
					type: action.type,
					name: action.name,
				},
				runsAt: new Date('2025-01-02T13:00:00Z'),
			};
			const dayOffset = 1;

			const createdJob = workerService.buildJob({
				journeyStartDate,
				userId,
				dayOffset,
				action,
			});

			expect(createdJob).toEqual(expectedJobData);
		});
	});

	describe('buildTodayJobs', () => {
		it('should build a job', async () => {
			const userId = uuidv4();
			const journeyId = uuidv4();

			const action = {
				type: 'email',
				name: 'Sign up to platforms',
				runsAt: '10:00:00',
			};

			const journeyStartDate = '2025-01-01';

			const expectedJobData = {
				job: {
					jobType: 'action',
					userId,
					type: action.type,
					name: action.name,
				},
				runsAt: new Date('2025-01-02T13:00:00Z'),
			};
			const dayOffset = 1;
			await journeyRepository.create({
				id: journeyId,
				title: 'Test Journey',
				startDate: journeyStartDate,
				actions: [action],
			});

			const mockedWorker = {
				buildTodayJobs: workerService.buildTodayJobs,
				buildJob: jest.fn().mockReturnValue(expectedJobData),
			};

			const createdJob = await mockedWorker.buildTodayJobs({
				journeyId,
				journeyStartDate,
				userId,
				dayOffset,
			});

			console.log('Created Job:', createdJob);

			// expect(createdJob).toEqual(expectedJobData);
		});
	});
});
