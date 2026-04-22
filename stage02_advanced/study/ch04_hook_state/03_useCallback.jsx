/**
 * 03_useCallback.jsx — useCallback 완전 정복
 * =============================================
 * 함수의 참조를 고정해 불필요한 리렌더링을 막는 useCallback을 살펴봅니다.
 *
 * 1. 왜 useCallback이 필요한가 — 함수도 매번 새로 만들어진다
 * 2. useCallback 기본 사용법
 * 3. React.memo + useCallback 조합 (시너지 효과)
 * 4. 의존성 배열과 함수형 업데이트 패턴
 */

import { useState, useCallback, memo, useRef } from 'react';

// ─────────────────────────────────────────────
// 예제 1: 문제 이해 — 함수는 매번 새로 만들어진다
// ─────────────────────────────────────────────

/**
 * React.memo로 감쌌지만, onClick이 매번 새 함수로 바뀌기 때문에
 * 부모가 리렌더링될 때마다 자식도 함께 리렌더링됩니다.
 */
const NaiveButton = memo(({ label, onClick }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log(`❌ NaiveButton "${label}" 렌더링 #${renderCount.current}`);

  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        background: '#fee2e2',
        border: '1px solid #fca5a5',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.85rem',
      }}
    >
      {label} (렌더 #{renderCount.current})
    </button>
  );
});

/**
 * React.memo + useCallback 조합.
 * onClick 참조가 고정되어 있어 부모가 리렌더링돼도 이 컴포넌트는 변화 없음.
 */
const OptimizedButton = memo(({ label, onClick }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log(`✅ OptimizedButton "${label}" 렌더링 #${renderCount.current}`);

  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        background: '#dcfce7',
        border: '1px solid #86efac',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.85rem',
      }}
    >
      {label} (렌더 #{renderCount.current})
    </button>
  );
});

/**
 * 부모 컴포넌트가 리렌더링될 때 자식 버튼의 렌더링 횟수를 비교합니다.
 * "부모 리렌더링" 버튼을 눌러보세요.
 */
export function CallbackNeedDemo() {
  const [parentCount, setParentCount] = useState(0);
  const [actionCount, setActionCount] = useState(0);

  // ❌ 매 렌더링마다 새 함수가 만들어집니다
  const handleNaiveClick = () => setActionCount(c => c + 1);

  // ✅ 참조가 고정됩니다 (빈 배열 → 처음 한 번만 생성)
  const handleOptimizedClick = useCallback(() => {
    setActionCount(c => c + 1);
  }, []);

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
        "부모 리렌더링" 버튼을 여러 번 누른 뒤, 렌더 횟수를 비교하세요 (콘솔도 확인).
      </p>
      <p style={{ marginBottom: '10px' }}>
        부모 리렌더 횟수: <strong>{parentCount}</strong> &nbsp;|&nbsp;
        액션 횟수: <strong>{actionCount}</strong>
      </p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
        <button
          onClick={() => setParentCount(c => c + 1)}
          style={{ padding: '8px 16px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          부모 리렌더링
        </button>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <NaiveButton label="useCallback 없음" onClick={handleNaiveClick} />
        <OptimizedButton label="useCallback 있음" onClick={handleOptimizedClick} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 예제 2: 의존성 배열 이해
// ─────────────────────────────────────────────
/**
 * userId가 바뀔 때만 fetchUser 함수를 새로 만듭니다.
 * - 의존성 배열이 빈 배열 []이면: 처음 마운트 시 한 번만 생성
 * - 의존성 배열에 값이 있으면: 그 값이 바뀔 때 새 함수 생성
 * - 의존성 배열 생략: 매 렌더링마다 새 함수 생성 (useCallback 의미 없음)
 */
export function DependencyArrayDemo() {
  const [userId, setUserId] = useState(1);
  const [result, setResult] = useState('');
  const [log, setLog] = useState([]);

  // userId가 바뀔 때만 함수를 새로 만듭니다
  const fetchUser = useCallback(() => {
    const msg = `userId=${userId} 사용자 정보 요청 (실제 fetch 생략)`;
    setResult(msg);
    setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, [userId]); // userId가 의존성 → userId 바뀌면 함수도 새로 만들어짐

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
        userId가 달라지면 fetchUser 함수가 새로 만들어집니다. (의존성 배열: [userId])
      </p>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
        <label style={{ fontSize: '0.9rem' }}>User ID:</label>
        <input
          type="number"
          value={userId}
          onChange={e => setUserId(Number(e.target.value))}
          min={1}
          style={{ width: '60px', padding: '5px 8px', border: '1px solid #d1d5db', borderRadius: '5px' }}
        />
        <button
          onClick={fetchUser}
          style={{ padding: '6px 14px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          데이터 요청
        </button>
      </div>
      {result && (
        <p style={{ padding: '8px 12px', background: '#eef2ff', borderRadius: '6px', fontSize: '0.85rem', color: '#4f46e5', marginBottom: '8px' }}>
          {result}
        </p>
      )}
      {log.length > 0 && (
        <div style={{ fontSize: '0.78rem', color: '#6b7280', maxHeight: '80px', overflowY: 'auto' }}>
          {log.map((entry, i) => <div key={i}>{entry}</div>)}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 예제 3: 실전 — 검색 + 정렬 버튼 최적화
// ─────────────────────────────────────────────

/** 정렬 버튼 — memo로 최적화 */
const SortButton = memo(({ label, active, onClick }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px',
        background: active ? '#6366f1' : '#f3f4f6',
        color: active ? 'white' : '#374151',
        border: `1px solid ${active ? '#6366f1' : '#d1d5db'}`,
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.82rem',
        fontWeight: active ? '700' : '400',
      }}
    >
      {label} <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>(렌더 #{renderCount.current})</span>
    </button>
  );
});

export function SearchWithCallbacks() {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [inputFocus, setInputFocus] = useState(false); // 무관한 state

  const items = ['아이폰', '갤럭시', '픽셀', '샤오미', '원플러스', '소니'];

  // ✅ setSortBy는 안정적 참조 → 의존성 배열에 포함 불필요
  const handleSortByName = useCallback(() => setSortBy('name'), []);
  const handleSortByLength = useCallback(() => setSortBy('length'), []);

  const filtered = items
    .filter(i => i.includes(query))
    .sort((a, b) => sortBy === 'length' ? a.length - b.length : a.localeCompare(b));

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
        검색어를 입력해도 SortButton의 렌더 횟수는 증가하지 않습니다.
      </p>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
          placeholder="검색..."
          style={{
            flex: 1,
            padding: '6px 10px',
            border: `1.5px solid ${inputFocus ? '#6366f1' : '#d1d5db'}`,
            borderRadius: '6px',
            outline: 'none',
          }}
        />
        <SortButton label="이름순" active={sortBy === 'name'} onClick={handleSortByName} />
        <SortButton label="길이순" active={sortBy === 'length'} onClick={handleSortByLength} />
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filtered.map(item => (
          <li key={item} style={{ padding: '5px 10px', background: '#f9fafb', borderRadius: '5px', marginBottom: '3px', fontSize: '0.9rem' }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────
// 전체 데모
// ─────────────────────────────────────────────
export default function UseCallbackDemo() {
  const sectionStyle = {
    marginBottom: '24px',
    padding: '16px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>useCallback 예제</h1>
      <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '0.9rem' }}>
        콘솔(F12)을 열고 버튼을 눌러보세요. 렌더링 횟수 차이를 확인할 수 있습니다.
      </p>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>① 문제 이해 — useCallback 없으면?</h2>
        <CallbackNeedDemo />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>② 의존성 배열 이해</h2>
        <DependencyArrayDemo />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>③ 실전 — 검색 + 정렬 버튼 최적화</h2>
        <SearchWithCallbacks />
      </div>
    </div>
  );
}
