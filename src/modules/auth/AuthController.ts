import { Request, Response } from 'express';
import { loginValidator } from './validators/LoginValidator';
import { refreshValidator } from './validators/RefreshValidator';
import AuthService from './AuthService';

class AuthController {
  private authService = new AuthService();

  login = async (request: Request, response: Response) => {
    const validatedInput = loginValidator.parse(request.body);
    const { accessToken, refreshToken } = await this.authService.login(validatedInput);

    response.status(200).json({ accessToken, refreshToken });
  };

  getRefreshToken = async (request: Request, response: Response) => {
    const validatedInput = refreshValidator.parse(request.body);
    const { accessToken } = await this.authService.getRefreshToken(validatedInput);

    response.status(200).json({ accessToken });
  };
}

export default AuthController;
