import { Request, Response, NextFunction } from 'express';
import { ResetModel } from './models/reset_model';
import { TokenError, TokenErrorCode, TokenErrorMessage } from '../../product/error/token_error';

export const tokenVerifyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { token} = req.query;

  if (!token || typeof token !== 'string' || token.length != 64) {
    const tokenError = new TokenError();
    tokenError.CreateError(res, TokenErrorCode.InvalidToken, TokenErrorMessage.InvalidToken);
    return;
  }

  const user = new ResetModel(token, req.ip, res);

  try {
    await user.checkTokenValidate(res);
    next();
  } catch (err) {
    return next(err);
  }
};
