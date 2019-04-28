'use strict'

import * as mongoose from 'mongoose';
import { registerEvents } from './events.sockets';
var EventsSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Commute', 'Hypnos', 'Work', 'Food', 'Relax','Sleep'],
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
        required: false
    }
});

registerEvents(EventsSchema);
export default mongoose.model('Events', EventsSchema);