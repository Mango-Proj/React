import { useState } from 'react';
import Header from './components/Header';
import NoteForm from './components/NoteForm';
import SearchBar from './components/SearchBar';
import NoteList from './components/NoteList';

/**
 * App — 앱 전체 레이아웃 컴포넌트
 *
 * [상태 리프팅(State Lifting) 패턴]
 * searchQuery와 sortBy를 여기서 관리합니다.
 * 이유: 두 값이 SearchBar(입력)와 NoteList(사용) 양쪽 모두에 필요하기 때문.
 * → 두 컴포넌트의 공통 부모인 App이 상태를 가지고 props로 내려줍니다.
 *
 * [Context API와의 차이]
 * - notes, addNote, deleteNote, togglePin → Context (어디서든 접근 가능해야 하므로)
 * - searchQuery, sortBy → App의 로컬 state (SearchBar ↔ NoteList 사이에서만 필요)
 */
export default function App() {
  // 검색어 상태: SearchBar에서 입력 → NoteList에서 필터링에 사용
  const [searchQuery, setSearchQuery] = useState('');

  // 정렬 기준 상태: 'newest' | 'oldest' | 'pinned'
  const [sortBy, setSortBy] = useState('newest');

  const styles = {
    app: {
      maxWidth: '680px',
      margin: '0 auto',
      padding: '32px 16px 64px',
    },
  };

  return (
    <div style={styles.app}>
      {/* 앱 제목 + 메모 통계 */}
      <Header />

      {/* 새 메모 입력 폼 */}
      <NoteForm />

      {/* 검색창 + 정렬 선택 드롭다운 */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* 메모 카드 목록 (필터링 + 정렬 적용) */}
      <NoteList searchQuery={searchQuery} sortBy={sortBy} />
    </div>
  );
}
