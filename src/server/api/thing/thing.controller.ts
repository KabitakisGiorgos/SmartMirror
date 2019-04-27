/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 * POST    /api/things              ->  create
 * GET     /api/things/:id          ->  show
 * PUT     /api/things/:id          ->  upsert
 * PATCH   /api/things/:id          ->  patch
 * DELETE  /api/things/:id          ->  destroy
 */

import { Request, Response } from 'express';
import * as jsonpatch from 'fast-json-patch';
import * as thingEvents from './thing.events';
import Thing from './thing.model';


/*---------------------------------------------------------
 * Start Data Structure Defs
 ---------------------------------------------------------*/

/**
 * Data structure of thing object.
 * @typedef {Object} Thing
 * @property {String} name - The name of the thing.
 * @property {String} info - Detailed info about the thing.
 * @property {boolean} active - Indicates whether the thing is active.
 */

/*---------------------------------------------------------
 * END Data Structure Defs
 ---------------------------------------------------------*/


/*---------------------------------------------------------
 * BEGIN Helper functions
 ---------------------------------------------------------*/

function publishThingCreated() {
  return function (entity) {
    if (entity) {
      thingEvents.ThingCreated(entity);
    }
    return entity;
  };
}

function respondWithResult(res: Response, statusCode: number) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function (entity) {
    try {
      jsonpatch.applyPatch(entity, patches, /*validate*/ true);
    } catch (err) {
      return Promise.reject(err);
    }

    return entity.save();
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

/*---------------------------------------------------------
 * END Helper functions
 ---------------------------------------------------------*/


/**
 * Creates a controller for Things
 *
 * @class ThingController
 */
class ThingController {

  /**
   * Creates an instance of ThingController.
   * @memberof ThingController
   */
  constructor() { }

  /**
   * Gets a list of Things
   *
   * @param {Object} req - http request object
   * @param {Object} res - http response object to report any issues
   * @return {Thing[]} The list of available things
   */
  public index(req: Request, res: Response) {
    return Thing.find().exec()
      .then(respondWithResult(res, 200))
      .catch(handleError(res, 500));
  }

  /**
   * Gets a specific thing
   *
   * @param {Object} req - http request object
   * @param {Object} res - http response object to report any issues
   * @return {Thing} A specific thing with id
   */
  public show(req: Request, res: Response) {
    return Thing.findById(req.params.id).exec()
      .then(handleEntityNotFound(res))
      .then(respondWithResult(res, 200))
      .catch(handleError(res, 500));
  }

  /**
   * Creates a new Thing in the DB
   *
   * @export
   * @param {Object} req - http request object
   * @param {String} req.body.name - The name of the thing.
   * @param {String} req.body.info - Detailed info about the thing.
   * @param {boolean} req.body.active - Indicates whether the thing is active.
   * @param {Object} res - http response object to report any issues
   * @return {Thing} The created thing
   */
  public create(req: Request, res: Response) {
    return Thing.create(req.body)
      // .then(publishThingCreated()) // REDIS event Fedarator i might not use it
      .then(respondWithResult(res, 201))
      .catch(handleError(res, 500));
  }

  /**
   * Upserts an existing Thing in the DB
   *
   * @export
   * @param {Object} req - http request object
   * @param {String} req.body.name - The name of the thing.
   * @param {String} req.body.info - Detailed info about the thing.
   * @param {boolean} req.body.active - Indicates whether the thing is active.
   * @param {Object} res - http response object to report any issues
   * @return {Thing} The updated thing
   */
  public upsert(req: Request, res: Response) {
    if (req.body._id) {
      delete req.body._id;
    }
    return Thing.findOneAndUpdate(
      { _id: req.params.id },
      req.body, { new: true, runValidators: true }
    ).exec()
      .then(handleEntityNotFound(res))
      .then(respondWithResult(res, 200))
      .catch(handleError(res, 500));
  }

  /**
   * Updates an existing Thing in the DB
   *
   * @export
   * @param {Object} req - http request object
   * @param {String} req.body.name - The name of the thing.
   * @param {String} req.body.info - Detailed info about the thing.
   * @param {boolean} req.body.active - Indicates whether the thing is active.
   * @param {Object} res - http response object to report any issues
   * @return {Thing} The updated thing
   */
  public patch(req: Request, res: Response) {
    if (req.body._id) {
      delete req.body._id;
    }
    return Thing.findById(req.params.id).exec()
      .then(handleEntityNotFound(res))
      .then(patchUpdates(req.body))
      .then(respondWithResult(res, 200))
      .catch(handleError(res, 500));
  }

  /**
   * Deletes a Thing from the DB
   *
   * @export
   * @param {Object} req - http request object
   * @param {Object} res - http response object to report any issues
   * @return
   */
  public destroy(req: Request, res: Response) {
    return Thing.findById(req.params.id).exec()
      .then(handleEntityNotFound(res))
      .then(removeEntity(res))
      .catch(handleError(res, 500));
  }

  /**
   * Updates an existing Thing in the DB
   *
   * @export
   * @param {Object} req - http request object
   * @param {String} req.body.attribute - The name of the attribute.
   * @param {String} req.body.value - The value of the attribute.
   * @param {Object} res - http response object to report any issues
   * @return {Thing} The updated thing
   */
  public propagateEventToUI(req: Request, res: Response) {

    console.log('propagateEventToUI called!');

    let eventType = 'message';
    let event = {
      attribute: 'value'
    };

    //Inform client for the new event 
    let data2String = JSON.stringify(event);
    global.__socketController.broadcastMessage(eventType, data2String);

    res.send('OK!');
    return;
  }
}

export default new ThingController();
