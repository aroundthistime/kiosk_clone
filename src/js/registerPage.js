if (window.location.pathname === '/registerMenu') {
  history.replaceState({}, null, location.pathname);

  // 세자릿수마다 콤마 찍어주는 함수
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // 메뉴등록 준비 함수 (+ 버튼을 누르면 실행)
  function openRegisterPopup() {
    // 팝업창을 준비 (폼은 비어있음)
    $('.dim').show();
    $('#register-popup').css('display', 'block');
    $('.register-or-edit').text('메뉴등록');

    $('.input-form1').scrollTop(0);
    $('.input-form2').scrollTop(0);

    const currentCategory = $('input:radio[name=categories]:checked').val();
    $(`input:radio[name=category][value=${currentCategory}]`).prop('checked', true);

    //버거류가 아닌 경우 단품/세트 탭 조작불가
    if (currentCategory === '사이드' || currentCategory === '음료' || currentCategory === '디저트') {
      $('#form-tabs > label').hide();
      $('.input-form1').css('height', 'calc(100% - 1rem)');
    } else {
      $('#form-tabs > label').show();
      $('.input-form1').css('height', 'calc(100% - 5rem)');
    }
  }

  // 메뉴수정 준비 함수 (메뉴카드의 a 태그 영역(메뉴사진+메뉴이름)을 누르면 실행)
  function openEditPopup() {
    // 1. 팝업창을 준비

    $('.dim').show();
    $('#register-popup').css('display', 'block');
    $('.register-or-edit').text('메뉴수정');

    $('.input-form1').scrollTop(0);
    $('.input-form2').scrollTop(0);

    const currentCategory = $('input:radio[name=categories]:checked').val();
    if (currentCategory === '사이드' || currentCategory === '음료' || currentCategory === '디저트') {
      $('#form-tabs > label').hide();
      $('.input-form1').css('height', 'calc(100% - 1rem)');
    } else {
      $('#form-tabs > label').show();
      $('.input-form1').css('height', 'calc(100% - 5rem)');
    }

    // 클릭한 a태그의 id(objectId)를 참조해서, DB에서 데이터를 GET한 뒤 폼에 차례로 입력
    // isCombo == true 일 경우와 == false 일 경우 두 가지 양식 데이터를 읽어옴

    $('.card').one('click', function () {
      let objectId = $(this).attr('id');
      $.ajax({
        type: 'GET',
        url: '/api/menus',
        data: {},
        success: function (response) {
          if (response['result'] === 'success') {
            // 단품 서식을 해당 메뉴의 값으로 채움
            let menuNum = 0;
            let menus = response['menus_list'];
            let singleToEdit = menus[0];

            while (menuNum < menus.length) {
              if (menus[menuNum]['_id'] === objectId) {
                singleToEdit = menus[menuNum]
                break;
              } else {
                menuNum += 1;
              }
            }

            $('#object-id-single').val(objectId);
            $('#product-image').val(singleToEdit['image']);

            let nameKr = singleToEdit['nameKr'];
            let nameEng = singleToEdit['nameEng'];

            // (버거류일 경우) 입력 당시의 상품이름만 남긴다
            if (nameKr.includes(' (단품)')) {
              nameKr = nameKr.substring(0, nameKr.length - 5);
            }
            if (nameEng.includes(' (Burger Only)')) {
              nameEng = nameEng.substring(0, nameEng.length - 13);
            }

            $('#name-kr').val(nameKr);
            $('#name-eng').val(nameEng);

            $('#calories').val(singleToEdit['calories']);
            $('#price').val(singleToEdit['price']);
            $('#extra-price').val(singleToEdit['extraPrice']);
            $('#is-discounted').val(singleToEdit['isDiscounted']);

            $(`input:radio[name=category][value=${singleToEdit['menuType']}]`).prop('checked', true);
            $(`input:radio[name=soldOut][value=${singleToEdit['isSoldOut'] + 0}]`).prop('checked', true); // boolean -> integer 형변환
            $(`input:radio[name=recommendation][value=${singleToEdit['isRecommended'] + 0}]`).prop('checked', true); // boolean -> integer 형변환
            $(`input:radio[name=discontinue][value=${singleToEdit['isDiscontinued'] + 0}]`).prop('checked', true); // boolean -> integer 형변환

            let nonAllergens = singleToEdit['ingredientsNonAllergicEng'];
            let allergens = singleToEdit['ingredientsAllergicEng'];

            for (let nonAllergen = 0; nonAllergen < nonAllergens.length; nonAllergen++) {
              $(`input:checkbox[name=ingredients][value=${nonAllergens[nonAllergen]}]`).prop('checked', true);
            }

            for (let allergen = 0; allergen < allergens.length; allergen++) {
              $(`input:checkbox[name=allergens][value=${allergens[allergen]}]`).prop('checked', true);
              $(`input:checkbox[name=ingredients][value=${allergens[allergen]}]`).prop('checked', true);
            }

            // 버거류(프리미엄/와퍼/치킨버거일 경우) 세트 서식을 해당 메뉴의 값으로 채움
            if (singleToEdit['menuType'] == '프리미엄' || singleToEdit['menuType'] == '와퍼' || singleToEdit['menuType'] == '치킨버거') {

              menuNum = 0;
              let comboToEdit = menus[0];
              while (menuNum < menus.length) {
                if (menus[menuNum]['nameKr'] === (nameKr + ' (세트)')) {
                  comboToEdit = menus[menuNum];
                  break;
                } else {
                  menuNum += 1;
                }
              }

              $('#object-id-combo').val(comboToEdit['_id']);
              $('#combo-image').val(comboToEdit['image']);
              $('#calories-combo').val(comboToEdit['calories']);
              $('#price-combo').val(comboToEdit['price']);
            }
          } else {
            alert('메뉴 받아오기 실패');
          }
        }
      });
    })
  }

  function closePopup() {
    //취소버튼 누를 시 폼양식 리셋
    $('form').each(function () {
      this.reset();
    });

    $('#single').prop('checked', true);

    $('#register-popup').css('display', 'none');
    $('.dim').hide();
    window.location.href = window.location.href; // window.location.reload()를 쓰면 dim이 없어지지 않음
    history.replaceState({}, null, location.pathname); // URL 뒤의 잔여 id(#~)를 없애기 위함
  }

  function callInputForm() {
    $(document).ready(function () {
      let tempHtml = $('.hidden1').html();
      $('.input-form1').append(tempHtml);
    })

    $(document).ready(function () {
      let tempHtml = $('.hidden2').html();
      $('.input-form2').append(tempHtml);
    })

    $(document).ready(function () {
      $('input:radio[id=is-discontinued]').click(function () {
        $('.alert-container').css('display', 'flex');
      })
    })
  }

  function alertProceed() {
    $('.alert-container').css('display', 'none');
  }

  function alertDecline() {
    $('.alert-container').css('display', 'none');
    $('input:radio[id=is-not-discontinued]').click();
  }

  function fillAlertPopup() {
    $('.fill-alert-container').css('display', 'flex');
  }

  function fillAlertClose() {
    $('.fill-alert-container').css('display', 'none');
  }

  function showMenu() {
    // 1. 메뉴카드 목록 초기화
    let plusCard = `<div class='last-card'>
                            <a href='#register-popup' class='plus-button'> + </a>
                        </div>
            `;

    $('.premium > div.container').empty();
    $('.premium > div.container').append(plusCard);

    $('.whoppers > div.container').empty();
    $('.whoppers > div.container').append(plusCard);

    $('.chicken-burgers > div.container').empty();
    $('.chicken-burgers > div.container').append(plusCard);

    $('.sides > div.container').empty();
    $('.sides > div.container').append(plusCard);

    $('.drinks > div.container').empty();
    $('.drinks > div.container').append(plusCard);

    $('.desserts > div.container').empty();
    $('.desserts > div.container').append(plusCard);


    // 2. isDiscontinued==false인 각 메뉴의 정보를 ajax를 통해 서버에서 읽어온다
    $.ajax({
      type: 'GET',
      url: '/api/menus',
      data: {},
      success: function (response) {
        let menus = response['menus_list'];

        for (let i = 0; i < menus.length; i++) {
          let menu = menus[i];
          let isCombo = menu['isCombo'];
          let isDiscontinued = menu['isDiscontinued'];

          // 카드만 만들 것이므로, 단품 && 단종되지 않은 메뉴 정보들만 읽어온다
          if ((isCombo === false) && (isDiscontinued === false)) {
            let objectId = menu['_id'];
            let menuType = menu['menuType']; //한국어
            let image = menu['image'];
            let nameKr = menu['nameKr'];
            let price = menu['price'];
            let isDiscounted = menu['isDiscounted'];
            let isSoldOut = menu['isSoldOut'];

            // (버거류일 경우) 입력 당시의 상품이름만 남긴다
            if (nameKr.includes(' (단품)')) {
              nameKr = nameKr.substring(0, nameKr.length - 5);
            }

            // 카드의 틀을 만든다
            let tempHtml = `
                                <div class='card' id='${objectId}'>
                                    <div>
                                        <a href='#register-popup' class='menu-card'>
                                            <img src='${image}'>
                                        </a>
                                    </div>
                                    <div>
                                        <a href='#register-popup' class='menu-card menu-name'><br>${nameKr}</a>
                                        <div class='price'>￦ ${numberWithCommas(price)}</div>
                                    </d>
                                </div>
                            `;

            // 메뉴타입(카테고리)별로 메뉴카드를 그린다
            let categories = {
              '프리미엄': 'premium',
              '와퍼': 'whoppers',
              '치킨버거': 'chicken-burgers',
              '사이드': 'sides',
              '음료': 'drinks',
              '디저트': 'desserts'
            };

            let category = categories[menuType];
            $(`.${category} > div > div.last-card`).before(tempHtml);

            // 할인 (주황색 SALE 레이블 첨가, 원가에 취소선, 새 가격 첨가)
            if (isDiscounted > 0) {
              $(`#${objectId}> div > div.price`).html(`<del>￦ ${numberWithCommas(price)}</del><br> → ￦ ${numberWithCommas(price - isDiscounted)}`);
              $(`#${objectId}`).toggleClass('sale-sign');
            }

            // 품절 (상품이미지 흑백처리. 회색 SOLD 레이블 첨가)
            if (isSoldOut === true) {
              $(`#${objectId} > div > div`).toggleClass('sold-sign');
              $(`#${objectId} > div > a`).toggleClass('grayscale');
            }
            $('.menu-card').on('click', function () { openEditPopup() });
          }
        }
      }
    })
  }

  // 단품 메뉴정보를 폼에서 입력받는 함수
  function getInputValueSingle() {
    // 1. 사용자가 입력한 폼 데이터를 받아와서 변수에 저장한다
    let objectId = $('#object-id-single').val();
    let image = $('#product-image').val();

    let categoryId = $('input:radio[name=category]:checked').attr('id');
    let categoryKorToEng = {
      'premium': '프리미엄',
      'whoppers': '와퍼',
      'chicken-burgers': '치킨버거',
      'sides': '사이드',
      'drinks': '음료',
      'desserts': '디저트'
    };

    let category = categoryKorToEng[categoryId];

    let nameKr = $('#name-kr').val();
    let nameEng = $('#name-eng').val();
    let calories = parseInt($('#calories').val());
    let price = parseInt($('#price').val());
    let extraPrice = parseInt($('#extra-price').val());
    let discount = parseInt($('#is-discounted').val());

    let isSoldOut = parseInt($('input:radio[name=soldOut]:checked').val());
    let isRecommended = parseInt($('input:radio[name=recommendation]:checked').val());
    let isDiscontinued = parseInt($('input:radio[name=discontinue]:checked').val());

    let ingredients = [];


    $('input:checkbox[name=ingredients]:checked').each(function () {
      let ingredient = $(this).val();
      if (ingredients.includes(ingredient)) {
        return false;
      } else {
        ingredients.push(ingredient);  // 디버그 (수정 시 중복해서 checkbox의 값을 읽는 것 방지)
      }
    });

    let ingredientsAllergicEng = [];

    $('input:checkbox[name=allergens]:checked').each(function () {
      let allergenVal = $(this).val();
      ingredientsAllergicEng.push(allergenVal);
    });

    // 중복요소 제거 (위의 .each문 어딘가에 문제가 있는 듯하나, 찾기 힘들어 이렇게 해결함)
    ingredientsAllergicEng = ingredientsAllergicEng.filter((item, index) =>
      ingredientsAllergicEng.indexOf(item) === index
    );

    let ingredientsNonAllergicEng = ingredients.filter(x => !ingredientsAllergicEng.includes(x));

    let ingredientsEngToKr = {
      'beef': '쇠고기',
      'pork': '돼지고기',
      'chicken': '닭고기',
      'pollock': '명태연육',
      'crab': '명태연육',
      'shellfish': '조개류',
      'shrimp': '새우',
      'milk': '우유',
      'egg': '난류',
      'flour': '밀가루',
      'soybean': '대두',
      'potato': '감자',
      'lettuce': '양상추',
      'tomato': '토마토',
      'cucumber': '오이',
      'onion': '양파',
      'truffle': '트러플'
    };

    let ingredientsAllergicKr = [];
    let ingredientsNonAllergicKr = [];

    for (let ingredient in ingredientsAllergicEng) {
      ingredientsAllergicKr.push(ingredientsEngToKr[ingredientsAllergicEng[ingredient]]);
    }

    for (let ingredient in ingredientsNonAllergicEng) {
      ingredientsNonAllergicKr.push(ingredientsEngToKr[ingredientsNonAllergicEng[ingredient]]);
    }

    let newMenu = {};

    newMenu['objectId'] = objectId;
    newMenu['isCombo'] = false; // Node.js라면 false가 되어야
    newMenu['image'] = image;
    newMenu['menuType'] = category;
    newMenu['nameKr'] = nameKr;
    newMenu['nameEng'] = nameEng;
    newMenu['calories'] = calories;
    newMenu['price'] = price;
    newMenu['extraPrice'] = extraPrice;
    newMenu['isDefaultCombo'] = false;
    newMenu['defaultCombo'] = '';
    newMenu['side'] = '';
    newMenu['drink'] = '';
    newMenu['ingredientsAllergicEng'] = ingredientsAllergicEng;
    newMenu['ingredientsAllergicKr'] = ingredientsAllergicKr;
    newMenu['ingredientsNonAllergicEng'] = ingredientsNonAllergicEng;
    newMenu['ingredientsNonAllergicKr'] = ingredientsNonAllergicKr;
    newMenu['isDiscounted'] = discount;
    newMenu['isSoldOut'] = isSoldOut;
    newMenu['isRecommended'] = isRecommended;
    newMenu['isDiscontinued'] = isDiscontinued;

    // 딕셔너리를 return한다
    return newMenu;
  }

  // 세트 메뉴정보를 폼에서 입력받는 함수
  function getInputValueCombo() {
    // 1. 사용자가 입력한 폼 데이터를 받아와서 변수에 저장한다
    let objectId = $('#object-id-combo').val();
    let image = $('#combo-image').val();

    let categoryId = $('input:radio[name=category]:checked').attr('id');
    let categoryKorToEng = {
      'premium': '프리미엄',
      'whoppers': '와퍼',
      'chicken-burgers': '치킨버거',
      'sides': '사이드',
      'drinks': '음료',
      'desserts': '디저트'
    };
    let category = categoryKorToEng[categoryId];

    let nameKr = $('#name-kr').val(); // 단품 데이터 재활용
    let nameEng = $('#name-eng').val(); // 단품 데이터 재활용
    let calories = parseInt($('#calories-combo').val());
    let price = parseInt($('#price-combo').val());
    let extraPrice = 0;
    let discount = parseInt($('#is-discounted').val()); //단품 데이터 재활용 (텍스트인풋으로 바꿀 예정)
    let isSoldOut = parseInt($('input:radio[name=soldOut]:checked').val()); //단품 데이터 재활용
    let isRecommended = parseInt($('input:radio[name=recommendation]:checked').val()); //단품 데이터 재활용
    let isDiscontinued = parseInt($('input:radio[name=discontinue]:checked').val()); //단품 데이터 재활용

    let ingredients = [];

    $('input:checkbox[name=ingredients]:checked').each(function () {
      let ingredient = $(this).val();
      if (ingredients.includes(ingredient)) {
        return false;
      } else {
        ingredients.push(ingredient);  // 디버그 (수정 시 중복해서 checkbox의 값을 읽는 것 방지)
      }
    });

    let ingredientsAllergicEng = [];

    $('input:checkbox[name=allergens]:checked').each(function () {
      let allergenVal = $(this).val();
      ingredientsAllergicEng.push(allergenVal);
    });


    // 중복요소 제거 (위의 .each문 어딘가에 문제가 있는 듯하나, 찾기 힘들어 이렇게 해결함)
    ingredientsAllergicEng = ingredientsAllergicEng.filter((item, index) =>
      ingredientsAllergicEng.indexOf(item) === index
    );

    let ingredientsNonAllergicEng = ingredients.filter(x => !ingredientsAllergicEng.includes(x));

    let ingredientsEngToKr = {
      'beef': '쇠고기',
      'pork': '돼지고기',
      'chicken': '닭고기',
      'pollock': '명태연육',
      'crab': '명태연육',
      'shellfish': '조개류',
      'shrimp': '새우',
      'milk': '우유',
      'egg': '난류',
      'flour': '밀가루',
      'soybean': '대두',
      'potato': '감자',
      'lettuce': '양상추',
      'tomato': '토마토',
      'cucumber': '오이',
      'onion': '양파',
      'truffle': '트러플'
    };

    let ingredientsAllergicKr = [];
    let ingredientsNonAllergicKr = [];

    for (let ingredient in ingredientsAllergicEng) {
      ingredientsAllergicKr.push(ingredientsEngToKr[ingredientsAllergicEng[ingredient]]);
    }

    for (let ingredient in ingredientsNonAllergicEng) {
      ingredientsNonAllergicKr.push(ingredientsEngToKr[ingredientsNonAllergicEng[ingredient]]);
    }

    // 3. 딕셔너리 형태로 가공한다
    let newMenu = {};

    newMenu['objectId'] = objectId;
    newMenu['isCombo'] = true;
    newMenu['image'] = image;
    newMenu['menuType'] = category;
    newMenu['nameKr'] = nameKr + ' (세트)';
    newMenu['nameEng'] = nameEng + ' (Meal)';
    newMenu['calories'] = calories;
    newMenu['price'] = price;
    newMenu['extraPrice'] = extraPrice;
    newMenu['defaultCombo'] = '';
    newMenu['isDefaultCombo'] = true;
    newMenu['side'] = ''; //프렌치프라이 objectId값 (백엔드로)
    newMenu['drink'] = ''; //코카콜라 objectId값 (백엔드로)
    newMenu['ingredientsAllergicEng'] = ingredientsAllergicEng;
    newMenu['ingredientsAllergicKr'] = ingredientsAllergicKr;
    newMenu['ingredientsNonAllergicEng'] = ingredientsNonAllergicEng;
    newMenu['ingredientsNonAllergicKr'] = ingredientsNonAllergicKr;
    newMenu['isDiscounted'] = discount;
    newMenu['isSoldOut'] = isSoldOut;
    newMenu['isRecommended'] = isRecommended;
    newMenu['isDiscontinued'] = isDiscontinued;

    return newMenu;
  }


  // 메뉴등록(POST)
  function submit() {
    // 1. 폼에 입력된 단품과 세트 정보 딕셔너리를 받아온다 (앞서 정의한 함수 활용)
    let singleInfo = getInputValueSingle();

    // 기입되지 않은 항목이 있는지 체크
    let noImage = singleInfo['image'] === '' || singleInfo['image'] === null;
    let noMenuType = singleInfo['menuType'] === '' || singleInfo['menuType'] === null //?
    let noNameKr = singleInfo['nameKr'] === '' || singleInfo['nameKr'] === null;
    let noNameEng = singleInfo['nameEng'] === '' || singleInfo['nameEng'] === null;
    let noCalories = singleInfo['calories'] === '' || singleInfo['calories'] === null || isNaN(singleInfo['calories']);
    let noPrice = singleInfo['price'] === '' || singleInfo['price'] === null || isNaN(singleInfo['price']);
    let noExtraPrice = singleInfo['extraPrice'] === '' || singleInfo['extraPrice'] === null || isNaN(singleInfo['extraPrice']);
    let noDiscount = singleInfo['isDiscounted'] === '' || singleInfo['isDiscounted'] === null || isNaN(singleInfo['isDiscounted']);

    // 재료구성 (음료가 아닌데 비어있을 경우)
    let noNonAllergenEng = !(singleInfo['ingredientsAllergicEng'].length || singleInfo['ingredientsNonAllergicEng'].length);
    let noNonAllergenKr = !(singleInfo['ingredientsAllergicKr'].length || singleInfo['ingredientsNonAllergicKr'].length);

    let checkDrink = singleInfo['menuType'] === '음료'

    if ($('input:radio[name=category]:checked').length === 0) {
      fillAlertPopup();
      return;
    }

    // 만약 하나라도 해당되면 경고모달창을 띄운 뒤 원래 창으로 돌아간다
    if (checkDrink) {
      if (noImage || noMenuType || noNameKr || noNameEng || noCalories || noPrice || noExtraPrice || noDiscount) {
        fillAlertPopup();
        return;
      }
    } else if (!checkDrink) {
      if (noImage || noMenuType || noNameKr || noNameEng || noCalories || noPrice || noNonAllergenEng || noNonAllergenKr) {
        fillAlertPopup();
        return;
      }
    }

    let objectId = singleInfo['objectId'];
    let isCombo = singleInfo['isCombo'];
    let image = singleInfo['image'];
    let menuType = singleInfo['menuType'];
    let nameKr = singleInfo['nameKr'];
    let nameEng = singleInfo['nameEng'];

    let calories = singleInfo['calories'];
    let price = singleInfo['price'];
    let extraPrice = singleInfo['extraPrice'];
    let defaultCombo = singleInfo['defaultCombo'];
    let isDefaultCombo = singleInfo['isDefaultCombo'];
    let side = singleInfo['side'];
    let drink = singleInfo['drink'];
    let isDiscounted = singleInfo['isDiscounted'];
    let ingredientsAllergicEng = singleInfo['ingredientsAllergicEng'];
    let ingredientsAllergicKr = singleInfo['ingredientsAllergicKr'];
    let ingredientsNonAllergicEng = singleInfo['ingredientsNonAllergicEng'];
    let ingredientsNonAllergicKr = singleInfo['ingredientsNonAllergicKr'];
    let isSoldOut = singleInfo['isSoldOut'];
    let isRecommended = singleInfo['isRecommended'];
    let isDiscontinued = singleInfo['isDiscontinued'];

    // 입력되지 않은 항목이 있을 경우 제출하지 않는다
    // 모든 필수입력항목이 입력되었다면, 딕셔너리에 담긴 데이터를 ajax를 통해 시간차를 두고 순차적으로 서버에 POST한다
    // 원래 화면으로 돌아가고 사이트를 refresh한다 (windows.location.reload(); 를 이용)

    if (menuType === '프리미엄' || menuType === '와퍼' || menuType === '치킨버거') {
      nameKr = singleInfo['nameKr'] + ' (단품)';
      nameEng = singleInfo['nameEng'] + ' (Burger Only)';
    }

    if (menuType === '프리미엄' || menuType === '와퍼' || menuType === '치킨버거') {
      let comboInfo = getInputValueCombo();

      // 기입되지 않은 항목이 있는지 체크
      let checkComboImage = comboInfo['image'] === '' || comboInfo['image'] === null;
      let checkComboCalories = comboInfo['calories'] === '' || comboInfo['calories'] === null || isNaN(comboInfo['calories']);
      let checkComboPrice = comboInfo['price'] === '' || comboInfo['price'] === null || isNaN(comboInfo['price']);

      if (checkComboImage || checkComboCalories || checkComboPrice) {
        fillAlertPopup();
        return;
      }

      let combo = JSON.stringify(comboInfo);
      let single = JSON.stringify(singleInfo);

      // 세트 폼 서버에 POST
      $.ajax({
        type: 'POST',
        url: '/api/menus',
        data: {
          setType: true,
          objectId: objectId,
          comboInfo: combo,
          singleInfo: single,
        },
        success: function (response) {
          if (response['result'] === 'success') {
            console.log(response['msg'] + ' 세트');
            window.location.href = window.location.href;
          } else {
            alert('메뉴 받아오기 실패');
          }
        }
      })
    } else {
      // 단품 폼 서버에 POST

      $.ajax({
        type: 'POST',
        url: '/api/menus',
        data: {
          setType: false, objectId: objectId, isCombo: isCombo, image: image, menuType: menuType,
          nameKr: nameKr, nameEng: nameEng, calories: calories,
          price: price, extraPrice: extraPrice,
          isDiscounted: isDiscounted,
          ingredientsAllergicEng: JSON.stringify(ingredientsAllergicEng),
          ingredientsAllergicKr: JSON.stringify(ingredientsAllergicKr),
          ingredientsNonAllergicEng: JSON.stringify(ingredientsNonAllergicEng),
          ingredientsNonAllergicKr: JSON.stringify(ingredientsNonAllergicKr),
          isSoldOut: isSoldOut, isRecommended: isRecommended, isDiscontinued: isDiscontinued
        },
        success: function (response) {
          if (response['result'] === 'success') {
            console.log(response['msg'] + ' 단품');
            window.location.href = window.location.href;
          } else {
            closePopup();
            alert('메뉴 올리기 실패');
          }
        }
      })
    }

    closePopup();
  }


  $(document).ready(function () {
    showMenu();
    callInputForm();

    // 재료 체크박스의 내용과 알레르기유발물질 체크박스의 내용을 상호 반영하는 부분 (별도의 함수로 분리시킬경우 오류발생)
    $(document).ready(function () {
      $('input:checkbox[name=ingredients]').click(function () {
        let ingredientId = $(this).attr('id');
        let chk = $(this).is(':checked');
        if (chk === true) {
          $('input:checkbox[name=allergens][id=' + ingredientId + '-allergen]').prop('checked', true);
        } else {
          $('input:checkbox[name=allergens][id=' + ingredientId + '-allergen]').prop('checked', false);
        }
      })
    })

    $(document).ready(function () {
      $('input:checkbox[name=allergens]').click(function () {
        let allergenId = $(this).attr('id');
        let strArr = allergenId.split('-allergen');
        let chk = $(this).is(':checked');
        if (chk === true) {
          $('input:checkbox[name=ingredients][id=' + strArr[0] + ']').prop('checked', true);
        } else {
          $('input:checkbox[name=ingredients][id=' + strArr[0] + ']').prop('checked', false);
        }
      })
    })

    // 메뉴 생성/수정 팝업(모달)창 호출 함수
    $('.plus-button').on('click', function () { openRegisterPopup() });
    // $('.menu-card').on('click', function () { openEditPopup() });

    // 팝업창 내 경고 모달창 버튼 관련 함수
    $('.fill-alert-decline').on('click', function () { fillAlertClose() });
    $('.alert-decline').on('click', function () { alertDecline() });
    $('.alert-proceed').on('click', function () { alertProceed() });

    // 팝업창 취소/확인 버튼 관련 함수
    $('.decline').on('click', function () { closePopup() });
    $('.submit').on('click', function () { submit() });

  })

}