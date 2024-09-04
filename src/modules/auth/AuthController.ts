import { Request, Response } from 'express';
import { loginValidator } from './validators/LoginValidator';
import AuthService from './AuthService';

class AuthController {
  private authService = new AuthService();

  login = async (request: Request, response: Response) => {
    const validatedInput = loginValidator.parse(request.body);
    const { accessToken, refreshToken } = await this.authService.login(validatedInput);

    response.status(200).json({ accessToken, refreshToken });
  };
}

export default AuthController;
