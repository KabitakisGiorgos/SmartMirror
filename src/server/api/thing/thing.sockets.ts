/**
 * Thing model events
 */

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};


function emitEvent(event) {
  return function (doc) {
    global.__socketController.broadcastMessage(`thing:${event}`, doc);
  };
}

// Register the event emitter to the model events
export function registerEvents(Thing) {
  for (var e in events) {
    let event = events[e];
    Thing.post(e, emitEvent(event));
  }
}
