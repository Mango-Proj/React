import { memo, useCallback, useState } from 'react';

/**
 * NoteCard — 개별 메모 카드 컴포넌트
 *
 * [사용된 최적화 기법]
 * ① React.memo (= memo): props가 변하지 않으면 이 컴포넌트를 리렌더하지 않음
 *    → NoteList에서 다른 카드가 수정되어도 이 카드는 리렌더 건너뜀
 *    → 효과: onDelete, onTogglePin이 useCallback으로 안정적이어서
 *            props 비교에서 항상 "같음"으로 판단됨
 *
 * ② useCallback: 이 컴포넌트 내부의 핸들러도 메모이제이션
 *    → note.id가 바뀌지 않는 한 새 함수를 만들지 않음
 *
 * [삭제 UX — 두 번 클릭 확인]
 * 실수로 삭제하는 것을 방지하기 위해:
 *   1번째 클릭: "정말 삭제?" 문구로 경고 표시
 *   2번째 클릭: 실제 삭제 실행
 *   3초 후 미클릭: 자동으로 일반 상태로 복귀
 *
 * Props:
 * @param {{ id, title, content, pinned, createdAt }} note - 메모 데이터
 * @param {Function} onDelete - 삭제 함수 (id를 인수로 호출)
 * @param {Function} onTogglePin - 핀 토글 함수 (id를 인수로 호출)
 */
const NoteCard = memo(function NoteCard({ note, onDelete, onTogglePin }) {
  // 삭제 확인 상태 (첫 클릭 후 true → 경고 표시)
  const [confirmDelete, setConfirmDelete] = useState(false);

  // handleTogglePin: note.id, onTogglePin이 바뀔 때만 새 함수 생성
  const handleTogglePin = useCallback(() => {
    onTogglePin(note.id);
  }, [note.id, onTogglePin]);

  // handleDeleteClick: 두 번 클릭 확인 로직
  const handleDeleteClick = useCallback(() => {
    if (confirmDelete) {
      // 두 번째 클릭: 실제 삭제
      onDelete(note.id);
    } else {
      // 첫 번째 클릭: 경고 상태로 전환
      setConfirmDelete(true);
      // 3초 후 자동으로 일반 상태로 복귀
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  }, [confirmDelete, note.id, onDelete]);

  // 날짜 포맷팅: timestamp → "4월 22일 14:30" 형식
  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(note.createdAt));

  const styles = {
    card: {
      background: '#ffffff',
      // 핀 고정 여부에 따라 테두리 색과 그림자 변경
      border: note.pinned ? '2px solid #fbbf24' : '2px solid #f3f4f6',
      borderRadius: '14px',
      padding: '18px 20px',
      boxShadow: note.pinned
        ? '0 4px 16px rgba(251, 191, 36, 0.18)'  // 핀: 따뜻한 노란 그림자
        : '0 2px 8px rgba(0, 0, 0, 0.05)',        // 일반: 연한 그림자
      position: 'relative',
      transition: 'box-shadow 0.2s, border-color 0.2s',
    },
    pinnedIcon: {
      position: 'absolute',
      top: '14px',
      right: '14px',
      fontSize: '16px',
    },
    title: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#1e1b4b',
      marginBottom: '8px',
      // 핀 아이콘과 겹치지 않도록 오른쪽 여백
      paddingRight: note.pinned ? '32px' : '0',
      lineHeight: '1.4',
    },
    content: {
      fontSize: '14px',
      color: '#4b5563',         // gray-600
      lineHeight: '1.65',
      marginBottom: '14px',
      whiteSpace: 'pre-wrap',   // 줄바꿈 문자(\n)를 그대로 표시
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '8px',
    },
    date: {
      fontSize: '12px',
      color: '#9ca3af',         // gray-400
    },
    actions: {
      display: 'flex',
      gap: '6px',
    },
    pinBtn: {
      padding: '4px 12px',
      borderRadius: '6px',
      border: 'none',
      // 핀 상태에 따라 버튼 색 변경
      background: note.pinned ? '#fef3c7' : '#f3f4f6',
      color: note.pinned ? '#92400e' : '#6b7280',
      fontSize: '12px',
      cursor: 'pointer',
      fontWeight: note.pinned ? '600' : '400',
    },
    deleteBtn: {
      padding: '4px 12px',
      borderRadius: '6px',
      border: 'none',
      // 삭제 확인 상태에 따라 버튼 색 변경
      background: confirmDelete ? '#fee2e2' : '#f3f4f6',  // red-100 or gray-100
      color: confirmDelete ? '#dc2626' : '#6b7280',       // red-600 or gray-500
      fontSize: '12px',
      cursor: 'pointer',
      fontWeight: confirmDelete ? '700' : '400',
      transition: 'background 0.15s, color 0.15s',
    },
  };

  return (
    <div style={styles.card}>
      {/* 핀 고정 아이콘 (고정된 경우만 표시) */}
      {note.pinned && (
        <span style={styles.pinnedIcon} title="고정된 메모">📌</span>
      )}

      {/* 제목 */}
      <h3 style={styles.title}>{note.title}</h3>

      {/* 내용 (없으면 표시 생략) */}
      {note.content && (
        <p style={styles.content}>{note.content}</p>
      )}

      {/* 하단: 날짜 + 액션 버튼 */}
      <div style={styles.footer}>
        <span style={styles.date}>{formattedDate}</span>

        <div style={styles.actions}>
          {/* 핀 고정/해제 버튼 */}
          <button
            onClick={handleTogglePin}
            style={styles.pinBtn}
            title={note.pinned ? '고정 해제' : '고정하기'}
          >
            {note.pinned ? '📌 고정됨' : '📍 고정'}
          </button>

          {/* 삭제 버튼 — 첫 클릭: 확인 요청 / 두 번째 클릭: 삭제 실행 */}
          <button
            onClick={handleDeleteClick}
            style={styles.deleteBtn}
            title={confirmDelete ? '한 번 더 클릭하면 삭제됩니다' : '메모 삭제'}
          >
            {confirmDelete ? '정말 삭제?' : '🗑 삭제'}
          </button>
        </div>
      </div>
    </div>
  );
});

export default NoteCard;
