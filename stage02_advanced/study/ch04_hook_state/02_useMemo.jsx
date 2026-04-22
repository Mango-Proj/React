/**
 * 02_useMemo.jsx — useMemo & React.memo
 * ==========================================
 * 불필요한 재연산과 리렌더링을 막는 두 가지 최적화 도구를 살펴봅니다.
 *
 * 1. useMemo       — 계산 결과를 기억해 불필요한 재연산 방지
 * 2. React.memo    — 컴포넌트 자체를 기억해 불필요한 리렌더링 방지
 * 3. 최적화 필요 vs 불필요 비교 데모
 */

import { useState, useMemo, memo } from 'react';

// ─────────────────────────────────────────────
// 헬퍼: "무거운 계산" 시뮬레이션
// ─────────────────────────────────────────────
/**
 * 실제로는 빠르지만, 무거운 계산을 흉내 내기 위해 의도적으로 느리게 만든 함수입니다.
 * 실무에서는 복잡한 필터링, 통계 계산, 정렬 등이 이에 해당합니다.
 */
function heavyCalculation(numbers) {
  console.log('🔥 무거운 계산 실행!');
  // 의도적인 느린 루프
  let result = 0;
  for (let i = 0; i < 100_000; i++) {
    result += i * 0.000001;
  }
  return numbers.reduce((sum, n) => sum + n, 0) + Math.floor(result);
}

// ─────────────────────────────────────────────
// 예제 1: useMemo 없이 (매 렌더링마다 재계산)
// ─────────────────────────────────────────────
/**
 * theme 버튼만 눌러도 heavyCalculation이 다시 실행됩니다.
 * 숫자와 전혀 관계 없는 동작인데도 불필요한 재계산이 발생합니다.
 */
export function WithoutUseMemo() {
  const [numbers] = useState([1, 2, 3, 4, 5, 10, 20]);
  const [theme, setTheme] = useState('light');

  // ❌ 매 렌더링마다 실행됩니다 — theme이 바뀌어도 실행!
  const sum = heavyCalculation(numbers);

  return (
    <div style={{
      padding: '12px',
      background: theme === 'dark' ? '#1e293b' : '#f8fafc',
      color: theme === 'dark' ? 'white' : '#1e293b',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
    }}>
      <p style={{ fontSize: '0.8rem', color: theme === 'dark' ? '#94a3b8' : '#6b7280', marginBottom: '8px' }}>
        ❌ useMemo 없음 — 테마 버튼을 눌러도 콘솔에 "무거운 계산 실행!"이 출력됩니다
      </p>
      <p>합계: <strong>{sum}</strong></p>
      <button
        onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        style={{ marginTop: '8px', padding: '6px 14px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
      >
        테마 전환 ({theme})
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// 예제 2: useMemo 적용 (관련 값이 바뀔 때만 재계산)
// ─────────────────────────────────────────────
/**
 * theme이 바뀌어도 sum은 다시 계산되지 않습니다.
 * numbers 배열이 바뀔 때만 heavyCalculation이 실행됩니다.
 */
export function WithUseMemo() {
  const [numbers, setNumbers] = useState([1, 2, 3, 4, 5, 10, 20]);
  const [theme, setTheme] = useState('light');

  // ✅ numbers가 바뀔 때만 재계산됩니다
  const sum = useMemo(() => heavyCalculation(numbers), [numbers]);

  const addNumber = () => {
    setNumbers(prev => [...prev, Math.floor(Math.random() * 100)]);
  };

  return (
    <div style={{
      padding: '12px',
      background: theme === 'dark' ? '#1e293b' : '#f8fafc',
      color: theme === 'dark' ? 'white' : '#1e293b',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
    }}>
      <p style={{ fontSize: '0.8rem', color: theme === 'dark' ? '#94a3b8' : '#6b7280', marginBottom: '8px' }}>
        ✅ useMemo 적용 — 테마 전환 시 콘솔 출력 없음. 숫자 추가 시에만 재계산.
      </p>
      <p>숫자들: [{numbers.join(', ')}]</p>
      <p>합계: <strong style={{ color: '#6366f1' }}>{sum}</strong></p>
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={addNumber}
          style={{ padding: '6px 14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          숫자 추가 (재계산 O)
        </button>
        <button
          onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
          style={{ padding: '6px 14px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          테마 전환 (재계산 X)
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 예제 3: React.memo — 컴포넌트 메모이제이션
// ─────────────────────────────────────────────

/** 렌더링될 때마다 콘솔에 로그를 출력하는 자식 컴포넌트 */
const CarItem = ({ model, price }) => {
  console.log(`🚗 CarItem 렌더링: ${model}`);
  return (
    <li style={{ padding: '6px 10px', background: '#f3f4f6', borderRadius: '6px', marginBottom: '4px' }}>
      {model} — {price.toLocaleString()}원
    </li>
  );
};

/**
 * React.memo로 감싼 버전.
 * model이나 price props가 바뀌지 않으면 리렌더링되지 않습니다.
 */
const MemoizedCarItem = memo(({ model, price }) => {
  console.log(`✅ MemoizedCarItem 렌더링: ${model}`);
  return (
    <li style={{ padding: '6px 10px', background: '#eef2ff', borderRadius: '6px', marginBottom: '4px', border: '1px solid #c7d2fe' }}>
      {model} — {price.toLocaleString()}원 <span style={{ fontSize: '0.75rem', color: '#6366f1' }}>(메모이제이션)</span>
    </li>
  );
});

/**
 * 부모 컴포넌트의 counter가 바뀔 때:
 * - 일반 CarItem    → 매번 리렌더링됩니다
 * - MemoizedCarItem → props가 그대로라면 리렌더링 안 됩니다
 */
export function ReactMemoDemo() {
  const [counter, setCounter] = useState(0);
  const cars = [
    { id: 1, model: '아반떼', price: 22_000_000 },
    { id: 2, model: '소나타', price: 29_000_000 },
    { id: 3, model: '그랜저', price: 40_000_000 },
  ];

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
        "카운터 증가" 버튼을 누르면 부모가 리렌더링됩니다.<br />
        콘솔에서 어느 컴포넌트가 다시 렌더링되는지 확인하세요.
      </p>
      <p>카운터: <strong>{counter}</strong></p>
      <button
        onClick={() => setCounter(c => c + 1)}
        style={{ marginBottom: '12px', padding: '6px 14px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
      >
        카운터 증가 (+1)
      </button>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '160px' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ef4444', marginBottom: '4px' }}>❌ 일반 컴포넌트</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cars.map(car => <CarItem key={car.id} model={car.model} price={car.price} />)}
          </ul>
        </div>
        <div style={{ flex: 1, minWidth: '160px' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: '700', color: '#6366f1', marginBottom: '4px' }}>✅ React.memo 적용</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cars.map(car => <MemoizedCarItem key={car.id} model={car.model} price={car.price} />)}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 예제 4: useMemo로 파생 데이터 계산
// ─────────────────────────────────────────────
/**
 * 상품 목록을 필터링하고 정렬하는 결과를 useMemo로 계산합니다.
 * 검색어나 정렬 기준이 바뀔 때만 재계산됩니다.
 */
export function ProductFilter() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'price'
  const [highlight, setHighlight] = useState(false); // 무관한 state

  const products = [
    { id: 1, name: '아이폰 15', price: 1_350_000 },
    { id: 2, name: '갤럭시 S24', price: 1_200_000 },
    { id: 3, name: '픽셀 8', price: 890_000 },
    { id: 4, name: '아이폰 SE', price: 680_000 },
    { id: 5, name: '갤럭시 A55', price: 560_000 },
  ];

  // ✅ search 또는 sortBy가 바뀔 때만 필터/정렬을 다시 계산합니다
  // highlight가 바뀌어도 이 계산은 실행되지 않습니다
  const filteredAndSorted = useMemo(() => {
    console.log('📋 필터/정렬 계산 실행');
    return products
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => sortBy === 'price' ? a.price - b.price : a.name.localeCompare(b.name));
  }, [search, sortBy]); // products는 컴포넌트 외부에 있어 안정적이라 생략

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
        "하이라이트" 버튼은 계산과 무관 → 콘솔에 재계산 메시지 없음
      </p>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="검색..."
          style={{ flex: 1, padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '6px', minWidth: '100px' }}
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
        >
          <option value="name">이름순</option>
          <option value="price">가격순</option>
        </select>
        <button
          onClick={() => setHighlight(h => !h)}
          style={{ padding: '6px 12px', background: highlight ? '#fbbf24' : '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          하이라이트 (무관한 state)
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredAndSorted.map(p => (
          <li
            key={p.id}
            style={{
              padding: '8px 12px',
              background: highlight ? '#fef9c3' : '#f9fafb',
              borderRadius: '6px',
              marginBottom: '4px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>{p.name}</span>
            <span style={{ color: '#6366f1', fontWeight: '600' }}>{p.price.toLocaleString()}원</span>
          </li>
        ))}
        {filteredAndSorted.length === 0 && (
          <li style={{ color: '#9ca3af', textAlign: 'center', padding: '16px' }}>검색 결과 없음</li>
        )}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────
// 전체 데모
// ─────────────────────────────────────────────
export default function UseMemoDemo() {
  const sectionStyle = {
    marginBottom: '24px',
    padding: '16px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>useMemo & React.memo 예제</h1>
      <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '0.9rem' }}>
        콘솔(F12)을 열고 각 버튼을 눌러보세요. 언제 재계산/리렌더링이 일어나는지 확인할 수 있습니다.
      </p>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>① useMemo 없음 — 불필요한 재계산</h2>
        <WithoutUseMemo />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>② useMemo 적용 — 필요할 때만 재계산</h2>
        <WithUseMemo />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>③ React.memo — 컴포넌트 리렌더링 최적화</h2>
        <ReactMemoDemo />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>④ useMemo 실전 — 상품 필터/정렬</h2>
        <ProductFilter />
      </div>
    </div>
  );
}
