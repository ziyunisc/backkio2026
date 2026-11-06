
document.addEventListener("DOMContentLoaded", () => {

    // AI 모드 여부 확인
    const aiMode = sessionStorage.getItem("aiMode") === "true";
    // 일반 모드에서는 메뉴 추천 패널 숨기기
    if (!aiMode) {
        document.getElementById("ai-helper-panel")?.classList.add("hidden");
    }
    sessionStorage.removeItem("aiMode");

    // 시작 안내 화면
    const introScreen = document.getElementById("intro-screen");
    const introStartBtn = document.getElementById("intro-start-btn");

    // AI 모드일 경우 시작 안내 화면 생략
    if (aiMode) {
        document.body.classList.add("ai-mode");
        introScreen.classList.add("hidden");
    }

    // 기본 모드에서 시작 버튼 누르면 타이머 시작
        
    introStartBtn.addEventListener("click", () => {
        if (introStartBtn.disabled) return;
        introStartBtn.disabled = true;

        // 시작 안내 화면을 닫고 키오스크 표시
        introScreen.classList.add("hidden");

        if (!aiMode) {
            sessionStorage.removeItem("firstMissionResult");
            sessionStorage.removeItem("aiMode");

            startMissionCountdown();
        }
    });


        
    const menuData = {
        "커피": [
            { name: "아메리카노", price: 3500, image: "/static/images/아메리카노.png" },
            { name: "헤이즐넛아메리카노", price: 4000, image: "/static/images/헤이즐넛아메리카노.png" },
            { name: "카라멜마끼아또", price: 4800, image: "/static/images/카라멜마끼아또.png" },
            { name: "카페모카", price: 4500, image: "/static/images/카페모카.png" },
            { name: "카푸치노", price: 4000, image: "/static/images/카푸치노.png" }
        ],

        "라떼": [
            { name: "카페라떼", price: 4000, image: "/static/images/카페라떼.png" },
            { name: "바닐라라떼", price: 4200, image: "/static/images/바닐라라떼.png" },
            { name: "헤이즐넛라떼", price: 4200, image: "/static/images/헤이즐넛라떼.png" },
            { name: "딸기라떼", price: 4500, image: "/static/images/딸기라떼.png" },
            { name: "고구마라떼", price: 4500, image: "/static/images/고구마라떼.png" },
            { name: "곡물라떼", price: 4500, image: "/static/images/곡물라떼.png" }
        ],

        "에이드": [
            { name: "레몬에이드", price: 4300, image: "/static/images/레몬에이드.png" },
            { name: "자몽에이드", price: 4300, image: "/static/images/자몽에이드.png" },
            { name: "청포도에이드", price: 4300, image: "/static/images/청포도에이드.png" },
            { name: "체리에이드", price: 4300, image: "/static/images/체리에이드.png"},
            { name: "블루레몬에이드", price: 4500, image: "/static/images/블루레몬에이드.png" }
        ],

        "스무디": [
            { name: "요거트스무디", price: 4800, image: "/static/images/요거트스무디.png" },
            { name: "딸기요거트스무디", price: 5000, image: "/static/images/딸기요거트스무디.png" },
            { name: "블루베리요거트스무디", price: 5000, image: "/static/images/블루베리요거트스무디.png" },
            { name: "초코스무디", price: 4800, image: "/static/images/초코스무디.png" }
        ],

        "주스": [
            { name: "딸기주스", price: 4500, image: "/static/images/딸기주스.png"},
            { name: "수박주스", price: 4500, image: "/static/images/수박주스.png" },
            { name: "키위주스", price: 4500, image: "/static/images/키위주스.png" },
            { name: "망고주스", price: 4500, image: "/static/images/망고주스.png" }
        ],

        "티": [
            { name: "아이스티", price: 3500, image: "/static/images/아이스티.png" },
            { name: "녹차", price: 3500, image: "/static/images/녹차.png" },
            { name: "유자차", price: 3800,image: "/static/images/유자차.png" },
            { name: "캐모마일", price: 3800, image: "/static/images/캐모마일.png" },
            { name: "얼그레이", price: 3800, image: "/static/images/얼그레이.png" },
            { name: "허니블랙자몽티", price: 4500, image: "/static/images/허니블랙자몽티.png" }
        ],
        "디저트": [
        { name: "스노우버터쿠키", price: 2500, image: "/static/images/스노우버터쿠키.png" },
        { name: "크로플", price: 4000, image: "/static/images/크로플.png" },
        { name: "치즈케이크", price: 5000, image: "/static/images/치즈케이크.png" }
        ]
    };

    // 결제 및 포인트 팝업 요소
    const paymentOverlay = document.getElementById("payment-overlay");
    const pointsOverlay = document.getElementById("points-overlay");
    const paymentAmount = document.getElementById("payment-amount");

    // 결제 팝업 열기
    function showPayment() {
        const total = cart.reduce(
            (sum, item) => sum + item.price, 0
        );

        paymentAmount.textContent = `${total.toLocaleString()}원`;
        paymentOverlay.classList.remove("hidden");
    }

    // 포인트 적립 팝업 열기
    function showPoints() {
        pointsOverlay.classList.remove("hidden");
    }

    
    // 결제 수단 선택
    document.querySelectorAll(".payment-option").forEach(button => {
        button.addEventListener("click", () => {
            const paymentMethod = button.querySelector("span")?.textContent.trim();

            // 기프티콘/상품권만 결제 성공
            if (paymentMethod === "기프티콘/상품권") {
                paymentOverlay.classList.add("hidden");
                showPoints();
                return;
            }

            // 다른 결제 수단은 실패 팝업 표시
            document.getElementById("payment-fail-overlay")
                .classList.remove("hidden");
        });
    });

    // 실패 팝업 확인 버튼
    document.getElementById("payment-fail-confirm")
        .addEventListener("click", () => {
            document.getElementById("payment-fail-overlay")
                .classList.add("hidden");
        });


    // 포인트 적립 생략
    document.getElementById("points-skip").addEventListener("click", () => {
        pointsOverlay.classList.add("hidden");
        completeOrder();
    });

    // 포인트 적립 방법 선택
    document.querySelectorAll(".points-option").forEach(button => {
        button.addEventListener("click", () => {
            pointsOverlay.classList.add("hidden");

            // 체험용: 실제 개인정보 입력이나 적립은 하지 않음
            completeOrder();
        });
    });

    
    /* ==========================
       랜덤 디저트 추천 팝업
    ========================== */

    const upsellOverlay = document.getElementById("upsell-overlay");
    const upsellAccept = document.getElementById("upsell-accept");
    const upsellDecline = document.getElementById("upsell-decline");
    const upsellMore = document.getElementById("upsell-more");

    let currentRecommendedDessert = null;

    // 등록된 디저트 3개 중 랜덤 선택
    function getRandomDessert() {
        const desserts = menuData["디저트"] || [];

        if (desserts.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(
            Math.random() * desserts.length
        );

        return desserts[randomIndex];
    }

    // 팝업의 기존 문구 변경
    function changeUpsellText() {
        const walker = document.createTreeWalker(
            upsellOverlay,
            NodeFilter.SHOW_TEXT
        );

        const textNodes = [];

        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        textNodes.forEach(node => {
            const text = node.textContent.trim();

            if (!text) return;

            if (text.includes("세트") && 
                (text.includes("변경") || text.includes("구매"))) {
                node.textContent = "이런 디저트는 어떠세요?";
            } else if (
                text.includes("추가") &&
                text.includes("2,000")
            ) {
                node.textContent =
                    "주문하신 음료와 함께 디저트도 즐겨보세요!";
            }
        });
    }

    // 추천 디저트 표시 영역 생성
    const dessertInfo = document.createElement("div");
    dessertInfo.id = "upsell-dessert-info";

    dessertInfo.style.textAlign = "center";
    dessertInfo.style.padding = "16px";
    dessertInfo.style.margin = "12px 0";
    dessertInfo.style.borderRadius = "12px";
    dessertInfo.style.background = "#f1f6fc";

    // 기존 팝업 버튼 바로 앞에 디저트 정보 삽입
    upsellAccept.parentNode.insertBefore(
        dessertInfo,
        upsellAccept
    );

    // 기존 버튼 문구 변경
    upsellAccept.textContent = "이 디저트 추가하기";
    upsellDecline.textContent = "음료만 주문하기";

    if (upsellMore) {
        upsellMore.style.display = "none";
    }

    // 팝업 열기
    function showUpsell() {
        currentRecommendedDessert = getRandomDessert();

        if (!currentRecommendedDessert) {
            showPayment();
            return;
        }

        changeUpsellText();

        const dessert = currentRecommendedDessert;

        dessertInfo.innerHTML = `
            <div style="
                width: 100px;
                height: 100px;
                margin: 0 auto 8px;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <img
                    src="${dessert.image}"
                    alt="${dessert.name}"
                    style="
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        border-radius: 8px;
                    "
                >
            </div>

            <div style="
                font-size:21px;
                font-weight:800;
                margin-bottom:6px;
                color:#243e5c;
            ">
                ${dessert.name}
            </div>

            <div style="
                font-size:18px;
                font-weight:700;
                color:#477fb5;
            ">
                ${dessert.price.toLocaleString()}원
            </div>
        `;

        upsellOverlay.classList.remove("hidden");
    }

    // 팝업 닫기
    function closeUpsell() {
        upsellOverlay.classList.add("hidden");
    }

    // 추천 디저트 추가하기
    upsellAccept.addEventListener("click", () => {
        if (currentRecommendedDessert) {
            cart.push({
                drink: currentRecommendedDessert.name,
                temperature: null,
                size: null,
                shots: null,
                syrup: null,
                milk: null,
                ice: null,
                cup: null,
                toppings: [],
                price: currentRecommendedDessert.price,
                category: "디저트",
                setAdded: false
            });

            updateCart();
        }

        closeUpsell();
        showPayment();
    });

    // 디저트 추가하지 않고 주문하기
    upsellDecline.addEventListener("click", () => {
        closeUpsell();
        showPayment();
    });

    // ============================
    // 1. HTML 요소 가져오기
    // ============================
    const menuScreen = document.getElementById("menu-screen");
    const optionScreen = document.getElementById("option-screen");
    const bottomBar = document.getElementById("bottom-bar");

    const menuCards = document.querySelectorAll(".menu-card");
    const categoryButtons = document.querySelectorAll(".category-bar button");

    const cancelBtn = document.querySelector(".cancel-btn");
    const confirmBtn = document.querySelector(".confirm-btn");
    const orderBtn = document.getElementById("order-btn");

    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    const timerDisplay = document.getElementById("timer");

    const shotMinus = document.getElementById("shot-minus");
    const shotPlus = document.getElementById("shot-plus");
    const shotCount = document.getElementById("shot-count");

    // ============================
    // 2. 기본 변수
    // ============================
    let selectedDrink = null;              // 선택음료
    let basePrice = 0;                     // 가격
    let shots = 1;                         // 샷

    let cart = [];                         // 장바구니
    let timeLeft = 30;
    let timerInterval = null;
    let gameFinished = false;

    const optionGroups = document.querySelectorAll(".option-group");
    // 옵션 버튼의 원래 주문 값 저장
    document.querySelectorAll(".pill").forEach(button => {
        button.dataset.value =
            button.textContent.trim().replace(/\s*[+-]\s*[\d,]+.*$/, "");
    });
    // ============================
    // 3. 랜덤 미션 생성
    // ============================

        
    const missions = [
        {
            drink: "카페라떼",
            temperature: "HOT",
            size: "Tall",
            shots: 3,
            milk: "저지방",
            ice: null,
            cup: "일회용",
            toppings: ["휘핑크림", "초코드리즐", "자바칩"]
        },
        {
            drink: "곡물라떼",
            temperature: "ICE",
            size: "Venti",
            shots: 2,
            milk: "두유",
            ice: "많이",
            cup: "개인텀블러",
            toppings: ["휘핑크림"]
        },
        {
            drink: "카라멜마끼아또",
            temperature: "ICE",
            size: "Grande",
            shots: 2,
            milk: "아몬드",
            ice: "적게",
            cup: "매장컵",
            toppings: ["휘핑크림", "카라멜드리즐", "자바칩"]
        },
        {
            freeChoice: true
        }
    ];



        // 저장된 미션 확인
    const savedMission = sessionStorage.getItem("currentMission");

    let mission;

    if (aiMode && savedMission) {
        // AI 모드에서는 첫 번째 주문의 미션 유지
        mission = JSON.parse(savedMission);
    } else {
        // 일반 모드에서는 새로운 랜덤 미션 생성
        mission = missions[Math.floor(Math.random() * missions.length)];

        // AI 모드에서도 사용할 수 있도록 저장
        sessionStorage.setItem("currentMission", JSON.stringify(mission));
    }
    // 미션 표시 영역 생성
    const missionBox = document.createElement("div");
    missionBox.style.display = "none";
    
        // 선택된 미션을 콘솔에만 출력
    console.log("========== 주문 미션 ==========");

    if (mission.freeChoice) {
        console.log("미션 4: 유저 마음대로");
        console.log("조건: 아무 음료나 자유롭게 주문하기");
    } else {
        console.log("음료:", mission.drink);
        console.log("온도:", mission.temperature);
        console.log("사이즈:", mission.size);
        console.log("샷:", mission.shots);
        console.log("우유:", mission.milk);
        console.log("얼음:", mission.ice ?? "해당 없음");
        console.log("컵:", mission.cup);
        
        console.log("토핑:", mission.toppings.join(", "));
    }

    console.log("===============================");

    menuScreen.insertBefore(
        missionBox,
        menuScreen.querySelector(".menu-grid")
    );

    // ============================
    // 4. 타이머
    // ============================
    
    function startMissionCountdown() {
        const overlay = document.createElement("div");
        overlay.className = "mission-countdown-overlay";

        const text = document.createElement("div");
        text.className = "mission-countdown-text";

        overlay.appendChild(text);
        document.querySelector(".kiosk").appendChild(overlay);

        let step = 0;

        const messages = [
            "3",
            "2",
            "1",
            mission.freeChoice
                ? "내 차례인데 메뉴를 정하지 못했다!\n뭐 먹지?"
                : `${mission.drink}를 주문하세요!`
        ];

        function showStep() {
            text.classList.remove("countdown-pop");

            // 애니메이션을 다시 시작하기 위한 처리
            void text.offsetWidth;

            text.textContent = messages[step];
            text.classList.add("countdown-pop");

            if (step === 3) {
                text.classList.add("countdown-mission");
            }

            step++;

            if (step < messages.length) {
                setTimeout(showStep, 1000);
            } else {
                setTimeout(() => {
                    overlay.remove();

                    // 카운트다운 종료 후 30초 타이머 시작
                    startTimer();
                }, 1500);
            }
        }

        showStep();
    }

    function startTimer() {
        clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            if (gameFinished) return;

            timeLeft--;
            timerDisplay.textContent = timeLeft;

            // 특정 시간에 경고 팝업 표시
            if (timeLeft === 15) {
                showTimeWarning(15);
            }

            if (timeLeft === 5) {
                showTimeWarning(5);
            }


            // 제한 시간 종료
            if (timeLeft <= 0) {
                finishGame(false, true);
            }
        }, 1000);
    }
    if (aiMode) {
        timerDisplay.textContent = "∞";
    
    }
    // ============================
    // 6. 음료 선택
    // ============================
    
    // 메뉴 목록 영역
    const menuGrid = document.getElementById("menu-grid");

    // 카테고리별 메뉴 표시
    function renderMenu(category) {
        const drinks = menuData[category];

        if (!drinks) {
            console.error("카테고리 데이터가 없습니다:", category);
            return;
        }


        menuGrid.innerHTML = "";

        drinks.forEach(drink => {
            const card = document.createElement("div");
            card.className = "menu-card";

            card.innerHTML = `
                <div class="drink-icon">${drink.image
                    ? `<img src="${drink.image}" alt="${drink.name}" class="menu-drink-image">`
                    : (drink.icon || "☕")
                }</div>
                <strong>${drink.name}</strong>
                <small>${category}</small>
                <span>${drink.price.toLocaleString()}원</span>
            `;

            // 음료 선택 시 기존 옵션 화면 열기
            card.addEventListener("click", () => {
                if (gameFinished) return;

                                
                selectedDrink = drink.name;
                basePrice = drink.price;

                // 디저트는 옵션 선택 없이 바로 장바구니에 담기
                if (category === "디저트") {
                    cart.push({
                        drink: drink.name,
                        temperature: null,
                        size: null,
                        shots: null,
                        syrup: null,
                        milk: null,
                        ice: null,
                        cup: null,
                        price: drink.price
                    });

                    updateCart();
                    return;
                }

                resetOptions();
                applyDrinkOptionRules();
                updateTemperatureOptions();

                
                menuScreen.classList.add("hidden");
                optionScreen.classList.remove("hidden");
                bottomBar.classList.add("hidden");

                if (aiMode) {
                    startAiOptionWizard();
                }

                // 옵션 화면을 열 때마다 스크롤을 맨 위로 이동
                
                
                // 옵션 화면을 열 때마다 실제 스크롤 영역 초기화
                function resetOptionScroll() {
                    const optionContent = optionScreen.querySelector(".option-content");
                    const aiWizardBody = optionScreen.querySelector(".ai-wizard-body");

                    // 일반 모드 옵션 화면
                    if (optionContent) {
                        optionContent.scrollTop = 0;
                        optionContent.scrollLeft = 0;
                    }

                    // AI 모드 옵션 화면
                    if (aiWizardBody) {
                        aiWizardBody.scrollTop = 0;
                        aiWizardBody.scrollLeft = 0;
                    }
                }

                // 옵션 화면이 표시된 직후 실행
                resetOptionScroll();

                requestAnimationFrame(() => {
                    resetOptionScroll();
                });



                document.getElementById("ai-assistant-btn").style.display = "block";

            });

            menuGrid.appendChild(card);
        });


    }

    // 카테고리 버튼 클릭
        
    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            const category = button.dataset.category;

            categoryButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            renderMenu(category);
            if (easyWordsEnabled) {
                applyEasyWords(menuGrid);
            }
        });
    });


    // 처음에는 커피 카테고리 표시
    renderMenu("커피");
    
    // 기본적으로 차갑게 제공하는 음료
    const iceOnlyCategories = ["에이드", "스무디", "주스"];

    function isIceOnlyDrink() {
        return Object.entries(menuData).some(([category, drinks]) =>
            iceOnlyCategories.includes(category) &&
            drinks.some(drink => drink.name === selectedDrink)
        );
    }

    // 선택한 음료에 따라 온도 버튼 설정
    function updateTemperatureOptions() {
        const temperatureGroup = [...optionGroups].find(group =>
            getOptionTitle(group).includes("온도")
        );

        if (!temperatureGroup) return;

        const buttons = [...temperatureGroup.querySelectorAll(".pill")];

        const hotButton = buttons.find(button =>
            (button.dataset.value || button.textContent.trim()).includes("HOT")
        );

        const iceButton = buttons.find(button =>
            (button.dataset.value || button.textContent.trim()).includes("ICE")
        );

        if (hotButton) {
            hotButton.style.display = isIceOnlyDrink() ? "none" : "";
        }

        if (isIceOnlyDrink() && iceButton) {
            buttons.forEach(button => button.classList.remove("selected"));
            iceButton.classList.add("selected");
        }
    }
    
    // 메뉴별 사용 가능한 옵션 설정
    function getDrinkOptionRules(drinkName = selectedDrink) {
        const category = Object.keys(menuData).find(key =>
            menuData[key].some(item => item.name === drinkName)
        );

        const coffeeNames = [
            "아메리카노", "헤이즐넛아메리카노",
            "카라멜마끼아또", "카페모카", "카푸치노",
            "카페라떼", "바닐라라떼", "헤이즐넛라떼"
        ];

        const milkNames = [
            "카라멜마끼아또", "카페모카", "카푸치노",
            "카페라떼", "바닐라라떼", "헤이즐넛라떼",
            "딸기라떼", "고구마라떼", "곡물라떼"
        ];

        const coldOnly = ["에이드", "스무디", "주스"]
            .includes(category);

        const coffee = coffeeNames.includes(drinkName);

        return {
            category,
            coldOnly,
            temperature: true,
            size: true,

            // 기존 커피 + 모든 라떼에서 샷 추가 가능
            shots: coffee || category === "라떼",

            milk: milkNames.includes(drinkName),

            // 시럽은 기존 설정 유지
            syrup: coffee,

            ice: !["스무디"].includes(category),
            cup: true,
            toppings: ["커피", "라떼", "스무디"]
                .includes(category)
        };
    }

    // 메뉴별 옵션 버튼 활성화 / 비활성화
    function applyDrinkOptionRules() {
        const rules = getDrinkOptionRules();

        const groupRules = {
            "시럽": rules.syrup,
            "우유": rules.milk,
            "얼음": rules.ice,
            "토핑": rules.toppings
        };

        optionGroups.forEach(group => {
            const title = getOptionTitle(group);
            const entry = Object.entries(groupRules)
                .find(([name]) => title.includes(name));

            const enabled = entry ? entry[1] : true;

            group.classList.toggle(
                "option-disabled", !enabled
            );

            group.querySelectorAll(".pill").forEach(button => {
                button.disabled = !enabled;

                if (!enabled) {
                    button.classList.remove("selected");
                }
            });

            // 옵션 제목도 회색으로 표시
            const heading = group.previousElementSibling;
            if (heading) {
                heading.classList.toggle(
                    "option-disabled-title", !enabled
                );
            }
        });

        // 에스프레소 샷 0개 고정
        if (!rules.shots) {
            shots = 0;
            shotCount.textContent = "0";
            shotMinus.disabled = true;
            shotPlus.disabled = true;
        } else {
            shots = 1;
            shotCount.textContent = "1";
            shotMinus.disabled = false;
            shotPlus.disabled = false;
        }

        // 온도: 차가운 음료는 HOT만 비활성화
        const temperatureGroup = [...optionGroups].find(group =>
            getOptionTitle(group).includes("온도")
        );

        if (temperatureGroup) {
            const buttons = [
                ...temperatureGroup.querySelectorAll(".pill")
            ];

            const hot = buttons.find(button =>
                (button.dataset.value || button.textContent)
                    .includes("HOT")
            );

            const ice = buttons.find(button =>
                (button.dataset.value || button.textContent)
                    .includes("ICE")
            );

            if (hot) {
                hot.disabled = rules.coldOnly;
                hot.classList.toggle(
                    "option-unavailable", rules.coldOnly
                );
            }

            if (rules.coldOnly && ice) {
                buttons.forEach(button =>
                    button.classList.remove("selected")
                );
                ice.classList.add("selected");
            }
        }
    updateIceOptionState();
    }

    // ============================
    // 7. 옵션 초기화
    // ============================
    
    
    function resetOptions() {
        // 샷 초기화
        shots = 1;
        shotCount.textContent = "1";

        // 모든 옵션 선택 해제
        document.querySelectorAll(".pill").forEach(button => {
            button.classList.remove("selected");
            if (getOptionTitle(button.closest(".option-group")).includes("온도")) {
                updateIceOptionState();
            }
        });
        
        // 기본 선택값 설정
        const defaults = {
            "시럽": "기본",
            "우유": "일반우유",
            "얼음": "보통",
        };

        optionGroups.forEach(group => {
            const title = getOptionTitle(group);
            const buttons = group.querySelectorAll(".pill");

            for (const [key, value] of Object.entries(defaults)) {
                if (title.includes(key)) {
                    buttons.forEach(button => {
                        if (button.textContent.trim() === value) {
                            button.classList.add("selected");
                        }
                    });
                    break;
                }
            }
        });
    }

    optionGroups.forEach(group => {
    const buttons = group.querySelectorAll(".pill");
    const title = getOptionTitle(group);

    buttons.forEach(button => {
        button.addEventListener("click", () => {

            if (gameFinished || button.disabled) return;

            // 토핑은 여러 개 선택 가능
            if (title.includes("토핑")) {
                button.classList.toggle("selected");
            } else {
                // 나머지는 하나만 선택
                buttons.forEach(btn => {
                    btn.classList.remove("selected");
                });

                button.classList.add("selected");
            }

            // HOT / ICE 선택 시 얼음 옵션 상태 갱신
            if (title.includes("온도")) {
                updateIceOptionState();
            }

            console.log("선택한 옵션:", button.textContent);
            });
        });
    });

    
    


    // ============================
    // 9. 샷 개수 변경
    // ============================
    shotMinus.addEventListener("click", () => {
        if (shots > 1 && !gameFinished) {
            shots--;
            shotCount.textContent = shots;
        }
    });

    shotPlus.addEventListener("click", () => {
        if (shots < 6 && !gameFinished) {
            shots++;
            shotCount.textContent = shots;
        }
    });

    // ============================
    // 10. 옵션 값 가져오기
    // ============================
    
    function getOptionTitle(group) {
        const heading = group.previousElementSibling;
        if (!heading) return "";

        return heading.dataset.originalTitle || heading.textContent;
    }

    
    function getSelectedOption(title) {
        const group = [...optionGroups].find(group => {
            return getOptionTitle(group).includes(title);
        });

        if (!group) return null;

        const selected = group.querySelector(".pill.selected");

        return selected
            ? selected.dataset.value ||
            selected.textContent.trim().replace(/\s*[+-]\s*[\d,]+.*$/, "")
            : null;
    }


    function getOptionPrice(text) {
        if (!text) return 0;

        const match = text.match(/([+-])\s*([\d,]+)/);

        if (!match) return 0;

        const amount = Number(match[2].replace(/,/g, ""));
        return match[1] === "+" ? amount : -amount;
    }
        // 음료 종류에 따라 필요한 옵션 구분
    
    // ============================
    // 11. 가격 계산
    // ============================
    // HOT 선택 시 얼음량 옵션 비활성화
    function updateIceOptionState() {
        const temperature = getSelectedOption("온도");

        const iceGroup = [...optionGroups].find(group =>
            getOptionTitle(group).includes("얼음")
        );

        if (!iceGroup) return;

        const rules = getDrinkOptionRules();

        // HOT이거나 원래 얼음 옵션이 없는 음료
        const disabled = temperature === "HOT" || !rules.ice;

        // 얼음 옵션 영역 회색 처리
        iceGroup.classList.toggle("option-disabled", disabled);
        iceGroup.classList.toggle("ice-disabled", disabled);

        // 얼음 옵션 제목 회색 처리
        const heading = iceGroup.previousElementSibling;

        if (heading) {
            heading.classList.toggle(
                "option-disabled-title",
                disabled
            );
        }

        // 버튼 활성화 / 비활성화
        const buttons = iceGroup.querySelectorAll(".pill");

        buttons.forEach(button => {
            button.disabled = disabled;

            if (disabled) {
                button.classList.remove("selected");
            }
        });

        // ICE를 다시 선택하면 기본값 '보통' 선택
        if (!disabled) {
            const selected = iceGroup.querySelector(".pill.selected");

            if (!selected) {
                const normalButton = [...buttons].find(button =>
                    (button.dataset.value || button.textContent.trim())
                        .includes("보통")
                );

                if (normalButton) {
                    normalButton.classList.add("selected");
                }
            }
        }
    }
    
    function calculatePrice() {
        let price = basePrice;
        const rules = getDrinkOptionRules();

        function selectedPrice(title) {
            const group = [...optionGroups].find(group =>
                getOptionTitle(group).includes(title)
            );

            const selected = group?.querySelector(".pill.selected");

            return getOptionPrice(selected?.textContent || "");
        }

        price += selectedPrice("사이즈");
        price += selectedPrice("컵");

        if (rules.syrup) {
            price += selectedPrice("시럽");
        }

        if (rules.milk) {
            price += selectedPrice("우유");
        }

        if (rules.shots) {
            price += Math.max(0, shots - 1) * 500;
        }

        if (rules.toppings) {
            const toppingGroup = [...optionGroups].find(group =>
                getOptionTitle(group).includes("토핑")
            );

            toppingGroup?.querySelectorAll(".pill.selected")
                .forEach(button => {
                    price += getOptionPrice(button.textContent);
                });
        }

        return Math.max(0, price);
    }


    // ============================
    // 12. 장바구니 담기
    // ============================
    confirmBtn.addEventListener("click", () => {
        if (gameFinished) return;

        const temperature = getSelectedOption("온도");
        const size = getSelectedOption("사이즈");
        const cup = getSelectedOption("컵");
        console.log("온도:", temperature);
        console.log("사이즈:", size);
        console.log("컵:", cup);
        if (!temperature || !size || !cup) {
            alert("필수 옵션을 모두 선택해주세요.");
            return;
        }
        const toppingGroup = [...optionGroups].find(group =>
            getOptionTitle(group).includes("토핑")
        );

        const toppings = toppingGroup
            ? [...toppingGroup.querySelectorAll(".pill.selected")]
                .map(btn =>
                    btn.dataset.value ||
                    btn.textContent.trim().split(/\s*[+-]\s*\d/)[0]
                )   
            : [];
        const rules = getDrinkOptionRules(selectedDrink);
        const item = {
            drink: selectedDrink,
            temperature,
            size,
            shots: rules.shots ? shots : null,
            syrup: rules.syrup
                ? getSelectedOption("시럽") : null,
            milk: rules.milk
                ? getSelectedOption("우유") : null,
            ice: rules.ice && temperature === "ICE"
                ? getSelectedOption("얼음") : null,
            cup,
            toppings: rules.toppings ? toppings : [],
            price: calculatePrice()
        };
        item.setAdded = false;
        cart.push(item);
        updateCart();

        optionScreen.classList.add("hidden");
        menuScreen.classList.remove("hidden");
        bottomBar.classList.remove("hidden");
        document.getElementById("ai-assistant-btn").style.display = "none"

    });

    // ============================
    // 13. 취소 버튼
    // ============================
    cancelBtn.addEventListener("click", () => {
        if (gameFinished) return;

        optionScreen.classList.add("hidden");
        menuScreen.classList.remove("hidden");
        bottomBar.classList.remove("hidden");
        document.getElementById("ai-assistant-btn").style.display = "block";
    });

    // ============================
    // 14. 장바구니 갱신
    // ============================
    function updateCart() {
        const total = cart.reduce((sum, item) => sum + item.price, 0);

        cartCount.textContent = `${cart.length}건`;
        cartTotal.textContent = `${total.toLocaleString()}원`;

        orderBtn.disabled = cart.length === 0;
    }
    
    // 실제 주문 완료 및 미션 판정
    function completeOrder() {
        if (gameFinished || cart.length === 0) return;

        const item = cart[cart.length - 1];

        
        const correct = mission.freeChoice
            ? cart.length > 0
            : (
                cart.length === 1 &&
                !item.setAdded &&
                item.drink === mission.drink &&
                item.temperature === mission.temperature &&
                item.size === mission.size &&
                item.shots === mission.shots &&
                item.milk === mission.milk &&
                (mission.ice === null || item.ice === mission.ice) &&
                item.cup === mission.cup &&
                (item.toppings ?? []).length === mission.toppings.length &&
                mission.toppings.every(topping =>
                    (item.toppings ?? []).some(selected =>
                        selected.trim() === topping.trim()
                    )
                )
            );
            /*console.table({
                장바구니개수: cart.length === 1,
                세트미선택: !item.setAdded,
                음료: item.drink === mission.drink,
                온도: item.temperature === mission.temperature,
                사이즈: item.size === mission.size,
                샷: item.shots === mission.shots,
                우유: item.milk === mission.milk,
                얼음: item.ice === mission.ice,
                컵: item.cup === mission.cup,
                토핑:
                    item.toppings.length === mission.toppings.length &&
                    mission.toppings.every(t =>
                        item.toppings.includes(t)
                    )
            });*/
            finishGame(correct, false);
    }   

    // ============================
    // 15. 주문 검증
    // ============================
    
    orderBtn.addEventListener("click", () => {
        if (gameFinished) return;
        if (cart.length === 0) return;

        // AI 모드는 디저트 추천 팝업 생략
        if (aiMode) {
            showPayment();
            return;
        }

        // 일반 모드는 랜덤 디저트 추천
        showUpsell();
    });


    // ============================
    // 16. 결과 화면
    // ============================
    
    // 제한 시간 경고 팝업
    const timeWarning = document.getElementById("time-warning");
    const warningTitle = document.getElementById("warning-title");
    const warningMessage = document.getElementById("warning-message");

    let warningTimeout = null;

    function showTimeWarning(seconds) {
        if (gameFinished) return;

        clearTimeout(warningTimeout);

        warningTitle.textContent = "⚠️ 제한 시간 경고!";
        warningMessage.textContent =
            `제한 시간이 ${seconds}초 남았습니다! 서둘러 주문해주세요!`;

        // 5초 남았을 때 빨간색 경고
        timeWarning.classList.toggle("urgent", seconds <= 5);

        // 팝업 표시
        timeWarning.classList.add("show");

        // 2초 후 자동으로 사라짐
        warningTimeout = setTimeout(() => {
            timeWarning.classList.remove("show");
        }, 2000);
    }

    // 미션 정답과 실제 주문을 비교해 실패 이유 생성
    function getMissionErrors(timeout = false) {
        const errors = [];

        if (timeout) {
            errors.push("제한 시간을 초과했어요");
        }

        // 자유 주문 미션은 메뉴 및 옵션을 비교하지 않음
        if (mission.freeChoice) {
            return errors;
        }

        const item = cart.find(order => order.drink === mission.drink);

        // 메뉴가 다른 경우
        if (!item) {
            const ordered = cart
                .map(order => order.drink)
                .filter(Boolean);

            if (ordered.length > 0) {
                errors.push({
                    label: "음료 메뉴",
                    actual: [...new Set(ordered)].join(", "),
                    expected: mission.drink
                });
            }
        } else {
                    // 옵션 비교: 정답 → 실제 주문
            const compare = (label, expected, actual) => {
                if (expected === undefined) return;

                const a = expected ?? null;
                const b = actual ?? null;

                if (String(a) !== String(b)) {
                    if (cart.some(order => order.setAdded)) {
                        errors.push({
                            label: "세트 메뉴",
                            actual: "추가함",
                            expected: "추가 안 함"
                        });
                    }
                }
            };

            compare("온도", mission.temperature, item.temperature);
            compare("사이즈", mission.size, item.size);
            compare("샷 개수", mission.shots, item.shots);
            compare("시럽", mission.syrup, item.syrup);
            compare("우유 종류", mission.milk, item.milk);

            // HOT 음료에서는 얼음량 비교 생략
            if (mission.temperature === "ICE") {
                compare("얼음량", mission.ice, item.ice);
            }

            compare("컵 종류", mission.cup, item.cup);

            // 토핑 비교 (순서와 관계없이 검사)
            if (Array.isArray(mission.toppings)) {
                const expected = [...mission.toppings]
                    .map(value => value.trim()).sort();

                const actual = [...(item.toppings || [])]
                    .map(value => value.trim()).sort();

                if (JSON.stringify(expected) !== JSON.stringify(actual)) {
                    errors.push(
                        `토핑: ${expected.join(", ") || "없음"} → ` +
                        `${actual.join(", ") || "없음"}`
                    );
                }
            }
        }

        // 요청하지 않은 세트 추가
        if (cart.some(order => order.setAdded)) {
            errors.push("요청하지 않은 세트 메뉴가 추가되었어요");
        }

        // 요청하지 않은 추가 메뉴
        const extraOrders = cart.filter(order =>
            order !== item && !order.setAdded
        );

        if (extraOrders.length > 0 && item) {
            errors.push(
                `추가 메뉴가 주문되었어요 (${extraOrders.map(
                    order => order.drink
                ).join(", ")})`
            );
        }

        return errors;
    }
    
    /* ==========================================
    체험 종료 시 열려 있는 팝업 모두 닫기
    ========================================== */
    function closeAllOrderPopups() {
        const popupIds = [
            "upsell-overlay",
            "payment-overlay",
            "payment-fail-overlay",
            "points-overlay"
        ];

        popupIds.forEach(id => {
            const popup = document.getElementById(id);

            if (popup) {
                popup.classList.add("hidden");
            }
        });
    }

    
    function finishGame(success, timeout) {
        if (gameFinished) return;

        // 체험 종료 상태로 전환
        gameFinished = true;

        // 타이머 정지
        clearInterval(timerInterval);
        timerInterval = null;

        // 디저트, 결제, 결제 실패, 포인트 팝업 즉시 닫기
        closeAllOrderPopups();


        // 경고창 자동 닫기 예약 취소
        clearTimeout(warningTimeout);
        warningTimeout = null;

        // 표시 중인 경고창 즉시 숨기기
        if (timeWarning) {
            timeWarning.classList.remove("show", "urgent");
        }


        const elapsed = Math.max(0, 30 - timeLeft);
        const item = cart[cart.length - 1];

        const missionErrors = getMissionErrors(timeout);

        // 실제 비교 결과에 따라 성공 여부 결정
        const missionSuccess = !timeout &&
            missionErrors.length === 0 &&
            cart.length > 0 &&
            (mission.freeChoice || (
                cart.length === 1 &&
                cart[0].drink === mission.drink
            ));
        // 일반 모드에서만 첫 번째 주문 결과 저장
        if (!aiMode) {
            sessionStorage.setItem(
                "firstMissionResult",
                missionSuccess ? "success" : "fail"
            );
        }
        const resultClass = missionSuccess ? "success" : "fail";

        const resultTitle = missionSuccess
            ? "미션 성공"
            : "미션 실패";
        // 첫 번째 주문 결과 불러오기
        const firstMissionResult = sessionStorage.getItem(
            "firstMissionResult"
        );

        // AI 모드에서 두 번째 주문을 마쳤을 때만 수령 안내 표시
        let pickupMessageHTML = "";

        if (aiMode && firstMissionResult !== null) {
            const pickupMessage = firstMissionResult === "success"
                ? "옆에서 음료와 간식을 받아가세요"
                : "옆에서 음료를 받아가세요";

            pickupMessageHTML = `
                <div class="pickup-message">
                    <div class="pickup-message-icon">🎁</div>
                    <div class="pickup-message-title">체험 완료!</div>
                    <div class="pickup-message-text">
                        ${pickupMessage}
                    </div>
                </div>
            `;
        }
        // 실패 원인 목록 HTML
        const resultErrorsHTML = missionSuccess
    ? ""
    : `
        <div class="mission-error-list">
            <div class="mission-error-count">
                틀린 항목 ${missionErrors.length}개
            </div>

            ${missionErrors.map(error => {
                if (typeof error === "string") {
                    return `
                        <div class="mission-error-simple">
                            ${error}
                        </div>
                    `;
                }

                return `
                    <div class="mission-error-card">
                        <div class="mission-error-label">
                            ${error.label}
                        </div>

                        <div class="mission-error-compare">
                            <div class="mission-error-actual">
                                <small>내 주문</small>
                                <strong>${error.actual}</strong>
                            </div>

                            <div class="mission-error-expected">
                                <small>정답</small>
                                <strong>${error.expected}</strong>
                            </div>
                        </div>
                    </div>
                `;
            }).join("")}
        </div>
    `;

        // 주문 내역 표시
        
        
        const groupedOrders = [];

        cart.forEach(order => {
            // 같은 메뉴인지 비교하기 위한 옵션 정보
            const orderKey = JSON.stringify({
                drink: order.drink,
                category: order.category || "",
                temperature: order.temperature,
                size: order.size,
                shots: order.shots,
                syrup: order.syrup,
                milk: order.milk,
                ice: order.ice,
                cup: order.cup,
                toppings: [...(order.toppings || [])].sort(),
                price: order.price,
                setAdded: order.setAdded || false
            });

            // 동일한 메뉴와 옵션을 가진 상품 찾기
            const existingOrder = groupedOrders.find(
                item => item.key === orderKey
            );

            if (existingOrder) {
                existingOrder.quantity++;
            } else {
                groupedOrders.push({
                    key: orderKey,
                    order: order,
                    quantity: 1
                });
            }
        });

        // 중복 주문을 합쳐서 영수증 HTML 생성
        const orderItemsHTML = groupedOrders.map(group => {
            const order = group.order;
            const quantity = group.quantity;
            const isDessert = order.category === "디저트";

            // 음료 옵션 표시
            const rules = getDrinkOptionRules(order.drink);

            const options = isDessert
                ? ""
                : [
                    order.temperature,
                    order.size,
                    rules.shots && order.shots != null
                        ? `샷 ${order.shots}`
                        : null,
                    rules.syrup ? order.syrup : null,
                    rules.milk ? order.milk : null,
                    rules.ice ? order.ice : null,
                    order.cup,
                    ...(rules.toppings ? (order.toppings || []) : [])
                ].filter(Boolean).join(" / ");
            // 동일 상품의 합계 가격
            const groupPrice = order.price * quantity;

                        
            return `
                <div class="receipt-item">
                    <div class="receipt-item-top">
                        <span class="receipt-item-diamond">◆</span>

                        <div class="receipt-item-details">
                            <div class="receipt-item-name">
                                ${order.drink}${quantity > 1 ? ` X ${quantity}` : ""}
                            </div>

                            ${!isDessert ? `<p>${options}</p>` : ""}
                        </div>

                        <strong class="receipt-item-price">
                            ${groupPrice.toLocaleString()}원
                        </strong>
                    </div>
                </div>
            `;

        }).join("");



        const totalPrice = cart.reduce(
            (sum, order) => sum + order.price, 0
        );

        const orderNumber = String(
            Math.floor(Math.random() * 9000) + 1000
        );

        document.querySelector(".kiosk").innerHTML = `
            <div class="receipt-screen">

                <div class="receipt-paper">

                    <div class="receipt-brand">
                        <div class="receipt-brand-icon">☕</div>
                        <h2>AI CAFE</h2>
                        <p>BAEKSEOK AI KIOSK</p>
                    </div>

                    <div class="receipt-dashed"></div>

                    <div class="receipt-order-info">
                        <div>
                            <span>주문번호</span>
                            <strong>#${orderNumber}</strong>
                        </div>
                        <div>
                            <span>주문유형</span>
                            <strong>키오스크 체험</strong>
                        </div>
                    </div>

                    <div class="receipt-dashed"></div>

                    <div class="receipt-section-title">
                        [주문 내역]
                    </div>

                    ${orderItemsHTML}

                    <div class="receipt-dashed"></div>

                    <div class="receipt-price-row">
                        <span>주문 합계</span>
                        <span>${totalPrice.toLocaleString()}원</span>
                    </div>

                    <div class="receipt-price-row">
                        <span>체험 할인</span>
                        <span class="receipt-discount">
                            -${totalPrice.toLocaleString()}원
                        </span>
                    </div>

                    <div class="receipt-total">
                        <strong>최종 결제 (실결제)</strong>
                        <strong>0원</strong>
                    </div>

                    <div class="receipt-dashed"></div>

                    <div class="receipt-result ${resultClass}">

                    <div class="mission-result-icon">
                        ${missionSuccess ? "✓" : "✕"}
                    </div>

                    <div class="mission-result-title">
                        ${resultTitle}
                    </div>

                    ${resultErrorsHTML}

                    <div class="mission-result-divider"></div>

                    <div class="mission-result-time-label">
                        총 소요 시간
                    </div>

                    <div class="mission-result-time">
                        ${elapsed}초
                    </div>

                </div>
                    <div class="receipt-barcode" aria-hidden="true">
                        <span></span><span></span><span></span>
                        <span></span><span></span><span></span>
                        <span></span><span></span><span></span>
                        <span></span><span></span><span></span>
                        <span></span><span></span><span></span>
                        <span></span><span></span><span></span>
                        <span></span><span></span>
                    </div>

                    <div class="receipt-code">
                        RC-2026-${orderNumber}
                    </div>

                </div>

                <div class="receipt-actions">

                    ${pickupMessageHTML}

                    <button id="ai-help-btn" class="receipt-ai-btn">
                        ${aiMode
                            ? "처음으로 돌아가기"
                            : "AI 모드는 얼마나 쉬울까? 체험하기"
                        }
                    </button>

                </div>
                <div class="receipt-footer">
                    백석고등학교 모두의AI연구소
                </div>

            </div>
        `;

        
        document.getElementById("ai-help-btn")
            .addEventListener("click", () => {

                // 이미 AI 모드라면 애니메이션 없이 다시 주문
                // AI 모드 체험 종료 → 처음 화면으로 돌아가기
                if (aiMode) {

                    // 이전 체험 기록 삭제
                    sessionStorage.removeItem("firstMissionResult");
                    sessionStorage.removeItem("currentMission"); // 이 줄만 추가!
                    sessionStorage.removeItem("aiMode");

                    // 페이지 새로고침 → 일반 모드 첫 화면
                    window.location.reload();

                    return;
                }

                // 처음 AI 모드를 적용할 때만 애니메이션 실행
                const transition = document.getElementById("ai-transition");
                const message = document.getElementById("ai-transition-text");

                transition.classList.add("show");

                message.textContent = "AI 시스템을 준비하고 있습니다...";

                setTimeout(() => {
                    message.textContent = "주문 환경을 개선하고 있습니다...";
                }, 1000);

                setTimeout(() => {
                    message.textContent = "AI 도우미가 활성화되었습니다!";
                }, 2200);

                setTimeout(() => {
                    sessionStorage.setItem("aiMode", "true");
                    window.location.reload();
                }, 3000);
            });

    }


    
    // ==========================
    // AI 도우미 창 열기 / 닫기
    // ==========================

    const aiHelperPanel = document.getElementById("ai-helper-panel");
    const aiHelperClose = document.getElementById("ai-helper-close");
    
    // ==========================
    // 화면 가독성 개선 기능
    // ==========================

    const aiVisibilityButton =
        document.getElementById("ai-help-visibility");
     

    if (aiVisibilityButton) {
        aiVisibilityButton.addEventListener("click", () => {

            const loading = document.getElementById("ai-readable-loading");

            if (!loading || loading.classList.contains("show")) {
                return;
            }

            // 로딩 화면 표시
            loading.classList.add("show");

            // 1.5초 후 가독성 개선
            setTimeout(() => {

                // 가독성 개선 모드 활성화
                document.body.classList.add("readable-mode");

                // 선택지 창 닫기
                aiHelperPanel.classList.remove("open");

                // AI 도우미 버튼 다시 표시
                if (aiHelperButton) {
                    aiHelperButton.style.display = "";
                }

                // 로딩 화면 닫기
                loading.classList.remove("show");

                console.log("AI 가독성 개선 모드 활성화");

            }, 1500);
        });
    }


    // 기존 AI 도우미 버튼
    const aiHelperButton = document.getElementById("ai-assistant-btn");
    
    /* ==================================
    AI 메뉴 추천 - 4단계 상담
    ================================== */

    const aiRecommendButton = document.getElementById("ai-help-recommend");
    const aiRecommendScreen = document.getElementById("ai-recommend-screen");
    const aiRecommendQuestion = document.getElementById("ai-recommend-question");
    const aiRecommendChoices = document.getElementById("ai-recommend-choices");
    const aiRecommendResult = document.getElementById("ai-recommend-result");
    const aiRecommendPrev = document.getElementById("ai-recommend-prev");
    const aiRecommendRestart = document.getElementById("ai-recommend-restart");

    // 기존 AI 도우미의 첫 번째 선택지 영역
    const aiMainOptions = document.querySelector(
        "#ai-helper-panel > .ai-helper-options"
    );

    
    // ==========================================
    // 새로운 취향 기반 메뉴 추천
    // ==========================================

    let recommendStep = 0;
    let recommendAnswers = {};
    let recommendCategory = null;

    // 새 추천 데이터의 이름을 실제 키오스크 메뉴 이름으로 변환
    const recommendNameMap = {
        "latte": "카페라떼",
        "vanilla_latte": "바닐라라떼",
        "caramel_macchiato": "카라멜마끼아또",
        "cafe_mocha": "카페모카",
        "hazelnut_americano": "헤이즐넛아메리카노",
        "hazelnut_latte": "헤이즐넛라떼",
        "plain_yogurt_smoothie": "요거트스무디",
        "strawberry_smoothie": "딸기요거트스무디",
        "blueberry_smoothie": "블루베리요거트스무디",
        "strawberry_latte": "딸기라떼",
        "sweetpotato_latte": "고구마라떼",
        "grain_latte": "곡물라떼",
        "strawberry_juice": "딸기주스",
        "watermelon_juice": "수박주스",
        "kiwi_juice": "키위주스",
        "mango_juice": "망고주스",
        "iced_tea": "아이스티",
        "green_tea": "녹차",
        "chamomile_tea": "캐모마일",
        "earlgrey_tea": "얼그레이",
        "honey_grapefruit_tea": "허니블랙자몽티"
    };

    function getActualDrinkName(drink) {
        return recommendNameMap[drink.id] || drink.name;
    }

    
    // Q1은 기존 showRecommendQuestion()의 커피/논커피 선택을 유지
    // Q2와 Q3은 선택한 종류에 따라 완전히 분리

    const recommendQuestionData = {
        coffee: [
            {
                id: "taste",
                title: "어떤 맛의 커피를 좋아하세요?",
                options: [
                    { label: "☕ 쓴맛이 깊고 진한 커피", value: "strong" },
                    { label: "🍯 달달한 커피", value: "sweet" },
                    { label: "🥛 부드러운 커피", value: "soft" }
                ]
            },
            {
                id: "milk",
                title: "우유가 들어간 커피를 좋아하세요?",
                options: [
                    { label: "네", value: "yes" },
                    { label: "아니요", value: "no" }
                ]
            }
        ]
    };

    const noncoffeeTypes = [
        { label: "🫧 톡 쏘는 탄산이 있는 음료", value: "ade" },
        { label: "🥤 달콤하고 걸쭉한 음료", value: "smoothie" },
        { label: "🍹 과일 맛이 진한 음료", value: "juice" },
        { label: "🍵 담백하게 마시는 차", value: "tea" },
        { label: "🥛 부드럽고 고소한 음료", value: "latte" }
    ];

    const noncoffeeDetails = {
        ade: {
            title: "어떤 맛을 더 좋아하세요?",
            options: [
                { label: "새콤한 맛", value: "sour" },
                { label: "달콤한 맛", value: "sweet" }
            ]
        },
        smoothie: {
            title: "어떤 맛을 더 좋아하세요?",
            options: [
                { label: "새콤달콤한 맛", value: "sour" },
                { label: "진하고 달콤한 맛", value: "sweet" }
            ]
        },
        juice: {
            title: "어떤 과일 맛을 좋아하세요?",
            options: [
                { label: "새콤한 과일 맛", value: "sour" },
                { label: "달콤한 과일 맛", value: "sweet" }
            ]
        },
        tea: {
            title: "어떤 차를 좋아하세요?",
            options: [
                { label: "향이 은은하고 담백한 차", value: "light" },
                { label: "향과 맛이 진한 차", value: "strong" }
            ]
        },
        latte: {
            title: "어떤 맛을 더 좋아하세요?",
            options: [
                { label: "고소하고 담백한 맛", value: "nutty" },
                { label: "달콤하고 부드러운 맛", value: "sweet" }
            ]
        }
    };

    function getRecommendQuestions() {
        if (recommendCategory === "coffee") {
            return recommendQuestionData.coffee;
        }

        if (recommendCategory === "noncoffee") {
            const detail = noncoffeeDetails[recommendAnswers.type];

            return [
                {
                    id: "type",
                    title: "어떤 특징의 음료를 좋아하세요?",
                    options: noncoffeeTypes
                },
                {
                    id: "detail",
                    title: detail
                        ? detail.title
                        : "어떤 맛을 좋아하세요?",
                    options: detail ? detail.options : []
                }
            ];
        }

        return [];
    }

    function showRecommendQuestion() {
        aiRecommendResult.style.display = "none";
        aiRecommendChoices.style.display = "";
        aiRecommendQuestion.style.display = "";
        aiRecommendChoices.innerHTML = "";
        aiRecommendPrev.disabled = recommendStep === 0;

        // Q1: 커피 여부
        if (recommendStep === 0) {
            aiRecommendQuestion.textContent =
                "커피를 드시고 싶으신가요?";

            [
                ["네", "coffee"],
                ["아니요", "noncoffee"]
            ].forEach(([label, value]) => {
                const button = document.createElement("button");
                button.type = "button";
                button.textContent = label;

                button.addEventListener("click", () => {
                    recommendCategory = value;
                    recommendAnswers = {};
                    recommendStep = 1;
                    showRecommendQuestion();
                });

                aiRecommendChoices.appendChild(button);
            });
            return;
        }

        // Q4: 추천 후보를 더 구분할 필요가 있을 때
        if (recommendStep === 3) {
            aiRecommendQuestion.textContent =
                "단맛이 강한 음료가 더 좋으세요?";

            [
                ["네", "high"],
                ["아니요", "low"]
            ].forEach(([label, value]) => {
                const button = document.createElement("button");
                button.type = "button";
                button.textContent = label;

                button.addEventListener("click", () => {
                    recommendAnswers.sweetness = value;
                    showRecommendResult();
                });

                aiRecommendChoices.appendChild(button);
            });
            return;
        }

        const questions = getRecommendQuestions();
        const current = questions[recommendStep - 1];
        if (!current) return;

        aiRecommendQuestion.textContent = current.title;

        current.options.forEach(option => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = option.label;

            button.addEventListener("click", () => {
                recommendAnswers[current.id] = option.value;

                if (current.id === "type") {
                    delete recommendAnswers.detail;
                    delete recommendAnswers.sweetness;
                }

                recommendStep++;

                // Q3까지 완료한 경우
                if (recommendStep === 3) {
                    showRecommendResult();
                } else {
                    showRecommendQuestion();
                }
            });

            aiRecommendChoices.appendChild(button);
        });
    }
    
    // 실제 키오스크의 음료별 추천 특성
    // taste: strong / sweet / soft
    // detail: sour / sweet / light / strong / nutty
    // sweetness: 단맛 정도 (1~3)
    const drinkProfiles = [
        // 커피
        { name: "아메리카노", group: "coffee", taste: "strong", milk: "no", sweetness: 1 },
        { name: "헤이즐넛아메리카노", group: "coffee", taste: "sweet", milk: "no", sweetness: 2 },
        { name: "카라멜마끼아또", group: "coffee", taste: "sweet", milk: "yes", sweetness: 3 },
        { name: "카페모카", group: "coffee", taste: "sweet", milk: "yes", sweetness: 3 },
        { name: "카푸치노", group: "coffee", taste: "strong", milk: "yes", sweetness: 1 },
        { name: "카페라떼", group: "coffee", taste: "soft", milk: "yes", sweetness: 1 },
        { name: "바닐라라떼", group: "coffee", taste: "sweet", milk: "yes", sweetness: 3 },
        { name: "헤이즐넛라떼", group: "coffee", taste: "soft", milk: "yes", sweetness: 2 },

        // 에이드
        { name: "레몬에이드", group: "ade", detail: "sour", sweetness: 2 },
        { name: "자몽에이드", group: "ade", detail: "sour", sweetness: 1 },
        { name: "청포도에이드", group: "ade", detail: "sweet", sweetness: 3 },
        { name: "체리에이드", group: "ade", detail: "sweet", sweetness: 3 },
        { name: "블루레몬에이드", group: "ade", detail: "sour", sweetness: 2 },

        // 스무디
        { name: "요거트스무디", group: "smoothie", detail: "sour", sweetness: 2 },
        { name: "딸기요거트스무디", group: "smoothie", detail: "sour", sweetness: 3 },
        { name: "블루베리요거트스무디", group: "smoothie", detail: "sour", sweetness: 3 },
        { name: "초코스무디", group: "smoothie", detail: "sweet", sweetness: 3 },

        // 주스
        { name: "딸기주스", group: "juice", detail: "sweet", sweetness: 3 },
        { name: "수박주스", group: "juice", detail: "sweet", sweetness: 2 },
        { name: "키위주스", group: "juice", detail: "sour", sweetness: 2 },
        { name: "망고주스", group: "juice", detail: "sweet", sweetness: 3 },

        // 차
        { name: "아이스티", group: "tea", detail: "strong", sweetness: 3 },
        { name: "녹차", group: "tea", detail: "light", sweetness: 1 },
        { name: "유자차", group: "tea", detail: "strong", sweetness: 2 },
        { name: "캐모마일", group: "tea", detail: "light", sweetness: 1 },
        { name: "얼그레이", group: "tea", detail: "strong", sweetness: 1 },
        { name: "허니블랙자몽티", group: "tea", detail: "strong", sweetness: 3 },

        // 논커피 라떼
        { name: "딸기라떼", group: "latte", detail: "sweet", sweetness: 3 },
        { name: "고구마라떼", group: "latte", detail: "nutty", sweetness: 2 },
        { name: "곡물라떼", group: "latte", detail: "nutty", sweetness: 1 }
    ];
    
    const drinkDescriptions = {
        // 커피
        "아메리카노": "진한 커피 본연의 맛을 깔끔하게 즐길 수 있는 음료",
        "헤이즐넛아메리카노": "아메리카노에 고소하고 달콤한 헤이즐넛 향을 더한 커피",
        "카라멜마끼아또": "부드러운 우유와 달콤한 카라멜이 어우러진 커피",
        "카페모카": "커피의 진한 풍미에 달콤한 초콜릿 맛을 더한 음료",
        "카푸치노": "진한 커피 위에 부드럽고 풍성한 우유 거품을 얹은 음료",
        "카페라떼": "진한 에스프레소와 고소한 우유가 조화로운 커피",
        "바닐라라떼": "부드러운 우유와 달콤한 바닐라 향이 어우러진 커피",
        "헤이즐넛라떼": "고소한 헤이즐넛 향과 부드러운 우유가 조화로운 커피",

        // 에이드
        "레몬에이드": "상큼한 레몬과 톡 쏘는 탄산이 어우러진 음료",
        "자몽에이드": "자몽 특유의 쌉싸름하고 상큼한 맛의 음료",
        "청포도에이드": "달콤하고 싱그러운 청포도 맛에 탄산을 더한 음료",
        "체리에이드": "달콤한 체리 향과 청량한 탄산이 어우러진 음료",
        "블루레몬에이드": "상큼한 레몬 맛과 시원한 탄산이 매력적인 음료",

        // 스무디
        "요거트스무디": "요거트의 새콤달콤한 맛을 시원하고 부드럽게 즐길 수 있는 음료",
        "딸기요거트스무디": "달콤한 딸기와 상큼한 요거트가 어우러진 스무디",
        "블루베리요거트스무디": "블루베리의 달콤한 풍미와 요거트의 상큼함이 조화로운 음료",
        "초코스무디": "진한 초콜릿 맛을 차갑고 부드럽게 즐길 수 있는 음료",

        // 주스
        "딸기주스": "딸기의 달콤하고 상큼한 맛을 느낄 수 있는 주스",
        "수박주스": "수박 특유의 달콤하고 시원한 맛이 매력적인 주스",
        "키위주스": "키위의 새콤달콤하고 산뜻한 풍미의 음료",
        "망고주스": "망고의 진하고 달콤한 열대과일 풍미를 담은 주스",

        // 차
        "아이스티": "달콤한 복숭아 향을 시원하게 즐길 수 있는 차",
        "녹차": "녹차 특유의 은은한 향과 깔끔한 맛의 차",
        "유자차": "향긋한 유자 향과 새콤달콤한 맛이 어우러진 차",
        "캐모마일": "은은한 꽃향기와 부드러운 맛이 특징인 허브차.",
        "얼그레이": "베르가모트의 향긋한 향이 매력적인 홍차.",
        "허니블랙자몽티": "달콤한 꿀과 쌉싸름한 자몽이 어우러진 향긋한 차",

        // 논커피 라떼
        "딸기라떼": "달콤한 딸기와 부드러운 우유가 어우러진 음료",
        "고구마라떼": "고구마의 달콤하고 고소한 맛을 부드럽게 즐길 수 있는 음료",
        "곡물라떼": "여러 곡물의 고소하고 담백한 풍미를 담은 부드러운 음료"
    };

    function rankRecommendDrinks() {
        const candidates = drinkProfiles.filter(drink => {
            if (recommendCategory === "coffee") {
                return drink.group === "coffee";
            }
            return drink.group === recommendAnswers.type;
        });

        return candidates.map(drink => {
            let score = 0;

            if (recommendCategory === "coffee") {
                if (drink.taste === recommendAnswers.taste) {
                    score += 5;
                }
                if (drink.milk === recommendAnswers.milk) {
                    score += 6;
                }
            } else {
                if (drink.detail === recommendAnswers.detail) {
                    score += 6;
                }
            }

            if (recommendAnswers.sweetness) {
                if (recommendAnswers.sweetness === "high") {
                    score += drink.sweetness * 2;
                } else {
                    score += (4 - drink.sweetness) * 2;
                }
            }

            return { ...drink, score };
        }).sort((a, b) => b.score - a.score);
    }

    function needsExtraRecommendQuestion() {
        const ranked = rankRecommendDrinks();

        if (ranked.length < 2) return false;

        // 공동 1위가 있고 단맛 정도가 서로 다를 때만 Q4
        const tied = ranked.filter(
            drink => drink.score === ranked[0].score
        );

        return tied.length > 1 &&
            new Set(tied.map(drink => drink.sweetness)).size > 1;
    }

    function showRecommendResult() {
        aiRecommendQuestion.style.display = "none";
        aiRecommendChoices.style.display = "none";
        aiRecommendResult.style.display = "block";
        aiRecommendPrev.disabled = false;

        
        const ranked = rankRecommendDrinks();

        // 상위 3개 음료 추천
        
        const availableDrinks = ranked.slice(0, 2).map(drink => {
            return {
                name: drink.name,
                desc: drinkDescriptions[drink.name] || "맛있게 즐길 수 있는 음료예요."
            };
        });


        if (availableDrinks.length === 0) {
            aiRecommendResult.innerHTML = `
                <div class="ai-result-heading">
                    <h3>추천할 음료를 찾지 못했어요.</h3>
                    <p>처음부터 다시 선택해 주세요.</p>
                </div>
            `;
            return;
        }


        aiRecommendResult.innerHTML = `
            <div class="ai-result-heading">
                <h3>추천 음료를 찾았어요!</h3>
                <p>마음에 드는 음료를 선택해 주세요.</p>
            </div>

            ${availableDrinks.map((drink, index) => {
                const name = drink.name;

                const menu = Object.values(menuData)
                    .flat()
                    .find(item => item.name === name);

                return `
                    <div class="ai-result-card"
                         data-drink="${name}"
                         role="button"
                         tabindex="0">

                        <div class="ai-result-label">
                            ${index === 0
                                ? "가장 추천하는 음료"
                                : "다른 추천 음료"}
                        </div>

                        <div class="ai-result-drink">
                            <div class="ai-result-emoji">
                                <img src="${menu.image}"
                                     alt="${name}"
                                     style="width:60px;height:60px;object-fit:contain;">
                            </div>

                            <div class="ai-result-info">
                                <h4>${name}</h4>
                                <p>${drink.desc}</p>
                            </div>
                        </div>
                    </div>
                `;
            }).join("")}
        `;

        // 기존 주문 확인 팝업 연결
        aiRecommendResult
            .querySelectorAll(".ai-result-card")
            .forEach(card => {

                const selectDrink = () => {
                    const drinkName = card.dataset.drink;

                    document.getElementById(
                        "ai-order-modal-drink"
                    ).textContent = drinkName;

                    document.getElementById(
                        "ai-order-modal"
                    ).style.display = "flex";
                };

                card.addEventListener("click", selectDrink);

                card.addEventListener("keydown", event => {
                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {
                        event.preventDefault();
                        selectDrink();
                    }
                });
            });
    }

    // 주문 확인 팝업 닫기
    document.getElementById("ai-order-modal-cancel").addEventListener("click", () => {
        document.getElementById("ai-order-modal").style.display = "none";

        aiRecommendResult.querySelectorAll(".ai-result-card").forEach(card => {
            card.classList.remove("selected");
        });
    });
    
    // '네, 주문할게요' 버튼 클릭
    document.getElementById("ai-order-modal-confirm").addEventListener("click", () => {
        const drinkName = document.getElementById("ai-order-modal-drink").textContent.trim();

        // 팝업 닫기
        document.getElementById("ai-order-modal").style.display = "none";

        // 추천 음료의 카테고리 찾기
        const category = Object.keys(menuData).find(category =>
            menuData[category].some(drink => drink.name === drinkName)
        );

        if (!category) {
            alert("해당 음료를 찾을 수 없습니다.");
            return;
        }

        // 기존 메뉴 카드 생성
        renderMenu(category);

        // 추천 음료의 위치 찾기
        const drinkIndex = menuData[category].findIndex(
            drink => drink.name === drinkName
        );

        // 기존 메뉴 카드 클릭
        const menuCards = document.querySelectorAll("#menu-grid .menu-card");

        if (menuCards[drinkIndex]) {
            menuCards[drinkIndex].click();

            // AI 도우미 창 닫기
            document.getElementById("ai-helper-panel").classList.remove("open");

            // AI 도우미 버튼 다시 표시
            document.getElementById("ai-assistant-btn").style.display = "block";

            // 메뉴 추천 화면 초기화
            aiRecommendScreen.style.display = "none";
            aiMainOptions.style.display = "";

            recommendStep = 0;
            recommendAnswers = {};
            recommendCategory = null;

        } else {
            alert("음료 선택 화면을 열 수 없습니다.");
        }
    });

    // 메뉴 추천 버튼 클릭
    if (aiRecommendButton && aiRecommendScreen && aiMainOptions) {
        aiRecommendButton.addEventListener("click", () => {
            recommendStep = 0;
            recommendAnswers = {};
            recommendCategory = null;

            aiMainOptions.style.display = "none";
            aiRecommendScreen.style.display = "block";

            showRecommendQuestion();
        });
    }

    // 이전 질문
    
    if (aiRecommendPrev) {
        aiRecommendPrev.addEventListener("click", () => {
            if (recommendStep > 0) {
                recommendStep--;
                showRecommendQuestion();
            }
        });
    }


    // 처음부터 다시 시작
    
    if (aiRecommendRestart) {
        aiRecommendRestart.addEventListener("click", () => {
            recommendStep = 0;
            recommendAnswers = {};
            recommendCategory = null;
            showRecommendQuestion();
        });
    }


    // 도우미 버튼 클릭 → 선택지 창 열기
    
    // AI 도우미 버튼 클릭 → 바로 메뉴 추천 상담 시작
    if (aiHelperButton && aiHelperPanel && aiRecommendScreen) {
        aiHelperButton.addEventListener("click", () => {
            // AI 도우미 창 열기
            aiHelperPanel.classList.add("open");

            // 기존 선택지 화면 숨기기
            if (aiMainOptions) {
                aiMainOptions.style.display = "none";
            }

            // 주문 방법 안내 화면은 사용하지 않음
            // 메뉴 추천 상담 화면 바로 표시
            aiRecommendScreen.style.display = "block";

            // 추천 상담 처음부터 시작
            recommendStep = 0;
            recommendAnswers = {};
            recommendCategory = null;
            showRecommendQuestion();

            // AI 도우미 버튼 숨기기
            aiHelperButton.style.display = "none";

            // 추천 상담 화면으로 이동
            aiHelperPanel.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        });
    }


    
    // 닫기 버튼 클릭 → 메뉴 추천 상담 닫기
    if (aiHelperClose && aiHelperPanel) {
        aiHelperClose.addEventListener("click", () => {
            aiHelperPanel.classList.remove("open");

            if (aiRecommendScreen) {
                aiRecommendScreen.style.display = "none";
            }

            if (aiMainOptions) {
                aiMainOptions.style.display = "none";
            }

            // 상담 초기화
            recommendStep = 0;
            recommendAnswers = {};
            recommendCategory = null;

            // AI 도우미 버튼 다시 표시
            if (aiHelperButton) {
                aiHelperButton.style.display = "";
            }
        });
    }

    
    /* ======================================
    AI 쉬운 단어 모드
    화면 글씨와 실제 데이터 분리
    ====================================== */

    const aiWordsButton =
        document.getElementById("ai-help-options");

    let easyWordsEnabled = false;

    // 화면 표시용 단어
    const easyWords = {
        "HOT": "따뜻하게",
        "ICE": "차갑게",

        "사이즈": "크기",
        "얼음량 (ICE 선택 시)": "얼음량 (차가운거 선택 시)",

        "Short": "작은 크기",
        "Tall": "보통 크기",
        "Grande": "큰 크기",
        "Venti": "아주 큰 크기",

        "초코드리즐": "초콜릿 소스",
        "카라멜드리즐": "카라멜 소스",
        "시나몬파우더": "계피 가루",
        "자바칩": "초콜릿 칩",
        "오트밀크": "귀리우유",
        "개인텀블러": "개인 컵",

        "에스프레소 샷": "커피 원액 한 모금",
        "기본 2샷": "기본 1개",
        "추가 토핑": "추가 재료",

        "티": "차",
        "디저트": "간식"
    };

    // 원래 글씨를 저장하고 표시 글씨만 변경
    
    function applyEasyWords(root = document) {
        if (!easyWordsEnabled) return;

        // 원래 글씨를 저장하고 화면에 보이는 글씨만 변경
        function translate(element) {
            if (!element) return;

            if (!element.hasAttribute("data-original-text")) {
                element.dataset.originalText = element.textContent;
            }

            const original = element.dataset.originalText;
            let translated = original;

            for (const [before, after] of Object.entries(easyWords)) {
                // 카테고리 이름은 별도로 처리
                if (before === "티" || before === "디저트") continue;

                translated = translated.replaceAll(before, after);
            }

            element.textContent = translated;
        }

        // 옵션 버튼의 글씨 변경
        root.querySelectorAll(".pill").forEach(translate);
        // 옵션 그룹 제목도 쉬운 단어로 변경
        // 옵션 제목의 글자만 번역 (필수 표시 유지)
        root.querySelectorAll(".option-group").forEach(group => {
            const heading = group.previousElementSibling;
            if (!heading) return;
            if (!heading.dataset.originalTitle) {
                heading.dataset.originalTitle = heading.textContent;
            }
            heading.childNodes.forEach(node => {
                if (node.nodeType !== Node.TEXT_NODE) return;

                if (!node._originalText) {
                    node._originalText = node.textContent;
                }

                let text = node._originalText;

                for (const [before, after] of Object.entries(easyWords)) {
                    if (before === "티" || before === "디저트") continue;
                    text = text.replaceAll(before, after);
                }

                node.textContent = text;
            });
        });
        // 옵션 화면의 별도 제목도 번역
        root.querySelectorAll("#option-screen h3, #option-screen h4").forEach(heading => {
            // 옵션 그룹 제목은 위에서 처리했으므로 제외
            if (heading.nextElementSibling?.classList.contains("option-group")) {
                return;
            }

            // 자식 태그가 없는 제목만 안전하게 번역
            if (heading.children.length === 0) {
                translate(heading);
            }
        });

        // 카테고리 버튼의 글씨 변경
        root.querySelectorAll(".category-bar button").forEach(button => {
            if (button.dataset.category === "티") {
                button.textContent = "차";
            } else if (button.dataset.category === "디저트") {
                button.textContent = "간식";
            }
        });

        // 메뉴 카드의 카테고리 표시만 변경
        root.querySelectorAll(".menu-card small").forEach(element => {
            if (element.textContent === "티") {
                element.textContent = "차";
            } else if (element.textContent === "디저트") {
                element.textContent = "간식";
            }
        });
    }


    // AI 버튼 클릭
    if (aiWordsButton) {
        aiWordsButton.addEventListener("click", () => {

            easyWordsEnabled = true;

            applyEasyWords();

            if (aiHelperPanel) {
                aiHelperPanel.classList.remove("open");
            }

            if (aiHelperButton) {
                aiHelperButton.style.display = "";
            }

            console.log("AI 쉬운 단어 모드 활성화");
        });

    }
    
    // AI 모드 진입 시 가독성 개선과 쉬운 단어 자동 적용
    
    /* ==========================================
       AI 모드 - 단계별 옵션 선택
    ========================================== */

    const wizard = document.getElementById("ai-option-wizard");
    const wizardQuestion = document.getElementById("ai-wizard-question");
    const wizardDescription = document.getElementById("ai-wizard-description");
    const wizardChoices = document.getElementById("ai-wizard-choices");
    const wizardCount = document.getElementById("ai-wizard-step-count");
    const wizardProgress = document.getElementById("ai-wizard-progress-fill");
    const wizardDrink = document.getElementById("ai-wizard-drink-name");
    const wizardBack = document.getElementById("ai-wizard-back");
    const wizardNext = document.getElementById("ai-wizard-next");
    
        // AI 옵션 화면 주문 취소 버튼
    const wizardCancel = document.createElement("button");
    wizardCancel.type = "button";
    wizardCancel.id = "ai-wizard-cancel";
    wizardCancel.textContent = "주문 취소";
    wizardCancel.className = "ai-wizard-cancel";

    // 기존 이전 버튼 옆에 추가
    wizardBack.parentNode.insertBefore(wizardCancel, wizardBack);

    // 주문 취소 버튼 클릭
    wizardCancel.addEventListener("click", () => {
        // 옵션 선택 화면 닫기
        optionScreen.classList.add("hidden");

        // AI 옵션 단계별 화면 숨기기
        wizard.classList.add("hidden");

        // 메뉴 화면으로 복귀
        menuScreen.classList.remove("hidden");
        bottomBar.classList.remove("hidden");

        // 선택 중이던 음료 초기화
        selectedDrink = null;
        basePrice = 0;
        wizardStepIndex = 0;
        wizardAnswers = {};

        resetOptions();

        // AI 도우미 버튼 다시 표시
        if (aiHelperButton) {
            aiHelperButton.style.display = "block";
        }
    });
    const wizardSteps = [
        {
            id: "temperature",
            title: "음료의 온도는 어떻게 할까요?",
            description: "원하는 온도를 선택해 주세요.",
            group: "온도",
            labels: {
                HOT: "🔥 따뜻하게",
                ICE: "🧊 시원하게"
            },
            required: true
        },
        {
            id: "size",
            title: "음료 크기는 어떻게 할까요?",
            description: "원하는 크기를 선택해 주세요.",
            group: "사이즈",
            labels: {
                Short: "작은 크기",
                Tall: "보통 크기",
                Grande: "큰 크기",
                Venti: "아주 큰 크기"
            },
            required: true
        },
        {
            id: "shots",
            title: "커피 원액(샷)은 몇 개 넣을까요?",
            required: true
        },
        {
            id: "milk",
            title: "어떤 우유로 만들까요?",
            description: "원하는 우유 종류를 선택해 주세요.",
            group: "우유",
            labels: {
                일반우유: "일반 우유",
                저지방: "저지방 우유",
                오트밀크: "귀리 우유",
                두유: "두유",
                아몬드: "아몬드 우유"
            },
            required: true
        },
        {
            id: "ice",
            title: "얼음은 얼마나 넣을까요?",
            description: "원하는 얼음 양을 선택해 주세요.",
            group: "얼음",
            required: true
        },
        {
            id: "cup",
            title: "어떤 컵에 담아드릴까요?",
            description: "컵 종류를 선택해 주세요.",
            group: "컵",
            labels: {
                일회용: "일회용 컵",
                매장컵: "매장 컵",
                개인텀블러: "개인 컵"
            },
            required: true
        },
        {
            id: "toppings",
            title: "추가 재료를 넣을까요?",
            description: "추가를 원하지 않으시면 선택 완료를 눌러주세요.",
            group: "토핑",
            multiple: true,
            labels: {
                휘핑크림: "휘핑크림",
                초코드리즐: "초콜릿 소스",
                카라멜드리즐: "카라멜 소스",
                시나몬파우더: "계피 가루",
                자바칩: "초콜릿 칩"
            }
        },
        {
            id: "summary",
            title: "주문 내용을 확인해 주세요.",
            description: "선택한 옵션과 가격을 확인한 뒤 담아주세요."
        }
    ];

    let wizardStepIndex = 0;
    let wizardAnswers = {};

    // 기존 옵션 그룹을 원래 제목으로 검색
    function wizardFindGroup(title) {
        return [...optionGroups].find(group =>
            getOptionTitle(group).includes(title)
        );
    }

    // 기존 버튼의 원래 주문 값
    function wizardButtonValue(button) {
        return (
            button.dataset.value ||
            button.textContent.trim()
                .replace(/\s*[+-]\s*[\d,]+.*$/, "")
        ).trim();
    }

    // 가격을 포함한 화면 표시용 이름
    
    function wizardOptionLabel(step, button) {
        const value = wizardButtonValue(button);
        const name = step.labels?.[value] || value;
        const price = getOptionPrice(button.textContent);

        // 한국어로 바뀐 옵션에만 원래 이름 표시
        
        const normalizeLabel = text =>
            String(text).replace(/\s+/g, "").toLowerCase();

        const normalizedName = normalizeLabel(name);
        const normalizedValue = normalizeLabel(value);

        const isSimilar =
            normalizedName === normalizedValue ||
            normalizedName.includes(normalizedValue) ||
            normalizedValue.includes(normalizedName);

        const displayName = isSimilar
            ? name
            : `${value} (${name})`;


        return {
            name: displayName,
            price: price === 0
                ? ""
                : `${price > 0 ? "+" : "-"}${Math.abs(price).toLocaleString()}원`
        };
    }

    // 따뜻한 음료에서는 얼음 질문 제외
    
    
    function wizardActiveSteps() {
        const rules = getDrinkOptionRules();

        return wizardSteps.filter(step => {
            if (step.id === "temperature" && rules.coldOnly) {
                return false;
            }

            if (step.id === "shots" && !rules.shots) {
                return false;
            }

            if (step.id === "milk" && !rules.milk) {
                return false;
            }

            if (step.id === "ice") {
                return rules.ice &&
                    wizardAnswers.temperature === "ICE";
            }

            if (step.id === "toppings" && !rules.toppings) {
                return false;
            }

            return true;
        });
    }


    // 현재 단계 가져오기
    function wizardCurrentStep() {
        return wizardActiveSteps()[wizardStepIndex];
    }

    // 옵션이 선택되어 있는지 확인
    function wizardHasAnswer(step) {
        if (!step.required) return true;

        if (step.id === "shots") {
            return Number.isInteger(wizardAnswers.shots);
        }

        return wizardAnswers[step.id] != null;
    }

    // 기존 키오스크 옵션 버튼과 동기화
    function wizardSyncOption(step, value) {
        if (step.id === "shots") {
            shots = Number(value);
            shotCount.textContent = shots;
            return;
        }

        const group = wizardFindGroup(step.group);
        if (!group) return;

        const buttons = [...group.querySelectorAll(".pill")];
        const target = buttons.find(button =>
            wizardButtonValue(button) === value
        );

        if (!target) return;

        // 기존 옵션 선택 이벤트를 그대로 사용
        if (step.multiple) {
            target.click();
        } else if (!target.classList.contains("selected")) {
            target.click();
        }
    }

    // 단계별 선택지 생성
    function wizardRenderChoices(step) {
        wizardChoices.innerHTML = "";

        let options = [];

        
        if (step.id === "shots") {
            options = [1, 2, 3, 4].map(value => ({
                value,
                label: `${value}개${value === 1 ? " (기본)" : ""}`,
                price: value === 1
                    ? ""
                    : `+${((value - 1) * 500).toLocaleString()}원`
            }));
        } else {
            const group = wizardFindGroup(step.group);

            if (group) {
                options = [...group.querySelectorAll(".pill")]
                    .map(button => ({
                        value: wizardButtonValue(button),
                        label: wizardOptionLabel(step, button).name,
                        price: wizardOptionLabel(step, button).price
                    }));
            }
        }


        options.forEach(option => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "ai-wizard-choice";

            const selected = step.multiple
                ? (wizardAnswers[step.id] || []).includes(option.value)
                : wizardAnswers[step.id] === option.value;

            if (selected) button.classList.add("selected");

            const label = document.createElement("span");
            label.className = "ai-choice-label";

            const name = document.createElement("span");
            name.textContent = option.label;
            label.appendChild(name);

            if (option.price) {
                const price = document.createElement("small");
                price.className = "ai-choice-price";
                price.textContent = option.price;
                label.appendChild(price);
            }

            const check = document.createElement("span");
            check.className = "choice-check";
            check.textContent = selected ? "✓" : "○";

            button.append(label, check);

            button.addEventListener("click", () => {
                if (step.multiple) {
                    const values = [...(wizardAnswers[step.id] || [])];

                    const index = values.indexOf(option.value);

                    if (index >= 0) {
                        values.splice(index, 1);
                    } else {
                        values.push(option.value);
                    }

                    wizardAnswers[step.id] = values;
                } else {
                    wizardAnswers[step.id] = option.value;
                }

                
                wizardSyncOption(step, option.value);

                // 따뜻한 음료 선택 시 얼음 질문 생략
                if (
                    step.id === "temperature" &&
                    option.value === "HOT"
                ) {
                    delete wizardAnswers.ice;
                }

                // 여러 개를 선택하는 추가 재료 단계
                if (step.multiple) {
                    wizardRender();
                    return;
                }

                // 일반 선택지는 클릭 즉시 다음 질문으로 이동
                const activeSteps = wizardActiveSteps();

                if (wizardStepIndex < activeSteps.length - 1) {
                    wizardStepIndex++;
                }

                wizardRender();

            });

            wizardChoices.appendChild(button);
        });
    }

    // 마지막 주문 확인 화면
    function wizardRenderSummary() {
        wizardChoices.innerHTML = "";

        const summary = document.createElement("div");
        summary.className = "ai-wizard-summary";
                
        if (getDrinkOptionRules().coldOnly || isIceOnlyDrink()) {
            const temperatureRow = document.createElement("div");
            temperatureRow.className = "ai-wizard-summary-row";

            temperatureRow.innerHTML =  
                "<span>온도</span><strong>ICE (시원하게)</strong>";

            summary.appendChild(temperatureRow);
        }

        const labels = {
            temperature: "온도",
            size: "크기",
            shots: "커피 원액",
            milk: "우유",
            ice: "얼음",
            cup: "컵",
            toppings: "추가 재료"
        };

        const names = {
            HOT: "따뜻하게",
            ICE: "시원하게",
            Short: "작은 크기",
            Tall: "보통 크기",
            Grande: "큰 크기",
            Venti: "아주 큰 크기",
            오트밀크: "귀리 우유",
            개인텀블러: "개인 컵",
            초코드리즐: "초콜릿 소스",
            카라멜드리즐: "카라멜 소스",
            시나몬파우더: "계피 가루",
            자바칩: "초콜릿 칩"
        };

        wizardActiveSteps().forEach(step => {
            if (step.id === "summary") return;

            const value = wizardAnswers[step.id];

            let displayValue;

            if (step.id === "shots") {
                displayValue = `${value}개`;
            } else if (Array.isArray(value)) {
                displayValue = value.length
                    ? value.map(v => names[v] || v).join(", ")
                    : "추가 안 함";
            } else {
                displayValue = names[value] || value || "선택 안 함";
            }

            const row = document.createElement("div");
            row.className = "ai-wizard-summary-row";

            const nameElement = document.createElement("span");
            nameElement.textContent = labels[step.id];

            const valueElement = document.createElement("strong");
            valueElement.textContent = displayValue;

            row.append(nameElement, valueElement);
            summary.appendChild(row);
        });
        
        const total = document.createElement("div");
        total.className = "ai-wizard-summary-total";

        const totalLabel = document.createElement("span");
        totalLabel.textContent = "총 가격";

        const totalValue = document.createElement("strong");
        const finalPrice = calculatePrice();;

        totalValue.textContent =
            `${finalPrice.toLocaleString()}원`;

        total.append(totalLabel, totalValue);
        summary.appendChild(total);

        wizardChoices.appendChild(summary);
    }

    // 현재 단계 화면 표시
    function wizardRender() {
        const steps = wizardActiveSteps();
        const step = steps[wizardStepIndex];

        if (!step) return;

        wizardCount.textContent =
            `${wizardStepIndex + 1} / ${steps.length}`;

        wizardProgress.style.width =
            `${((wizardStepIndex + 1) / steps.length) * 100}%`;

        wizardQuestion.textContent = step.title;
        wizardDescription.textContent = step.description;

        
        if (step.id === "summary") {
            wizardRenderSummary();
        } else {
            wizardRenderChoices(step);
        }


        wizardBack.disabled = wizardStepIndex === 0;
        wizardNext.disabled = !wizardHasAnswer(step);

        const showNextButton =
            step.id === "toppings" || step.id === "summary";

        wizardNext.style.display = showNextButton ? "" : "none";

        wizardNext.textContent =
            step.id === "toppings"
                ? "선택 완료"
                : "장바구니에 담기";
    }

    // 새 음료 선택 시 상담 시작
    
    function startAiOptionWizard() {
        if (!aiMode || !wizard) return;

        wizardStepIndex = 0;
        wizardAnswers = {};

        resetOptions();
        applyDrinkOptionRules();

        const rules = getDrinkOptionRules();

        // 실제 샷 수는 유지하되, AI 화면에서는 미선택 상태로 시작
        shots = rules.shots ? 1 : 0;
        shotCount.textContent = String(shots);

        // 사용자가 직접 선택하기 전까지 체크 표시 없음
        delete wizardAnswers.shots;

        // 차가운 음료는 ICE 자동 적용
        if (rules.coldOnly) {
            wizardAnswers.temperature = "ICE";
        }

        wizard.classList.remove("hidden");
        wizardDrink.textContent = selectedDrink || "";

        wizardRender();
        updateIceOptionState();
    }

    
    

    // 이전 단계
    if (wizardBack) {
        wizardBack.addEventListener("click", () => {
            if (wizardStepIndex > 0) {
                wizardStepIndex--;
                wizardRender();
            }
        });
    }

    // 다음 단계 또는 장바구니 담기
    if (wizardNext) {
        wizardNext.addEventListener("click", () => {
            const steps = wizardActiveSteps();
            const step = steps[wizardStepIndex];

            if (!wizardHasAnswer(step)) return;

            if (step.id === "summary") {
                // 기존 장바구니 담기 기능 실행
                confirmBtn.click();

                // 성공적으로 메뉴 화면으로 돌아온 경우
                if (optionScreen.classList.contains("hidden")) {
                    wizard.classList.add("hidden");
                }
                return;
            }

            if (wizardStepIndex < steps.length - 1) {
                wizardStepIndex++;
                wizardRender();
            }
        });
    }

    if (aiMode) {
        document.body.classList.add("readable-mode");

        easyWordsEnabled = true;
        applyEasyWords();

        // 통합된 AI 모드에서는 개별 개선 버튼을 사용하지 않음
        document.getElementById("ai-help-visibility")?.remove();
        document.getElementById("ai-help-options")?.remove();

        console.log("AI 통합 모드 활성화");
    }



});
