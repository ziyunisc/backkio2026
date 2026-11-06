// ==========================================================================
// [1] 질문 데이터 정의 (Questions Data)
// ==========================================================================

// 커피 질문 (총 5단계)
const COFFEE_QUESTIONS = [
  {
    id: "type",
    title: "어떤 스타일의 커피를 원하시나요?",
    isMultiple: false,
    options: [
      { label: "블랙커피", value: "black" },
      { label: "우유가 들어간 커피", value: "milk" },
      { label: "시럽·초콜릿이 들어간 커피", value: "dessert" }
    ]   
  },
  {
    id: "taste",
    title: "어느 쪽이 더 좋으세요?",
    isMultiple: false,
    options: [
      { label: "쌉쌀한 맛", value: "bitter" },
      { label: "커피와 우유의 조화가 느껴지는 맛", value: "balanced" },
      { label: "단맛", value: "sweet" }
    ]
  },
  {
    id: "flavor",
    title: "어떤 재료가 들어간 메뉴를 원하시나요?",
    isMultiple: false,
    options: [
      { label: "추가 향 없는 커피", value: "coffee" },
      { label: "헤이즐넛", value: "hazelnut" },
      { label: "카라멜", value: "caramel" },
      { label: "초콜릿", value: "chocolate" },
      { label: "바닐라", value: "vanilla" }
    ]
  },
  {
    id: "texture",
    title: "어떤 형태를 원하시나요?",
    isMultiple: false,
    options: [
      { label: "우유 없이 가벼운 음료", value: "light" },
      { label: "우유가 조금 섞인 음료", value: "creamy" },
      { label: "우유 거품이 많은 음료", value: "foam" }
    ]
  },
  {
    id: "avoid",
    title: "피하고 싶은 것이 있나요?",
    isMultiple: true,
    options: [
      { label: "쓴맛", value: "bitter" },
      { label: "단맛", value: "sweet" },
      { label: "우유", value: "dairy" },
      { label: "없음", value: "none" }
    ]
  }
];

// 논커피 질문 (총 4단계, 1번 선택값에 따라 2~3번 옵션 동적 매칭)
const NONCOFFEE_STEP1 = {
  id: "type",
  title: "어떤 종류의 음료를 원하시나요?",
  isMultiple: false,
  options: [
    { label: "에이드", value: "ade" },
    { label: "스무디", value: "smoothie" },
    { label: "논커피 라떼", value: "latte" },
    { label: "과일주스", value: "juice" },
    { label: "차", value: "tea" }
  ]
};

const NONCOFFEE_STEP2_TASTE = {
  id: "taste",
  title: "어느 맛이 더 좋으세요?",
  isMultiple: false,
  optionsByType: {
    ade: [
      { label: "단맛", value: "sweet" },
      { label: "신맛", value: "sour" },
      { label: "자몽의 쌉쌀한 맛", value: "bitter" }
    ],
    smoothie: [
      { label: "단맛", value: "sweet" },
      { label: "요거트의 신맛", value: "sour" }
    ],
    latte: [
      { label: "단맛", value: "sweet" },
      { label: "딸기의 신맛", value: "sour" },
      { label: "곡물·고구마의 고소한 맛", value: "nutty" }
    ],
    juice: [
      { label: "단맛", value: "sweet" },
      { label: "과일의 신맛", value: "sour" }
    ],
    tea: [
      { label: "단맛", value: "sweet" },
      { label: "유자·자몽의 신맛", value: "sour" },
      { label: "홍차·녹차의 쌉쌀한 맛", value: "bitter" },
      { label: "캐모마일 향", value: "herbal" }
    ]
  }
};

const NONCOFFEE_STEP3_FLAVOR = {
  id: "flavor",
  title: "어떤 재료를 원하시나요?",
  isMultiple: false,
  optionsByType: {
    ade: [
      { label: "레몬", value: "lemon" },
      { label: "자몽", value: "grapefruit" },
      { label: "블루레몬", value: "bluelemon" },
      { label: "청포도", value: "grape" },
      { label: "체리", value: "cherry" }
    ],
    smoothie: [
      { label: "플레인 요거트", value: "yogurt" },
      { label: "딸기", value: "strawberry" },
      { label: "블루베리", value: "blueberry" },
      { label: "초콜릿", value: "chocolate" }
    ],
    latte: [
      { label: "딸기", value: "strawberry" },
      { label: "고구마", value: "sweetpotato" },
      { label: "곡물", value: "grain" }
    ],
    juice: [
      { label: "딸기", value: "strawberry" },
      { label: "수박", value: "watermelon" },
      { label: "키위", value: "kiwi" },
      { label: "망고", value: "mango" }
    ],
    tea: [
      { label: "아이스티", value: "blacktea" },
      { label: "녹차", value: "greentea" },
      { label: "유자", value: "citron" },
      { label: "캐모마일", value: "chamomile" },
      { label: "얼그레이", value: "earlgrey" },
      { label: "꿀·자몽", value: "honeygrapefruit" }
    ]
  }
};

const NONCOFFEE_STEP4_AVOID = {
  id: "avoid",
  title: "피하고 싶은 것이 있나요?",
  isMultiple: true,
  options: [
    { label: "단맛", value: "sweet" },
    { label: "신맛", value: "sour" },
    { label: "쓴맛", value: "bitter" },
    { label: "곡물·고구마의 고소한 맛", value: "nutty" },
    { label: "우유·요거트", value: "dairy" },
    { label: "탄산", value: "carbonated" },
    { label: "카페인", value: "caffeine" },
    { label: "없음", value: "none" }
  ]
};


// ==========================================================================
// [2] 음료 데이터베이스 (Drink Menu Database)
// * 질문의 선택값(value)들과 1:1로 정확하게 매핑된 데이터입니다.
// ==========================================================================
const BEVERAGE_DATABASE = [
  // --- 커피 (Coffee) ---
  {
    id: "americano",
    name: "아메리카노",
    category: "coffee",
    type: "black",
    taste: "bitter",
    flavor: "coffee",
    texture: "light",
    avoidTags: ["bitter"],
    desc: "원두 고유의 깊고 쌉싸름한 풍미를 깔끔하게 즐길 수 있는 기본 메뉴"
  },
  {
    id: "latte",
    name: "카페라떼",
    category: "coffee",
    type: "milk",
    taste: "balanced",
    flavor: "coffee",
    texture: "creamy",
    avoidTags: ["dairy"],
    desc: "신선한 우유와 에스프레소가 완벽한 밸런스를 이루는 부드러운 음료"
  },
  {
    id: "cappuccino",
    name: "카푸치노",
    category: "coffee",
    type: "milk",
    taste: "balanced",
    flavor: "coffee",
    texture: "foam",
    avoidTags: ["dairy"],
    desc: "풍성하고 쫀쫀한 우유 거품의 질감을 음미할 수 있는 커피"
  },
  {
    id: "vanilla_latte",
    name: "바닐라 라떼",
    category: "coffee",
    type: "dessert",
    taste: "sweet",
    flavor: "vanilla",
    texture: "creamy",
    avoidTags: ["dairy", "sweet"],
    desc: "바닐라 빈의 감미로운 향과 달콤함이 어우러진 인기 음료"
  },
  {
    id: "caramel_macchiato",
    name: "카라멜 마키아또",
    category: "coffee",
    type: "dessert",
    taste: "sweet",
    flavor: "caramel",
    texture: "creamy",
    avoidTags: ["dairy", "sweet"],
    desc: "달콤한 카라멜 소스와 부드러운 우유 거품이 감싸는 디저트 커피"
  },
  {
    id: "cafe_mocha",
    name: "카페 모카",
    category: "coffee",
    type: "dessert",
    taste: "sweet",
    flavor: "chocolate",
    texture: "creamy",
    avoidTags: ["dairy", "sweet"],
    desc: "진한 다크 초콜릿 시럽과 에스프레소의 달콤쌉쌀한 만남"
  },
  {
    id: "hazelnut_americano",
    name: "헤이즐넛 아메리카노",
    category: "coffee",
    type: "black",
    taste: "sweet",
    flavor: "hazelnut",
    texture: "light",
    avoidTags: ["sweet"],
    desc: "아메리카노의 깔끔함에 고소하고 향긋한 헤이즐넛 향을 더한 커피"
  },
  {
    id: "hazelnut_latte",
    name: "헤이즐넛 라떼",
    category: "coffee",
    type: "dessert",
    taste: "sweet",
    flavor: "hazelnut",
    texture: "creamy",
    avoidTags: ["dairy", "sweet"],
    desc: "고소한 우유에 헤이즐넛 풍미가 가득 퍼지는 달콤한 라떼"
  },

  // --- 논커피: 에이드 (Ade) ---
  {
    id: "lemon_ade",
    name: "레몬에이드",
    category: "noncoffee",
    type: "ade",
    taste: "sour",
    flavor: "lemon",
    avoidTags: ["carbonated", "sour"],
    desc: "상큼한 생레몬의 톡 쏘는 청량감이 가득한 탄산 음료"
  },
  {
    id: "grapefruit_ade",
    name: "자몽에이드",
    category: "noncoffee",
    type: "ade",
    taste: "bitter",
    flavor: "grapefruit",
    avoidTags: ["carbonated", "bitter"],
    desc: "달콤 쌉쌀한 자몽 과육과 톡 쏘는 탄산의 매력적인 조화"
  },
  {
    id: "bluelemon_ade",
    name: "블루레몬에이드",
    category: "noncoffee",
    type: "ade",
    taste: "sour",
    flavor: "bluelemon",
    avoidTags: ["carbonated", "sour"],
    desc: "시원한 바다를 닮은 푸른 빛깔의 상큼한 청량 에이드"
  },
  {
    id: "grape_ade",
    name: "청포도에이드",
    category: "noncoffee",
    type: "ade",
    taste: "sweet",
    flavor: "grape",
    avoidTags: ["carbonated", "sweet"],
    desc: "달콤한 청포도 알갱이가 씹히는 과즙 가득 에이드"
  },
  {
    id: "cherry_ade",
    name: "체리에이드",
    category: "noncoffee",
    type: "ade",
    taste: "sweet",
    flavor: "cherry",
    avoidTags: ["carbonated", "sweet"],
    desc: "달콤하고 매혹적인 체리 풍미가 퍼지는 탄산 에이드"
  },

  // --- 논커피: 스무디 (Smoothie) ---
  {
    id: "plain_yogurt_smoothie",
    name: "플레인 요거트 스무디",
    category: "noncoffee",
    type: "smoothie",
    taste: "sour",
    flavor: "yogurt",
    avoidTags: ["dairy", "sour"],
    desc: "새콤달콤하고 진한 정통 요거트의 맛을 즐길 수 있는 아이스 블렌딩"
  },
  {
    id: "strawberry_smoothie",
    name: "딸기 요거트 스무디",
    category: "noncoffee",
    type: "smoothie",
    taste: "sweet",
    flavor: "strawberry",
    avoidTags: ["dairy", "sweet"],
    desc: "달콤한 딸기와 산뜻한 요거트가 어우러진 베스트셀러 스무디"
  },
  {
    id: "blueberry_smoothie",
    name: "블루베리 스무디",
    category: "noncoffee",
    type: "smoothie",
    taste: "sweet",
    flavor: "blueberry",
    avoidTags: ["dairy", "sweet"],
    desc: "블루베리의 진한 보랏빛 풍미와 달콤함을 담은 스무디"
  },
  {
    id: "choco_smoothie",
    name: "초코 스무디",
    category: "noncoffee",
    type: "smoothie",
    taste: "sweet",
    flavor: "chocolate",
    avoidTags: ["dairy", "sweet"],
    desc: "초콜릿을 듬뿍 갈아 넣어 당 충전에 딱 맞는 극강의 달콤함"
  },

  // --- 논커피: 라떼 (Non-coffee Latte) ---
  {
    id: "strawberry_latte",
    name: "생딸기 라떼",
    category: "noncoffee",
    type: "latte",
    taste: "sweet",
    flavor: "strawberry",
    avoidTags: ["dairy", "sweet"],
    desc: "신선한 우유 속에 달콤한 딸기 과육이 씹히는 인기 만점 음료"
  },
  {
    id: "sweetpotato_latte",
    name: "군고구마 라떼",
    category: "noncoffee",
    type: "latte",
    taste: "nutty",
    flavor: "sweetpotato",
    avoidTags: ["dairy", "nutty"],
    desc: "구수한 군고구마와 따뜻한 우유가 만나 든든하게 배를 채워주는 라떼"
  },
  {
    id: "grain_latte",
    name: "곡물 미숫가루 라떼",
    category: "noncoffee",
    type: "latte",
    taste: "nutty",
    flavor: "grain",
    avoidTags: ["dairy", "nutty"],
    desc: "정겨운 곡물의 고소함과 달콤함이 어우러진 웰빙 라떼"
  },

  // --- 논커피: 주스 (Juice) ---
  {
    id: "watermelon_juice",
    name: "수박 주스",
    category: "noncoffee",
    type: "juice",
    taste: "sweet",
    flavor: "watermelon",
    avoidTags: ["sweet"],
    desc: "시원하고 달콤한 여름 수박을 100% 갈아 만든 청량 생과일 주스"
  },
  {
    id: "strawberry_juice",
    name: "생딸기 주스",
    category: "noncoffee",
    type: "juice",
    taste: "sweet",
    flavor: "strawberry",
    avoidTags: ["sweet"],
    desc: "우유 없이 딸기 과육 본연의 달콤함을 그대로 담아낸 주스"
  },
  {
    id: "kiwi_juice",
    name: "생키위 주스",
    category: "noncoffee",
    type: "juice",
    taste: "sour",
    flavor: "kiwi",
    avoidTags: ["sour"],
    desc: "새콤달콤한 생키위 씨가 톡톡 씹히는 비타민 충전 주스"
  },
  {
    id: "mango_juice",
    name: "망고 주스",
    category: "noncoffee",
    type: "juice",
    taste: "sweet",
    flavor: "mango",
    avoidTags: ["sweet"],
    desc: "진하고 부드러운 열대과일 망고 특유의 묵직한 달콤함"
  },

  // --- 논커피: 차 (Tea) ---
  {
    id: "iced_tea",
    name: "복숭아 아이스티",
    category: "noncoffee",
    type: "tea",
    taste: "sweet",
    flavor: "blacktea",
    avoidTags: ["sweet", "caffeine"],
    desc: "달콤한 복숭아 과즙과 깔끔한 홍차가 어우러진 국민 음료"
  },
  {
    id: "green_tea",
    name: "제주 녹차",
    category: "noncoffee",
    type: "tea",
    taste: "bitter",
    flavor: "greentea",
    avoidTags: ["bitter", "caffeine"],
    desc: "입안을 개운하고 깔끔하게 정리해 주는 은은한 떫은맛의 녹차"
  },
  {
    id: "citron_tea",
    name: "유자차",
    category: "noncoffee",
    type: "tea",
    taste: "sour",
    flavor: "citron",
    avoidTags: ["sour"],
    desc: "달콤새콤한 유자청 과육이 가득 퍼지는 비타민C 가득한 전통 차"
  },
  {
    id: "chamomile_tea",
    name: "캐모마일 허브티",
    category: "noncoffee",
    type: "tea",
    taste: "herbal",
    flavor: "chamomile",
    avoidTags: [],
    desc: "카페인 없이 은은한 사과 향으로 마음을 편안하게 해주는 허브티"
  },
  {
    id: "earlgrey_tea",
    name: "얼그레이 홍차",
    category: "noncoffee",
    type: "tea",
    taste: "bitter",
    flavor: "earlgrey",
    avoidTags: ["bitter", "caffeine"],
    desc: "향긋한 베르가못 오렌지 오일 향이 우아한 클래식 블랙티"
  },
  {
    id: "honey_grapefruit_tea",
    name: "꿀 자몽 블랙티",
    category: "noncoffee",
    type: "tea",
    taste: "sweet",
    flavor: "honeygrapefruit",
    avoidTags: ["caffeine"],
    desc: "달콤한 꿀과 자몽, 그리고 진한 홍차가 만난 트렌디 블렌딩 티"
  }
];


// ==========================================================================
// [3] 추천 매칭 엔진 알고리즘 (Recommendation Algorithm)
// ==========================================================================

/**
 * 사용자의 응답 데이터를 기반으로 최적의 음료를 계산합니다.
 * 
 * @param {string} category - "coffee" 또는 "noncoffee"
 * @param {Object} userAnswers - 사용자가 선택한 답변 객체
 *   예시 (커피): { type: "black", taste: "bitter", flavor: "coffee", texture: "light", avoid: ["none"] }
 *   예시 (논커피): { type: "ade", taste: "sour", flavor: "lemon", avoid: ["caffeine"] }
 * 
 * @returns {Object} { best: 가장 점수가 높은 음료, alternatives: 대안 음료 2개 }
 */
function getRecommendation(category, userAnswers) {
  // 1. 해당 카테고리(커피 or 논커피)에 속하는 메뉴만 필터링
  const candidates = BEVERAGE_DATABASE.filter(item => item.category === category);
  const avoidList = userAnswers.avoid || [];

  // 2. 각 메뉴별 매칭 점수 채점
  const scoredDrinks = candidates.map(drink => {
    let score = 0;
    let isDisqualified = false; // 기피 항목에 걸렸는지 여부

    // [기피 항목 검사] 피하고 싶은 재료/맛이 포함되어 있다면 큰 감점 처리 (-100점)
    if (drink.avoidTags && avoidList.some(tag => drink.avoidTags.includes(tag))) {
      score -= 100;
      isDisqualified = true;
    }

    // [취향 일치 점수 가산]
    if (drink.type === userAnswers.type) score += 3;       // 스타일/종류 일치 시 (+3점)
    if (drink.taste === userAnswers.taste) score += 3;     // 맛 일치 시 (+3점)
    if (drink.flavor === userAnswers.flavor) score += 4;   // 특정 원재료 일치 시 (+4점, 가중치 높음)
    
    // 질감(커피만 해당)
    if (userAnswers.texture && drink.texture === userAnswers.texture) {
      score += 2;
    }

    return {
      ...drink,
      matchScore: score,
      isDisqualified
    };
  });

  // 3. 점수가 높은 순으로 정렬
  scoredDrinks.sort((a, b) => b.matchScore - a.matchScore);

  // 4. 기피 항목에 걸리지 않은 후보 중 1위 및 2~3위 대체 메뉴 추출
  const validDrinks = scoredDrinks.filter(d => !d.isDisqualified);

  // 만약 모든 메뉴가 기피 항목에 걸렸을 경우를 대비한 안전 처리
  const finalPool = validDrinks.length > 0 ? validDrinks : scoredDrinks;

  return {
    best: finalPool[0],
    alternatives: finalPool.slice(1, 3)
  };
}