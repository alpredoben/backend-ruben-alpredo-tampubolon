const router = require('express').Router();
const { signIn, signUp, reupdateToken } = require('./auth.handler');
const {
  reqValidatorMiddleware,
} = require('../../middlewares/validation_middleware');
const { signInValidation, signUpValidation } = require('./auth.validation');

router.post('/sign-in', reqValidatorMiddleware(signInValidation), signIn);
router.post('/sign-up', reqValidatorMiddleware(signUpValidation), signUp);
router.get('/refresh-token', reupdateToken);

module.exports = router;
