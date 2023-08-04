import { Request, Response, NextFunction } from 'express';
import { LoginModel } from './models/login_model';
declare global {
    namespace Express {
      interface Request {
        loginUser?: LoginModel;
      }
    }
}
export const modelMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const {email, password} = req.body;
  const user = new LoginModel(email, password, req.ip, res);
  req.loginUser = user;
  next()
};

export const ipMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.loginUser!;
    const ipStatus = await user.controlIPAdress(res)
    if (ipStatus) {
      next();
    }
};

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.loginUser!;
    await user.authenticate(res)
    next();
  } catch (error) {
  }
};