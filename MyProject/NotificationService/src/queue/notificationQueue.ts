
// src/queue/notificationQueue.ts

import { Queue, Worker, Job } from 'bullmq';
import * as dotenv from 'dotenv';
import { AppDataSource } from '../data-source';
import { Notificationjob, JobStatus } from '../entity/Notificationjob';


//.env file get Redis Connection details
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);

//Create Queue
export const notificationQueue = new Queue('notification-queue', {
    connection: {
        host: REDIS_HOST,
        port: REDIS_PORT,
    }
});
  
//JobLogic Worker
const worker = new Worker('notification-queue', async (job: Job<any>) => {
    const notificationJobRepository = AppDataSource.getRepository(Notificationjob);
    let notification: Notificationjob | null = null; 

    try {
        notification = await notificationJobRepository.findOne({ where: { id: job.data.jobId } });

        if (!notification) {
            console.error(`Job ID ${job.data.jobId} not found in database. Skipping processing.`);
            throw new Error(`Notification job with ID ${job.data.jobId} not found.`);
        }

        console.log(`Processing notification for userId: ${notification.userId}, message: "${notification.message}"`);


        // Simulate sending notification (e.g., email, SMS, etc.)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate a random failure for demonstration purposes30%
        if (Math.random() < 0.3) {
            console.warn(`Simulating failure for job ID: ${notification.id}`);
            throw new Error("Simulated notification sending failure.");
        }

        // If successful, update the job status
        notification.status = JobStatus.COMPLETED;
        await notificationJobRepository.save(notification);
        console.log(`Notification job ID ${notification.id} completed.`);

    } catch (error: any) {
        console.error(`Error processing job ID ${job.data.jobId}:`, error.message);
        if (notification) {
            notification.status = JobStatus.FAILED;
            notification.attempts = (notification.attempts || 0) + 1;
            await notificationJobRepository.save(notification);
        }
        throw error;
    }
}, {

  //Worker Connection Settings.
    connection: {
        host: REDIS_HOST,
        port: REDIS_PORT,
    },
});

worker.on('failed', (job, err) => {
    console.log(`Job ${job?.id} failed with error: ${err.message}. Attempts: ${job?.attemptsMade}/${job?.opts.attempts}`);
});

worker.on('completed', (job) => {
    console.log(`Job ${job?.id} has completed!`);
});

worker.on('error', (err) => {
    console.error('BullMQ Worker error:', err);
});

