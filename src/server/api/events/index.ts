import { Router } from 'express';
import controller from './events.controller';

let router = Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.get('/:id', controller.retrieve);
router.delete('/:id', controller.delete);
router.put('/:id', controller.update);

export default router;  