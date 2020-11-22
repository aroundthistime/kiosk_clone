export const fakeCustomerPage = (req, res) => {
  // const categoriesWithMenu = [];
  // categoriesWithMenu.push({
  //   nameEng: 'BEST',
  //   nameKr: '추천메뉴',
  //   menus: [],
  // });
  // categories.forEach((category) => {
  //   categoriesWithMenu.push({
  //     nameEng: category.nameEng,
  //     nameKr: category.nameKr,
  //     menus: [],
  //   });
  // });
  res.render('index', {
    // pageTitle: COMPANY_NAME,
    // isCustomerPage: true, // 해당 페이지가 고객주문 페이지인지 메뉴관리 페이지인지 구별
    // categories: categoriesWithMenu,
    // drinks: [],
    // sides: [],
    // defaultDrink: {},
    // defaultSide: {},
  });
};

export const salesControllPage = (req, res) => {
  res.render('salesControll', {});
}