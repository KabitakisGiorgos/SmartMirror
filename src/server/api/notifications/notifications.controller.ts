import { Request, Response } from 'express';
import * as jsonpatch from 'fast-json-patch';
// import * as notificationsEvents from './notifications.events'; Might not needed
import Notification from './notifications.model';

/**
 *  BEGIN Helper functions
 */

function respondWithResult(res: Response, statusCode: number) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) return res.status(statusCode).json(entity);
        return null;
    };
}

function removeEntity(res: Response) {
    return function (entity) {
        if (entity) {
            return entity.remove()
                .then(() => {
                    res.status(204).end();
                });
        }
    };
}

function handleEntityNotFound(res: Response) {
    return function (entity) {
        if (!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function handleError(res: Response, statusCode: number) {
    statusCode = statusCode || 500;
    return function (err) {
        res.status(statusCode).send(err);
    };
}

/**
 *  END Helper functions
 */

class NotificationController {
    constructor() { }

    public index(req: Request, res: Response) {
        return Notification.find().exec()
            .then(respondWithResult(res, 200))
            .catch(handleError(res, 500));
    }


    public create(req: Request, res: Response) {
        return Notification.create(req.body)
            .then(respondWithResult(res, 201))
            .catch(handleError(res, 500));
    }

    public retrieve(req: Request, res: Response) {
        return Notification.find({ severity: req.params.severity }).exec()
            .then(handleEntityNotFound(res))
            .then(respondWithResult(res, 200))
            .catch(handleError(res, 500));
    }

    public delete(req: Request, res: Response) {
        return Notification.findById(req.params.id).exec()
            .then(handleEntityNotFound(res))
            .then(removeEntity(res))
            .catch(handleError(res, 500));
    }

    public ping(req: Request, res: Response) {
        let eventType = 'Notification Ping';
        let event = {
            data: req.body
        };
        global.__socketController.broadcastMessage(eventType, JSON.stringify(event));
        res.status(200).send('Done');
        return;
    }
}

export default new NotificationController();
