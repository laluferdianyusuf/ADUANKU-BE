const UserService = require("../services/userService");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const { status, status_code, message, data } = await UserService.RegisterUser(
    {
      username,
      email,
      password,
    }
  );

  res.status(status_code).send({
    status: status,
    message: message,
    data: data,
  });
};

const registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  const { status, status_code, message, data } =
    await UserService.RegisterAdmin({
      username,
      email,
      password,
    });

  res.status(status_code).send({
    status: status,
    message: message,
    data: data,
  });
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  const { status, status_code, message, data, token } = await UserService.Login(
    {
      username,
      password,
    }
  );

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, username, email, gender, birthday, phoneNumber, address } =
    req.body;

  const { status, status_code, message, data, token } =
    await UserService.updateUser({
      id: id,
      name: name,
      username: username,
      email: email,
      gender: gender,
      birthday: birthday,
      phoneNumber: phoneNumber,
      address: address,
    });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const currentUser = async (req, res) => {
  const currentUser = req.users;

  res.status(200).send({
    status: true,
    message: "You are logged in with this user",
    data: { user: currentUser },
  });
};

module.exports = {
  registerUser,
  registerAdmin,
  login,
  updateUser,
  currentUser,
};
