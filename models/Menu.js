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
      return !this.isCombo || this.isDefaultCombo;
    },
  },
  price: {
    type: Number,
    required: true,
  },
  extraPrice: {
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
  isCombo: {
    type: Boolean,
    required: true,
  },
  defaultCombo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
  },
  isDefaultCombo: {
    type: Boolean,
    required() {
      return this.isCombo;
    },
  },
  drink: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required() {
      return this.isCombo;
    },
  },
  sideMenu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    requried() {
      return this.isCombo;
    },
  },
  ingredientsNonAllergicKr: [
    {
      type: String,
      required() {
        return !(this.menuType === '음료');
      },
    },
  ],
  ingredientsNonAllergicEng: [
    {
      type: String,
      required() {
        return !(this.menuType === '음료');
      },
    },
  ],
  ingredientsAllergicKr: [
    {
      type: String,
      required() {
        return !(this.menuType === '음료');
      },
    },
  ],
  ingredientsAllergicEng: [
    {
      type: String,
      required() {
        return !(this.menuType === '음료');
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
  isDiscontinued: {
    type: Boolean,
    default: false,
  },
});

const model = mongoose.model('Menu', MenuSchema);
export default model;
