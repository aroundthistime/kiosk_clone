import axios from 'axios';
import routes from '../../routes';

const categories = document.querySelectorAll('.category');
const menuLists = document.querySelectorAll('.menu-list');
const menuBlocks = document.querySelectorAll('.menuBlock');

const languageSettingsToggle = document.getElementById('languageCheckbox');
const customerFinalOrderBtn = document.getElementById('customerFinalOrderBtn');
const customerFinalCancelBtn = document.getElementById('customerFinalCancelBtn');
const shoppingCartEmptyMessage = document.getElementById('shoppingCartEmptyMessage');

// popups
const menuDetailsPopup = document.getElementById('menuDetails');
const comboSinglePopup = document.getElementById('comboSinglePopup');
const forHereToGoPopup = document.getElementById('forHereTogoPopup');
const orderResultPopup = document.getElementById('orderResult');
const overlay = document.getElementById('overlay');
const loadingPopup = document.getElementById('loadingPopup');

let selectedMenu;
let lastMouseMove;
let usingKorean = true;

const SELECTED_CATEGORY_CLASSNAME = 'category--selected';
const INVISIBLE = 'hidden'; // classname that makes element invisible;
const SOLD_OUT_CLASSNAME = 'menuBlock--sold-out';
const THREE_MINUTES_TO_MILLISECONDS = 180000;
const TEN_SECONDS_TO_MILLISECONDS = 10000;
const NON_BURGER_MENU_TYPES = ['사이드', '음료', '디저트']; // 햄버거가 아닌 류들의 메뉴타입

const hidePopup = (popup) => {
  overlay.classList.add(INVISIBLE);
  popup.classList.add(INVISIBLE);
};

const showPopup = (popup) => {
  overlay.classList.remove(INVISIBLE);
  popup.classList.remove(INVISIBLE);
};

const changeLanguage = () => {
  document.querySelectorAll('.language-convertable').forEach((text) => {
    if (usingKorean) {
      if (text.classList.contains('language-convertable--kr')) {
        text.classList.remove(INVISIBLE);
      } else {
        text.classList.add(INVISIBLE);
      }
    } else if (text.classList.contains('language-convertable--eng')) {
      text.classList.remove(INVISIBLE);
    } else {
      text.classList.add(INVISIBLE);
    }
  });
};

const selectLanguage = async (event) => {
  usingKorean = !languageSettingsToggle.checked;
  showPopup(loadingPopup);
  await changeLanguage();
  hidePopup(loadingPopup);
};

const selectCategory = (event) => {
  let selectedCategory = event.target;
  while (!selectedCategory.classList.contains('category')) {
    selectedCategory = selectedCategory.parentNode; // in case the click event happened on the span
  }
  const categoryName = selectedCategory.querySelector('.category-name').innerText; // 영문 카테고리명
  categories.forEach((category) => {
    if (category.classList.contains(categoryName)) {
      category.classList.add(SELECTED_CATEGORY_CLASSNAME); // 카테고리탭(Tab) 선택처리
    } else {
      category.classList.remove(SELECTED_CATEGORY_CLASSNAME);
    }
  });
  menuLists.forEach((menuList) => {
    if (menuList.classList.contains(`menu-list__${categoryName}`)) { // 선택한 카테고리의 메뉴목록(만) 보여줌
      menuList.classList.remove(INVISIBLE);
    } else {
      menuList.classList.add(INVISIBLE);
    }
  });
};

const prepareCategories = () => {
  categories.forEach((category) => {
    category.addEventListener('click', selectCategory);
    if (category.classList.contains('BEST')) { // set default category
      category.click(); // select category 실행
    }
  });
};

const isDiscounted = (menu) => {
  if (menu.isDiscounted === 0) {
    return false;
  }
  return true;
};

const fillIngredientsList = (ingredientsDOM, ingredients) => {
  // ingredientsDOM은 html문서상 재료목록 담는 span, ingredients는 Menu 개체가 가지는 재료의 리스트
  ingredientsDOM.innerText = ''; // 해당 ingredients DOM의 내용 초기화
  ingredients.forEach((ingredient) => {
    const ingredientSpan = document.createElement('SPAN');
    ingredientSpan.classList.add('ingredient');
    ingredientSpan.innerText = ingredient;
    ingredientsDOM.appendChild(ingredientSpan);
  });
};

const fillMenuDetailsPopup = (isCombo) => {
  const singleComboOption = document.getElementById('singleComboOption');
  const menuNameBox = document.getElementById('menuDetailsMenuName');
  const menuNameKr = menuNameBox.querySelector('.language-convertable--kr');
  const menuNameEng = menuNameBox.querySelector('.language-convertable--eng');
  const menuImg = document.getElementById('menuDetailsImg');
  const menuPrice = document.getElementById('menuDetailsPrice');
  const menuCalories = document.getElementById('menuDetailsCalories');
  const ingredientsNonAllergicKr = document.getElementById('ingredientsNonAllergicKr');
  const ingredientsAllergicKr = document.getElementById('ingredientsAllergicKr');
  const ingredientsNonAllergicEng = document.getElementById('ingredientsNonAllergicEng');
  const ingredientsAllergicEng = document.getElementById('ingredientsAllergicEng');
  const drinkOption = document.getElementById('menuDetailsDrink');
  const sideOption = document.getElementById('menuDetailsSide');
  menuNameKr.innerText = selectedMenu.nameKr;
  menuNameEng.innerText = selectedMenu.nameEng;
  menuImg.src = selectedMenu.image;
  if (isDiscounted(selectedMenu)) {
    menuPrice.innerText = `${selectedMenu.isDiscounted} ₩`;
  } else {
    menuPrice.innerText = `${selectedMenu.price} ₩`;
  }
  menuCalories.innerText = `${selectedMenu.calories} Kcal`;
  fillIngredientsList(ingredientsNonAllergicKr, selectedMenu.ingredientsNonAllergicKr);
  fillIngredientsList(ingredientsAllergicKr, selectedMenu.ingredientsAllergicKr);
  fillIngredientsList(ingredientsNonAllergicEng, selectedMenu.ingredientsNonAllergicEng);
  fillIngredientsList(ingredientsAllergicEng, selectedMenu.ingredientsAllergicEng);
  if (isCombo) {
    singleComboOption.classList.remove('single');
    singleComboOption.classList.add('combo');
    document.querySelectorAll('.optionBlock--default').forEach((defaultOptionBlock) => {
      defaultOptionBlock.click(); // check the default options of drinks and sides
    });
    drinkOption.classList.remove(INVISIBLE);
    sideOption.classList.remove(INVISIBLE);
  } else {
    singleComboOption.classList.add('single');
    singleComboOption.classList.remove('combo');
    drinkOption.classList.add(INVISIBLE);
    sideOption.classList.add(INVISIBLE);
  }
  showPopup(menuDetailsPopup);
};

const isBurger = (menu) => {
  if (NON_BURGER_MENU_TYPES.includes(menu.menuType)) {
    return false;
  }
  return true;
};

const selectMenuBlock = async (event) => {
  let selectedMenuBlock = event.target;
  if (!selectedMenuBlock.classList.contains('menuBlock')) {
    selectedMenuBlock = selectedMenuBlock.parentNode;
  }
  const selectedMenuId = selectedMenuBlock.querySelector('.menu-id').innerText;
  const response = await axios({
    url: `/api/menu-details/${selectedMenuId}`,
    method: 'GET',
  });
  if (response.status === 200) {
    selectedMenu = response.data;
    if (isBurger(selectedMenu)) {
      showPopup(comboSinglePopup);
    } else {
      fillMenuDetailsPopup(false); // 버거가 아니므로 무조건 단품 => isCombo에 false전달
      showPopup(menuDetailsPopup);
    }
  }
};

const prepareMenuBlocks = () => {
  menuBlocks.forEach((menuBlock) => {
    if (!menuBlock.classList.contains(SOLD_OUT_CLASSNAME)) {
      menuBlock.addEventListener('click', selectMenuBlock);
    }
  });
};

const handleSingleBtnClick = (event) => {
  hidePopup(comboSinglePopup);
  fillMenuDetailsPopup(false); // isCombo에 대해 false 전달해줌
};

const handleComboBtnClick = async (event) => {
  hidePopup(comboSinglePopup);
  const response = await axios({
    url: `/api/menu-details/${selectedMenu.defaultCombo}`,
    method: 'GET',
  });
  selectedMenu = response.data;
  fillMenuDetailsPopup(true); // isCombo에 대해 true 전달
};

const handlePopupCancel = (event) => {
  let popup = event.target;
  while (!popup.classList.contains('popup')) {
    popup = popup.parentNode;
  }
  hidePopup(popup);
};

const prepareComboSinglePopup = () => {
  const singleBtn = comboSinglePopup.querySelector('.binary-option--single');
  const comboBtn = comboSinglePopup.querySelector('.binary-option--combo');
  const cancelBtn = comboSinglePopup.querySelector('.binary-options-popup__cancel');
  singleBtn.addEventListener('click', handleSingleBtnClick);
  comboBtn.addEventListener('click', handleComboBtnClick);
  cancelBtn.addEventListener('click', handlePopupCancel);
};

const selectOptionBlock = (event) => {
  let selectedOptionBlock = event.target;
  while (!selectedOptionBlock.classList.contains('optionBlock')) {
    selectedOptionBlock = selectedOptionBlock.parentNode;
  }
  const optionsList = selectedOptionBlock.parentNode;// either <side options list> or <drinks options list>
  optionsList.querySelectorAll('.optionBlock').forEach((optionBlock) => {
    if (optionBlock === selectedOptionBlock) {
      optionBlock.classList.add('optionBlock--selected');
    } else {
      optionBlock.classList.remove('optionBlock--selected');
    }
  });
};

const getShoppingCartTotalPrice = () => { // return the pure int version of total price of shopping cart
  const shoppingCartTotalPrice = document.getElementById('shoppingCartTotalPrice');
  return parseInt(shoppingCartTotalPrice.innerText.substring(0, shoppingCartTotalPrice.innerText.length - 2)); // length-2는 " ₩"을 제거해주기 위함
};

const reduceOrderAmount = (event) => {
  let clickedReduceBtn = event.target;
  while (!clickedReduceBtn.classList.contains('amount__btn')) {
    clickedReduceBtn = clickedReduceBtn.parentNode;
  }
  const clickedOrderBar = clickedReduceBtn.parentNode.parentNode;
  const reducedPrice = parseInt(clickedOrderBar.querySelector('.order__price--original').innerText); // change amount, price inside the shopping cart
  const clickedOrderAmount = clickedOrderBar.querySelector('.amount__current');
  clickedOrderAmount.innerText = parseInt(clickedOrderAmount.innerText) - 1;
  const clickedOrderPrice = clickedOrderBar.querySelector('.order__price');
  clickedOrderPrice.innerText = parseInt(clickedOrderPrice.innerText) - reducedPrice;
  const shoppingCartTotalAmount = document.getElementById('shoppingCartTotalAmount'); // change amount, price in the total price, amount of shopping cart
  const shoppingCartTotalPrice = document.getElementById('shoppingCartTotalPrice');
  shoppingCartTotalAmount.innerText = parseInt(shoppingCartTotalAmount.innerText) - 1;
  shoppingCartTotalPrice.innerText = `${getShoppingCartTotalPrice() - reducedPrice} ₩`;
  if (clickedOrderAmount.innerText === '1') {
    clickedReduceBtn.removeEventListener('click', reduceOrderAmount);
    clickedReduceBtn.classList.add('disabled');
  }
};

const increaseOrderAmount = (event) => {
  let clickedIncreaseBtn = event.target;
  while (!clickedIncreaseBtn.classList.contains('amount__btn')) {
    clickedIncreaseBtn = clickedIncreaseBtn.parentNode;
  }
  const clickedOrderBar = clickedIncreaseBtn.parentNode.parentNode;
  const increasedPrice = parseInt(clickedOrderBar.querySelector('.order__price--original').innerText); // change amount, price inside the shopping cart
  const clickedOrderAmount = clickedOrderBar.querySelector('.amount__current');
  clickedOrderAmount.innerText = parseInt(clickedOrderAmount.innerText) + 1;
  const clickedOrderPrice = clickedOrderBar.querySelector('.order__price');
  clickedOrderPrice.innerText = parseInt(clickedOrderPrice.innerText) + increasedPrice;
  const shoppingCartTotalAmount = document.getElementById('shoppingCartTotalAmount'); // change amount, price in the total price, amount of shopping cart
  const shoppingCartTotalPrice = document.getElementById('shoppingCartTotalPrice');
  shoppingCartTotalAmount.innerText = parseInt(shoppingCartTotalAmount.innerText) + 1;
  shoppingCartTotalPrice.innerText = `${getShoppingCartTotalPrice() + increasedPrice} ₩`;
  const reduceBtn = clickedOrderBar.querySelector('.amount__btn--reduce'); // reactive order reduce btn
  reduceBtn.addEventListener('click', reduceOrderAmount);
  reduceBtn.classList.remove('disabled');
};

const handleFinalOrderBtnClick = (event) => { // must decide between 포장 & 매장 first if you click 최종주문 버튼
  showPopup(forHereToGoPopup);
};

const removeOrderBar = (event) => {
  let clickedOrderBar = event.target;
  while (!clickedOrderBar.classList.contains('shopping-cart__order')) {
    clickedOrderBar = clickedOrderBar.parentNode;
  }
  const clickedOrderBarPrice = parseInt(clickedOrderBar.querySelector('.order__price').innerText);
  const clickedOrderBarAmount = parseInt(clickedOrderBar.querySelector('.amount__current').innerText);
  const shoppingCartTotalPrice = document.getElementById('shoppingCartTotalPrice'); // modify total shopping cart infos
  const shoppingCartTotalAmount = document.getElementById('shoppingCartTotalAmount');
  shoppingCartTotalPrice.innerText = `${getShoppingCartTotalPrice() - clickedOrderBarPrice} ₩`;
  shoppingCartTotalAmount.innerText = parseInt(shoppingCartTotalAmount.innerText) - clickedOrderBarAmount;
  clickedOrderBar.parentNode.removeChild(clickedOrderBar); // remove clicked orderbar from html
  if (shoppingCartTotalAmount.innerText === '0') { // if shopping cart is empty
    shoppingCartEmptyMessage.classList.remove(INVISIBLE);
    customerFinalOrderBtn.classList.add('btn--disabled');
    customerFinalOrderBtn.removeEventListener('click', handleFinalOrderBtnClick);
  }
};

const addToCart = (menu, price, drink = null, side = null) => {
  const shoppingCart = document.getElementById('shoppingCartOrders');
  const orderBar = document.createElement('DIV');
  orderBar.classList.add('shopping-cart__order');
  const orderBarMenu = document.createElement('DIV'); // 메뉴이름 (및 ID값) column
  orderBarMenu.classList.add('order__column');
  orderBarMenu.classList.add('order__menu');
  const menuNameKr = document.createElement('SPAN');
  menuNameKr.classList.add('menu-name');
  menuNameKr.classList.add('language-convertable');
  menuNameKr.classList.add('language-convertable--kr');
  menuNameKr.innerText = menu.nameKr;
  const menuNameEng = document.createElement('SPAN');
  menuNameEng.classList.add('menu-name');
  menuNameEng.classList.add('language-convertable');
  menuNameEng.classList.add('language-convertable--eng');
  menuNameEng.innerText = menu.nameEng;
  const menuId = document.createElement('SPAN');
  menuId.classList.add('menu-id');
  menuId.classList.add(INVISIBLE);
  menuId.innerText = menu._id;
  let drinkNameKr;
  let drinkNameEng;
  let drinkId;
  let sideNameKr;
  let sideNameEng;
  let sideId;
  if (drink) { // 세트구성이면 사이드, 음료에 대한 정보도 표시
    drinkNameKr = document.createElement('SPAN');
    drinkNameKr.classList.add('drink-name');
    drinkNameKr.classList.add('language-convertable');
    drinkNameKr.classList.add('language-convertable--kr');
    drinkNameKr.innerText = drink.nameKr;
    drinkNameEng = document.createElement('SPAN');
    drinkNameEng.classList.add('drink-name');
    drinkNameEng.classList.add('language-convertable');
    drinkNameEng.classList.add('language-convertable--eng');
    drinkNameEng.innerText = drink.nameEng;
    drinkId = document.createElement('SPAN');
    drinkId.classList.add('drink-id');
    drinkId.classList.add(INVISIBLE);
    drinkId.innerText = drink.id;
    sideNameKr = document.createElement('SPAN');
    sideNameKr.classList.add('side-name');
    sideNameKr.classList.add('language-convertable');
    sideNameKr.classList.add('language-convertable--kr');
    sideNameKr.innerText = side.nameKr;
    sideNameEng = document.createElement('SPAN');
    sideNameEng.classList.add('side-name');
    sideNameEng.classList.add('language-convertable');
    sideNameEng.classList.add('language-convertable--eng');
    sideNameEng.innerText = side.nameEng;
    sideId = document.createElement('SPAN');
    sideId.classList.add('side-id');
    sideId.classList.add(INVISIBLE);
    sideId.innerText = side.id;
  }
  if (usingKorean) { // only view the info of the current language settings
    menuNameEng.classList.add(INVISIBLE);
    if (drink) {
      drinkNameEng.classList.add(INVISIBLE);
      sideNameEng.classList.add(INVISIBLE);
    }
  } else {
    menuNameKr.classList.add(INVISIBLE);
    if (drink) {
      drinkNameKr.classList.add(INVISIBLE);
      sideNameKr.classList.add(INVISIBLE);
    }
  }
  orderBarMenu.appendChild(menuNameKr);
  orderBarMenu.appendChild(menuNameEng);
  orderBarMenu.appendChild(menuId);
  if (drink) {
    orderBarMenu.appendChild(drinkNameKr);
    orderBarMenu.appendChild(drinkNameEng);
    orderBarMenu.appendChild(drinkId);
    orderBarMenu.appendChild(sideNameKr);
    orderBarMenu.appendChild(sideNameEng);
    orderBarMenu.appendChild(sideId);
  }
  orderBar.appendChild(orderBarMenu);
  const orderBarAmount = document.createElement('DIV'); // 해당 메뉴 수량 확인 및 조절 column
  orderBarAmount.classList.add('order__column');
  orderBarAmount.classList.add('order__amount');
  const orderReduceBtn = document.createElement('DIV');
  orderReduceBtn.classList.add('amount__btn');
  orderReduceBtn.classList.add('amount__btn--reduce');
  orderReduceBtn.classList.add('order-bar__btn');
  orderReduceBtn.classList.add('disabled');
  const orderReduceIcon = document.createElement('I');
  orderReduceIcon.classList.add('fas');
  orderReduceIcon.classList.add('fa-minus');
  orderReduceBtn.appendChild(orderReduceIcon);
  orderReduceBtn.addEventListener('click', reduceOrderAmount);
  const orderCurrentAmount = document.createElement('DIV');
  orderCurrentAmount.classList.add('amount__current');
  orderCurrentAmount.innerText = 1; // 처음 장바구니에 담을 때는 무조건 수량 1로 설정
  const orderIncreaseBtn = document.createElement('DIV');
  orderIncreaseBtn.classList.add('amount__btn');
  orderIncreaseBtn.classList.add('amount__btn--increase');
  orderIncreaseBtn.classList.add('order-bar__btn');
  const orderIncreaseIcon = document.createElement('I');
  orderIncreaseIcon.classList.add('fas');
  orderIncreaseIcon.classList.add('fa-plus');
  orderIncreaseBtn.appendChild(orderIncreaseIcon);
  orderIncreaseBtn.addEventListener('click', increaseOrderAmount);
  orderBarAmount.appendChild(orderReduceBtn);
  orderBarAmount.appendChild(orderCurrentAmount);
  orderBarAmount.appendChild(orderIncreaseBtn);
  orderBar.appendChild(orderBarAmount);
  const orderBarPrice = document.createElement('DIV');
  orderBarPrice.classList.add('order__column');
  orderBarPrice.classList.add('order__price');
  orderBarPrice.innerText = price;
  orderBar.appendChild(orderBarPrice);
  const orderBarOriginalPrice = document.createElement('DIV'); // 해당 메뉴 1개당 가격 (메뉴 수량조절할때 참고용)
  orderBarOriginalPrice.classList.add('order__price--original');
  orderBarOriginalPrice.classList.add(INVISIBLE);
  orderBarOriginalPrice.innerText = price;
  orderBar.appendChild(orderBarOriginalPrice);
  const orderBarRemoveBtn = document.createElement('DIV');
  orderBarRemoveBtn.classList.add('order__column');
  orderBarRemoveBtn.classList.add('order__remove');
  orderBarRemoveBtn.classList.add('order-bar__btn');
  const orderBarRemoveIcon = document.createElement('I');
  orderBarRemoveIcon.classList.add('fas');
  orderBarRemoveIcon.classList.add('fa-times');
  orderBarRemoveBtn.appendChild(orderBarRemoveIcon);
  orderBarRemoveBtn.addEventListener('click', removeOrderBar);
  orderBar.appendChild(orderBarRemoveBtn);
  shoppingCart.appendChild(orderBar);
  const shoppingCartTotalPrice = document.getElementById('shoppingCartTotalPrice'); // modify total info of the shopping cart as well
  const shoppingCartTotalAmount = document.getElementById('shoppingCartTotalAmount');
  shoppingCartTotalPrice.innerText = `${getShoppingCartTotalPrice() + price} ₩`;
  shoppingCartTotalAmount.innerText = parseInt(shoppingCartTotalAmount.innerText) + 1;
  shoppingCartEmptyMessage.classList.add(INVISIBLE); // remove shopping cart empty message
  customerFinalOrderBtn.classList.remove('btn--disabled'); // able 최종주문 버튼
  customerFinalOrderBtn.addEventListener('click', handleFinalOrderBtnClick);
};

const alreadyInCart = (menuId, drinkId = null, sideId = null) => {
  if (drinkId) { // 세트
    return Array.from(document.querySelectorAll('.shopping-cart__order')).some((orderBar) => {
      let orderBarDrinkId = orderBar.querySelector('.drink-id');
      if (!orderBarDrinkId) { // 세트메뉴를 찾고있는데 단품이면
        return false;
      }
      const orderBarMenuId = orderBar.querySelector('.menu-id').innerText;
      const orderBarSideId = orderBar.querySelector('.side-id').innerText;
      orderBarDrinkId = orderBarDrinkId.innerText;
      if (orderBarMenuId === menuId && orderBarSideId === sideId && orderBarDrinkId === drinkId) {
        orderBar.querySelector('.amount__btn--increase').click(); // 이미 존재하면 수량 하나 증가
        return true;
      }
      return false;
    });
  } // 단품
  return Array.from(document.querySelectorAll('.shopping-cart__order')).some((orderBar) => {
    if (orderBar.querySelector('.drink-id')) { // 단품찾고있는데 세트메뉴이면
      return false;
    }
    const orderBarMenuId = orderBar.querySelector('.menu-id').innerText;
    if (orderBarMenuId === menuId) {
      orderBar.querySelector('.amount__btn--increase').click(); // 이미 존재하면 수량 하나 증가
      return true;
    }
    return false;
  });
};

const handleAddCartBtnClick = (event) => {
  const singleComboOption = document.getElementById('singleComboOption');
  let menuPrice = selectedMenu.price;
  if (singleComboOption.classList.contains('single')) {
    if (!alreadyInCart(selectedMenu._id)) {
      addToCart(selectedMenu, menuPrice);
    }
  } else {
    let selectedSide;
    let selectedDrink;
    document.querySelectorAll('.optionBlock--selected').forEach((selectedOptionBlock) => {
      const optionExtraPrice = selectedOptionBlock.querySelector('.optionBlock__extra-price').querySelector('span').innerText;
      menuPrice += parseInt(optionExtraPrice.substring(2, optionExtraPrice.length - 1));
      const optionNameBox = selectedOptionBlock.querySelector('.optionBlock__menu-name');
      const optionNameKr = optionNameBox.querySelector('.language-convertable--kr').innerText;
      const optionNameEng = optionNameBox.querySelector('.language-convertable--eng').innerText;
      const optionId = selectedOptionBlock.querySelector('.optionBlock__id').innerText;
      if (selectedOptionBlock.parentNode.classList.contains('option-list--side')) {
        selectedSide = {
          nameKr: optionNameKr,
          nameEng: optionNameEng,
          id: optionId,
        };
      } else {
        selectedDrink = {
          nameKr: optionNameKr,
          nameEng: optionNameEng,
          id: optionId,
        };
      }
    });
    console.log(selectedSide, selectedDrink);
    if (!alreadyInCart(selectedMenu._id, selectedDrink.id, selectedSide.id)) {
      addToCart(selectedMenu, menuPrice, selectedDrink, selectedSide);
    }
  }
  hidePopup(menuDetailsPopup);
};

const prepareMenuDetailsPopup = () => {
  const optionBlocks = document.querySelectorAll('.optionBlock');
  const cancelBtn = document.getElementById('menuDetailsCancelBtn');
  const addCartBtn = document.getElementById('menuDetailsAddCartBtn');
  optionBlocks.forEach((optionBlock) => {
    optionBlock.addEventListener('click', selectOptionBlock);
  });
  addCartBtn.addEventListener('click', handleAddCartBtnClick);
  cancelBtn.addEventListener('click', handlePopupCancel);
};

const getOrderContentsFromCart = () => {
  const shoppingCartOrders = document.getElementById('shoppingCartOrders');
  const orderContents = [];
  shoppingCartOrders.querySelectorAll('.shopping-cart__order').forEach((orderBar) => {
    const menuId = orderBar.querySelector('.menu-id').innerText;
    const price = parseInt(orderBar.querySelector('.order__price').innerText);
    const amount = parseInt(orderBar.querySelector('.amount__current').innerText);
    const sideIdSpan = orderBar.querySelector('.side-id');
    const drinkIdSpan = orderBar.querySelector('.drink-id');
    if (sideIdSpan) {
      orderContents.push({
        menuId,
        price,
        amount,
        drinkId: drinkIdSpan.innerText,
        sideId: sideIdSpan.innerText,
      });
    } else {
      orderContents.push({
        menuId,
        price,
        amount,
        drinkId: null,
        sideId: null,
      });
    }
  });
  return orderContents;
};

const sendOrder = async (orderContents, totalPrice, isTakeout) => {
  const response = await axios({
    url: routes.sendOrder,
    method: 'POST',
    data: {
      orderContents,
      totalPrice,
      isTakeout,
    },
  });
  const orderSuccessPopup = document.getElementById('orderSuccess');
  const orderFailPopup = document.getElementById('orderFail');
  if (response.status === 200) { // 주문성공
    const orderNum = document.getElementById('orderNum');
    orderNum.innerText = response.data; // 수신한 주문번호 대입
    orderSuccessPopup.classList.remove(INVISIBLE);
    orderFailPopup.classList.add(INVISIBLE);
  } else {
    orderSuccessPopup.classList.add(INVISIBLE);
    orderFailPopup.classList.remove(INVISIBLE);
  }
  hidePopup(loadingPopup);
  showPopup(orderResultPopup);
  setTimeout(refreshCustomerPage, TEN_SECONDS_TO_MILLISECONDS); // 주문번호 보여준 후에 10초후까지 확인버튼 누르지 않으면 자동 페이지갱신
};

const gatherOrderInfo = (event) => { // 포장여부 설정시 포장여부, 주문내용, 총 가격 모두 추출
  let eatingLocation = event.target;
  while (!eatingLocation.classList.contains('binary-option')) {
    eatingLocation = eatingLocation.parentNode;
  }
  hidePopup(forHereToGoPopup);
  showPopup(loadingPopup);
  let isTakeout;
  if (eatingLocation.classList.contains('binary-option--toGo')) {
    isTakeout = true;
  } else {
    isTakeout = false;
  }
  const orderContents = getOrderContentsFromCart();
  const totalPrice = getShoppingCartTotalPrice();
  sendOrder(orderContents, totalPrice, isTakeout);
};

const prepareForHereToGoPopup = () => {
  const forHereBtn = forHereToGoPopup.querySelector('.binary-option--forHere');
  const toGoBtn = forHereToGoPopup.querySelector('.binary-option--toGo');
  const closeBtn = forHereToGoPopup.querySelector('.binary-options-popup__cancel');
  forHereBtn.addEventListener('click', gatherOrderInfo);
  toGoBtn.addEventListener('click', gatherOrderInfo);
  closeBtn.addEventListener('click', handlePopupCancel);
};

const refreshCustomerPage = (event = null) => {
  location.reload();
  window.scrollTo(0, 0); // 페이지 하단에서 reload되는 것 방지
};
const prepareCustomerFinalBtns = () => {
  customerFinalCancelBtn.addEventListener('click', refreshCustomerPage);
};

const detectMouseMove = (event) => {
  const savedMouseMove = lastMouseMove = Math.random();
  setTimeout(() => { // refresh the page if no one uses the machine for 3 minutes
    if (lastMouseMove === savedMouseMove) {
      refreshCustomerPage();
    }
  }, THREE_MINUTES_TO_MILLISECONDS);
};

const initCustomerPage = () => {
  languageSettingsToggle.addEventListener('click', selectLanguage);
  prepareCategories();
  prepareMenuBlocks();
  prepareComboSinglePopup();
  prepareMenuDetailsPopup();
  prepareForHereToGoPopup();
  prepareCustomerFinalBtns(); // 최종 주문, 최종 취소 버튼
  document.getElementById('orderResultBtn').addEventListener('click', refreshCustomerPage); // 주문 다 끝나고 확인버튼 누르면 refresh
  window.addEventListener('mousemove', detectMouseMove);
};

if (languageSettingsToggle) { // 언어설정이 있으면 고객주문페이지
  initCustomerPage();
}
