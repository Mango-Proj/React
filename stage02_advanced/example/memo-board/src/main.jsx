import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NoteProvider } from './context/NoteContext';
import App from './App';
import './index.css';

/**
 * 앱 진입점
 *
 * [Context API 패턴]
 * NoteProvider로 App 전체를 감싸면,
 * 하위 어느 컴포넌트에서든 useNotes() 훅으로 메모 상태에 접근할 수 있습니다.
 *
 * 구조:
 *   NoteProvider (전역 상태 공급)
 *     └── App (레이아웃)
 *           ├── Header   (메모 개수 표시)
 *           ├── NoteForm (메모 추가)
 *           ├── SearchBar (검색 + 정렬)
 *           └── NoteList (카드 목록)
 *                 └── NoteCard[] (개별 카드)
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NoteProvider>
      <App />
    </NoteProvider>
  </StrictMode>
);
