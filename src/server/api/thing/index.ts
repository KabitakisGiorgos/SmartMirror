import { Router } from 'express';
import controller from './thing.controller';
import { check } from 'express-validator/check'
let router = Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', [check('name').isEmail().withMessage('Must be email')], controller.upsert);
router.post('/propagateEventToUI', controller.propagateEventToUI);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

export default router;
