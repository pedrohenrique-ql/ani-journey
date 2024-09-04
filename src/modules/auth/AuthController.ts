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

  refresh = async (request: Request, response: Response) => {
    const validatedInput = refreshValidator.parse(request.body);
    const { accessToken } = await this.authService.refreshAccessToken(validatedInput);

    response.status(200).json({ accessToken });
  };

  logout = async (request: Request, response: Response) => {
    const { sessionId } = request.middlewares.authenticated;
    await this.authService.logout(sessionId);

    response.status(204).send();
  };
}

export default AuthController;
