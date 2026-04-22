/**
 * Header.jsx — 앱 상단 헤더 컴포넌트
 * =====================================
 * 앱 제목과 버킷리스트 달성률을 표시합니다.
 *
 * [ch02] Props로 데이터 받기
 *   - progressPercent: 완료율 (0~100)
 *   - completedCount:  완료된 항목 수
 *   - totalCount:      전체 항목 수
 *
 * [ch03] CSS 모듈로 스타일 적용
 */

import styles from './Header.module.css';

/**
 * @param {number} props.progressPercent - 완료 퍼센트 (0~100)
 * @param {number} props.completedCount  - 완료 항목 수
 * @param {number} props.totalCount      - 전체 항목 수
 */
function Header({ progressPercent, completedCount, totalCount }) {
  return (
    <header className={styles.header}>
      {/* 앱 제목 */}
      <h1 className={styles.title}>나의 버킷리스트 ✨</h1>

      {/* 달성률 텍스트 */}
      <p className={styles.subtitle}>
        {totalCount === 0
          ? '첫 번째 꿈을 추가해보세요!'
          : `${completedCount} / ${totalCount} 완료 · ${progressPercent}% 달성`}
      </p>

      {/*
        진행률 바 컨테이너
        전체 너비의 progressPercent%만큼 채워집니다
      */}
      {totalCount > 0 && (
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            // style에 width를 직접 지정해 동적으로 너비를 조절합니다
            // CSS 모듈만으로는 동적 값을 표현하기 어렵기 때문에
            // 이런 경우 인라인 스타일과 CSS 모듈을 함께 사용합니다
            style={{ width: `${progressPercent}%` }}
            // 웹 접근성: 스크린 리더가 진행률을 읽을 수 있도록
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      )}
    </header>
  );
}

export default Header;
