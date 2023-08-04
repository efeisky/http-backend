import { Router } from 'express';
import { RouterPaths } from '../../product/constant/route_paths';
import { createMiddleware, ipMiddleware, modelMiddleware } from './registerMiddlewares';

const router = Router();

router.post(RouterPaths.default,modelMiddleware,ipMiddleware,createMiddleware, (req, res) => {});

router.all(RouterPaths.default, (req, res) => {
  res.sendStatus(405);
});

export default router;
