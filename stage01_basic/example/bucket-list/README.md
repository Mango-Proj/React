# 나의 버킷리스트 ✨

`stage01_basic/study` (ch02 ~ ch04) 에서 배운 React 개념을 모두 적용한 미니프로젝트입니다.

---

## 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행 (http://localhost:5173)
npm run dev
```

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 항목 추가 | 꿈을 입력하고 버튼 클릭 또는 Enter 키로 추가 |
| 완료 토글 | 항목 클릭으로 완료/미완료 전환 + 취소선 표시 |
| 항목 삭제 | ✕ 버튼으로 항목 개별 삭제 |
| 필터링 | 전체 / 미완료 / 완료 탭으로 목록 필터링 |
| 달성률 표시 | 헤더에 완료율 % + 진행 바 애니메이션 |
| 데이터 저장 | 새로고침해도 localStorage에 유지됨 |
| 완료 항목 정리 | 완료된 항목 전체를 한 번에 삭제 |

---

## 프로젝트 구조

```
bucket-list/
├── index.html                  # HTML 진입점
├── vite.config.js              # Vite 빌드 설정
├── package.json                # 의존성 목록
└── src/
    ├── main.jsx                # React 앱 시작점 (createRoot)
    ├── index.css               # 전역 스타일 (리셋, body 배경)
    ├── App.jsx                 # 핵심 두뇌 컴포넌트 (state, 이벤트 핸들러)
    ├── App.module.css          # App 레이아웃 스타일
    └── components/
        ├── Header.jsx          # 헤더 + 달성률 진행 바
        ├── Header.module.css
        ├── BucketInput.jsx     # 새 항목 입력창
        ├── BucketInput.module.css
        ├── FilterBar.jsx       # 전체/미완료/완료 필터 탭
        ├── FilterBar.module.css
        ├── BucketItem.jsx      # 개별 항목 카드 (체크 + 삭제)
        └── BucketItem.module.css
```

---

## 적용된 React 개념 (ch02 ~ ch04)

### ch02 — 컴포넌트와 Props, State, 이벤트

| 개념 | 어디서 쓰였나 |
|------|--------------|
| **컴포넌트 분리** | App → Header, BucketInput, FilterBar, BucketItem 으로 역할별 분리 |
| **Props** | App이 각 자식에게 데이터(items, counts)와 콜백(onAdd, onToggle, onDelete)을 전달 |
| **useState** | `items` (항목 배열), `filter` (현재 필터) 두 가지 상태 관리 |
| **Lazy initialization** | `useState(() => JSON.parse(localStorage...))` — 최초 렌더에만 실행 |
| **이벤트 핸들링** | onClick, onKeyDown(Enter), onChange 활용 |
| **제어 컴포넌트** | BucketInput — `value={inputValue}` + `onChange`로 입력창 값을 React가 제어 |
| **조건부 렌더링** | 항목 없을 때 빈 상태 메시지, 완료 항목 없을 때 '정리' 버튼 숨김 |
| **파생 데이터** | `totalCount`, `completedCount`, `progressPercent`, `filteredItems` — state 없이 계산 |

### ch03 — CSS 스타일링

| 개념 | 어디서 쓰였나 |
|------|--------------|
| **CSS 모듈** | 모든 컴포넌트에 `*.module.css` 적용 — 클래스명 충돌 없음 |
| **조건부 className** | BucketItem: `completed` 여부에 따라 클래스 추가/제거 |
| **인라인 style** | Header: `style={{ width: \`${progressPercent}%\` }}` — 동적 값은 인라인 스타일로 |
| **CSS 변수(트랜지션)** | `transition: width 0.4s ease` 로 진행 바 부드럽게 애니메이션 |

### ch04 — useEffect와 생명주기

| 개념 | 어디서 쓰였나 |
|------|--------------|
| **useEffect** | `items`가 바뀔 때마다 localStorage에 자동 저장 |
| **의존성 배열** | `[items]` — items가 바뀔 때만 effect 실행 |
| **상태 설계 원칙** | 관련 데이터는 하나의 배열로 묶음, 파생 값은 별도 state로 만들지 않음 |
| **불변성 유지** | `map()`, `filter()`, spread(`...`) 로 항상 새 배열/객체 반환 |

---

## 데이터 흐름 다이어그램

```
App (state: items[], filter)
│
├── props ──→ Header
│              progressPercent, completedCount, totalCount
│
├── props ──→ BucketInput
│              onAdd(text)
│              └─→ App.handleAdd → setItems([...items, newItem])
│
├── props ──→ FilterBar
│              currentFilter, onFilterChange(value), counts
│              └─→ App → setFilter(value)
│
└── props ──→ BucketItem (× filteredItems.length)
               item, onToggle(id), onDelete(id)
               ├─→ App.handleToggle → setItems(items.map(...))
               └─→ App.handleDelete → setItems(items.filter(...))
```

---

## 주요 코드 설명

### localStorage 연동 (App.jsx)

```jsx
// 초기값을 함수로 전달 — 앱 시작 시 딱 한 번만 실행됩니다
const [items, setItems] = useState(() => {
  const saved = localStorage.getItem('bucket-list');
  return saved ? JSON.parse(saved) : getDefaultItems();
});

// items가 변경될 때마다 저장
useEffect(() => {
  localStorage.setItem('bucket-list', JSON.stringify(items));
}, [items]);
```

### 불변성을 지키는 상태 업데이트 (App.jsx)

```jsx
// 추가 — 기존 배열을 건드리지 않고 새 배열을 반환
const handleAdd = (text) =>
  setItems([...items, { id: crypto.randomUUID(), text, completed: false }]);

// 토글 — map()으로 해당 항목만 수정한 새 배열
const handleToggle = (id) =>
  setItems(items.map(item =>
    item.id === id ? { ...item, completed: !item.completed } : item
  ));

// 삭제 — filter()로 해당 항목을 뺀 새 배열
const handleDelete = (id) =>
  setItems(items.filter(item => item.id !== id));
```

### 동적 className (BucketItem.jsx)

```jsx
// 완료 여부에 따라 클래스를 조건부로 추가
<li className={`${styles.item} ${item.completed ? styles.completed : ''}`}>
```

---

## 색상 팔레트

| 색상 | 용도 |
|------|------|
| `#6366f1` (인디고) | 주요 액센트 (버튼, 체크박스, 탭) |
| `#8b5cf6` (바이올렛) | 헤더 그라디언트 끝 |
| `#f5f3ff` (연보라) | 앱 전체 배경 |
| `#ede9fe` | 카드/입력창 테두리 |
