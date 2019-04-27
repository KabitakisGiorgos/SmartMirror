'use strict'

import * as mongoose from 'mongoose';
import { registerEvents } from './events.sockets';
var EventsSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Commute', 'Sleep', 'Work', 'Food', 'Relax'],
        required: true
    },
    start: {
        type: Number,
        required: true
    },
    end: {
        type: Number,
        required: false
    },
    options: mongoose.Schema.Types.Mixed,
    icon: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
});

registerEvents(EventsSchema);
export default mongoose.model('Events', EventsSchema);