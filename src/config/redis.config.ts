export default {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  auth_pass: process.env.REDIS_PASSWORD,
};
