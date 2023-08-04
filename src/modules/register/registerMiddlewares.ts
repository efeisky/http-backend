import { Request, Response, NextFunction } from 'express';
import { RegisterModel } from './models/register_model';
declare global {
  namespace Express {
    interface Request {
      registerUser?: RegisterModel;
    }
  }
}
export const modelMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const {username, email, password} = req.body;
  const user = new RegisterModel(username, email, password, req.ip, res);
  req.registerUser = user;
  next()
};

export const ipMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.registerUser!;
    const ipStatus = await user.controlIPAdress(res)
    if (ipStatus) {
      next();
    }
};

export const createMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.registerUser!;
    await user.create(res)
    next();
  } catch (error) {
  }
};