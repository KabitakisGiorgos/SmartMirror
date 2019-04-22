'use strict';

import * as mongoose from 'mongoose';
import { registerEvents } from './notification.sockets';

var NotificationSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    severity: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

NotificationSchema.index({ createdAt: 1 }, {
    expireAfterSeconds: 86400 //1 day in seconds
});


registerEvents(NotificationSchema);
var model = mongoose.model('Notification', NotificationSchema);
model.on('index', () => { });
export default model;
