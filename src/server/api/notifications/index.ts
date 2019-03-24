
import { Router } from 'express';
import controller from './notifications.controller';

let router = Router();
router.get('/', controller.index);
router.post('/', controller.create);
router.get('/:severity', controller.retrieve);
router.delete('/:id', controller.delete);
router.post('/ping', controller.ping);

export default router;