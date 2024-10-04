<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>영양소 블록 화면</title>
    <script src="https://cdn.socket.io/4.0.0/socket.io.min.js"></script> <!-- socket.io 클라이언트 로드 -->
    
    <style>
        @font-face {
            font-family: 'Happiness-Sans-Title';
            src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2205@1.0/Happiness-Sans-Title.woff2') format('woff2');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: 'Happiness-Sans-Title', sans-serif;
            background-color: #fee791;
            height: 100vh;
            display: flex;
            flex-direction: column;
            text-align: center;
            justify-content: space-between;
            overflow: hidden; /* 스크롤 차단 */
        }

        .container {
            position: relative;
            width: 100%;
            height: 100%; /* 화면 전체 높이 */
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        /* 상단 메뉴 버튼 */
        .menu-btn {
            position: absolute;
            top: 45px;
            left: 60px;
            width: 94.5px;
            height: 84px;
            background-color: white;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* 수평 배치 */
        .horizontal-layout-nutrition {
            display: flex;
            justify-content: center; /* 가운데 정렬 */
            align-items: center; /* 세로 가운데 정렬 */
            gap: 20px; /* 블록 사이 간격 */
            margin-top: 30px;
        }

        /* 영양소 표시 */
        .carbon, .protein {
            display: inline-flex;
            padding: 0px 40px 0px 6px;
            align-items: center;
            gap: 16px;
            border-radius: 70px;
            max-width: 140px;
            margin-top: 20px; /* 추가: 영양소와의 간격 */
            position: absolute;
            top: 600px; /* Y축 고정 */
        }

        .carbon {
            background-color: #FFACAC;
            left: 178px; /* 탄수화물 블럭 X축 */
        }

        .protein {
            background-color: #83C0FE;
            left: 1046px; /* 단백질 블럭 X축 */
        }

        .info {
            position: absolute;
            top: 600px;
            left: 564px;
            font-family: "Happiness-Sans-Title";
            font-size: 35px;
            line-height: 143%;
            letter-spacing: -1px;
            border-radius: 70px;
            border: 1.5px solid #FFF;
            background: linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0) 100%);
            box-shadow: 4.876px 4.876px 48.762px 0px rgba(255, 184, 0, 0.50);
            padding: 16px 30px;
            text-align: center;
            color: black;
            margin-top: 20px; /* 이미지와 텍스트 사이의 간격 */
            max-width: 240px;
        }

        /* 이미지 크기 및 간격 설정 유지 */
        .carbon img, .protein img {
            width: 80px;
            height: 80px;
            margin-right: -20px;
        }
        .carbon span, .protein span {
            color: #FFF;
            font-family: "Happiness-Sans-Title";
            font-size: 34px;
            line-height: 143%;
            letter-spacing: -2.086px;
        }

        .horizontal-layout-images {
            display: flex;
            justify-content: center; /* 가운데 정렬 */
            align-items: center; /* 세로 가운데 정렬 */
            gap: 100px; /* 아보카도와 버터 이미지 간 간격 */
        }

        .avocado{
            display: inline-flex;
            align-items: center;
            position: absolute;
            top: 300px; /* Y축 고정 */
        }

        .butter {
            display: inline-flex;
            align-items: center;
            position: absolute;
            top: 250px; /* Y축 고정 */
        }

        .avocado img, .butter img {
            max-width: 300px;
            width: 100%;
            height: auto;
            object-fit: contain; /* 이미지가 잘리지 않게 조정 */
            z-index: 1;
            margin-right: -20px;
            filter: blur(15px); /* 블러 적용 */
            opacity: 0.7; /* 투명도 70% */  transition: filter 0.5s ease, opacity 0.5s ease; /* 전환 효과 */
        }

        .avocado img:hover, .butter img:hover {
            filter: blur(0); /* 블러 제거 */
            opacity: 1; /* 투명도 100% */
        }

        .avocado {
            left: 83px;
        }

        .butter {
            left: 900px;
        }

        /* 텍스트와 올리브 이미지 섹션 */
        .content {
            text-align: center;
            margin-top: -140px;
        }

        .content p {
            color: #000000;
            font-size: 70px;
            font-family: "Happiness-Sans-Title";
            line-height: 143%;
            letter-spacing: -3.36px;
            transition: font-size 1s, opacity 1s;
            margin-top: -130px;
        }

        /* 올리브 이미지 */
        .olive img {
            margin-top: -30px;
            max-width: 500px;
            width: 100%;
            height: auto;
            object-fit: contain; /* 이미지가 잘리지 않게 조정 */
            z-index: 1;
            animation: float 3s ease-in-out infinite;
        }

        .nutritionblock img{
            max-width: 600px;
            width: 100%;
            height: auto;
            object-fit: contain; /* 이미지가 잘리지 않게 조정 */
            z-index: 1;
            position: absolute;
            top: 730px;
            display: flex;
            justify-content: center; /* 가운데 정렬 */
            align-items: center; /* 세로 가운데 정렬 */
            left: 367px;
        }

        /* 블러 처리된 원 */
        .background-blur {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 1200px;  /* 원 크기 */
            height: 1200px;
            background-color: #ffdb26dd;
            border-radius: 50%;
            filter: blur(100px);  /* 블러 처리 */
            transform: translate(-50%, -50%);
            z-index: -1;  /* 다른 요소보다 뒤에 배치 */
        }


        @keyframes float {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-30px);
            }
        }

        /* 아이패드 12.9인치 최적화를 위한 미디어 쿼리 */
        @media (max-height: 1024px) {
            .content p { font-size: 56px; }
            .olive img { max-width: 500px; }
            .avocado img { max-width: 300px; }
            .butter img { max-width: 400px; }
            .info { font-size: 32px; margin-top: 20px; margin-bottom: 190px; }
        }
    </style>
</head>
<body>

<div class="container">
    <!-- 메뉴 버튼 -->
    <div class="menu-btn">
        <img src="menu2.svg" alt="menu" />
    </div>

    <!-- 블러 처리된 원 -->
    <div class="background-blur"></div>

    <!-- 타이틀 -->
    <div class="content">
        <p class="title">영양소 블록을 쌓아 음식을 만들어봐요!</p>

        <!-- 아이템 컨테이너 -->
        <div class="olive" id="olive">
            <img src="olive.png" alt="올리브" />
        </div>

        <div class="horizontal-layout-nutrition">
            <!-- 정보 표시 -->
            <div id="info-text" class="info">올리브 오일</div>

            <!-- 영양소 up/down -->
            <div class="carbon" id="carbon">
                <img src="carbon.svg" alt="탄수화물"/>
                <span>-1</span>
            </div>

            <div class="protein" id="protein">
                <img src="protein.svg" alt="단백질"/>
                <span>+1</span>
            </div>
        </div>

        <div class="horizontal-layout-images">
            <!-- 아보카드 이미지 -->
            <div class="avocado">
                <img src="avocado.png" alt="아보카도" />
            </div>

            <!-- 버터 이미지 -->
            <div class="butter">
                <img src="butter.png" alt="버터" />
            </div>
        </div>

        <div id="image-block" class="nutritionblock"><img src="bottomblock1.png" alt="영양소 블록 이미지" /></div>
</div>

<script>
    const socket = io.connect('https://fast-spire-56568.herokuapp.com'); // Heroku의 서버 URL로 변경
    const bottomBlockImage = document.getElementById("image-block").querySelector("img"); // 이미지 가져오기

    socket.on('rfid', function(tag) {
        if (tag === '5390718B') {
            bottomBlockImage.src = 'bottomblock2.png';
            document.getElementById('info-text').innerText = '버터'; // 변경된 텍스트
        } else if (tag === 'C002D958') {
            bottomBlockImage.src = 'bottomblock3.png';
            document.getElementById('info-text').innerText = '아보카도'; // 변경된 텍스트
        } else if (tag === 'C2765B54') {
            bottomBlockImage.src = 'bottomblock1.png';
            document.getElementById('info-text').innerText = '올리브유'; // 변경된 텍스트
        }
    });

    app.use(cors({
  origin: 'https://nutritionblock.netlify.app'
}));

</script>

</body>
</html>
