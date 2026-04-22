import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────
// 1. 샘플 초기 데이터
// ─────────────────────────────────────────────────────────────────
const SAMPLE_NOTES = [
  {
    id: 1,
    title: '리액트 공부 계획',
    content: 'useReducer, Context API, 커스텀 훅 복습하기',
    pinned: true,
    createdAt: Date.now() - 86400000, // 24시간 전
  },
  {
    id: 2,
    title: '장보기 목록',
    content: '우유, 계란, 빵, 사과, 바나나',
    pinned: false,
    createdAt: Date.now() - 3600000, // 1시간 전
  },
  {
    id: 3,
    title: '주간 목표',
    content: '미니 프로젝트 완성 후 GitHub에 올리기',
    pinned: false,
    createdAt: Date.now(),
  },
];

// ─────────────────────────────────────────────────────────────────
// 2. 액션 타입 상수
//
// 문자열을 직접 쓰면 오타가 나도 에러가 발생하지 않아 디버깅이 어려움.
// 상수로 정의해두면 오타 시 즉시 "변수가 없음" 에러가 발생하여 안전함.
// ─────────────────────────────────────────────────────────────────
const ActionTypes = {
  ADD: 'ADD_NOTE',
  DELETE: 'DELETE_NOTE',
  TOGGLE_PIN: 'TOGGLE_PIN',
};

// ─────────────────────────────────────────────────────────────────
// 3. 리듀서 함수
//
// [useReducer 패턴 — ch04_hook_state/05_useReducer.jsx 참고]
//
// "은행 창구" 역할:
//   - state(현재 잔액/상태)와 action(업무 요청서)을 받아서
//   - 새로운 state(처리 후 상태)를 반환
//
// 규칙:
//   ① 순수 함수여야 함 (같은 입력 → 항상 같은 출력)
//   ② state를 직접 수정하지 않고 새 배열/객체를 반환
//   ③ 부작용(API 호출, localStorage 저장 등)은 여기서 하지 않음
// ─────────────────────────────────────────────────────────────────
function noteReducer(state, action) {
  switch (action.type) {
    case ActionTypes.ADD:
      // 스프레드 연산자로 기존 배열을 건드리지 않고 새 배열 반환
      // 새 메모를 앞에 추가해서 최신 메모가 위에 오도록
      return [
        {
          id: Date.now(),                   // 간단한 고유 ID (실제 앱에서는 crypto.randomUUID() 사용)
          title: action.payload.title,
          content: action.payload.content,
          pinned: false,
          createdAt: Date.now(),
        },
        ...state,                           // 기존 메모들을 뒤에 붙임
      ];

    case ActionTypes.DELETE:
      // action.payload = 삭제할 메모의 id
      // filter: 해당 id를 제외한 새 배열 반환
      return state.filter(note => note.id !== action.payload);

    case ActionTypes.TOGGLE_PIN:
      // action.payload = 핀 토글할 메모의 id
      // map: 해당 id의 메모만 pinned를 반전, 나머지는 그대로
      return state.map(note =>
        note.id === action.payload
          ? { ...note, pinned: !note.pinned }  // 해당 메모만 변경
          : note                               // 나머지는 원본 그대로
      );

    default:
      // 모르는 액션 타입은 현재 상태를 그대로 반환
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────
// 4. Context 생성
//
// [Context API 패턴 — ch04_hook_state/06_context_api.jsx 참고]
//
// createContext(null): 기본값을 null로 설정
// → Provider 없이 사용하면 null이 반환됨
// → useNotes() 커스텀 훅에서 null 체크로 실수를 잡을 수 있음
// ─────────────────────────────────────────────────────────────────
const NoteContext = createContext(null);

// ─────────────────────────────────────────────────────────────────
// 5. Provider 컴포넌트
//
// "방송국" 역할: 이 Provider로 감싼 모든 자식 컴포넌트가
// 메모 상태(notes)와 조작 함수들(addNote, deleteNote, togglePin)에
// props 전달 없이 직접 접근할 수 있게 됩니다.
// ─────────────────────────────────────────────────────────────────
export function NoteProvider({ children }) {
  // localStorage에서 초기값 읽기
  // useReducer의 세 번째 인수(초기화 함수)를 활용:
  // → 초기화 함수는 컴포넌트 마운트 시 딱 한 번만 실행됨
  const getInitialNotes = () => {
    try {
      const saved = localStorage.getItem('memo-board-notes');
      return saved ? JSON.parse(saved) : SAMPLE_NOTES;
    } catch {
      return SAMPLE_NOTES;
    }
  };

  // useReducer: [현재 상태, dispatch 함수]
  // - notes: 현재 메모 배열
  // - dispatch: "업무 요청서(action)"를 리듀서에 전달하는 함수
  const [notes, dispatch] = useReducer(noteReducer, null, getInitialNotes);

  // notes가 바뀔 때마다 localStorage에 자동 저장
  // useLocalStorage 훅을 쓰지 않고 직접 구현한 버전
  // → useReducer와 useEffect의 조합 패턴
  useEffect(() => {
    localStorage.setItem('memo-board-notes', JSON.stringify(notes));
  }, [notes]);

  // ───────────────────────────────────
  // 편의 함수들 (dispatch를 직접 노출하는 대신 감싸서 제공)
  //
  // [useCallback 패턴 — ch04_hook_state/03_useCallback.jsx 참고]
  // useCallback: 함수 참조를 메모이제이션
  // → 이 함수들을 props로 받는 자식 컴포넌트(NoteCard)가
  //   메모이제이션(React.memo) 되어 있을 때 불필요한 리렌더를 방지
  // → dispatch는 리렌더 간에 안정적(stable)이므로 의존성 배열 비워도 됨
  // ───────────────────────────────────

  /** 새 메모 추가 */
  const addNote = useCallback((title, content) => {
    dispatch({ type: ActionTypes.ADD, payload: { title, content } });
  }, []); // dispatch가 안정적이므로 빈 배열 → 최초 1회만 생성

  /** 메모 삭제 */
  const deleteNote = useCallback((id) => {
    dispatch({ type: ActionTypes.DELETE, payload: id });
  }, []);

  /** 핀 고정/해제 토글 */
  const togglePin = useCallback((id) => {
    dispatch({ type: ActionTypes.TOGGLE_PIN, payload: id });
  }, []);

  // Context에 공급할 값 객체
  const value = { notes, addNote, deleteNote, togglePin };

  return (
    <NoteContext.Provider value={value}>
      {children}
    </NoteContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────
// 6. 커스텀 훅: useNotes
//
// useContext를 컴포넌트에서 직접 쓰는 대신 이 훅을 사용:
//   ① Provider 밖에서 사용 시 명확한 에러 메시지 제공
//   ② import 대상을 useNotes 하나로 단순화
//   ③ Context 내부 구현을 숨겨서 나중에 바꿔도 사용처 코드 변경 불필요
// ─────────────────────────────────────────────────────────────────
export function useNotes() {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error(
      'useNotes()는 <NoteProvider> 안에서만 사용할 수 있습니다.\n' +
      'main.jsx에서 <NoteProvider>로 앱을 감쌌는지 확인하세요.'
    );
  }
  return context;
}
