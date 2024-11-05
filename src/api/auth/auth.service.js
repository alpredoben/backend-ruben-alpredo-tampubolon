/* eslint-disable import/no-unresolved */
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const httpStatus = require('http-status');
const { mapingMessage } = require('../../utils/responser');
const {
  generateToken,
  verifiedRefreshToken,
} = require('../../utils/jwt_token');
const User = require('../../database/models/user_model');
const Role = require('../../database/models/role_model');
const { translator } = require('../../lang');

const registerAccount = async (email, password) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return mapingMessage(
      false,
      httpStatus.status.BAD_REQUEST,
      translator.__('message.error.user.existed')
    );
  }

  const roleCustomer = await Role.findOne({ where: { role_name: 'customer' } });

  const user = await User.create({
    user_id: uuidv4(),
    email,
    password: hashedPassword,
    salt,
    role_id: roleCustomer.role_id,
  });

  if (!user) {
    return mapingMessage(
      false,
      httpStatus.status.BAD_REQUEST,
      translator.__('message.error.user.created')
    );
  }

  return mapingMessage(
    true,
    httpStatus.status.CREATED,
    translator.__('message.success.user.created'),
    user
  );
};

const loginAccount = async (email, password) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return mapingMessage(
      false,
      httpStatus.status.UNAUTHORIZED,
      translator.__('message.error.user.invalid_email')
    );
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return mapingMessage(
      false,
      httpStatus.status.UNAUTHORIZED,
      translator.__('message.error.user.invalid_password')
    );
  }

  const accessToken = generateToken(user, 'access');
  const refreshToken = generateToken(user, 'refresh');

  await user.update({ refresh_token: refreshToken });
  await user.save();

  return mapingMessage(
    true,
    httpStatus.status.OK,
    translator.__('message.success.user.login'),
    { accessToken, refreshToken }
  );
};

const refreshToken = async (token) => {
  try {
    const decoded = verifiedRefreshToken(token);

    const user = await User.findOne({
      where: { user_id: decoded.user_id, refresh_token: token },
    });

    if (!user) {
      return mapingMessage(
        false,
        httpStatus.status.BAD_REQUEST,
        translator.__('message.error.auth.invalid_refresh')
      );
    }

    const newAccessToken = generateToken(user, 'access');
    return mapingMessage(
      true,
      httpStatus.status.OK,
      translator.__('message.success.user.refresh_token'),
      { accessToken: newAccessToken }
    );
  } catch (error) {
    return mapingMessage(false, httpStatus.status.BAD_REQUEST, error.message);
  }
};

module.exports = {
  registerAccount,
  loginAccount,
  refreshToken,
};
