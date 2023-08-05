import { Router } from 'express';
import { RouterPaths } from '../product/constant/route_paths';
import loginRoute from './../modules/login/loginRoutes';
import registerRoute from './../modules/register/registerRoutes';
import verifyRoute from './../modules/verify/verifyRoutes';
import resetRoute from './../modules/reset/resetRoutes';
import userRoute from '../modules/user/userRoutes';

const router = Router();

router.use(RouterPaths.login, loginRoute);
router.use(RouterPaths.register, registerRoute);
router.use(RouterPaths.verify, verifyRoute);
router.use(RouterPaths.reset, resetRoute);
router.use(RouterPaths.user, userRoute);

router.use(RouterPaths.notFound, (req, res) => {res.sendStatus(404);});
export default router;
