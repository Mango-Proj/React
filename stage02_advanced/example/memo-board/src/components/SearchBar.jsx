/**
 * SearchBar — 검색창 + 정렬 드롭다운 컴포넌트
 *
 * [Controlled Component 패턴]
 * 이 컴포넌트는 상태를 직접 갖지 않습니다.
 * 부모(App)에서 searchQuery, sortBy 상태를 관리하고,
 * SearchBar는 입력을 받아 onSearchChange, onSortChange를 호출하는
 * "순수한 UI 컴포넌트"입니다.
 *
 * 검색 debounce 처리는 여기서 하지 않고,
 * 실제로 검색 결과를 사용하는 NoteList에서 useDebounce로 처리합니다.
 * → 관심사 분리: SearchBar는 입력만, NoteList는 필터링만 담당
 *
 * Props:
 * @param {string} searchQuery - 현재 검색어 (App에서 관리)
 * @param {Function} onSearchChange - 검색어 변경 핸들러
 * @param {string} sortBy - 현재 정렬 기준 ('newest' | 'oldest' | 'pinned')
 * @param {Function} onSortChange - 정렬 변경 핸들러
 */
export default function SearchBar({ searchQuery, onSearchChange, sortBy, onSortChange }) {
  const styles = {
    container: {
      display: 'flex',
      gap: '10px',
      marginBottom: '16px',
      alignItems: 'center',
    },
    searchWrapper: {
      flex: 1,           // 검색창이 남은 공간을 모두 차지
      position: 'relative',
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '14px',
      pointerEvents: 'none', // 아이콘 클릭 시 input이 포커스되도록
    },
    searchInput: {
      width: '100%',
      padding: '10px 12px 10px 36px', // 왼쪽 아이콘 공간 확보
      border: '2px solid #e5e7eb',
      borderRadius: '10px',
      fontSize: '14px',
      outline: 'none',
      background: '#ffffff',
      color: '#1e1b4b',
    },
    select: {
      padding: '10px 12px',
      border: '2px solid #e5e7eb',
      borderRadius: '10px',
      fontSize: '14px',
      outline: 'none',
      background: '#ffffff',
      color: '#374151',
      cursor: 'pointer',
      minWidth: '100px',
    },
  };

  return (
    <div style={styles.container}>
      {/* 검색 입력창 */}
      <div style={styles.searchWrapper}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder="메모 검색..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* 정렬 기준 선택 드롭다운 */}
      <select
        value={sortBy}
        onChange={e => onSortChange(e.target.value)}
        style={styles.select}
      >
        <option value="newest">최신순</option>
        <option value="oldest">오래된순</option>
        <option value="pinned">핀 우선</option>
      </select>
    </div>
  );
}
