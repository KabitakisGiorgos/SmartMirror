import { Router } from 'express';
import controller from './news.controller';

let router = Router();

router.get('/', controller.index);
router.get('/renew', controller.retrieveNews);

export default router;