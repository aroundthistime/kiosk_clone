import mongoose from 'mongoose';

const MenuSchema = new mongoose.Schema({
  menuType: {
    type: String,
    required: true,
  },
  nameKr: {
    type: String,
    required: true,
  },
  nameEng: {
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
  extraPrice: {
    type: Number,
    required() {
      return (this.menuType === 'DRINKS' || this.menuType === 'SIDES');
    },
  },
  calories: {
    type: Number,
    required() {
      return !(this.isSetMenu) || this.isDefaultCombo;
    },
  },
  isCombo: {
    type: Boolean,
    required: true,
  },
  defaultCombo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'menus',
  },
  isDefaultCombo: {
    type: Boolean,
    required() {
      return this.isSetMenu;
    },
  },
  drink: {
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
  ingredientsNonAllergicKr: [
    {
      type: String,
      required() {
        return !(this.menuType === 'DRINKS' || this.menuType === 'DESSERTS');
      },
    },
  ],
  ingredientsNonAllergicEng: [
    {
      type: String,
      required() {
        return !(this.menuType === 'DRINKS' || this.menuType === 'DESSERTS');
      },
    },
  ],
  ingredientsAllergicKr: [
    {
      type: String,
      required() {
        return !(this.menuType === 'DRINKS' || this.menuType === 'DESSERTS');
      },
    },
  ],
  ingredientsAllergicEng: [
    {
      type: String,
      required() {
        return !(this.menuType === 'DRINKS' || this.menuType === 'DESSERTS');
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