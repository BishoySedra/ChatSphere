import * as userService from "../services/auth.js";

// user will give username, email, password
export const register = async (req, res, next) => {
  try {
    const user = await userService.registerService(req.body);

    return res.status(201).json({
      body: user,
      status: 201,
      message: "User registered successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res) => {
  try {
    const token = await userService.loginService(req.body);
  } catch (error) {
    next(error);
  }
  return res.json({ body: token, status: 200, message: "Login successful" });
};