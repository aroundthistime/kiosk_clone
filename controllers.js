// import Menu from '../models/Menu';
// import Order from '../models/Order';

// const DRINKS = '음료';
// const SIDES = '사이드';
// const DEFAULT_DRINK = '코카콜라 (M)'; // 세트 선택시 기본으로 선택되는 음료 이름
// const DEFAULT_SIDE = '감자튀김 (M)'; // 세트 선택시 기본으로 선택되는 사이드 이름
const COMPANY_NAME = 'BURGERKING';

const categories = [
  {
    nameEng: 'PREMIUM',
    nameKr: '프리미엄',
  },
  {
    nameEng: 'WHOPPERS',
    nameKr: '와퍼',
  },
  {
    nameEng: 'CHICKENS',
    nameKr: '치킨버거',
  },
  {
    nameEng: 'SIDES',
    nameKr: '사이드',
  },
  {
    nameEng: 'DRINKS',
    nameKr: '음료',
  },
  {
    nameEng: 'DESSERTS',
    nameKr: '디저트',
  },
];

export const fakeCustomerPage = (req, res) => {
  const categoriesWithMenu = [];
  categoriesWithMenu.push({
    nameEng: 'BEST',
    nameKr: '추천메뉴',
    menus: [],
  });
  categories.forEach((category) => {
    categoriesWithMenu.push({
      nameEng: category.nameEng,
      nameKr: category.nameKr,
      menus: [],
    });
  });
  res.render('index', {
    pageTitle: COMPANY_NAME,
    isCustomerPage: true, // 해당 페이지가 고객주문 페이지인지 메뉴관리 페이지인지 구별
    categories: categoriesWithMenu,
    drinks: [],
    sides: [],
    defaultDrink: {},
    defaultSide: {},
  });
};

export const getCustomerPage = async (req, res) => {
  const categoriesWithMenu = []; // 카테고리별로 영어이름, 한국어이름, 그에 해당하는 메뉴들의 목록을 가짐
  const bestMenus = Menu.find({ isRecommended: true });
  categoriesWithMenu.push({
    nameEng: 'BEST',
    nameKr: '추천메뉴',
    menus: bestMenus,
  });
  categories.forEach(async (category) => {
    const menus = await Menu.find({
      menuType : category.nameKr, // 해당 카테고리에 속하며
      isDiscontinued: false, // 판매중단되지 않은 메뉴
    });
    categoriesWithMenu.push({
      nameEng: category.nameEng,
      nameKr: category.nameKr,
      menus,
    });
  });
  const drinks = await Menu.find({
    menuType : DRINKS, // 음료이면서
    isDiscontinued: false, // 판매중이고
    isSoldOut: false, // 품절되지 않은 메뉴
  });
  const sides = await Menu.find({
    menuType: SIDES,
    isDiscontinued: false,
    isSoldOut: false,
  });
  const defaultDrink = await Menu.find({ nameKr: DEFAULT_DRINK });
  const defaultSide = await Menu.find({ nameKr: DEFAULT_SIDE });
  res.render('index', {
    pageTitle: COMPANY_NAME,
    isCustomerPage: true, // 해당 페이지가 고객주문 페이지인지 메뉴관리 페이지인지 구별
    categories: categoriesWithMenu,
    drinks,
    sides,
    defaultDrink,
    defaultSide,
  });
};

export const getMenuDetails = async (req, res) => {
  const {
    params: { id },
  } = req; // get menu id from params
  try {
    const menu = await Menu.findById(id);
    res.json(menu);
  } catch (error) {
    console.log(error);
    res.status(400);
  } finally {
    res.end();
  }
};

export const postSendOrder = async (req, res) => {
  const {
    body: { orderContents, totalPrice, isTakeout },
  } = req;
  try {
    const orderNum = 1;
    const lastOrder = await Order.find({}).sort({ _id: -1 }).limit(1);
    const todaysDate = new Date().getDate();
    if (lastOrder && todaysDate === lastOrder.date.getDate()) { // 주문이 기존에 하나도 없을 경우 대비하여 last Order 있는지도 검사해줘야함
      orderNum = lastOrder.orderNumber + 1;
    }
    const newOrder = await Order.create({
      orderNumber: orderNum,
      isTakeout,
      price: totalPrice,
    });
    orderContents.forEach(async (orderContent) => {
      let menu;
      if (orderContent.sideId) { // 세트메뉴이면
        menu = await Menu.find({
          _id: orderContent.menuId,
          sideMenu: ObjectId(orderContent.sideId),
          drink: ObjectId(orderContent.drinkId),
        });
        if (!menu){//해당 세트조합이 menu db상에 아직 안 만들어져있으면
          menu = Menu.create({
            nameKr : ,
            isCombo : true,
            drink : drinkId
          })
        }
      } else { // 단품이면
        menu = await Menu.findById(orderContent.menuId);
      }
      newOrder.choices.push(menu);
    });
    Order.save();
    res.json(orderNum);
  } catch (error) {
    console.log(error);
  } finally {
    res.end();
  }
};
