/**
 * Notification model events
 */

// Model events
var events = {
    save: 'save',
    remove: 'remove'
};


function emitEvent(event) {
    return function (doc) {
        global.__socketController.broadcastMessage(`notification:${event}`, doc);
    };
}

// Register the event emitter to the model events
export function registerEvents(Notification) {
    for (var e in events) {
        let event = events[e];
        Notification.post(e, emitEvent(event));
    }
}
