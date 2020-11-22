import mongoose from 'mongoose';

const MenuSchema = new mongoose.Schema({
  menu_type: {
    type: String,
    required: true,
  },
  name_kor: {
    type: String,
    required: true,
  },
  name_eng: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required() {
      return !(this.isSetMenu);
    },
  },
  price: {
    type: Number,
    required: true,
  },
  calorie: {
    type: Number,
    required() {
      return !(this.isSetMenu) || this.isDefaultSet;
    },
  },
  isSetMenu: {
    type: Boolean,
    required: true,
  },
  isDefaultSet: {
    type: Boolean,
    required() {
      return this.isSetMenu;
    },
  },
  drinks: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'menus',
    required() {
      return this.isSetMenu;
    },
  },
  sideMenu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'menus',
    requried() {
      return this.isSetMenu;
    },
  },
  ingredients_nonAllergic_kor: [
    {
      type: String,
      required() {
        return !(this.menu_type === 'DRINKS' || this.menu_type === 'DESSERTS');
      },
    },
  ],
  ingredients_nonAllergic_eng: [
    {
      type: String,
      required() {
        return !(this.menu_type === 'DRINKS' || this.menu_type === 'DESSERTS');
      },
    },
  ],
  ingredients_allergic_kor: [
    {
      type: String,
      required() {
        return !(this.menu_type === 'DRINKS' || this.menu_type === 'DESSERTS');
      },
    },
  ],
  ingredients_allergic_eng: [
    {
      type: String,
      required() {
        return !(this.menu_type === 'DRINKS' || this.menu_type === 'DESSERTS');
      },
    },
  ],
  isSoldOut: {
    type: Boolean,
    default: false,
  },
  isDiscounted: {
    type: Number,
    default: 0,
  },
  isRecommended: {
    type: Boolean,
    default: true,
  },
});

const model = mongoose.model('Menu', MenuSchema);
export default model;
