if (window.location.pathname === '/registerMenu') {
  history.replaceState({}, null, location.pathname);

  // 세자릿수마다 콤마 찍어주는 함수
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function uploadImage(event) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = function () {
      let tempImage = new Image();
      tempImage.src = reader.result;
      tempImage.onload = function () {
        let canvas = document.createElement('canvas');
        let canvasContext = canvas.getContext('2d');

        canvas.width = 230;
        canvas.height = 150;
        canvasContext.drawImage(this, 0, 0, 230, 150);

        let dataURI = canvas.toDataURL('image/*');
        let imgTag = "<img id='preview-img' src='" + dataURI + "'/>";
        if ($('#preview-img')) {
          $('#preview-img').remove();
        }

        $('.image-upload-area > i').css('display', 'none');
        $('.image-upload-area > p').css('display', 'none');

        $('.image-upload-area').append(imgTag);
        $('#product-image').val(dataURI);
      };
    };
  }

  function uploadImageForSet(event) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = function () {
      let tempImage = new Image();
      tempImage.src = reader.result;
      tempImage.onload = function () {
        let canvas = document.createElement('canvas');
        let canvasContext = canvas.getContext('2d');

        canvas.width = 230;
        canvas.height = 150;
        canvasContext.drawImage(this, 0, 0, 230, 150);

        let dataURI = canvas.toDataURL('image/*');
        let imgTag = "<img id='preview-img-for-set' src='" + dataURI + "'/>";
        if ($('#preview-img-for-set')) {
          $('#preview-img-for-set').remove();
        }

        $('.image-upload-area-for-set-menu > i').css('display', 'none');
        $('.image-upload-area-for-set-menu > p').css('display', 'none');

        $('.image-upload-area-for-set-menu').append(imgTag);
        $('#combo-image').val(dataURI);
      };
    };
  }

  // 메뉴등록 준비 함수 (+ 버튼을 누르면 실행)
  function openRegisterPopup() {
    // 팝업창을 준비 (폼은 비어있음)
    $('.dim').show();
    $('#register-popup').css('display', 'block');
    $('.register-or-edit').text('메뉴등록');
    $('.remove-option').hide();

    $('.input-form1').scrollTop(0);
    $('.input-form2').scrollTop(0);

    if ($('#preview-img')) {
      $('#preview-img').remove();
      $('.image-upload-area > i').css('display', 'block');
      $('.image-upload-area > p').css('display', 'block');
    }
    if ($('#preview-img-for-set')) {
      $('#preview-img-for-set').remove();
      $('.image-upload-area-for-set-menu > i').css('display', 'block');
      $('.image-upload-area-for-set-menu > p').css('display', 'block');
    }

    const currentCategory = $('input:radio[name=categories]:checked').val();
    $(`input:radio[name=category][value=${currentCategory}]`).prop('checked', true);

    // 단품/세트 탭 노출여부
    if (currentCategory === '사이드' || currentCategory === '음료' || currentCategory === '디저트') {
      $('#form-tabs > label').hide();
      $('.input-form1').css('height', 'calc(100% - 1rem)');
    } else {
      $('#form-tabs > label').show();
      $('.input-form1').css('height', 'calc(100% - 5rem)');
    }

    // 추가금액 입력란 노출여부
    if (currentCategory === '디저트' || currentCategory === '프리미엄' || currentCategory === '와퍼' || currentCategory === '치킨버거') {
      $('#extra').hide();
    } else {
      $('#extra').show();
    }

    // 재료입력란 노출여부
    if (currentCategory === '음료') {
      $('.ingredients').hide();
    } else {
      $('.ingredients').show();
    }

    const imageUploadBtn = document.getElementById('image-upload');
    imageUploadBtn.addEventListener('change', (e) => uploadImage(e));

    const imageUploadSetBtn = document.getElementById('image-upload-for-set');
    if (imageUploadSetBtn) {
      imageUploadSetBtn.addEventListener('change', (e) => uploadImageForSet(e));
    }
  }

  // 메뉴수정 준비 함수 (메뉴카드의 a 태그 영역(메뉴사진+메뉴이름)을 누르면 실행)
  function openEditPopup() {
    // 1. 팝업창을 준비

    $('.dim').show();
    $('#register-popup').css('display', 'block');
    $('.register-or-edit').text('메뉴수정');
    $('.remove-option').show();

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

    if (currentCategory === '디저트' || currentCategory === '프리미엄' || currentCategory === '와퍼' || currentCategory === '치킨버거') {
      $('#extra').hide();
    } else {
      $('#extra').show();
    }

    if (currentCategory === '음료') {
      $('.ingredients').hide();
    } else {
      $('.ingredients').show();
    }

    const imageUploadBtn = document.getElementById('image-upload');
    imageUploadBtn.addEventListener('change', (e) => uploadImage(e));

    const imageUploadSetBtn = document.getElementById('image-upload-for-set');
    if (imageUploadSetBtn) {
      imageUploadSetBtn.addEventListener('change', (e) => uploadImageForSet(e));
    }

    // 클릭한 a태그의 id(objectId)를 참조해서, DB에서 데이터를 GET한 뒤 폼에 차례로 입력
    // isCombo == true 일 경우와 == false 일 경우 두 가지 양식 데이터를 읽어옴

    $('.card').one('click', function () {
      const objectId = $(this).attr('id');
      $.ajax({
        type: 'GET',
        url: '/api/menus',
        data: {},
        success(response) {
          if (response.result === 'success') {
            // 단품 서식을 해당 메뉴의 값으로 채움
            let menuNum = 0;
            const menus = response.menus_list;
            let singleToEdit = menus[0];

            while (menuNum < menus.length) {
              if (menus[menuNum]._id === objectId) {
                singleToEdit = menus[menuNum];
                break;
              } else {
                menuNum += 1;
              }
            }

            if (singleToEdit['image']) {
              if ($('#preview-img')) {
                $('#preview-img').remove();
              }
              let imgTag = "<img id='preview-img' src='" + singleToEdit['image'] + "'/>";
              $('.image-upload-area').append(imgTag);

              $('.image-upload-area > i').css('display', 'none');
              $('.image-upload-area > p').css('display', 'none');
            }

            $('#object-id-single').val(objectId);
            $('#product-image').val(singleToEdit.image);

            let { nameKr } = singleToEdit;
            let { nameEng } = singleToEdit;

            // (버거류일 경우) 입력 당시의 상품이름만 남긴다
            if (nameKr.includes(' (단품)')) {
              nameKr = nameKr.substring(0, nameKr.length - 5);
            }
            if (nameEng.includes(' (Burger Only)')) {
              nameEng = nameEng.substring(0, nameEng.length - 13);
            }

            $('#name-kr').val(nameKr);
            $('#name-eng').val(nameEng);

            $('#calories').val(singleToEdit.calories);
            $('#price').val(singleToEdit.price);
            $('#extra-price').val(singleToEdit.extraPrice);
            $('#is-discounted').val(singleToEdit.isDiscounted);

            $(`input:radio[name=category][value=${singleToEdit.menuType}]`).prop('checked', true);
            $(`input:radio[name=soldOut][value=${singleToEdit.isSoldOut + 0}]`).prop('checked', true); // boolean -> integer 형변환
            $(`input:radio[name=recommendation][value=${singleToEdit.isRecommended + 0}]`).prop('checked', true); // boolean -> integer 형변환
            $(`input:radio[name=discontinue][value=${singleToEdit.isDiscontinued + 0}]`).prop('checked', true); // boolean -> integer 형변환

            const nonAllergens = singleToEdit.ingredientsNonAllergicEng;
            const allergens = singleToEdit.ingredientsAllergicEng;

            for (let nonAllergen = 0; nonAllergen < nonAllergens.length; nonAllergen++) {
              $(`input:checkbox[name=ingredients][value=${nonAllergens[nonAllergen]}]`).prop('checked', true);
            }

            for (let allergen = 0; allergen < allergens.length; allergen++) {
              $(`input:checkbox[name=allergens][value=${allergens[allergen]}]`).prop('checked', true);
              $(`input:checkbox[name=ingredients][value=${allergens[allergen]}]`).prop('checked', true);
            }

            // 버거류(프리미엄/와퍼/치킨버거일 경우) 세트 서식을 해당 메뉴의 값으로 채움
            if (singleToEdit.menuType == '프리미엄' || singleToEdit.menuType == '와퍼' || singleToEdit.menuType == '치킨버거') {
              menuNum = 0;
              let comboToEdit = menus[0];
              while (menuNum < menus.length) {
                if (menus[menuNum].nameKr === `${nameKr} (세트)`) {
                  comboToEdit = menus[menuNum];
                  break;
                } else {
                  menuNum += 1;
                }
              }

              if (comboToEdit['image']) {
                if ($('#preview-img-for-set')) {
                  $('#preview-img-for-set').remove();
                }
                let imgTag = "<img id='preview-img-for-set' src='" + comboToEdit['image'] + "'/>";
                $('.image-upload-area-for-set-menu').append(imgTag);

                $('.image-upload-area-for-set-menu > i').css('display', 'none');
                $('.image-upload-area-for-set-menu > p').css('display', 'none');
              }

              $('#object-id-combo').val(comboToEdit._id);
              $('#combo-image').val(comboToEdit.image);
              $('#calories-combo').val(comboToEdit.calories);
              $('#price-combo').val(comboToEdit.price);
            }
          } else {
            alert('메뉴 받아오기 실패');
          }
        },
      });
    });
  }

  function closePopup() {
    // 취소버튼 누를 시 폼양식 리셋
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
    $(document).ready(() => {
      const tempHtml = $('.hidden1').html();
      $('.input-form1').append(tempHtml);
    });

    $(document).ready(() => {
      const tempHtml = $('.hidden2').html();
      $('.input-form2').append(tempHtml);
    });

    $(document).ready(() => {
      $('input:radio[id=is-discontinued]').click(() => {
        $('.alert-container').css('display', 'flex');
      });
    });
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
    const plusCard = `<div class='last-card'>
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
      success(response) {
        const menus = response.menus_list;

        for (let i = 0; i < menus.length; i++) {
          const menu = menus[i];
          const { isCombo } = menu;
          const { isDiscontinued } = menu;

          // 카드만 만들 것이므로, 단품 && 단종되지 않은 메뉴 정보들만 읽어온다
          if (isCombo === false && isDiscontinued === false) {
            const objectId = menu._id;
            const { menuType } = menu; // 한국어
            const { image } = menu;
            let { nameKr } = menu;
            const { price } = menu;
            const { isDiscounted } = menu;
            const { isSoldOut } = menu;

            // (버거류일 경우) 입력 당시의 상품이름만 남긴다
            if (nameKr.includes(' (단품)')) {
              nameKr = nameKr.substring(0, nameKr.length - 5);
            }

            // 카드의 틀을 만든다
            const tempHtml = `
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
            const categories = {
              프리미엄: 'premium',
              와퍼: 'whoppers',
              치킨버거: 'chicken-burgers',
              사이드: 'sides',
              음료: 'drinks',
              디저트: 'desserts',
            };

            const category = categories[menuType];
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
            $('.menu-card').on('click', () => {
              openEditPopup();
            });
          }
        }
      },
    });
  }

  // 단품 메뉴정보를 폼에서 입력받는 함수
  function getInputValueSingle() {
    // 1. 사용자가 입력한 폼 데이터를 받아와서 변수에 저장한다
    const objectId = $('#object-id-single').val();
    const image = $('#product-image').val();

    const categoryId = $('input:radio[name=category]:checked').attr('id');
    const categoryKorToEng = {
      premium: '프리미엄',
      whoppers: '와퍼',
      'chicken-burgers': '치킨버거',
      sides: '사이드',
      drinks: '음료',
      desserts: '디저트',
    };

    const category = categoryKorToEng[categoryId];

    const nameKr = $('#name-kr').val();
    const nameEng = $('#name-eng').val();
    const calories = parseInt($('#calories').val());
    const price = parseInt($('#price').val());
    const extraPrice = parseInt($('#extra-price').val());
    const discount = parseInt($('#is-discounted').val());

    const isSoldOut = parseInt($('input:radio[name=soldOut]:checked').val());
    const isRecommended = parseInt($('input:radio[name=recommendation]:checked').val());
    const isDiscontinued = parseInt($('input:radio[name=discontinue]:checked').val());

    const ingredients = [];

    $('input:checkbox[name=ingredients]:checked').each(function () {
      const ingredient = $(this).val();
      if (ingredients.includes(ingredient)) {
        return false;
      }
      ingredients.push(ingredient); // 디버그 (수정 시 중복해서 checkbox의 값을 읽는 것 방지)
    });

    let ingredientsAllergicEng = [];

    $('input:checkbox[name=allergens]:checked').each(function () {
      const allergenVal = $(this).val();
      ingredientsAllergicEng.push(allergenVal);
    });

    // 중복요소 제거 (위의 .each문 어딘가에 문제가 있는 듯하나, 찾기 힘들어 이렇게 해결함)
    ingredientsAllergicEng = ingredientsAllergicEng.filter((item, index) => ingredientsAllergicEng.indexOf(item) === index);

    const ingredientsNonAllergicEng = ingredients.filter((x) => !ingredientsAllergicEng.includes(x));

    const ingredientsEngToKr = {
      beef: '쇠고기',
      pork: '돼지고기',
      chicken: '닭고기',
      pollock: '명태연육',
      crab: '명태연육',
      shellfish: '조개류',
      shrimp: '새우',
      milk: '우유',
      egg: '난류',
      flour: '밀가루',
      soybean: '대두',
      potato: '감자',
      lettuce: '양상추',
      tomato: '토마토',
      cucumber: '오이',
      onion: '양파',
      truffle: '트러플',
    };

    const ingredientsAllergicKr = [];
    const ingredientsNonAllergicKr = [];

    for (const ingredient in ingredientsAllergicEng) {
      ingredientsAllergicKr.push(ingredientsEngToKr[ingredientsAllergicEng[ingredient]]);
    }

    for (const ingredient in ingredientsNonAllergicEng) {
      ingredientsNonAllergicKr.push(ingredientsEngToKr[ingredientsNonAllergicEng[ingredient]]);
    }

    const newMenu = {};

    newMenu.objectId = objectId;
    newMenu.isCombo = false; // Node.js라면 false가 되어야
    newMenu.image = image;
    newMenu.menuType = category;
    newMenu.nameKr = nameKr;
    newMenu.nameEng = nameEng;
    newMenu.calories = calories;
    newMenu.price = price;
    newMenu.extraPrice = extraPrice;
    newMenu.isDefaultCombo = false;
    newMenu.defaultCombo = '';
    newMenu.side = '';
    newMenu.drink = '';
    newMenu.ingredientsAllergicEng = ingredientsAllergicEng;
    newMenu.ingredientsAllergicKr = ingredientsAllergicKr;
    newMenu.ingredientsNonAllergicEng = ingredientsNonAllergicEng;
    newMenu.ingredientsNonAllergicKr = ingredientsNonAllergicKr;
    newMenu.isDiscounted = discount;
    newMenu.isSoldOut = isSoldOut;
    newMenu.isRecommended = isRecommended;
    newMenu.isDiscontinued = isDiscontinued;

    // 딕셔너리를 return한다
    return newMenu;
  }

  // 세트 메뉴정보를 폼에서 입력받는 함수
  function getInputValueCombo() {
    // 1. 사용자가 입력한 폼 데이터를 받아와서 변수에 저장한다
    const objectId = $('#object-id-combo').val();
    const image = $('#combo-image').val();

    const categoryId = $('input:radio[name=category]:checked').attr('id');
    const categoryKorToEng = {
      premium: '프리미엄',
      whoppers: '와퍼',
      'chicken-burgers': '치킨버거',
      sides: '사이드',
      drinks: '음료',
      desserts: '디저트',
    };
    const category = categoryKorToEng[categoryId];

    const nameKr = $('#name-kr').val(); // 단품 데이터 재활용
    const nameEng = $('#name-eng').val(); // 단품 데이터 재활용
    const calories = parseInt($('#calories-combo').val());
    const price = parseInt($('#price-combo').val());
    const extraPrice = 0;
    const discount = parseInt($('#is-discounted').val()); // 단품 데이터 재활용 (텍스트인풋으로 바꿀 예정)
    const isSoldOut = parseInt($('input:radio[name=soldOut]:checked').val()); // 단품 데이터 재활용
    const isRecommended = parseInt($('input:radio[name=recommendation]:checked').val()); // 단품 데이터 재활용
    const isDiscontinued = parseInt($('input:radio[name=discontinue]:checked').val()); // 단품 데이터 재활용

    const ingredients = [];

    $('input:checkbox[name=ingredients]:checked').each(function () {
      const ingredient = $(this).val();
      if (ingredients.includes(ingredient)) {
        return false;
      }
      ingredients.push(ingredient); // 디버그 (수정 시 중복해서 checkbox의 값을 읽는 것 방지)
    });

    let ingredientsAllergicEng = [];

    $('input:checkbox[name=allergens]:checked').each(function () {
      const allergenVal = $(this).val();
      ingredientsAllergicEng.push(allergenVal);
    });

    // 중복요소 제거 (위의 .each문 어딘가에 문제가 있는 듯하나, 찾기 힘들어 이렇게 해결함)
    ingredientsAllergicEng = ingredientsAllergicEng.filter((item, index) => ingredientsAllergicEng.indexOf(item) === index);

    const ingredientsNonAllergicEng = ingredients.filter((x) => !ingredientsAllergicEng.includes(x));

    const ingredientsEngToKr = {
      beef: '쇠고기',
      pork: '돼지고기',
      chicken: '닭고기',
      pollock: '명태연육',
      crab: '명태연육',
      shellfish: '조개류',
      shrimp: '새우',
      milk: '우유',
      egg: '난류',
      flour: '밀가루',
      soybean: '대두',
      potato: '감자',
      lettuce: '양상추',
      tomato: '토마토',
      cucumber: '오이',
      onion: '양파',
      truffle: '트러플',
    };

    const ingredientsAllergicKr = [];
    const ingredientsNonAllergicKr = [];

    for (const ingredient in ingredientsAllergicEng) {
      ingredientsAllergicKr.push(ingredientsEngToKr[ingredientsAllergicEng[ingredient]]);
    }

    for (const ingredient in ingredientsNonAllergicEng) {
      ingredientsNonAllergicKr.push(ingredientsEngToKr[ingredientsNonAllergicEng[ingredient]]);
    }

    // 3. 딕셔너리 형태로 가공한다
    const newMenu = {};

    newMenu.objectId = objectId;
    newMenu.isCombo = true;
    newMenu.image = image;
    newMenu.menuType = category;
    newMenu.nameKr = `${nameKr} (세트)`;
    newMenu.nameEng = `${nameEng} (Meal)`;
    newMenu.calories = calories;
    newMenu.price = price;
    newMenu.extraPrice = extraPrice;
    newMenu.defaultCombo = '';
    newMenu.isDefaultCombo = true;
    newMenu.side = ''; // 프렌치프라이 objectId값 (백엔드로)
    newMenu.drink = ''; // 코카콜라 objectId값 (백엔드로)
    newMenu.ingredientsAllergicEng = ingredientsAllergicEng;
    newMenu.ingredientsAllergicKr = ingredientsAllergicKr;
    newMenu.ingredientsNonAllergicEng = ingredientsNonAllergicEng;
    newMenu.ingredientsNonAllergicKr = ingredientsNonAllergicKr;
    newMenu.isDiscounted = discount;
    newMenu.isSoldOut = isSoldOut;
    newMenu.isRecommended = isRecommended;
    newMenu.isDiscontinued = isDiscontinued;

    return newMenu;
  }

  // 메뉴등록(POST)
  function submit() {
    // 1. 폼에 입력된 단품과 세트 정보 딕셔너리를 받아온다 (앞서 정의한 함수 활용)
    const singleInfo = getInputValueSingle();

    // 기입되지 않은 항목이 있는지 체크
    const noImage = singleInfo.image === '' || singleInfo.image === null;
    const noMenuType = singleInfo.menuType === '' || singleInfo.menuType === null; // ?
    const noNameKr = singleInfo.nameKr === '' || singleInfo.nameKr === null;
    const noNameEng = singleInfo.nameEng === '' || singleInfo.nameEng === null;
    const noCalories = singleInfo.calories === '' || singleInfo.calories === null || isNaN(singleInfo.calories);
    const noPrice = singleInfo.price === '' || singleInfo.price === null || isNaN(singleInfo.price);
    const noExtraPrice = singleInfo.extraPrice === '' || singleInfo.extraPrice === null || isNaN(singleInfo.extraPrice);
    const noDiscount = singleInfo.isDiscounted === '' || singleInfo.isDiscounted === null || isNaN(singleInfo.isDiscounted);

    // 재료구성 (음료가 아닌데 비어있을 경우)
    const noNonAllergenEng = !(singleInfo.ingredientsAllergicEng.length || singleInfo.ingredientsNonAllergicEng.length);
    const noNonAllergenKr = !(singleInfo.ingredientsAllergicKr.length || singleInfo.ingredientsNonAllergicKr.length);

    const checkDrink = singleInfo.menuType === '음료';

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

    const { objectId } = singleInfo;
    const { isCombo } = singleInfo;
    const { image } = singleInfo;
    const { menuType } = singleInfo;
    let { nameKr } = singleInfo;
    let { nameEng } = singleInfo;

    const { calories } = singleInfo;
    const { price } = singleInfo;
    const { extraPrice } = singleInfo;
    const { defaultCombo } = singleInfo;
    const { isDefaultCombo } = singleInfo;
    const { side } = singleInfo;
    const { drink } = singleInfo;
    const { isDiscounted } = singleInfo;
    const { ingredientsAllergicEng } = singleInfo;
    const { ingredientsAllergicKr } = singleInfo;
    const { ingredientsNonAllergicEng } = singleInfo;
    const { ingredientsNonAllergicKr } = singleInfo;
    const { isSoldOut } = singleInfo;
    const { isRecommended } = singleInfo;
    const { isDiscontinued } = singleInfo;

    const single = JSON.stringify(singleInfo);

    // 입력되지 않은 항목이 있을 경우 제출하지 않는다
    // 모든 필수입력항목이 입력되었다면, 딕셔너리에 담긴 데이터를 ajax를 통해 시간차를 두고 순차적으로 서버에 POST한다
    // 원래 화면으로 돌아가고 사이트를 refresh한다 (windows.location.reload(); 를 이용)

    if (menuType === '프리미엄' || menuType === '와퍼' || menuType === '치킨버거') {
      nameKr = `${singleInfo.nameKr} (단품)`;
      nameEng = `${singleInfo.nameEng} (Burger Only)`;
    }

    if (menuType === '프리미엄' || menuType === '와퍼' || menuType === '치킨버거') {
      const comboInfo = getInputValueCombo();

      // 기입되지 않은 항목이 있는지 체크
      const checkComboImage = comboInfo.image === '' || comboInfo.image === null;
      const checkComboCalories = comboInfo.calories === '' || comboInfo.calories === null || isNaN(comboInfo.calories);
      const checkComboPrice = comboInfo.price === '' || comboInfo.price === null || isNaN(comboInfo.price);

      if (checkComboImage || checkComboCalories || checkComboPrice) {
        fillAlertPopup();
        return;
      }

      const combo = JSON.stringify(comboInfo);

      // 세트 폼 서버에 POST
      $.ajax({
        type: 'POST',
        url: '/api/menus',
        data: {
          setType: true,
          objectId,
          comboInfo: combo,
          singleInfo: single,
        },
        success(response) {
          if (response.result === 'success') {
            window.location.href = window.location.href;
          } else {
            alert('메뉴 받아오기 실패');
          }
        },
      });
    } else {
      // 단품 폼 서버에 POST

      $.ajax({
        type: 'POST',
        url: '/api/menus',
        data: {
          setType: false,
          objectId,
          singleInfo: single,
        },
        success(response) {
          if (response.result === 'success') {
            window.location.href = window.location.href;
          } else {
            closePopup();
            alert('메뉴 올리기 실패');
          }
        },
      });
    }

    closePopup();
  }

  $(document).ready(() => {
    showMenu();
    callInputForm();
    $('#name-eng').css('ime-mode', 'disabled');

    // 재료 체크박스의 내용과 알레르기유발물질 체크박스의 내용을 상호 반영하는 부분 (별도의 함수로 분리시킬경우 오류발생)
    $(document).ready(() => {
      $('input:checkbox[name=ingredients]').click(function () {
        const ingredientId = $(this).attr('id');
        const chk = $(this).is(':checked');
        if (chk === true) {
          $(`input:checkbox[name=allergens][id=${ingredientId}-allergen]`).prop('checked', true);
        } else {
          $(`input:checkbox[name=allergens][id=${ingredientId}-allergen]`).prop('checked', false);
        }
      });
    });

    $(document).ready(() => {
      $('input:checkbox[name=allergens]').click(function () {
        const allergenId = $(this).attr('id');
        const strArr = allergenId.split('-allergen');
        const chk = $(this).is(':checked');
        if (chk === true) {
          $(`input:checkbox[name=ingredients][id=${strArr[0]}]`).prop('checked', true);
        } else {
          $(`input:checkbox[name=ingredients][id=${strArr[0]}]`).prop('checked', false);
        }
      });
    });

    // 메뉴 생성/수정 팝업(모달)창 호출 함수
    $('.plus-button').on('click', () => {
      openRegisterPopup();
    });

    // 팝업창 내 경고 모달창 버튼 관련 함수
    $('.fill-alert-decline').on('click', () => {
      fillAlertClose();
    });
    $('.alert-decline').on('click', () => {
      alertDecline();
    });
    $('.alert-proceed').on('click', () => {
      alertProceed();
    });

    // 팝업창 취소/확인 버튼 관련 함수
    $('.decline').on('click', () => {
      closePopup();
    });
    $('.submit').on('click', () => {
      submit();
    });
  });
}
