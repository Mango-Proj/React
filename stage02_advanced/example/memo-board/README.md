# 메모 보드 — stage02_advanced 미니 프로젝트

> **stage02_advanced/study** 에서 배운 훅과 패턴들을 실제 앱에 적용해보는 미니 프로젝트입니다.

---

## 앱 소개

간단한 **메모 작성 · 검색 · 핀 고정** 앱입니다.

| 기능 | 설명 |
|------|------|
| 메모 추가 | 제목(필수) + 내용(선택)으로 새 메모 작성 |
| 메모 삭제 | 두 번 클릭으로 실수 삭제 방지 |
| 핀 고정 | 중요한 메모를 상단 고정 |
| 실시간 검색 | 제목/내용으로 검색 (debounce 적용) |
| 정렬 | 최신순 / 오래된순 / 핀 우선 |
| 자동 저장 | localStorage에 영구 저장 (새로고침 후에도 유지) |

---

## 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 시작
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

---

## 프로젝트 구조

```
memo-board/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                  # 앱 진입점, NoteProvider로 감쌈
    ├── App.jsx                   # 레이아웃, searchQuery/sortBy 상태 관리
    ├── index.css                 # 전역 초기화 스타일
    │
    ├── context/
    │   └── NoteContext.jsx       # useReducer + Context API + useCallback
    │
    ├── hooks/
    │   ├── useLocalStorage.js    # 커스텀 훅: localStorage 동기화
    │   └── useDebounce.js        # 커스텀 훅: 입력 지연 처리
    │
    └── components/
        ├── Header.jsx            # 앱 제목 + 메모 통계
        ├── NoteForm.jsx          # 메모 입력 폼 (useRef, useCallback)
        ├── SearchBar.jsx         # 검색창 + 정렬 드롭다운 (Controlled)
        ├── NoteList.jsx          # 목록 (useMemo, useDebounce)
        └── NoteCard.jsx          # 개별 카드 (React.memo, useCallback)
```

---

## study 개념과 파일 매핑

| study 챕터 | 개념 | 이 프로젝트에서 사용된 위치 |
|------------|------|---------------------------|
| ch04 / 01_useRef | DOM 직접 접근, 포커스 제어 | `NoteForm.jsx` — 제출 후 제목창 자동 포커스 |
| ch04 / 02_useMemo | 계산 결과 메모이제이션 | `NoteList.jsx` — 필터링+정렬 결과 캐싱 |
| ch04 / 02_useMemo | React.memo | `NoteCard.jsx` — props 안 바뀌면 리렌더 스킵 |
| ch04 / 03_useCallback | 함수 참조 메모이제이션 | `NoteContext.jsx`, `NoteCard.jsx` |
| ch04 / 04_custom_hook | 커스텀 훅 작성 패턴 | `useLocalStorage.js`, `useDebounce.js` |
| ch04 / 05_useReducer | 복잡한 상태 로직 분리 | `NoteContext.jsx` — `noteReducer` |
| ch04 / 06_context_api | 전역 상태 공유 | `NoteContext.jsx` — Provider + useNotes |

---

## 데이터 흐름 다이어그램

```
                    ┌─────────────────────────────┐
                    │         NoteProvider         │
                    │  (Context — "방송국")         │
                    │                              │
                    │  notes[]        ← useReducer │
                    │  addNote()      ← useCallback│
                    │  deleteNote()   ← useCallback│
                    │  togglePin()    ← useCallback│
                    └──────────┬──────────────────┘
                               │ Context 공급
              ┌────────────────┼────────────────────┐
              ▼                ▼                    ▼
        ┌──────────┐    ┌──────────┐         ┌──────────┐
        │  Header  │    │ NoteForm │         │ NoteList │
        │          │    │          │         │          │
        │ notes    │    │ addNote  │         │ notes    │
        │ .length  │    │          │         │ deleteNote│
        └──────────┘    └──────────┘         │ togglePin│
                                             └────┬─────┘
                                                  │
                                           ┌──────┴──────┐
                                           │  NoteCard[] │
                                           │  (React.memo)│
                                           └─────────────┘

  App (상태 리프팅)
    │
    ├─ searchQuery, sortBy 상태 보유
    ├─ SearchBar ←─ 입력 받음
    └─ NoteList ──→ props로 전달
```

---

## 핵심 코드 포인트

### 1. useReducer + Context API 조합 (`NoteContext.jsx`)

```jsx
// 리듀서: 상태 변경 로직을 한 곳에 모음
function noteReducer(state, action) {
  switch (action.type) {
    case 'ADD_NOTE':
      return [{ id: Date.now(), ...action.payload }, ...state];
    case 'DELETE_NOTE':
      return state.filter(note => note.id !== action.payload);
    case 'TOGGLE_PIN':
      return state.map(note =>
        note.id === action.payload ? { ...note, pinned: !note.pinned } : note
      );
  }
}

// Provider: useReducer + useEffect로 localStorage 자동 동기화
export function NoteProvider({ children }) {
  const [notes, dispatch] = useReducer(noteReducer, null, getInitialNotes);

  useEffect(() => {
    localStorage.setItem('memo-board-notes', JSON.stringify(notes));
  }, [notes]);

  // dispatch를 직접 노출하지 않고 useCallback으로 감싼 편의 함수 제공
  const addNote = useCallback((title, content) => {
    dispatch({ type: 'ADD_NOTE', payload: { title, content } });
  }, []);
  // ...
}
```

### 2. useDebounce 커스텀 훅 (`hooks/useDebounce.js`)

```js
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // 새 입력 시 이전 타이머 취소
  }, [value, delay]);

  return debouncedValue;
}
```

### 3. useMemo로 필터링+정렬 최적화 (`NoteList.jsx`)

```jsx
// notes, debouncedQuery, sortBy 중 하나라도 바뀔 때만 재계산
const filteredAndSortedNotes = useMemo(() => {
  const filtered = debouncedQuery
    ? notes.filter(note =>
        note.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : notes;

  return [...filtered].sort((a, b) => b.createdAt - a.createdAt);
}, [notes, debouncedQuery, sortBy]);
```

### 4. React.memo + useCallback 조합 (`NoteCard.jsx`)

```jsx
// React.memo: props가 같으면 리렌더 스킵
const NoteCard = memo(function NoteCard({ note, onDelete, onTogglePin }) {

  // useCallback: note.id가 같으면 같은 함수 참조 유지
  const handleTogglePin = useCallback(() => {
    onTogglePin(note.id);
  }, [note.id, onTogglePin]);

  // onDelete, onTogglePin은 NoteContext에서 useCallback으로 만들어져
  // 안정적(stable)이므로 NoteCard의 props 비교에서 항상 "같음"으로 판단됨
  // → React.memo가 효과를 발휘할 수 있는 조건이 갖춰짐
});
```

### 5. useRef로 자동 포커스 (`NoteForm.jsx`)

```jsx
const titleRef = useRef(null);

const handleSubmit = useCallback((e) => {
  if (!title.trim()) {
    titleRef.current?.focus(); // DOM 직접 조작 (리렌더 없이)
    return;
  }
  addNote(title, content);
  setTitle('');
  // 상태 업데이트 후 DOM이 그려진 다음에 포커스 이동
  setTimeout(() => titleRef.current?.focus(), 0);
}, [title, content, addNote]);

return <input ref={titleRef} ... />;
```

---

## 왜 이 기술 조합인가?

```
메모 CRUD 상태
  └─ useReducer    : 여러 종류의 상태 변경을 switch문으로 명확하게 분리
  └─ Context API   : 깊은 컴포넌트까지 props 없이 상태 전달

성능 최적화
  └─ useMemo       : 검색/정렬 계산은 데이터가 바뀔 때만 재실행
  └─ useCallback   : 함수 참조를 안정적으로 유지해 React.memo 효과 극대화
  └─ React.memo    : 카드 N개 중 1개만 바뀌어도 나머지는 리렌더 스킵

사용자 경험
  └─ useDebounce   : 검색창 타이핑 중 불필요한 필터링 방지
  └─ useRef        : 폼 제출 후 즉시 다음 메모 입력 가능하도록 자동 포커스
  └─ useLocalStorage: 새로고침해도 메모 유지
```

---

## 키워드 정리

| 훅 / 패턴 | 이 프로젝트에서의 역할 |
|-----------|----------------------|
| `useReducer` | 메모 추가/삭제/핀 토글 로직을 하나의 리듀서로 관리 |
| `createContext` / `useContext` | 메모 상태를 전역 공급 (Props Drilling 없이) |
| `useCallback` | addNote, deleteNote, togglePin, 카드 핸들러 안정화 |
| `useMemo` | 검색 + 정렬 연산 결과 캐싱 |
| `React.memo` | NoteCard — 관련 없는 카드의 리렌더 방지 |
| `useRef` | 폼 제출 후 input DOM에 자동 포커스 |
| `useDebounce` (커스텀) | 타이핑 중 과도한 필터링 방지 |
| `useLocalStorage` (커스텀) | useState + useEffect 조합 → localStorage 동기화 |
| 상태 리프팅 | searchQuery, sortBy를 App에서 관리해 SearchBar ↔ NoteList 공유 |
| Controlled Input | SearchBar, NoteForm의 input이 React state를 따름 |
