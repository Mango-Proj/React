/**
 * BucketItem.jsx — 버킷리스트 개별 항목 컴포넌트
 * =================================================
 * 하나의 버킷리스트 항목을 표시합니다.
 * 체크(완료 토글)와 삭제 기능을 제공합니다.
 *
 * [ch02] Props로 데이터 받기
 *   - item: { id, text, completed } — 표시할 항목 데이터
 *   - onToggle: 완료 상태를 뒤집는 콜백 (id 전달)
 *   - onDelete: 항목을 삭제하는 콜백 (id 전달)
 *
 * [ch02] 조건부 렌더링
 *   - completed 여부에 따라 텍스트에 취소선 스타일을 적용합니다
 *
 * [ch03] CSS 모듈로 스타일 적용
 */

import styles from './BucketItem.module.css';

/**
 * @param {{ id: string, text: string, completed: boolean }} props.item
 * @param {function} props.onToggle - (id: string) => void
 * @param {function} props.onDelete - (id: string) => void
 */
function BucketItem({ item, onToggle, onDelete }) {
  return (
    <li
      // 완료 상태에 따라 .item 외에 .completed 클래스를 조건부로 추가합니다
      // [ch03] 조건부 className
      className={`${styles.item} ${item.completed ? styles.completed : ''}`}
    >
      {/* ── 왼쪽: 체크박스 + 텍스트 ── */}
      <div
        className={styles.left}
        // 텍스트 영역 클릭 시 완료 토글
        onClick={() => onToggle(item.id)}
        // 웹 접근성: 키보드로도 조작 가능하도록
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle(item.id)}
        aria-label={`${item.text} ${item.completed ? '완료됨, 취소하려면 클릭' : '클릭하여 완료'}`}
      >
        {/* 커스텀 체크박스 — HTML checkbox 대신 div를 사용해 스타일을 자유롭게 꾸밉니다 */}
        <span
          className={`${styles.checkbox} ${item.completed ? styles.checkboxDone : ''}`}
          aria-hidden="true"
        >
          {/* 완료 시 체크 아이콘 표시 */}
          {item.completed && '✓'}
        </span>

        {/* 항목 텍스트 — completed 클래스가 붙으면 CSS로 취소선이 그어집니다 */}
        <span className={styles.text}>{item.text}</span>
      </div>

      {/* ── 오른쪽: 삭제 버튼 ── */}
      <button
        className={styles.deleteBtn}
        // [ch02] 이벤트 핸들링: 부모의 handleDelete를 id와 함께 호출
        onClick={() => onDelete(item.id)}
        aria-label={`${item.text} 삭제`}
      >
        ✕
      </button>
    </li>
  );
}

export default BucketItem;
