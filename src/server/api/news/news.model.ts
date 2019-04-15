'use strict'

import * as mongoose from 'mongoose';
var NewsSchema = new mongoose.Schema({

}, { strict: false });
//For starters no schema will be defined

export default mongoose.model('News', NewsSchema);