import { Router } from 'express';
import { RouterPaths } from '../../product/constant/route_paths';
import { verifyMiddleware } from './verifyMiddlewares';

const router = Router();

router.get(RouterPaths.default, verifyMiddleware, (req, res) => {});

router.all(RouterPaths.default, (req, res) => {
  res.sendStatus(405);
});

export default router;
