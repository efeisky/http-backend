import { Router } from 'express';
import { RouterPaths } from '../product/constant/route_paths';
import loginRoute from './../modules/login/loginRoutes';

const router = Router();

router.use(RouterPaths.login, loginRoute)

router.use(RouterPaths.notFound, (req, res) => {res.sendStatus(404);});
export default router;
