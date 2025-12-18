const app = require('./app');
const connectDB = require('./config/db');
const { env } = require('./config/env');

const start = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`Server listening on port ${env.PORT}`);
  });

  process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection', error);
    server.close(() => process.exit(1));
  });
};

start();
