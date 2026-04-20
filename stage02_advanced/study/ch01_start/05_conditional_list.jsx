/**
 * 05_conditional_list.jsx — 조건부·리스트 렌더링 예제
 * ======================================================
 * 조건부 렌더링: 특정 조건에 따라 다른 UI를 표시합니다.
 * 리스트 렌더링: 배열의 각 항목을 컴포넌트로 변환하여 표시합니다.
 *
 * 이 파일은 학습용 예제입니다.
 * Vite + React 프로젝트에서 각 컴포넌트를 App.jsx에 import하여 확인하세요.
 */

import { useState } from 'react';


// ─────────────────────────────────────────────────────
// 예제 1: 조건부 렌더링 — 3가지 패턴
// ─────────────────────────────────────────────────────

/**
 * 패턴 1: if 문 — 반환 자체를 분기할 때 (컴포넌트 전체가 달라질 때)
 * 패턴 2: 삼항 연산자 — JSX 안에서 둘 중 하나를 선택할 때
 * 패턴 3: && 단락 평가 — 조건이 참일 때만 보여줄 때
 */
export function ConditionalPatterns() {
  const [isLoggedIn, setIsLoggedIn]       = useState(false);
  const [isLoading, setIsLoading]         = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [messageCount, setMessageCount]   = useState(0);

  // 패턴 1: if 문 — 로딩 중이면 스피너, 아니면 콘텐츠
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>⏳ 로딩 중…</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', maxWidth: '420px' }}>
      <h2>조건부 렌더링 패턴</h2>

      {/* 컨트롤 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => setIsLoggedIn(p => !p)}>
          {isLoggedIn ? '로그아웃' : '로그인'}
        </button>
        <button onClick={() => setIsLoading(true)}>
          로딩 시뮬레이션
        </button>
        <button onClick={() => setHasNotification(p => !p)}>
          알림 {hasNotification ? '끄기' : '켜기'}
        </button>
        <button onClick={() => setMessageCount(p => p + 1)}>
          메시지 +1 ({messageCount})
        </button>
      </div>

      <hr style={{ margin: '0 0 16px', border: 'none', borderTop: '1px solid #e2e8f0' }} />

      {/* 패턴 2: 삼항 연산자 — 로그인 여부에 따라 다른 UI */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontWeight: 700, marginBottom: '8px' }}>패턴 2: 삼항 연산자</p>
        {isLoggedIn ? (
          <div style={{ background: '#dcfce7', padding: '12px', borderRadius: '8px', color: '#166534' }}>
            ✅ 환영합니다! 로그인 상태입니다.
          </div>
        ) : (
          <div style={{ background: '#fef9c3', padding: '12px', borderRadius: '8px', color: '#92400e' }}>
            🔒 로그인이 필요합니다.
          </div>
        )}
      </div>

      {/* 패턴 3: && 단락 평가 — 조건이 참일 때만 표시 */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontWeight: 700, marginBottom: '8px' }}>패턴 3: && 단락 평가</p>

        {/* isLoggedIn이 true일 때만 표시 */}
        {isLoggedIn && (
          <p style={{ color: '#7c3aed' }}>👤 로그인된 사용자에게만 보이는 메뉴</p>
        )}

        {/* hasNotification이 true일 때만 표시 */}
        {hasNotification && (
          <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '8px', marginTop: '8px' }}>
            🔔 새로운 알림이 있습니다!
          </div>
        )}
      </div>

      {/* &&의 함정 — 0을 조건으로 쓰면 "0"이 화면에 출력됩니다 */}
      <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '8px' }}>
        <p style={{ fontWeight: 700, marginBottom: '8px', color: '#dc2626' }}>⚠️ && 함정 주의</p>

        {/* ❌ messageCount가 0이면 화면에 "0"이 출력됨 */}
        <p>
          ❌ messageCount && 결과: <code>{String(messageCount && <span>메시지 {messageCount}개</span>)}</code>
          {messageCount && <span style={{ color: 'red' }}> → 0일 때 "0" 출력됨!</span>}
        </p>

        {/* ✅ 명시적 boolean 변환으로 해결 */}
        <p>
          ✅ messageCount &gt; 0 && 결과:{' '}
          {messageCount > 0 ? `메시지 ${messageCount}개` : '없음'}
        </p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: 리스트 렌더링 — map과 key
// ─────────────────────────────────────────────────────

/**
 * 리스트 렌더링의 핵심: map()으로 배열 → JSX 배열 변환
 *
 * key가 필요한 이유:
 * React는 리스트가 바뀌었을 때 어떤 항목이 추가·삭제·변경됐는지 효율적으로 파악하기 위해
 * 각 항목을 고유하게 식별하는 key가 필요합니다.
 * key가 없으면 경고가 발생하고, 렌더링 최적화가 제대로 되지 않습니다.
 */

const FRUITS = [
  { id: 1, name: '사과',    emoji: '🍎', color: '#fee2e2' },
  { id: 2, name: '바나나',  emoji: '🍌', color: '#fef9c3' },
  { id: 3, name: '오렌지',  emoji: '🍊', color: '#ffedd5' },
  { id: 4, name: '포도',    emoji: '🍇', color: '#f3e8ff' },
  { id: 5, name: '딸기',    emoji: '🍓', color: '#fce7f3' },
];

export function FruitList() {
  return (
    <div style={{ padding: '16px', maxWidth: '360px' }}>
      <h2>과일 목록</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {FRUITS.map(fruit => (
          // key: 리스트의 각 항목을 구분하는 고유 식별자
          // 반드시 같은 레벨의 형제 요소 중에서 고유해야 합니다
          <li
            key={fruit.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              marginBottom: '6px',
              background: fruit.color,
              borderRadius: '8px',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>{fruit.emoji}</span>
            <span style={{ fontWeight: 600 }}>{fruit.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: key — index vs id 비교
// ─────────────────────────────────────────────────────

/**
 * index를 key로 쓰면 안 되는 경우:
 * 목록에서 항목을 추가·삭제·정렬할 때 index가 바뀌면서
 * React가 잘못된 항목을 재사용합니다.
 * → 항상 변하지 않는 고유 id를 key로 사용하세요.
 */
export function KeyComparison() {
  const [items, setItems] = useState([
    { id: 1, text: '첫 번째' },
    { id: 2, text: '두 번째' },
    { id: 3, text: '세 번째' },
  ]);

  const removeFirst = () => {
    setItems(prev => prev.slice(1)); // 첫 번째 항목 삭제
  };

  const addItem = () => {
    setItems(prev => [
      { id: Date.now(), text: `새 항목 (${prev.length + 1})` },
      ...prev,
    ]);
  };

  return (
    <div style={{ padding: '16px', maxWidth: '480px' }}>
      <h2>key 비교: index vs id</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button onClick={addItem}>맨 앞에 추가</button>
        <button onClick={removeFirst}>첫 번째 삭제</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* ❌ index를 key로 사용 — 항목 추가·삭제 시 문제 발생 */}
        <div>
          <p style={{ fontWeight: 700, color: '#dc2626', marginBottom: '8px' }}>❌ key=index</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {items.map((item, idx) => (
              <li key={idx} style={{ padding: '8px', marginBottom: '4px', background: '#fef2f2', borderRadius: '6px', fontSize: '0.85rem' }}>
                <input defaultValue={item.text} style={{ width: '100%', border: 'none', background: 'transparent' }} />
              </li>
            ))}
          </ul>
          <p style={{ fontSize: '0.75rem', color: '#dc2626' }}>맨 앞에 추가 후 input에 직접 타이핑하면 값이 잘못 유지됩니다</p>
        </div>

        {/* ✅ 고유 id를 key로 사용 — 올바르게 동작 */}
        <div>
          <p style={{ fontWeight: 700, color: '#16a34a', marginBottom: '8px' }}>✅ key=id</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {items.map(item => (
              <li key={item.id} style={{ padding: '8px', marginBottom: '4px', background: '#dcfce7', borderRadius: '6px', fontSize: '0.85rem' }}>
                <input defaultValue={item.text} style={{ width: '100%', border: 'none', background: 'transparent' }} />
              </li>
            ))}
          </ul>
          <p style={{ fontSize: '0.75rem', color: '#16a34a' }}>고유 id로 각 항목이 정확하게 추적됩니다</p>
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 4: 리스트 + 조건부 렌더링 조합
// ─────────────────────────────────────────────────────

/**
 * 실무에서 리스트와 조건부 렌더링을 함께 사용하는 패턴입니다.
 * 예: 검색 필터, 카테고리 탭, 상태별 표시
 */

const PRODUCTS = [
  { id: 1, name: '맥북 프로',     category: '노트북', price: 2_500_000, inStock: true },
  { id: 2, name: '아이패드 에어', category: '태블릿', price: 850_000,  inStock: false },
  { id: 3, name: '갤럭시 탭',     category: '태블릿', price: 690_000,  inStock: true },
  { id: 4, name: 'LG 그램',       category: '노트북', price: 1_800_000, inStock: true },
  { id: 5, name: '아이패드 미니', category: '태블릿', price: 650_000,  inStock: false },
];

export function ProductCatalog() {
  const [filter, setFilter]     = useState('전체');       // 카테고리 필터
  const [showInStock, setShowInStock] = useState(false); // 재고 있는 것만 표시

  const categories = ['전체', '노트북', '태블릿'];

  // 필터 적용
  const filtered = PRODUCTS.filter(p => {
    const categoryMatch = filter === '전체' || p.category === filter;
    const stockMatch    = !showInStock || p.inStock;
    return categoryMatch && stockMatch;
  });

  return (
    <div style={{ padding: '16px', maxWidth: '480px' }}>
      <h2>상품 목록</h2>

      {/* 카테고리 탭 */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '6px 14px',
              background: filter === cat ? '#7c3aed' : '#e2e8f0',
              color: filter === cat ? '#fff' : '#1e293b',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 재고 필터 */}
      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', fontSize: '0.88rem', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={showInStock}
          onChange={e => setShowInStock(e.target.checked)}
        />
        재고 있는 상품만 보기
      </label>

      {/* 결과 없음 처리 */}
      {filtered.length === 0 ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '24px' }}>
          해당하는 상품이 없습니다.
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filtered.map(product => (
            <li
              key={product.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 14px',
                marginBottom: '6px',
                background: '#f8fafc',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                opacity: product.inStock ? 1 : 0.5, // 품절이면 흐리게
              }}
            >
              <div>
                <p style={{ margin: '0 0 2px', fontWeight: 700 }}>{product.name}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{product.category}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#7c3aed' }}>
                  {product.price.toLocaleString('ko-KR')}원
                </p>
                {/* 조건부 렌더링: 재고 여부 배지 */}
                {product.inStock ? (
                  <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '20px' }}>
                    재고 있음
                  </span>
                ) : (
                  <span style={{ fontSize: '0.75rem', background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '20px' }}>
                    품절
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '8px' }}>
        총 {filtered.length}개 표시 중 (전체 {PRODUCTS.length}개)
      </p>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
import { ConditionalPatterns, FruitList, KeyComparison, ProductCatalog } from './05_conditional_list';

function App() {
  return (
    <div>
      <ConditionalPatterns />
      <FruitList />
      <KeyComparison />
      <ProductCatalog />
    </div>
  );
}
*/
