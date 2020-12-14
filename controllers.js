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

// 각 카테고리별로 그에 해당하는 메뉴목록 가지는 object 생성 함수 //
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

// index(고객주문) 페이지 렌더링 함수
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
    await getCategoryMenus(categories[i]); // 각 카테고리별로 그에 해당하는 메뉴들 연결
  }
  const drinks = await Menu.find({
    // 이 drinks와 sides는 세트메뉴용 옵션들
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
  const defaultDrinkId = defaultDrink[0] ? defaultDrink[0]._id : '';
  const defaultSideId = defaultSide[0] ? defaultSide[0]._id : '';
  res.render('index', {
    pageTitle: COMPANY_NAME,
    categories: categoriesWithMenu,
    drinks,
    sides,
    defaultDrinkId,
    defaultSideId,
  });
};

// 특정 메뉴 조회 API (고객주문페이지에서 메뉴블록 클릭시 실행)
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

// 주문에 포함된 각 메뉴를 Order 개체의 choices배열에 삽입
const saveOrderContent = async (orderContent) => new Promise(async (resolve) => {
  let menuId;
  if (orderContent.sideId) {
    // 세트메뉴이면
    const defaultCombo = await Menu.findById(orderContent.menuId);
    let menu = await Menu.find({
      // DB에서 해당 세트조합 개체 찾기
      nameKr: defaultCombo.nameKr,
      isCombo: true,
      drink: orderContent.drinkId,
      sideMenu: orderContent.sideId,
    });
    menu = menu[0];
    if (!menu) {
      // 해당 세트조합이 DB에 없는경우(새로 생성)
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
        isDiscounted: defaultCombo.isDiscounted,
        isRecommended: false,
      });
    }
    menuId = menu._id;
  } else {
    // 단품이면
    menuId = orderContent.menuId;
  }
  newOrder.choices.push({
    menu: menuId,
    amount: orderContent.amount,
  });
  resolve();
});

// 주문 전송 API
export const postSendOrder = async (req, res) => {
  const {
    body: { orderContents, totalPrice, isTakeout },
  } = req;
  try {
    let orderNum = 1;
    let lastOrder = await Order.find({}).sort({ _id: -1 }).limit(1);
    lastOrder = lastOrder[0]; // find로 찾으면 배열로 찾아지기 때문
    const currentDate = new Date().getDate();
    if (lastOrder && currentDate === lastOrder.date.getDate()) {
      // 기존에 주문이 하나도 없을 경우도 검사
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

// 매출분석 페이지 router 설정 //
// 매출분석 페이지 router
export const getSalesControllPage = async (req, res) => {
  try {
    const records = await Record.find();
    const orders = await Order.find().populate('choices.menu');
    // 모든 레코드 및 주문 기록을 페이지에 JSON으로 전달
    res.status(200).render('salesControll', {
      records,
      orders,
      pageTitle: COMPANY_NAME,
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

// 특정 날짜에 해당하는 기록 조회 API
export const getRecord = async (req, res) => {
  const {
    body: { date, content },
  } = req;
  // 해당 날짜의 새로운 데이터 생성
  const newRecord = new Record({
    date,
    content,
  });

  try {
    const record = await Record.findOne({ date });
    if (!record) {
      await newRecord.save();
    } else {
      await record.update({ $set: { content } });
    }

    const records = await Record.find();
    return res.status(200).json(records);
  } catch (error) {
    console.log(error.message);
    return res.status(400);
  }
};

// 모든 특이사항 관련 기록 조회 API
export const getAllRecords = async (req, res) => {
  try {
    // 모든 레코드 JSON으로 전달
    const records = await Record.find();
    return res.status(200).json(records);
  } catch (error) {
    console.log(error.message);
    return res.status(400);
  }
};

// 테이블 관련 주문 조회 API
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

// 주방 관리 페이지 router 설정 //
// 주방 관리 페이지 router
export const getKitchenPage = async (req, res) => {
  try {
    // 페이지를 읽기전에 먼저 기존 주문내역 수신
    const orders = await Order.find({
      isCompleted: false,
    })
      .sort({ orderNumber: -1 })
      .populate({
        // objectID로 읽어오는것 방지
        path: 'choices.menu',
        populate: { path: 'drink' },
      })
      .populate({
        path: 'choices.menu',
        populate: { path: 'sideMenu' },
      });

    res.status(200).render('kitchen', {
      orders,
      pageTitle: COMPANY_NAME,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400);
  }
};

// 주문내역 수신 API
export const getOrdersInKitchen = async (req, res) => {
  try {
    // 주문내역에 사이드메뉴와 음료메뉴 정보 결합
    const orders = await Order.find({
      isCompleted: false,
    })
      .sort({ _id: -1 })
      .populate({
        path: 'choices.menu',
        populate: { path: 'drink' },
      })
      .populate({
        path: 'choices.menu',
        populate: { path: 'sideMenu' },
      });

    return res.status(200).json(orders);
  } catch (error) {
    console.log(error.message);
    return res.status(400);
  }
};

// 주문 상태 확인 API
export const checkOrderStatus = async (req, res) => {
  const {
    body: { id },
  } = req;

  try {
    const order = await Order.findOne({ _id: id });
    await order.update({ $set: { isChecked: true } });
    return res.status(200).json();
  } catch (error) {
    console.log(error.message);
    return res.status(400);
  }
};

// 주문 알람 API
export const checkOrderAlarmStatus = async (req, res) => {
  const {
    body: { id },
  } = req;

  try {
    const order = await Order.findOne({ _id: id });
    await order.update({ $set: { isAlarmed: true } });
    return res.status(200).json();
  } catch (error) {
    console.log(error.message);
    return res.status(400);
  }
};

// 주문 진행 API
export const processOrder = async (req, res) => {
  const {
    body: { id, task },
  } = req;

  try {
    // 주문완료시
    if (task === 'complete') {
      const order = await Order.findOne({ _id: id });
      await order.update({
        $set: {
          isCompleted: true,
        },
      });
      return res.status(200).json();
    }
    // 주문취소시
    await Order.deleteOne({ _id: id });
    return res.status(200).json();
  } catch (error) {
    console.log(error.message);
    return res.status(400);
  }
};

// 메뉴등록 페이지 router 설정 //
// 메뉴등록 페이지 router
export const getRegisterPage = async (req, res) => {
  try {
    // register 페이지 렌더링 설정
    res.status(200).render('register', {
      pageTitle: COMPANY_NAME,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400);
  }
};

// 등록된 메뉴 출력 API
export const getMenus = async (req, res) => {
  const menus = await Menu.find();
  try {
    return res.status(200).json({
      result: 'success',
      msg: 'getMenus 연결',
      menus_list: menus,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400);
  }
};

// 메뉴 등록 API
export const postEditMenu = async (req, res) => {
  const {
    body: {
      objectId,
      singleInfo,
      comboInfo,
      setType,
    },
  } = req;

  try {
    // 기본 사이드메뉴와 음료를 지정
    const coke = await Menu.findOne({ nameKr: DEFAULT_DRINK });
    const frenchFries = await Menu.findOne({ nameKr: DEFAULT_SIDE });
    // 단품메뉴와 콤보메뉴 정보 JSON 파싱
    const comboMenu = comboInfo ? JSON.parse(comboInfo) : null;
    const singleMenu = JSON.parse(singleInfo);
    const isSetType = setType === 'true';

    // 단품 메뉴 생성 시 필요 항목 정리
    const newSingleMenu = {
      menuType: singleMenu.menuType,
      nameKr: singleMenu.nameKr,
      nameEng: singleMenu.nameEng,
      image: singleMenu.image,
      price: singleMenu.price,
      calories: singleMenu.calories,
      extraPrice: singleMenu.extraPrice ? singleMenu.extraPrice : 0,
      isCombo: false,
      ingredientsAllergicEng: singleMenu.ingredientsAllergicEng
        ? singleMenu.ingredientsAllergicEng : [],
      ingredientsAllergicKr: singleMenu.ingredientsAllergicKr
        ? singleMenu.ingredientsAllergicKr
        : [],
      ingredientsNonAllergicEng: singleMenu.ingredientsNonAllergicEng
        ? singleMenu.ingredientsNonAllergicEng
        : [],
      ingredientsNonAllergicKr: singleMenu.ingredientsNonAllergicKr
        ? singleMenu.ingredientsNonAllergicKr
        : [],
      isDiscounted: singleMenu.isDiscounted,
      isSoldOut: singleMenu.isSoldOut,
      isRecommended: singleMenu.isRecommended,
      isDiscontinued: singleMenu.isDiscontinued,
    };

    // 세트 메뉴 생성 시 필요 항목 정리
    const newComboMenu = {
      menuType: comboMenu.menuType,
      nameKr: comboMenu.nameKr,
      nameEng: comboMenu.nameEng,
      image: comboMenu.image,
      price: comboMenu.price,
      calories: comboMenu.calories,
      isCombo: true,
      isDefaultCombo: true,
      sideMenu: frenchFries,
      drink: coke,
      extraPrice: comboMenu.extraPrice,
      ingredientsAllergicEng: comboMenu.ingredientsAllergicEng,
      ingredientsAllergicKr: comboMenu.ingredientsAllergicKr,
      ingredientsNonAllergicEng: comboMenu.ingredientsNonAllergicEng
        ? comboMenu.ingredientsNonAllergicEng
        : [],
      ingredientsNonAllergicKr: comboMenu.ingredientsNonAllergicKr
        ? comboMenu.ingredientsNonAllergicKr
        : [],
      isDiscounted: comboMenu.isDiscounted,
      isSoldOut: comboMenu.isSoldOut,
      isRecommended: comboMenu.isRecommended,
      isDiscontinued: comboMenu.isDiscontinued,
    };

    // 새로운 메뉴를 등록하는 경우
    if (objectId === '') {
      if (!isSetType) { // 세트메뉴가 포함되지 않는 메뉴라면
        const newMenu = await Menu.create(newSingleMenu);
        await newMenu.save();
      } else { // 세트메뉴가 있는 버거류의 경우
        const single = await Menu.create(newSingleMenu);
        const combo = await Menu.create(newComboMenu);
        single.defaultCombo = combo.id;
        single.save();
      }
    } else { // 기존 메뉴를 수정하는 경우
      if (!isSetType) { // 세트메뉴 없는 단품 메뉴 수정 시
        await Menu.updateOne(
          { _id: objectId },
          {
            $set: newSingleMenu,
          },
        );
      } else { // 세트 메뉴를 포함하는 버거류 메뉴 수정 시
        await Menu.updateOne(
          { _id: singleMenu.objectId },
          {
            $set: newSingleMenu,
          },
        );

        await Menu.updateOne(
          { _id: comboMenu.objectId },
          {
            $set: newComboMenu,
          },
        );
      }
    }
    return res.status(200).json({
      result: 'success',
      msg: '요청을 post했다.',
    });
  } catch (error) {
    res.status(400);
    console.log(error);
  } finally {
    res.end();
  }
};

// 일람핀 router 설정 //
// 알림판 router
export const getNoticeBoard = (req, res) => {
  res.render('noticeBoard', {
    pageTitle: `알림판 | ${COMPANY_NAME}`,
  });
};

// 모든 알림판 주문 내역 조회 API
export const getNewOrders = async (req, res) => {
  const {
    params: { date },
  } = req;
  const today = moment(date).format('YYYY-MM-DD');

  try {
    const orders = await Order.find({
      date: {
        $gte: new Date(`${today} 00:00:00`),
        $lte: new Date(`${today} 23:59:59`),
      },
    });
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error.message);
    return res.status(400);
  }
};
// 특정 주문 내역 조회 API
export const getNewOrderById = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const order = await Order.findById(id);
    if (!order) {
      // 주문 취소된 경우
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
