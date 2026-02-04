import { Worker } from "bullmq";

const worker = new Worker(
  "remainders", // MUST MATCH queue name
  async (job) => {
    const { userId, title } = job.data;
    console.log(`⏰ Remainder for user ${userId}: ${title}`);
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);

export default worker;
