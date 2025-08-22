import { getUTCDate } from "../../common/utils";

const workerServiceFactory = ({ queueService, journeyRepository }) => {
  const workerService = {
    async buildJob({ journeyStartDate, userId, dayOffset, action }) {
      const { runsAt, ...remainingActionData } = action;

      let baseDate = getUTCDate(`${journeyStartDate}T${runsAt}`);
      baseDate = baseDate.setUTCDate(baseDate.getUTCDate() + dayOffset);

      return {
        job: {
          jobType: "action",
          userId,
          ...remainingActionData,
        },
        runsAt: baseDate,
      };
    },

    async buildTodayJobs({ journeyId, userId, journeyStartDate, dayOffset }) {
      const actions = await journeyRepository.getActionListAt({
        journeyId,
        journeyStartDate,
        dayOffset,
      });

      return await Promise.all(
        actions.map((action) =>
          this.buildJob({
            userId,
            journeyStartDate,
            dayOffset,
            action,
          })
        )
      );
    },
    async processJob(job) {
      if (job.jobType === "day") {
        const jobs = await this.buildTodayJobs({
          journeyId: job.journeyId,
          userId: job.userId,
          journeyStartDate: job.journeyStartDate,
          dayOffset: job.dayOffset,
        });

        queueService.addBulk(jobs);

        const { dayOffset, ...jobData } = job;
        await queueService.add({
          ...jobData,
          dayOffset: dayOffset + 1,
        });
      }
    },
  };

  queueService.process(workerService.processJob);
  return;
};

export default workerServiceFactory;
