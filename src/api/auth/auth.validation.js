const { bodyValidation } = require('../../utils/validation');

module.exports = {
  signUpValidation: [
    bodyValidation('email', 'Email', 'check'),
    bodyValidation('password', 'Password', 'check'),
  ],

  signInValidation: [
    bodyValidation('email', 'Email', 'check'),
    bodyValidation('password', 'Password', 'check'),
  ],
};
