// src/server.js
const server = require('./app');
const { APP } = require('./configs/environments');
const { sequelize } = require('./configs/database');
const gracefullyShutdown = require('./gracefully_shutdown');

const httpServer = server.listen(APP.PORT, async () => {
  console.log(`Server is running on port ${APP.PORT}`);
  await sequelize.authenticate();
  console.log('Database connected');
});

// Graceful Shutdown
gracefullyShutdown(httpServer);
