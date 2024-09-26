const userModel = require('../models/userModel');

const registerController = async (req, res, next) => {
  const { name, email, password, location } = req.body;
  if (!name) {
    next('Please provide a Name');
  }
  if (!email) {
    next('Please provide an Email');
  }
  if (!password) {
    next('Please provide a Password');
  }
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    next('This email is already registered please login');
  }
  const user = await userModel.create({ name, email, password, location });
  const token = user.createJWT();
  res.status(200).send({
    success: true,
    message: 'User created successfully',
    user: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
    },
    token,
  });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next('Please provide all fields');
  }
  const user = await userModel.findOne({ email }).select('+password');
  if (!user) {
    next('Invalid userName or password');
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    next('Invalid password');
  }
  user.password = undefined;
  const token = user.createJWT();
  res.status(200).json({
    success: true,
    message: 'login successfully',
    user,
    token,
  });
};
module.exports = { registerController, loginController };
