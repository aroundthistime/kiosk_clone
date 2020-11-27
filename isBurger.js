const NON_BURGER_MENU_TYPES = ['사이드', '음료', '디저트']; // 햄버거가 아닌 류들의 메뉴타입

export const isBurger = (menu) => {
  if (NON_BURGER_MENU_TYPES.includes(menu.menuType)) {
    return false;
  }
  return true;
};
