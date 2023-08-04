import { Request, Response, NextFunction } from 'express';
import { VerifyModel } from './models/verify_model';
import { TokenError, TokenErrorCode, TokenErrorMessage } from '../../product/error/token_error';

export const verifyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const {token} = req.query;
  if (!token || typeof token !== 'string') {
    const tokenError = new TokenError();
    tokenError.CreateError(res, TokenErrorCode.InvalidToken, TokenErrorMessage.InvalidToken);
    return;
  }
  if (token?.length != 128) {
    const tokenError = new TokenError();
    tokenError.CreateError(res, TokenErrorCode.InvalidToken, TokenErrorMessage.InvalidToken);
    return;
  }
  const user = new VerifyModel(token!.toString(), req.ip, res);
  
  await user.checkTokenValidate(res)
  next()
};