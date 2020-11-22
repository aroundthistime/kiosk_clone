// import Menu from '../models/Menu';
// import Order from '../models/Order';

// const DRINKS = '음료';
// const SIDES = '사이드';
// const DEFAULT_DRINK = '코카콜라 (M)'; // 세트 선택시 기본으로 선택되는 음료 이름
// const DEFAULT_SIDE = '감자튀김 (M)'; // 세트 선택시 기본으로 선택되는 사이드 이름
const COMPANY_NAME = 'BURGERKING';

const categories = [
  {
    name_eng: 'PREMIUM',
    name_kor: '프리미엄',
  },
  {
    name_eng: 'WHOPPERS',
    name_kor: '와퍼',
  },
  {
    name_eng: 'CHICKENS',
    name_kor: '치킨버거',
  },
  {
    name_eng: 'SIDES',
    name_kor: '사이드',
  },
  {
    name_eng: 'DRINKS',
    name_kor: '음료',
  },
  {
    name_eng: 'DESSERTS',
    name_kor: '디저트',
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
      nameEng: category.name_eng,
      nameKr: category.name_kor,
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

// export const getCustomerPage = async (req, res) => {
//   const categoriesWithMenu = []; // 카테고리별로 영어이름, 한국어이름, 그에 해당하는 메뉴들의 목록을 가짐
//   const bestMenus = Menu.find({ isRecommended: true });
//   categoriesWithMenu.push({
//     nameEng: 'BEST',
//     nameKr: '추천메뉴',
//     menus: bestMenus,
//   });
//   categories.forEach(async (category) => {
//     const menus = await Menu.find({
//       category: category.name_kor, // 해당 카테고리에 속하며
//       isDiscontinued: false, // 판매중단되지 않은 메뉴
//     });
//     categoriesWithMenu.push({
//       nameEng: category.name_eng,
//       nameKr: category.name_kor,
//       menus,
//     });
//   });
//   const drinks = await Menu.find({
//     category: DRINKS, // 음료이면서
//     isDiscontinued: false, // 판매중이고
//     isSoldOut: false, // 품절되지 않은 메뉴
//   });
//   const sides = await Menu.find({
//     cateogry: SIDES,
//     isDiscontinued: false,
//     isSoldOut: false,
//   });
//   const defaultDrink = await Menu.find({ name_kor: DEFAULT_DRINK });
//   const defaultSide = await Menu.find({ name_kor: DEFAULT_SIDE });
//   res.render('index', {
//     pageTitle: COMPANY_NAME,
//     isCustomerPage: true, // 해당 페이지가 고객주문 페이지인지 메뉴관리 페이지인지 구별
//     categories: categoriesWithMenu,
//     drinks,
//     sides,
//     defaultDrink,
//     defaultSide,
//   });
// };

// export const getMenuDetails = async (req, res) => {
//   const {
//     params: { id },
//   } = req; // get menu id from params
//   try {
//     const menu = await Menu.findById(id);
//     res.json(menu);
//   } catch (error) {
//     console.log(error);
//     res.status(400);
//   } finally {
//     res.end();
//   }
// };

// export const postSendOrder = async (req, res) => {
//   const {
//     body: { orderContents, totalPrice, isTakeout },
//   } = req;
//   try {
//     const orderNum = 1;
//     const lastOrder = await Order.find({}).sort({ _id: -1 }).limit(1);
//     const todaysDate = new Date().getDate();
//     if (lastOrder && todaysDate === lastOrder.date.getDate()) { // 주문이 기존에 하나도 없을 경우 대비하여 last Order 있는지도 검사해줘야함
//       orderNum = lastOrder.order_number + 1;
//     }
//     const newOrder = await Order.create({
//       order_number: orderNum,
//       isTakeout,
//       price: totalPrice,
//     });
//     orderContents.forEach(async (orderContent) => {
//       let menu;
//       if (orderContent.sideId) { // 세트메뉴이면
//         menu = await Menu.find({
//           _id: orderContent.menuId,
//           sideMenu: ObjectId(orderContent.sideId),
//           drink: ObjectId(orderContent.drinkId),
//         });
//         if (!menu){//해당 세트조합이 menu db상에 아직 안 만들어져있으면
//           menu = Menu.create({
//             name_kor : ,
//             isSetMenu : true,
//             drinks : drinkId
//           })
//         }
//       } else { // 단품이면
//         menu = await Menu.findById(orderContent.menuId);
//       }
//       newOrder.choices.push(menu);
//     });
//     Order.save();
//     res.json(orderNum);
//   } catch (error) {
//     console.log(error);
//   } finally {
//     res.end();
//   }
// };
