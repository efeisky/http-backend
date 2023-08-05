import { Router } from 'express';
import { RouterPaths } from '../../product/constant/route_paths';
import { tokenVerifyMiddleware } from './resetMiddlewares';

const router = Router();

router.get(RouterPaths.default, tokenVerifyMiddleware, (req, res) => {});

router.all(RouterPaths.default, (req, res) => {
  res.sendStatus(405);
});

export default router;
