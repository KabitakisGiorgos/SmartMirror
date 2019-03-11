'use strict'

import * as mongoose from 'mongoose';
var UnknownCommandSchema = new mongoose.Schema({
    command: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model('unknownCommand', UnknownCommandSchema);