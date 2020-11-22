import mongoose from 'mongoose';

const RecordSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const model = mongoose.model('Record', RecordSchema);
export default model;