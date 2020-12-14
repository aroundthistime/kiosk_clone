import mongoose from 'mongoose';

const MenuSchema = new mongoose.Schema({
  menuType: { // 메뉴의 카테고리(한글) ex)와퍼
    type: String,
    required: true,
  },
  nameKr: { // 메뉴이름(한글)
    type: String,
    required: true,
  },
  nameEng: { // 메뉴이름(영어)
    type: String,
    required: true,
  },
  image: { // 메뉴 이미지 url
    type: String,
    required() {
      return !this.isCombo || this.isDefaultCombo;
    },
  },
  price: { // 메뉴 가격(할인과 무관)
    type: Number,
    required: true,
  },
  extraPrice: { // 세트메뉴에서 옵션으로 선택시 추가금액
    type: Number,
    required() {
      return this.menuType === '음료' || this.menuType === '사이드';
    },
  },
  calories: {
    type: Number,
    required() {
      return !this.isCombo || this.isDefaultCombo;
    },
  },
  isCombo: { // 세트메뉴인지 여부
    type: Boolean,
    required: true,
  },
  defaultCombo: { // 버거단품의 경우 가지는 해당 버거, 코카콜라(M), 감자튀김(M)으로 구성된 기본 구성의 세트
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
  },
  isDefaultCombo: { // 해당 메뉴가 defaultCombo인지 여부
    type: Boolean,
    required() {
      return this.isCombo;
    },
  },
  drink: { // 세트메뉴일 경우 선택된 음료 옵션
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required() {
      return this.isCombo;
    },
  },
  sideMenu: { // 세트메뉴일 경우 선택된 사이드 옵션
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    requried() {
      return this.isCombo;
    },
  },
  ingredientsNonAllergicKr: [ // 알레르기 무관한 재료목록(한글)
    {
      type: String,
      required() {
        return !(this.menuType === '음료');
      },
    },
  ],
  ingredientsNonAllergicEng: [ // 알레르기 무관한 재료목록(영어)
    {
      type: String,
      required() {
        return !(this.menuType === '음료');
      },
    },
  ],
  ingredientsAllergicKr: [ // 알레르기 유발가능 재료목록(한글)
    {
      type: String,
      required() {
        return !(this.menuType === '음료');
      },
    },
  ],
  ingredientsAllergicEng: [ // 알레르기 유발가능 재료목록(영어)
    {
      type: String,
      required() {
        return !(this.menuType === '음료');
      },
    },
  ],
  isSoldOut: { // 품절여부
    type: Boolean,
    default: false,
  },
  isDiscounted: { // 할인여부 (0이 들어가면 할인안됨, 그 외의 값이 들어가면 해당 금액만큼 할인)
    type: Number,
    default: 0,
  },
  isRecommended: { // 추천메뉴인지 여부
    type: Boolean,
    default: true,
  },
  isDiscontinued: { // 단종여부
    type: Boolean,
    default: false,
  },
});

const model = mongoose.model('Menu', MenuSchema);
export default model;
