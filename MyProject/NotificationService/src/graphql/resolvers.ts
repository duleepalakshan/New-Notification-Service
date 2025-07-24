import { AppDataSource } from "../data-source";
import { Notificationjob, JobStatus } from "../entity/Notificationjob";
import { notificationQueue } from "../queue/notificationQueue";

export const resolvers = {
  Query: {
    jobs: async (_: any, { status }: { status?: JobStatus }) => {
      const repo = AppDataSource.getRepository(Notificationjob);
      if (status) return repo.find({ where: { status } });
      return repo.find();
    },
    job: async (_: any, { id }: { id: number }) => {
      const repo = AppDataSource.getRepository(Notificationjob);
      return repo.findOneBy({ id });
    },
  },
  Mutation: {
    scheduleNotification: async (_: any, { input }: any) => {
      const repo = AppDataSource.getRepository(Notificationjob);
      const newJob = repo.create({
        userId: input.userId,
        message: input.message,
        status: JobStatus.PENDING,
      });
      const savedJob = await repo.save(newJob);

      const delay = new Date(input.sendAt).getTime() - Date.now();

      await notificationQueue.add(

        `sendNotification `,
        {
          dbId: savedJob.id,
        },
        {
          delay: delay > 0 ? delay : 0, // Delay ot negative
          attempts: 3, // Job Fail return try attempts
          backoff: {
            type: 'exponential', //Trying time increase
        }
    }
      );

      return savedJob;
    },
  },
};
