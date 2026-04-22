import { useState, useRef, useCallback } from 'react';
import { useNotes } from '../context/NoteContext';

/**
 * NoteForm — 새 메모 입력 폼 컴포넌트
 *
 * [사용된 훅]
 * ① useState  : 제목/내용 입력값, 폼 펼침 여부 관리 (controlled input)
 * ② useRef    : 제출 후 제목 입력창에 자동 포커스 (DOM 직접 접근)
 * ③ useCallback: 제출 핸들러 메모이제이션
 * ④ useNotes  : Context에서 addNote 함수 가져오기
 *
 * [useRef vs useState 선택 기준]
 * - titleRef: 렌더링에 영향을 주지 않고 DOM 요소만 참조 → useRef
 * - title, content: 값이 바뀔 때 화면을 다시 그려야 함 → useState
 *
 * [폼 동작]
 * 1. 입력창 클릭 시 폼이 펼쳐짐 (내용 입력 + 버튼 표시)
 * 2. 제목 입력 후 "추가" 클릭 → 메모 저장, 폼 초기화, 포커스 복귀
 * 3. "취소" 클릭 → 폼 접힘, 입력값 초기화
 */
export default function NoteForm() {
  const { addNote } = useNotes();

  // 입력값 상태 (Controlled Input)
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 폼 펼침 여부 (클릭 전: 제목 입력창만 / 클릭 후: 내용+버튼 표시)
  const [isExpanded, setIsExpanded] = useState(false);

  // useRef: 제목 input DOM 요소를 직접 참조
  // → 값을 추적하는 게 아니라 DOM 요소 자체에 접근하기 위해
  // → titleRef.current.focus()로 직접 포커스 이동 가능
  // → ref 변경은 리렌더를 일으키지 않음
  const titleRef = useRef(null);

  // useCallback: title, content, addNote가 바뀔 때만 새 함수 생성
  // → 불필요한 리렌더 방지 (이 컴포넌트는 메모이제이션 안 되어 있어서 큰 효과는 없지만
  //    코드 패턴을 보여주기 위해 작성)
  const handleSubmit = useCallback((e) => {
    e.preventDefault(); // 기본 form 제출(페이지 리로드) 방지

    const trimmedTitle = title.trim();

    // 제목이 비어있으면 제목 창에 포커스를 주고 중단
    if (!trimmedTitle) {
      titleRef.current?.focus(); // optional chaining: ref가 null이어도 에러 없음
      return;
    }

    // Context의 addNote 호출 (dispatch를 직접 쓰지 않고 편의 함수 사용)
    addNote(trimmedTitle, content.trim());

    // 폼 초기화
    setTitle('');
    setContent('');
    setIsExpanded(false);

    // 제출 후 다음 메모를 바로 입력할 수 있도록 포커스 복귀
    // setTimeout 0: 상태 업데이트(setIsExpanded) 후 DOM이 렌더링된 뒤 실행
    setTimeout(() => titleRef.current?.focus(), 0);
  }, [title, content, addNote]);

  const styles = {
    form: {
      background: '#ffffff',
      border: '2px solid #ede9fe',      // violet-100
      borderRadius: '16px',
      padding: '16px 20px',
      marginBottom: '16px',
      boxShadow: '0 2px 10px rgba(124, 58, 237, 0.07)',
      transition: 'box-shadow 0.2s',
    },
    titleInput: {
      width: '100%',
      border: 'none',
      outline: 'none',
      fontSize: '15px',
      fontWeight: '600',
      color: '#1e1b4b',
      background: 'transparent',
      padding: '2px 0',
    },
    divider: {
      height: '1px',
      background: '#f3f4f6',
      margin: '12px 0',
    },
    contentTextarea: {
      width: '100%',
      border: 'none',
      outline: 'none',
      fontSize: '14px',
      color: '#374151',
      background: 'transparent',
      resize: 'none',
      lineHeight: '1.6',
      padding: '2px 0',
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '8px',
    },
    cancelBtn: {
      padding: '7px 18px',
      borderRadius: '8px',
      border: 'none',
      background: '#f3f4f6',
      color: '#6b7280',
      fontSize: '14px',
      cursor: 'pointer',
    },
    submitBtn: {
      padding: '7px 18px',
      borderRadius: '8px',
      border: 'none',
      background: '#7c3aed',  // violet-600
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
    },
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {/* 제목 입력창 (ref 연결 → 자동 포커스용) */}
      <input
        ref={titleRef}
        type="text"
        placeholder="새 메모 제목을 입력하세요..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        onFocus={() => setIsExpanded(true)}  // 클릭 시 폼 펼치기
        style={styles.titleInput}
      />

      {/* 펼쳐진 상태: 내용 입력 + 버튼 */}
      {isExpanded && (
        <>
          <div style={styles.divider} />

          <textarea
            placeholder="내용을 입력하세요... (선택 사항)"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={3}
            style={styles.contentTextarea}
          />

          <div style={styles.divider} />

          <div style={styles.actions}>
            <button
              type="button"
              onClick={() => {
                // 취소: 입력값 초기화 + 폼 접기
                setTitle('');
                setContent('');
                setIsExpanded(false);
              }}
              style={styles.cancelBtn}
            >
              취소
            </button>
            <button type="submit" style={styles.submitBtn}>
              + 추가
            </button>
          </div>
        </>
      )}
    </form>
  );
}
