const { check, query, param } = require('express-validator');
const { translator } = require('../lang');

const bodyValidation = (properties, requiredName, methodName = 'check') => {
  let method = check(properties);
  const name = methodName.toString().toLowerCase();

  switch (name) {
    case 'query':
      method = query(properties);
      break;
    case 'param':
      method = param(properties);
      break;

    default:
      method = check(properties);
      break;
  }

  return method.notEmpty().withMessage(
    translator.__('message.error.validation.required', {
      fieldName: `${requiredName}`,
    })
  );
};

module.exports = {
  bodyValidation,
};
