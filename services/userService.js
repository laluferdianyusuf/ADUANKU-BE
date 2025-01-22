const UserRepository = require("../repositories/userRepository");
const bcrypt = require("bcrypt");
const { JWT, ROLES } = require("../lib/const");
const jwt = require("jsonwebtoken");

class UserService {
  static async RegisterUser({ username, email, password }) {
    try {
      if (!username) {
        return {
          status: false,
          status_code: 400,
          message: "Username is required",
          data: { user: null },
        };
      }
      if (!email) {
        return {
          status: false,
          status_code: 400,
          message: "Email is required",
          data: { user: null },
        };
      }
      if (!password) {
        return {
          status: false,
          status_code: 400,
          message: "Password is required",
          data: { user: null },
        };
      } else if (password.length < 8) {
        return {
          status: false,
          status_code: 400,
          message: "Password must be at least 8 characters",
          data: { user: null },
        };
      }

      const findEmail = await UserRepository.findUserByEmail({ email });
      if (findEmail) {
        return {
          status: false,
          status_code: 400,
          message: "Email address has already been registered",
          data: { user: null },
        };
      } else {
        const hashedPassword = await bcrypt.hash(password, JWT.SALT_ROUND);
        const registeredUser = await UserRepository.createUser({
          username,
          email,
          password: hashedPassword,
          role: ROLES.USER,
        });
        return {
          status: true,
          status_code: 201,
          message: "User successfully registered",
          data: { user: registeredUser },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: error.message,
        data: { user: null },
      };
    }
  }

  static async RegisterAdmin({ username, email, password }) {
    try {
      if (!username) {
        return {
          status: false,
          status_code: 400,
          message: "Username is required",
          data: { user: null },
        };
      }
      if (!email) {
        return {
          status: false,
          status_code: 400,
          message: "Email is required",
          data: { user: null },
        };
      }
      if (!password) {
        return {
          status: false,
          status_code: 400,
          message: "Password is required",
          data: { user: null },
        };
      } else if (password.length < 8) {
        return {
          status: false,
          status_code: 400,
          message: "Password must be at least 8 characters",
          data: { user: null },
        };
      }

      const findEmail = await UserRepository.findUserByEmail({ email });
      if (findEmail) {
        return {
          status: false,
          status_code: 400,
          message: "Email address has already been registered",
          data: { user: null },
        };
      } else {
        const hashedPassword = await bcrypt.hash(password, JWT.SALT_ROUND);
        const registeredAdmin = await UserRepository.createUser({
          username,
          email,
          password: hashedPassword,
          role: ROLES.ADMIN,
        });
        return {
          status: true,
          status_code: 201,
          message: "Admin successfully registered",
          data: { user: registeredAdmin },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: error.message,
        data: { user: null },
      };
    }
  }

  static async Login({ username, password }) {
    try {
      if (!username) {
        return {
          status: false,
          status_code: 400,
          message: "Username are required",
          data: { user: null, token: null },
        };
      }
      if (!password) {
        return {
          status: false,
          status_code: 400,
          message: "Password are required",
          data: { user: null, token: null },
        };
      }

      const getUser = await UserRepository.getUserByUsername({ username });

      if (!getUser) {
        return {
          status: false,
          status_code: 403,
          message: "Invalid Username, try again",
          data: { user: null, token: null },
        };
      }

      const isPasswordValid = await bcrypt.compare(password, getUser.password);
      if (!isPasswordValid) {
        return {
          status: false,
          status_code: 403,
          message: "Invalid password, try again",
          data: { user: null, token: null },
        };
      }

      const token = await jwt.sign(
        {
          id: getUser.id,
          name: getUser.name,
          username: getUser.username,
          email: getUser.email,
        },
        JWT.SECRET
      );

      return {
        status: true,
        status_code: 200,
        message: "Successfully signed",
        data: { user: getUser, token: token },
      };
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: error.message,
        data: { user: null, token: null },
      };
    }
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
    try {
      const getUser = await UserRepository.findUserById({ id: id });

      if (!getUser) {
        return {
          status: false,
          status_code: 404,
          message: "User not found",
          data: { user: null, token: null },
        };
      }

      const [updateResult] = await UserRepository.updateUser({
        id: id,
        name: name,
        username: username,
        email: email,
        gender: gender,
        birthday: birthday,
        phoneNumber: phoneNumber,
        address: address,
      });

      if (updateResult === 1) {
        const updatedUser = await UserRepository.findUserById({ id: id });

        const token = await jwt.sign(
          {
            id: updatedUser.id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
          },
          JWT.SECRET
        );

        return {
          status: true,
          status_code: 200,
          message: "Updated successfully",
          data: { user: updatedUser, token: token },
        };
      } else {
        return {
          status: false,
          status_code: 400,
          message: "Failed to update user",
          data: { user: null, token: null },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "Error: " + error.message,
        data: { user: null, token: null },
      };
    }
  }
}

module.exports = UserService;
