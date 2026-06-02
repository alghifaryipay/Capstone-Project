import api from "./api";

/* LOGIN */
export const loginUser =
  async (data) => {

    try {

      /* MOCK LOGIN */

      if (
        data.email ===
          "admin@gmail.com" &&
        data.password ===
          "123456"
      ) {

        return {
          token:
            "mock-token-123",

          user: {
            id: 1,

            fullname:
              "John Doe",

            email:
              "admin@gmail.com",
          },
        };
      }

      throw new Error(
        "Invalid email or password"
      );

    } catch (error) {

      throw new Error(
        error.message
      );
    }
  };

/* REGISTER */
export const registerUser =
  async (data) => {

    try {

      return {
        success: true,

        message:
          "Register success",
      };

    } catch (error) {

      throw new Error(
        error.message
      );
    }
  };

/* GET PROFILE */
export const getProfile =
  async () => {

    try {

      const response =
        await api.get(
          "/auth/profile"
        );

      return response.data;

    } catch (error) {

      throw new Error(
        error.message
      );
    }
  };