const { ExpressCustomError } = require('../../middlewares/error_middleware');
const {
  registerAccount,
  loginAccount,
  refreshToken,
} = require('./auth.service');
const { getSuccessResponse } = require('../../utils/responser');

const signUp = async (req, res, next) => {
  const { email, password } = req.body;
  const result = await registerAccount(email, password);

  if (result.success === false) {
    next(new ExpressCustomError(result.message, result.code));
  }

  return getSuccessResponse(res, result.code, result.message, result.data);
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  const result = await loginAccount(email, password);

  if (result.success === false) {
    next(new ExpressCustomError(result.message, result.code));
  }

  return getSuccessResponse(res, result.code, result.message, result.data);
};

const reupdateToken = async (req, res, next) => {
  const tokenHeader = req?.headers?.authorization ?? '';
  const token = tokenHeader.split(' ')[1];

  const result = await refreshToken(token);

  if (result.success === false) {
    next(new ExpressCustomError(result.message, result.code));
  }

  return getSuccessResponse(res, result.code, result.message, result.data);
};

module.exports = {
  signUp,
  signIn,
  reupdateToken,
};
