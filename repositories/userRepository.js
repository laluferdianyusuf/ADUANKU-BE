const { Op } = require("sequelize");
const { users } = require("../models");

class UserRepository {
  static async createUser({ name, username, email, password, role }) {
    const createUser = await users.create({
      name,
      username,
      email,
      password,
      role,
    });

    return createUser;
  }

  static async updateUser({
    id,
    name,
    username,
    email,
    gender,
    birthday,
    phoneNumber,
    address,
  }) {
    console.log(id);

    const updateUser = await users.update(
      {
        name: name,
        username: username,
        email: email,
        gender: gender,
        birthday: birthday,
        phoneNumber: phoneNumber,
        address: address,
      },
      { where: { id: id } }
    );

    return updateUser;
  }

  static async findUserById({ id }) {
    const findUser = await users.findOne({ where: { id: id } });
    return findUser;
  }

  static async findUserByEmail({ email }) {
    const findUser = await users.findOne({ where: { email } });
    return findUser;
  }

  static async getUserByUsername({ username }) {
    const getUser = await users.findOne({ where: { username } });
    return getUser;
  }

  static async getUsersByRoles({ role }) {
    const getUsers = await users.findAll({
      where: {
        role: {
          [Op.or]: role,
        },
      },
    });

    return getUsers;
  }
}

module.exports = UserRepository;
