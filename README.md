# kiosk_clone
 cloning a kiosk system for a fastfood shop

- [X] index의 18번쨰 줄 menu-list--selected나 그 위의 category--selected는 자바스크립트상으로 추천메뉴에 부여
- [x] 메뉴디테일팝업하기
- [X] 버튼따로 scss 뽑아내기
- [ ] 메뉴수정페이지 분류해서 if문으로 나누기
- [X] 메뉴디테일팝업에서 원화기호랑 Kcal 기호상수로 해서 만들기(&#8361;) ₩ 필요없을듯?
- [X] 메뉴디테일 킬때마다 기본 사이드 음료 설정하기
- [X] 디폴트 사이드, 음료의 이름 기호상수로 만들기
- [X] 메뉴의 카테고리가 음료, 사이드, ~ 아니면 팝업
- [X] optionBlock의 체크이미지 원래는 안보이고 optionBlock--selected밑에 있을때만 보이게
- [X] 팝업할 때 overlay생각
- [X] 상품에 주문이 하나라도 담기면 주문하기 버튼 활성화하고 아님 말고
- [X] 언어변환 남아있어야함
- [X] 상황봐서 수량조절의 disabled클래스네임을 btn--disabled으로 맞출지 고민해보기
- [X] prepareForHereToGoPopup
- [X] id로 mongoose reference하는거 되는지 확인해봐야됨 (ObjectId)
- [X] mongoose reference 1대1대응할 때 해당 개체 찾아서 직접넣어줘야하는지?
- [X] 세트메뉴는 굳이 칼로리, 가격, 
- [X] db완성되면 주문전송마저하기
- [X] language settings frontjavascript (selectLanguage함수) 다시 한 번 확인
- [X] menu 가짜로 넣어서 grid 손보기
- [X] 세트추가비용관련해서 연산수정
- [X] order만드는 곳에서 defaultMenu.sideMenu === sideId이부분되나 확인
- [X] customerPageFooter에서 orderBar css작업끝나면 주석처리(혹은 지우기)
- [X] isBurger제대로 되는지 확인 + 파일명 걍 isBurger로 둘 것인지?
- [X] css다 손보고 popup들에 hidden넣기
- [X] menu-list에 hidden 다시 넣기
- [ ] ingredients required defaultCombo 아닌 combo들은 필요없음

* 스키마 프로퍼티명 변경사항(기존과 내용 같은데 이름만 변경된 경우)

1. menu_type => menuType
2. name_kor => nameKr
3. name_eng => nameEng
4. calorie => calories
5. isSetMenu => isCombo
6. drinks => drink
7. ingredients_nonAllergic_kor => ingredientsNonAllergicKr
8. ingredients_nonAllergic_eng => ingredientsNonAllergicEng
9. ingredients_allergic_kor => ingredientsAllergicKr
10. ingredients_allergic_eng => ingredientsAllergicEng

11. order_number => orderNumber

12. record_content => content

* 디버깅모음
1. 2020/11/25 - controllers.js의 getMenuDetails에서 버거가 아닌 류가 선택된 경우 defaultCombo를 populate하면 안됨 => 검사문 추가 및 똑같은 버거류 검사문(isBurger)이 customerPage.js와 controllers.js에서 중복적으로 사용됨 -> 별도의 파일로 끄집어냄
2. 2020/11/25 - emptyMessage에서 .hidden이 적용되지 않음(display : none보다 display : flex가 우선순위가 더 높아짐) => .hidden에 !important 구문 추가
3. 2020/11/26 - 메뉴디테일 팝업에서 알레르기 유발성 재료에 대해서 한 span 안에 모두 넣으면 , 역시 빨간 글자가 되는 문제 발생 -> 알레르기 유발성 재료들을 각 재료별로 span을 만들어서 넣어주고 ::before로 콤마를 넣어서 연결시킴
4. 2020/11/27 - menu schema에서 일부 프로퍼티의 required가 이상하게 적용됨 => Menu Schema에서 required 판별 함수에서 기존 디비스키마의 잔존 프로퍼티인 isSetMenu => isCombo로 대체
5. 2020/11/27 - main.js에서 async/await으로 인해 "regeneratorruntime is not defined" 에러 발생 => babelrc수정 (브라우저를 크롬 최신버전으로 지정) 및 babel polyfill import
6. 2020/11/27 - 고객주문 페이지 3분이상 조작 없을시 자동 페이지 갱신이 이루어지지 않음 => if문의 조건식 lastMouseMove === savedMouseMove으로 변경
7. 2020/11/27 - selectLanguage함수가 hidePopup함수와 showPopup함수보다 먼저 등장하여 해당 함수들을 호출할 수 없음 => showPopup함수와 hidePopup함수를 코드 상단으로 이동
8. 2020/11/27 - 장바구니에 이미 담아있는 메뉴를 담을 경우 수량이 추가되는 것이 아니라 동일한 내용이 장바구니에 새로 추가됨 -> 장바구니에 담기를 눌렀을 때 해당 내용이 이미 장바구니에 있는지 검사하는 중간과정 추가
9. 2020/11/27 - 장바구니에 담긴 목록을 제거할 때 수량과 가격이 뒤바뀜 => removeOrderBar함수에서 장바구니 전체 수량, 가격 DOM element를 가져올 때 참조하는 ID를 원래대로 수정 (서로 바뀌어 있었음)
10. 2020/11/27 - 금일 날짜의 가장 최근 주문번호를 구할 수 없음 => .find 통해서 DB접근시 배열로 반환 따라서 find의 결과배열의 [0]을 최근 주문에 대입
11. 2020/11/27 - 메뉴블록의 한글메뉴이름이 보이지 않음 => 디비스키마 변경 전 프로퍼티명인 nameKor을 사용중이었음, nameKr을 대입하도록 코드수정
12. 2020/11/27 - 메뉴이름이 영어일 때 조금 잘림 => menuName의 height를 조금 늘려줌
13. 2020/11/27 - 고객주문화면의 카테고리들의 순서가 그때그때 다름 => categoriesWithMenu에 카테고리별로 개체 추가하는 작업 비동기처리로 변경
14. 2020/11/27 - 기본옵션대로 고르지 않은 세트를 주문할 때 Menu 개체 등록에서 오류 발생 => namekr에서 nameKr로 오타정정
15. 2020/11/27 - 언어 영어로 설정했을 때 알레르기 유발성 재료들이 빨갛게 표시되지 않는 오류 => ingredients--alergic에서 ingredients--allergic으로 오타정정