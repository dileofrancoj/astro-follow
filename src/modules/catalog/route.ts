import { Router } from 'express';
import { catalog } from './controller';

const router = Router();

router.route('/catalog').get(catalog);

export default router;