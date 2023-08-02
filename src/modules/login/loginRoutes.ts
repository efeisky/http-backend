import { Router } from 'express';
import { authMiddleware, ipMiddleware, modelMiddleware } from './loginMiddlewares';
import { RouterPaths } from '../../product/constant/route_paths';

const router = Router();

router.post(RouterPaths.default,modelMiddleware,ipMiddleware,authMiddleware, (req, res) => {});

router.all(RouterPaths.default, (req, res) => {
  res.sendStatus(405);
});

export default router;
