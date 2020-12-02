import moment from 'moment';
import Menu from './models/Menu';
import Order from './models/Order';
import Record from './models/Record';

const DRINKS = '음료';
const SIDES = '사이드';
const BEST = '추천메뉴';
const DEFAULT_DRINK = '코카콜라 (M)'; // 세트 선택시 기본으로 선택되는 음료 이름
const DEFAULT_SIDE = '감자튀김 (M)'; // 세트 선택시 기본으로 선택되는 사이드 이름
const COMPANY_NAME = 'BURGERKING';

let categoriesWithMenu = []; // 카테고리별로 영어이름, 한국어이름, 그에 해당하는 메뉴들의 목록을 가짐
let newOrder; // 새롭게 접수된 Order 개체 (함수 scope문제로 전역변수처리)

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

export const fakeDB = async (req, res) => {
  const single = await Menu.create({
    menuType: '와퍼',
    nameKr: '와퍼',
    nameEng: 'Whopper',
    image: 'https://d1cua0vf0mkpiy.cloudfront.net/images/menu/normal/a5146dcb-d6a6-4280-92be-25e8f4496fac.png',
    price: 5300,
    calories: 300,
    isCombo: false,
    ingredientsNonAllergicKr: ['김', '치', '찌', '개'],
    ingredientsNonAllergicEng: ['beef', 'pork', 'chicken', 'duck'],
    ingredientsAllergicKr: ['소', '갈', '비', '찜'],
    ingredientsAllergicEng: ['fish', 'eggs', 'shrimp', 'peanut'],
  });
  const drink = await Menu.create({
    menuType: '음료',
    nameKr: '코카콜라 (M)',
    nameEng: 'CocaCola (M)',
    image: 'https://d1cua0vf0mkpiy.cloudfront.net/images/menu/normal/fe2cdf8d-0487-4e5c-860a-beb85d223a3f.png',
    price: 1000,
    calories: 120,
    isCombo: false,
    extraPrice: 0,
    isRecommended: false,
  });
  const side = await Menu.create({
    menuType: '사이드',
    nameKr: '감자튀김 (M)',
    nameEng: 'French Fries (M)',
    image: 'https://d1cua0vf0mkpiy.cloudfront.net/images/menu/normal/84bd24cb-9b87-45bd-b371-b824c35018ad.png',
    price: 1500,
    calories: 150,
    isCombo: false,
    extraPrice: 0,
    isRecommended: false,
  });
  const combo = await Menu.create({
    menuType: '와퍼',
    nameKr: '와퍼 [세트]',
    nameEng: 'Whopper [Combo]',
    image: 'https://d1cua0vf0mkpiy.cloudfront.net/images/menu/normal/8d3c7992-5803-4445-b0f5-dca6cc877cfd.png',
    price: 7300,
    calories: 600,
    isCombo: true,
    isDefaultCombo: true,
    drink,
    sideMenu: side,
    ingredientsNonAllergicKr: ['김', '치', '찌', '개'],
    ingredientsNonAllergicEng: ['beef', 'pork', 'chicken', 'duck'],
    ingredientsAllergicKr: ['소', '갈', '비', '찜'],
    ingredientsAllergicEng: ['fish', 'eggs', 'shrimp', 'peanut'],
  });
  single.defaultCombo = combo.id;
  single.save();
  await Menu.create({
    menuType: '사이드',
    nameKr: '어니언링',
    nameEng: 'Onion Ring',
    image: 'https://d1cua0vf0mkpiy.cloudfront.net/images/menu/normal/47a6fc52-9e23-4770-8354-cabb545f5124.png',
    price: 2000,
    calories: 180,
    isCombo: false,
    extraPrice: 500,
    isRecommended: false,
  });
  res.redirect('/');
};

const getCategoryMenus = (category) => new Promise(async (resolve) => {
  const menus = await Menu.find({
    menuType: category.nameKr, // 해당 카테고리에 속하며
    isDiscontinued: false, // 판매중이고
    isCombo: false, // 단품인 메뉴들
  });
  categoriesWithMenu.push({
    nameEng: category.nameEng,
    nameKr: category.nameKr,
    menus,
  });
  resolve();
});

export const getCustomerPage = async (req, res) => {
  categoriesWithMenu = [];
  const bestMenus = await Menu.find({
    isRecommended: true,
    isCombo: false,
    isDiscontinued: false,
  });
  categoriesWithMenu.push({
    nameEng: 'BEST',
    nameKr: BEST,
    menus: bestMenus,
  });
  for (let i = 0; i < categories.length; i++) {
    await getCategoryMenus(categories[i]);
  }
  const drinks = await Menu.find({ // 이 drinks와 sides는 세트메뉴용 옵션들
    menuType: DRINKS, // 음료이면서
    isDiscontinued: false, // 판매중이고
    isSoldOut: false, // 품절되지 않은 메뉴
  });
  const sides = await Menu.find({
    menuType: SIDES,
    isDiscontinued: false,
    isSoldOut: false,
  });
  const defaultDrink = await Menu.find({ nameKr: DEFAULT_DRINK }).limit(1);
  const defaultSide = await Menu.find({ nameKr: DEFAULT_SIDE }).limit(1);
  const defaultDrinkId = defaultDrink[0]._id;
  const defaultSideId = defaultSide[0]._id;
  res.render('index', {
    pageTitle: COMPANY_NAME,
    isCustomerPage: true, // 해당 페이지가 고객주문 페이지인지 메뉴관리 페이지인지 구별
    categories: categoriesWithMenu,
    drinks,
    sides,
    defaultDrinkId,
    defaultSideId,
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

const saveOrderContent = async (orderContent) => new Promise(async (resolve) => {
  let menuId;
  if (orderContent.sideId) { // 세트메뉴이면
    const defaultCombo = await Menu.findById(orderContent.menuId);
    let menu = await Menu.find({ // DB에서 해당 세트조합 개체 찾기
      nameKr: defaultCombo.nameKr,
      isCombo: true,
      drink: orderContent.drinkId,
      sideMenu: orderContent.sideId,
    });
    menu = menu[0];
    if (!menu) { // 해당 세트조합이 DB에 없는경우(새로 생성)
      const selectedSide = await Menu.findById(orderContent.sideId);
      const selectedDrink = await Menu.findById(orderContent.drinkId);
      const extraPrice = selectedSide.extraPrice + selectedDrink.extraPrice;
      menu = await Menu.create({
        menuType: defaultCombo.menuType,
        nameKr: defaultCombo.nameKr,
        nameEng: defaultCombo.nameEng,
        price: defaultCombo.price + extraPrice,
        isCombo: true,
        isDefaultCombo: false,
        drink: orderContent.drinkId,
        sideMenu: orderContent.sideId,
        isDiscounted: defaultCombo.isDiscounted + extraPrice,
        isRecommended: false,
      });
    }
    menuId = menu._id;
  } else { // 단품이면
    menuId = orderContent.menuId;
  }
  newOrder.choices.push({
    menu: menuId,
    amount: orderContent.amount,
  });
  resolve();
});

export const postSendOrder = async (req, res) => {
  const {
    body: { orderContents, totalPrice, isTakeout },
  } = req;
  try {
    let orderNum = 1;
    let lastOrder = await Order.find({}).sort({ _id: -1 }).limit(1);
    lastOrder = lastOrder[0]; // find로 찾으면 배열로 찾아지기 때문
    console.log(orderNum);
    const currentDate = new Date().getDate();
    if ((lastOrder) && (currentDate === lastOrder.date.getDate())) { // 기존에 주문이 하나도 없을 경우도 검사
      orderNum = lastOrder.orderNumber + 1;
    }
    newOrder = await Order.create({
      orderNumber: orderNum,
      isTakeout,
      price: totalPrice,
    });
    const promises = orderContents.map((orderContent) => saveOrderContent(orderContent));
    await Promise.all(promises);
    newOrder.save();
    res.json(orderNum);
  } catch (error) {
    res.status(400);
    console.log(error);
  } finally {
    res.end();
  }
};

export const salesControllPage = async (req, res) => {
  try {
    const records = await Record.find();
    const orders = await Order.find().populate('choices.menu');
    res.status(200).render('salesControll', {
      records,
      orders,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      errors: {
        'access-error': error.message,
      },
    });
  }
};

export const getRecord = async (req, res) => {
  const {
    body: { date, content },
  } = req;
  const newRecord = new Record({
    date,
    content,
  });

  try {
    const record = await Record.findOne({ date });
    let data;
    if (!record) {
      data = await newRecord.save();
    } else {
      data = await record.update({ $set: { content } });
    }

    const records = await Record.find();
    return res.status(200).json(records);
  } catch (error) {
    console.log(error.message);
    return res.status(400);
  }
};

export const getAllRecords = async (req, res) => {
  try {
    const records = await Record.find();
    return res.status(200).json(records);
  } catch (error) {
    console.log(error.message);
    return res.status(400);
  }
};

export const getOrdersForTable = async (req, res) => {
  const {
    body: { start, end },
  } = req;
  try {
    // 입력받은 기간 내 주문내역
    const orders = await Order.find({
      date: {
        $gte: new Date(`${start} 00:00:00`),
        $lte: new Date(`${end} 23:59:59`),
      },
    }).populate('choices.menu');

    return res.status(200).json(orders);
  } catch (error) {
    console.log(error.message);
    return res.status(400);
  }
};

// 주문내역 더미데이터 임시 생성
export const makeDummyData = async (req, res) => {
  const menu = await Menu.findOne({
    menuType: ['와퍼', '음료', '사이드'][(Math.random() * 3) >> 0],
  });
  const date = moment().subtract((Math.random() * 200 + 1) >> 0, 'days');
  const orders = new Order({
    date,
    price: (Math.random() * 20000 + 1) >> 0,
    isCompleted: true,
    orderNumber: (Math.random() * 20000 + 1) >> 0,
    isTakeout: true,
    choices: {
      menu,
      amount: (Math.random() * 3 + 1) >> 0,
    },
  });
  try {
    const newOrder = await orders.save();
    res.status(200).json(newOrder);
  } catch (error) {
    console.log(error.message);
    res.status(400);
  }
};

export const getAlert = (req, res) => {
  res.render('alert', { pageTitle: `알림판 | ${COMPANY_NAME}` });
};

export const getPreparingOrders = async (req, res) => {
  try {
    const preparingOrders = await Order.find({ isCompleted: false });
    res.json(preparingOrders);
  } catch (error) {
    res.status(400);
    console.log(error);
  } finally {
    res.end();
  }
};

export const getCheckPreparingStatus = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const order = await Order.findById(id);
    if (!order) { // 주문 취소된 경우
      res.status(204);
    } else if (order.isCompleted) {
      res.json(true);
    } else {
      res.json(false);
    }
  } catch (error) {
    res.status(400);
    console.log(error);
  } finally {
    res.end();
  }
};
