import { useMemo } from 'react';
import { useNotes } from '../context/NoteContext';
import { useDebounce } from '../hooks/useDebounce';
import NoteCard from './NoteCard';

/**
 * NoteList — 메모 카드 목록 컴포넌트
 *
 * [사용된 훅]
 * ① useDebounce : 검색어 입력을 300ms 지연시켜 처리
 * ② useMemo     : 필터링 + 정렬 연산 결과를 메모이제이션
 * ③ useNotes    : Context에서 notes, deleteNote, togglePin 가져오기
 *
 * [useMemo 선택 이유]
 * 메모가 100개일 때 검색어가 바뀌면 100개를 전부 순회해야 합니다.
 * 부모(App)가 리렌더될 때마다 이 연산이 반복되면 낭비입니다.
 * useMemo로 notes, debouncedQuery, sortBy 중 하나라도 바뀔 때만 재계산합니다.
 *
 * Props:
 * @param {string} searchQuery - 검색어 (App에서 내려받음)
 * @param {string} sortBy - 정렬 기준 (App에서 내려받음)
 */
export default function NoteList({ searchQuery, sortBy }) {
  const { notes, deleteNote, togglePin } = useNotes();

  // useDebounce: 빠른 타이핑 시 매 글자마다 필터링하는 낭비를 방지
  // searchQuery가 바뀐 후 300ms가 지나야 debouncedQuery가 업데이트됨
  // → "리액트" 타이핑: 'ㄹ','리','리ㅇ'... 7번 → debouncedQuery는 '리액트' 1번만
  const debouncedQuery = useDebounce(searchQuery, 300);

  // useMemo: [의존성 배열]의 값이 바뀔 때만 아래 계산을 다시 실행
  // → notes, debouncedQuery, sortBy 모두 변하지 않으면 이전 결과 재사용
  const filteredAndSortedNotes = useMemo(() => {
    // ── 1단계: 검색어로 필터링 ──
    const filtered = debouncedQuery.trim()
      ? notes.filter(note => {
          const query = debouncedQuery.toLowerCase();
          // 제목 또는 내용 중 하나라도 검색어를 포함하면 통과
          return (
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query)
          );
        })
      : notes; // 검색어 없으면 전체 반환

    // ── 2단계: 정렬 ──
    // [...filtered]: 원본 배열을 직접 수정하지 않기 위해 얕은 복사
    const sorted = [...filtered];

    switch (sortBy) {
      case 'oldest':
        // 오래된순: createdAt 오름차순 (작은 값이 앞)
        sorted.sort((a, b) => a.createdAt - b.createdAt);
        break;

      case 'pinned':
        // 핀 우선: 고정된 메모를 앞으로, 같은 그룹 내에서는 최신순
        sorted.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1; // a가 핀 → a 앞으로
          if (!a.pinned && b.pinned) return 1;  // b가 핀 → b 앞으로
          return b.createdAt - a.createdAt;     // 같으면 최신순
        });
        break;

      case 'newest':
      default:
        // 최신순: createdAt 내림차순 (큰 값이 앞)
        sorted.sort((a, b) => b.createdAt - a.createdAt);
    }

    return sorted;
  }, [notes, debouncedQuery, sortBy]); // ← 이 세 값이 바뀔 때만 재실행

  const styles = {
    emptyState: {
      textAlign: 'center',
      padding: '64px 0',
      color: '#9ca3af',
    },
    emptyIcon: {
      fontSize: '52px',
      marginBottom: '16px',
    },
    emptyText: {
      fontSize: '15px',
      lineHeight: '1.6',
    },
    resultInfo: {
      fontSize: '13px',
      color: '#6b7280',
      marginBottom: '12px',
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
  };

  // 빈 상태 처리
  if (filteredAndSortedNotes.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>
          {debouncedQuery ? '🔍' : '📋'}
        </div>
        <p style={styles.emptyText}>
          {debouncedQuery
            ? `"${debouncedQuery}"에 해당하는 메모가 없어요`
            : '아직 메모가 없어요.\n위 입력창에서 첫 메모를 작성해보세요!'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* 검색 중일 때만 결과 수 표시 */}
      {debouncedQuery && (
        <p style={styles.resultInfo}>
          "{debouncedQuery}" 검색 결과 {filteredAndSortedNotes.length}개
        </p>
      )}

      {/* 메모 카드 목록 */}
      <div style={styles.list}>
        {filteredAndSortedNotes.map(note => (
          // key: 리스트 렌더링 시 각 항목을 고유하게 식별하는 값
          // note.id를 key로 → 순서가 바뀌어도 React가 올바른 카드를 업데이트
          <NoteCard
            key={note.id}
            note={note}
            onDelete={deleteNote}
            onTogglePin={togglePin}
          />
        ))}
      </div>
    </div>
  );
}
