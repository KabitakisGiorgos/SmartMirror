'use strict'

import * as mongoose from 'mongoose';
import { registerEvents } from './notification.sockets';

var NotificationSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

registerEvents(NotificationSchema);
export default mongoose.model('Notification', NotificationSchema);