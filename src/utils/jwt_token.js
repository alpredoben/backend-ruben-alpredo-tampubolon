const jwt = require('jsonwebtoken');
const { JWT } = require('../configs/environments');

module.exports = {
  verifiedRefreshToken: (token) => jwt.verify(token, JWT.REFRESH_KEY),

  // Generate JWT token (access or refresh)
  generateToken: (user, type = 'access') => {
    const secret = type === 'access' ? JWT.SECRET_KEY : JWT.REFRESH_KEY;

    const expiresIn = type === 'access' ? '1h' : '7d';

    return jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role_id: user.role_id,
      },
      secret,
      { expiresIn }
    );
  },

  getUserFromToken: (token, type = 'access') => {
    try {
      const secret = type === 'access' ? JWT.SECRET_KEY : JWT.REFRESH_KEY;
      const decoded = jwt.verify(token, secret);
      return {
        user_id: decoded.user_id,
        email: decoded.email,
        role_id: decoded.role_id,
      };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  },
};
