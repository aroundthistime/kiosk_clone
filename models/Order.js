import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderNumber: { // 주문번호
    type: Number,
    required: true,
  },
  choices: [ // 주문내용(각 메뉴와 그 수량)
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
  isTakeout: { // 포장여부
    type: Boolean,
    required: true,
  },
  isChecked: { // 주방페이지에서 해당 주문을 확인했는지 여부
    type: Boolean,
    default: false,
  },
  isAlarmed: { // 주방페이지에서 해당 주문이 알림음을 발생시켰는지 여부
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  price: { // 주문에 포함된 메뉴 총 금액
    type: Number,
    required: true,
  },
  isCompleted: { // 주문완료 여부
    type: Boolean,
    default: false,
  },
});

const model = mongoose.model('Order', OrderSchema);
export default model;
