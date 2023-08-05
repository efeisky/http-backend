import { Router } from 'express';
import { RouterPaths } from '../../product/constant/route_paths';
import { tokenVerifyMiddleware } from './userMiddlewares';

const router = Router();

router.get(RouterPaths.default, tokenVerifyMiddleware, (req, res) => {
  res.status(200).json({
    auth : true
  })
});

router.all(RouterPaths.default, (req, res) => {
  res.sendStatus(405);
});

export default router;
