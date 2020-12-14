import mongoose from 'mongoose';

const RecordSchema = new mongoose.Schema({
  content: {  // (선택 날짜의) 매출 특이사항 기록
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
