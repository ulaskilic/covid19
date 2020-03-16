import * as mongoose from 'mongoose';

export const CovidSchema = new mongoose.Schema({
  timestamp: Date,
  day: String,
  type: String,
  name: String,
  code: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  region: String,
  subRegion: String,
  confirmed: Number,
  death: Number,
  cured: Number,
});
