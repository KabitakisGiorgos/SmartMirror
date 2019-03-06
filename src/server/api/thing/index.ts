import { Router } from 'express';
import controller from './thing.controller';

let router = Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.post('/propagateEventToUI', controller.propagateEventToUI);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

export default router;
