'use strict';

import * as mongoose from 'mongoose';
import { registerEvents } from './thing.sockets';

var ThingSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(ThingSchema);
export default mongoose.model('Thing', ThingSchema);
