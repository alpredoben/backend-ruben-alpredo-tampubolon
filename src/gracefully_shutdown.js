// src/utils/gracefulShutdown.js

const { sequelize } = require('./configs/database');

const gracefullyShutdown = (server) => {
  const shutdown = async () => {
    console.log('\nStarting graceful shutdown...');
    try {
      // Close the HTTP server
      server.close(() => {
        console.log('HTTP server closed');
      });

      // Close the Sequelize connection
      await sequelize.close();
      console.log('Database connection closed');

      // // Close the Redis connection if using Redis
      // if (redisClient) {
      //   await redisClient.quit();
      //   console.log('Redis client disconnected');
      // }

      console.log('Graceful shutdown completed');
      process.exit(0); // Exit with success
    } catch (error) {
      console.error('Error during graceful shutdown:', error);
      process.exit(1); // Exit with failure
    }
  };

  // Handle signals for shutdown
  process.on('SIGINT', shutdown); // Handle Ctrl+C
  process.on('SIGTERM', shutdown); // Handle termination signal
};

module.exports = gracefullyShutdown;
