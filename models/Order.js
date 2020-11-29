import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: Number,
    required: true,
  },
  choices: [
    {
      menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
      },
      amount: {
        type: Number,
      },
    },
  ],
  isTakeout: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  price: {
    type: Number,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const model = mongoose.model('Order', OrderSchema);
export default model;
