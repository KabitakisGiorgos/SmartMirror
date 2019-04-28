import { Request, Response } from 'express';
import Events from './events.model';


function respondWithResult(res: Response, statusCode: number) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

function handleError(res: Response, statusCode: number) {
    statusCode = statusCode || 500;
    return function (err) {
        res.status(statusCode).send(err);
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

class EventsController {

    constructor() { }

    public index(req: Request, res: Response) {
        return Events.find().exec()
            .then(respondWithResult(res, 200))
            .catch(handleError(res, 500));
    }

    public create(req: Request, res: Response) {
        return Events.create(req.body)
            .then(respondWithResult(res, 201))
            .catch(handleError(res, 500));
    }

    public retrieve(req: Request, res: Response) {
        return Events.findById(req.params.id).exec()
            .then(handleEntityNotFound(res))
            .then(respondWithResult(res, 200))
            .catch(handleError(res, 500));
    }

    public delete(req: Request, res: Response) {
        return Events.findById(req.params.id).exec()
            .then(handleEntityNotFound(res))
            .then(removeEntity(res))
            .catch(handleError(res, 500));
    }

    public update(req: Request, res: Response) {
        if (req.body._id) {
            delete req.body._id;
        }
        return Events.findOneAndUpdate(
            { _id: req.params.id },
            req.body, { new: true, runValidators: true }
        ).exec()
            .then(handleEntityNotFound(res))
            .then(respondWithResult(res, 200))
            .catch(handleError(res, 500));
    }
}

export default new EventsController();