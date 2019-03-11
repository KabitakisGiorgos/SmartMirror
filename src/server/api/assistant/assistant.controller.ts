import { Request, Response } from 'express';
import UnknownCommamd from './assistant.model';

class AssistantController {
    constructor() { }

    public unknowncommand(req: Request, res: Response) {
        if (!req.body.command) {
            return res.status(500).json({
                error: 'Command Field is required'
            })
        }
        return UnknownCommamd.create(req.body)
            .then((command) => {
                return res.status(201).json(command)
            })
            .catch((err) => {
                return res.status(500).json(err);
            })
    }
}

export default new AssistantController;