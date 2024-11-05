/* eslint-disable global-require */
const optionSwagger = {
  openapi: '3.1.0',
  info: {
    description: 'Rest API Ecommerce XXXX',
    version: '1.0.0',
    title: 'Rest API Documentation',
    contact: {
      email: 'alpredo.tampubolon@gmail.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: '/api/v1/',
      description: 'Development server',
    },
  ],
  paths: require('./path'),
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: require('./schema'),
  },
};

module.exports = {
  optionSwagger,
};
