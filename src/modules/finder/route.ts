import { Router } from 'express';
import { finder } from './controller';

const router = Router();

router.route('/finder').post(finder);

export default router;