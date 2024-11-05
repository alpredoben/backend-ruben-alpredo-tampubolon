/* eslint-disable consistent-return */
const { validationResult } = require('express-validator');
const { translator } = require('../lang');
const { getErrorResponse } = require('../utils/responser');

const manipulateMessage = (msg, extractedErrors, errors) => {
  const msgList = {
    database: translator.__('message.error.database.undefined'),
    connect: translator.__('message.error.database.disconnect'),
    password: translator.__('message.error.database.authorization'),
    select: translator.__('message.errors.database.query_builder'),
    Please: errors.array(),
  };

  return msgList[msg] ?? extractedErrors;
};

const checkMessageError = (readMessageError, errors) => {
  const extractedErrors = [];
  if (errors.array().some((err) => err.type === 'alternative_grouped')) {
    const errArr = errors.array();
    const errMsg = errArr.map((err) => err.nestedErrors).flat(2);
    errMsg.map((err) => extractedErrors.push(err?.msg));
  } else {
    errors.array().map((err) => extractedErrors.push(err.msg));
  }
  const message = manipulateMessage(
    readMessageError[0][0],
    extractedErrors,
    errors
  );

  return message;
};

const reqValidatorMiddleware = (arraysValidation) => async (req, res, next) => {
  try {
    await Promise.all(
      arraysValidation.map((validation) => validation.run(req))
    );

    const errors = validationResult(req);

    // If there are errors, respond with a 400 status and the list of errors
    if (!errors.isEmpty()) {
      if (errors.array().some((err) => err.type === 'alternative_grouped')) {
        const errArr = errors.array();
        const errMsg = errArr.map((err) => err?.nestedErrors).flat(2);
        console.log(errMsg);
        const catchMessage = errArr
          .map((err) => err?.nestedErrors)
          .flat(2)
          .map((err) => err?.msg?.split(' '));
        console.error('error validateMiddleware', errMsg);
        const message = checkMessageError(catchMessage, errors);
        return getErrorResponse(res, 400, message, errors.array());
      }

      const readMessageError = errors.array().map((err) => err.msg.split(' '));

      const message = checkMessageError(readMessageError, errors);
      return getErrorResponse(res, 422, message, errors.array());
    }

    // If validation passes, proceed to the next middleware
    next();
  } catch (err) {
    console.error('Validation middleware encountered an error:', err);
    return getErrorResponse(res, 500, 'Server error during validation', err);
  }
};

module.exports = {
  reqValidatorMiddleware,
};
