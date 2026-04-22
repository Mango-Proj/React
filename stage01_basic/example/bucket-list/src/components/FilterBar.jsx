/**
 * FilterBar.jsx — 필터 탭 컴포넌트
 * ===================================
 * 버킷리스트 항목을 '전체 / 미완료 / 완료' 로 필터링하는 탭입니다.
 *
 * [ch02] Props로 데이터 받기
 *   - currentFilter: 현재 선택된 필터 값 ('all' | 'active' | 'completed')
 *   - onFilterChange: 탭 클릭 시 부모(App)에 필터 변경을 알리는 콜백
 *   - counts: { all, active, completed } — 각 탭에 표시할 항목 수
 *
 * [ch02] 조건부 렌더링
 *   - 선택된 탭에만 .active 클래스를 붙여 시각적으로 강조합니다
 *
 * [ch03] CSS 모듈로 스타일 적용
 */

import styles from './FilterBar.module.css';

/** 탭 목록을 배열로 관리 — 새 필터를 추가할 때 이 배열만 수정하면 됩니다 */
const FILTERS = [
  { value: 'all',       label: '전체' },
  { value: 'active',    label: '미완료' },
  { value: 'completed', label: '완료' },
];

/**
 * @param {string}   props.currentFilter  - 현재 활성 필터 값
 * @param {function} props.onFilterChange - 필터 변경 콜백 (value 전달)
 * @param {{ all: number, active: number, completed: number }} props.counts
 */
function FilterBar({ currentFilter, onFilterChange, counts }) {
  return (
    <div className={styles.filterBar} role="tablist" aria-label="항목 필터">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          // 현재 선택된 탭이면 .active 클래스를 추가로 붙입니다
          // [ch03] 조건부 className: 두 클래스를 문자열로 합칩니다
          className={
            `${styles.tab} ${currentFilter === value ? styles.active : ''}`
          }
          onClick={() => onFilterChange(value)}
          // 웹 접근성: 선택된 탭임을 스크린 리더에 알립니다
          role="tab"
          aria-selected={currentFilter === value}
        >
          {label}
          {/* 각 탭 옆에 항목 수 뱃지 표시 */}
          <span className={styles.badge}>{counts[value]}</span>
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
