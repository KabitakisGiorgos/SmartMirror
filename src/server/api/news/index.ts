import { Router } from 'express';
import controller from './news.controller';

let router = Router();

router.get('/', controller.index);

export default router;