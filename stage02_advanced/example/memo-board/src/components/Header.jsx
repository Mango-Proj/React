import { useNotes } from '../context/NoteContext';

/**
 * Header — 앱 상단 헤더 컴포넌트
 *
 * [Context API 사용 예시]
 * props를 통해 notes를 전달받지 않고,
 * useNotes() 훅으로 Context에서 직접 꺼내 씁니다.
 * → Props Drilling 없이 어느 깊이에서든 상태에 접근 가능
 *
 * 표시 정보:
 * - 앱 제목
 * - 전체 메모 개수
 * - 핀 고정된 메모 개수 (있을 때만 표시)
 */
export default function Header() {
  // Context에서 notes 배열만 꺼냄 (addNote, deleteNote 등은 불필요)
  const { notes } = useNotes();

  // 통계 계산 (useMemo가 필요할 만큼 무겁지 않으므로 일반 계산)
  const totalCount = notes.length;
  const pinnedCount = notes.filter(note => note.pinned).length;

  const styles = {
    header: {
      marginBottom: '28px',
    },
    titleRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '10px',
    },
    title: {
      fontSize: '28px',
      fontWeight: '800',
      color: '#7c3aed', // violet-600
    },
    statsRow: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
    },
    badge: {
      fontSize: '13px',
      color: '#6b7280',        // gray-500
      background: '#f3f4f6',   // gray-100
      padding: '3px 12px',
      borderRadius: '99px',    // pill 모양
    },
    pinnedBadge: {
      fontSize: '13px',
      color: '#92400e',        // amber-800
      background: '#fef3c7',   // amber-100
      padding: '3px 12px',
      borderRadius: '99px',
    },
  };

  return (
    <header style={styles.header}>
      <div style={styles.titleRow}>
        <span style={{ fontSize: '28px' }}>📝</span>
        <h1 style={styles.title}>메모 보드</h1>
      </div>

      <div style={styles.statsRow}>
        {/* 전체 메모 수 */}
        <span style={styles.badge}>전체 {totalCount}개</span>

        {/* 핀 고정 메모 수 (하나라도 있을 때만 표시) */}
        {pinnedCount > 0 && (
          <span style={styles.pinnedBadge}>📌 고정 {pinnedCount}개</span>
        )}
      </div>
    </header>
  );
}
