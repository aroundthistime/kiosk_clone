# kiosk_clone

cloning a kiosk system for a fastfood shop

# 실행방법

1.  깃으로 해당 프로젝트 pull
2.  node.js 설치되어 있어야 합니다. 설치법은 구글링 검색 추천드려요.
3.  vscode 등 개발환경 터미널에서 npm install 명령어 입력 (적용된 패키지 다운로드)
4.  install 완료 후 터미널에서 npm start 명령어 (서버 구동) 및 npm run dev (gulp 실행) 입력

        gulp까지 실행시켜야 변경 사항 자동으로 적용되어 배포됩니다.

5.  localhost:5000 으로 접속하여 결과 확인

# 개발진행

1.  src 폴더에서 자바스크립트, scss설정 및 이미지 관리
2.  웹에서 보여지는 화면 (html 관련) 설정은 views 폴더에서 pug 파일로 작성 (관련 문법은 구글링)
3.  라우터 추가는 index.js 에서 다음과 같이 설정

        app.get('/가고자 하는 URL', (req, res) => res.render('보여줄 pug 파일명'));

4.  라우터 추가되면 링크에 localhost:5000/salesControll 과 같이 입력하여 이동 가능

# scss

1.  기본적으로 css와 유사하나 편의기능이 몇 가지 주어집니다.
2.  mixin(믹스인) 사용예제 src/scss/style.scss 에 주석으로 작성한 부분 참고하시면 좋을거 같습니다.
3.  들여쓰기로 자식 태그에게 스타일 적용 가능합니다. 해당 부분은 #salesControll 설정 예시로 보시면 될 거 같습니다.
4.  그 외 추가적인 기능이나 문법은 구글링 하시는 것 추천드립니다.

# MongoDB 연동

1.  일단 MongoDB 설치해야 합니다. (설치법 및 세팅은 구글링 추천!!)
2.  db에서 kiosk 라는 이름의 database 하나를 생성합니다. (이름은 자유롭게 명명 가능)
3.  mongoose 패키지 설치합니다. npm install mongoose 로 설치하시면 됩니다.
4.  아래의 코드를 index.js에 추가합니다.

        import mongoose from 'mongoose';

        mongoose.connect('mongodb://localhost:27017/kiosk', // <-- 데이터베이스 이름을 다르게 지었다면 kiosk를 해당 이름으로 변경
          {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
          });

        const db = mongoose.connection;

        const handleDBOpen = () => console.log('✅ Connected to DB');
        const handleDBError = (error) => console.log(`❗ Error with DB connection : ${error}`);

        db.once('open', handleDBOpen);
        db.on('error', handleDBError);

5.  위 과정을 개별적으로 적용하기 번거로우시면 master 브랜치말고 그 밑으로 분기된 브랜치 중 하나 pull 하셔도 됩니다.
