import { Router } from 'express';
import { RouterPaths } from '../product/constant/route_paths';
import loginRoute from './../modules/login/loginRoutes';
import registerRoute from './../modules/register/registerRoutes';
import verifyRoute from './../modules/verify/verifyRoutes';

const router = Router();

router.use(RouterPaths.login, loginRoute);
router.use(RouterPaths.register, registerRoute);
router.use(RouterPaths.verify, verifyRoute);

router.use(RouterPaths.notFound, (req, res) => {res.sendStatus(404);});
export default router;
