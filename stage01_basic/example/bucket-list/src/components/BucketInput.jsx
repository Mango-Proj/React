/**
 * BucketInput.jsx — 새 항목 입력 컴포넌트
 * ==========================================
 * 버킷리스트에 새 항목을 추가하는 입력창입니다.
 *
 * [ch02] 제어 컴포넌트 (Controlled Component) 패턴
 *   - inputValue: 입력창의 현재 값을 state로 관리
 *   - onChange: 입력 시 state 업데이트
 *   → React가 항상 입력창의 값을 제어합니다
 *
 * [ch02] 이벤트 핸들링
 *   - onClick: 버튼 클릭으로 추가
 *   - onKeyDown: Enter 키로도 추가
 *
 * [ch02] Props
 *   - onAdd: 부모(App)에서 받은 항목 추가 함수
 */

import { useState } from 'react';
import styles from './BucketInput.module.css';

/**
 * @param {function} props.onAdd - 새 항목 텍스트를 인자로 받는 콜백 함수
 */
function BucketInput({ onAdd }) {
  // 입력창의 현재 값을 관리하는 로컬 state
  // inputValue는 이 컴포넌트에서만 필요하므로 여기서 선언합니다
  const [inputValue, setInputValue] = useState('');

  /**
   * 항목 추가 처리
   * - 빈 문자열이나 공백만 있으면 추가하지 않습니다
   * - 추가 후 입력창을 비웁니다
   */
  const handleSubmit = () => {
    const trimmed = inputValue.trim(); // 앞뒤 공백 제거
    if (!trimmed) return;              // 빈 값이면 아무것도 안 함

    onAdd(trimmed);       // 부모(App)의 handleAdd 호출
    setInputValue('');    // 입력창 초기화
  };

  /**
   * Enter 키 누를 때 추가 (키보드 사용자 편의)
   * [ch02] onKeyDown 이벤트 핸들링
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="text"
        // value를 state로 연결 → 제어 컴포넌트
        value={inputValue}
        // 입력할 때마다 state 업데이트 (e.target.value = 현재 입력 내용)
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="이루고 싶은 꿈을 입력하세요..."
        // 최대 입력 글자 수 제한
        maxLength={60}
      />
      <button
        className={styles.addBtn}
        onClick={handleSubmit}
        // 빈 값일 때 버튼 비활성화 (시각적 피드백)
        disabled={!inputValue.trim()}
      >
        추가
      </button>
    </div>
  );
}

export default BucketInput;
