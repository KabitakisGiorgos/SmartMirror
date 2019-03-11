import { Router } from 'express'
import controller from './assistant.controller';

let router = Router();

router.post('/unknowncommand', controller.unknowncommand);

export default router;