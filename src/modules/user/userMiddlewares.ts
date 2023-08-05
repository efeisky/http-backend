import { Request, Response, NextFunction } from 'express';
import { TokenError, TokenErrorCode, TokenErrorMessage } from '../../product/error/token_error';
import { UserAuthModel } from './models/user_auth_model';

export const tokenVerifyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['session-based'] ?? null;
  if (!token || typeof token !== 'string' || token.length === 0) {
    const tokenError = new TokenError();
    tokenError.CreateError(res, TokenErrorCode.InvalidToken, TokenErrorMessage.InvalidToken);
    return;
  }
  const auth = new UserAuthModel(token, req.ip, res);

  try {
    await auth.checkTokenValidate(res);
    next();
  } catch (err) {
    return next(err);
  }
};
