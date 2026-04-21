/**
 * 05_conditional_rendering.jsx — 조건부 렌더링 예제
 * ====================================================
 * 특정 조건에 따라 다른 UI를 보여주는 세 가지 패턴을 배웁니다.
 * - if 문: 복잡한 분기 처리
 * - 삼항 연산자: 두 가지 중 하나 선택
 * - && 논리 연산자: 조건이 참일 때만 표시
 *
 * 이 파일은 학습용 예제입니다.
 * Vite + React 프로젝트의 App.jsx에서 import하여 확인하세요.
 */

import { useState } from 'react';


// ─────────────────────────────────────────────────────
// 예제 1: if 문 — 로그인/로그아웃 상태 전환
// ─────────────────────────────────────────────────────

/**
 * if 문은 return 앞에서 변수에 JSX를 할당하는 방식으로 사용합니다.
 * 조건이 3개 이상이거나 로직이 복잡할 때 적합합니다.
 */
export function GreetingWithIf() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin  = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  // return 전에 if 문으로 표시할 내용을 결정합니다
  let message;
  if (isLoggedIn) {
    message = <h2 style={{ color: '#16a34a' }}>👋 다시 오신 것을 환영합니다!</h2>;
  } else {
    message = <h2 style={{ color: '#dc2626' }}>🔒 로그인해 주세요.</h2>;
  }

  let button;
  if (isLoggedIn) {
    button = <button onClick={handleLogout} style={dangerBtn}>로그아웃</button>;
  } else {
    button = <button onClick={handleLogin} style={primaryBtn}>로그인</button>;
  }

  return (
    <div style={cardStyle}>
      <h3>if 문 조건부 렌더링</h3>
      {message}   {/* 조건에 따라 할당된 JSX를 렌더링 */}
      {button}    {/* 조건에 따라 할당된 JSX를 렌더링 */}
      <p style={{ marginTop: '8px', fontSize: '0.82rem', color: '#94a3b8' }}>
        isLoggedIn: {String(isLoggedIn)}
      </p>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: 삼항 연산자 — JSX 안에서 바로 분기
// ─────────────────────────────────────────────────────

/**
 * 삼항 연산자: 조건 ? 참일때 : 거짓일때
 * JSX {} 안에서 바로 사용할 수 있어 코드가 간결해집니다.
 * 두 가지 경우만 있을 때(true/false 토글) 가장 적합합니다.
 */
export function GreetingWithTernary() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div style={cardStyle}>
      <h3>삼항 연산자 조건부 렌더링</h3>

      {/* JSX 안에서 삼항 연산자로 바로 분기 */}
      <h2>
        {isLoggedIn ? '다시 오신 것을 환영합니다!' : '로그인해 주세요.'}
      </h2>

      {/* 여러 줄의 JSX도 삼항 연산자로 처리 가능 */}
      {isLoggedIn ? (
        <div style={{ padding: '12px', background: '#dcfce7', borderRadius: '8px' }}>
          <p style={{ margin: 0, color: '#15803d' }}>✅ 로그인 상태입니다.</p>
        </div>
      ) : (
        <div style={{ padding: '12px', background: '#fef9c3', borderRadius: '8px' }}>
          <p style={{ margin: 0, color: '#92400e' }}>⚠️ 비로그인 상태입니다.</p>
        </div>
      )}

      <button
        onClick={() => setIsLoggedIn(p => !p)}
        style={{ ...primaryBtn, marginTop: '12px' }}
      >
        {isLoggedIn ? '로그아웃' : '로그인'}
      </button>

      <p style={{ marginTop: '8px', fontSize: '0.82rem', color: '#94a3b8' }}>
        isLoggedIn: {String(isLoggedIn)}
      </p>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: && 논리 연산자 — 조건이 참일 때만 표시
// ─────────────────────────────────────────────────────

/**
 * {조건 && <JSX />}
 * 조건이 참(true)이면 JSX를 렌더링합니다.
 * 조건이 거짓(false)이면 아무것도 렌더링하지 않습니다.
 *
 * ⚠️ 주의: 조건에 숫자 0을 쓰면 화면에 "0"이 출력됩니다!
 * {items.length && <목록 />}  → items.length가 0이면 "0"이 출력됨!
 * {items.length > 0 && <목록 />} → 올바른 방법
 */
export function NotificationPanel() {
  const [isLoggedIn, setIsLoggedIn]       = useState(false);
  const [hasMessage, setHasMessage]       = useState(false);
  const [messageCount, setMessageCount]   = useState(0);

  return (
    <div style={cardStyle}>
      <h3>&& 논리 연산자 조건부 렌더링</h3>

      {/* 컨트롤 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button onClick={() => setIsLoggedIn(p => !p)} style={isLoggedIn ? dangerBtn : primaryBtn}>
          {isLoggedIn ? '로그아웃' : '로그인'}
        </button>
        <button onClick={() => setHasMessage(p => !p)} style={secondaryBtn}>
          알림 {hasMessage ? 'OFF' : 'ON'}
        </button>
        <button onClick={() => setMessageCount(p => p + 1)} style={secondaryBtn}>
          메시지 +1 ({messageCount})
        </button>
      </div>

      {/* && 사용 */}
      {isLoggedIn && (
        <div style={{ padding: '10px', background: '#ede9fe', borderRadius: '8px', marginBottom: '8px' }}>
          <p style={{ margin: 0, color: '#7c3aed' }}>👤 로그인된 사용자에게만 보이는 메뉴</p>
        </div>
      )}

      {hasMessage && (
        <div style={{ padding: '10px', background: '#fef3c7', borderRadius: '8px', marginBottom: '8px' }}>
          <p style={{ margin: 0, color: '#92400e' }}>🔔 새로운 알림이 있습니다!</p>
        </div>
      )}

      {/* ⚠️ && 함정 비교 */}
      <div style={{ padding: '12px', background: '#fef2f2', borderRadius: '8px', marginTop: '8px' }}>
        <p style={{ fontWeight: 700, color: '#dc2626', margin: '0 0 6px', fontSize: '0.88rem' }}>
          ⚠️ && 함정 (messageCount = {messageCount})
        </p>
        <p style={{ margin: '0 0 4px', fontSize: '0.85rem' }}>
          ❌ messageCount && ...: <strong style={{ color: 'red' }}>{messageCount && '메시지 있음'}</strong>
          {messageCount === 0 && <span style={{ color: '#dc2626' }}> ← "0" 출력됨!</span>}
        </p>
        <p style={{ margin: 0, fontSize: '0.85rem' }}>
          ✅ messageCount &gt; 0 && ...: {messageCount > 0 ? '메시지 있음' : <span style={{ color: '#94a3b8' }}>(아무것도 표시 안 됨)</span>}
        </p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 4: 조건부 컴포넌트 렌더링 — 컴포넌트 전체를 전환
// ─────────────────────────────────────────────────────

/**
 * 로그인 여부에 따라 완전히 다른 컴포넌트를 보여줍니다.
 * 단순 텍스트가 아닌 컴포넌트 전체를 조건부로 교체하는 패턴입니다.
 */

function Dashboard() {
  return (
    <div style={{ padding: '20px', background: '#f0fdf4', borderRadius: '10px', textAlign: 'center' }}>
      <p style={{ fontSize: '2rem', margin: '0 0 8px' }}>🏠</p>
      <h2 style={{ color: '#15803d', margin: '0 0 8px' }}>대시보드</h2>
      <p style={{ color: '#16a34a', margin: 0 }}>로그인 후에만 볼 수 있는 화면입니다.</p>
    </div>
  );
}

function Login() {
  return (
    <div style={{ padding: '20px', background: '#fff7ed', borderRadius: '10px', textAlign: 'center' }}>
      <p style={{ fontSize: '2rem', margin: '0 0 8px' }}>🔐</p>
      <h2 style={{ color: '#c2410c', margin: '0 0 8px' }}>로그인 필요</h2>
      <p style={{ color: '#ea580c', margin: 0 }}>계속하려면 로그인하세요.</p>
    </div>
  );
}

export function AuthApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div style={cardStyle}>
      <h3>조건부 컴포넌트 전환</h3>

      {/* isLoggedIn에 따라 완전히 다른 컴포넌트를 렌더링 */}
      {isLoggedIn ? <Dashboard /> : <Login />}

      <button
        onClick={() => setIsLoggedIn(p => !p)}
        style={{ ...primaryBtn, marginTop: '12px', width: '100%' }}
      >
        {isLoggedIn ? '로그아웃' : '로그인'}
      </button>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 5: 리스트 항목 필터링 — 조건부 렌더링 + 배열 filter()
// ─────────────────────────────────────────────────────

/**
 * state로 필터 조건을 관리하고,
 * filter()로 조건에 맞는 항목만 골라 렌더링합니다.
 */
export function ItemList() {
  const [filter, setFilter] = useState('all');

  const items = [
    { id: 1, name: '사과',    type: 'fruit',     emoji: '🍎' },
    { id: 2, name: '상추',    type: 'vegetable', emoji: '🥬' },
    { id: 3, name: '복숭아',  type: 'fruit',     emoji: '🍑' },
    { id: 4, name: '브로콜리', type: 'vegetable', emoji: '🥦' },
    { id: 5, name: '포도',    type: 'fruit',     emoji: '🍇' },
    { id: 6, name: '당근',    type: 'vegetable', emoji: '🥕' },
  ];

  // filter() 메서드로 조건에 맞는 항목만 추출합니다
  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;    // 전체: 모두 표시
    return item.type === filter;          // 특정 타입만 표시
  });

  return (
    <div style={cardStyle}>
      <h3>리스트 필터링</h3>

      {/* 필터 선택 */}
      <select
        value={filter}
        onChange={e => setFilter(e.target.value)}
        style={{ padding: '8px 12px', borderRadius: '7px', border: '1px solid #cbd5e1', marginBottom: '16px', fontSize: '0.88rem' }}
      >
        <option value="all">전체 ({items.length}개)</option>
        <option value="fruit">과일만 ({items.filter(i => i.type === 'fruit').length}개)</option>
        <option value="vegetable">채소만 ({items.filter(i => i.type === 'vegetable').length}개)</option>
      </select>

      {/* 결과가 없을 때 처리 */}
      {filteredItems.length === 0 ? (
        <p style={{ color: '#94a3b8', textAlign: 'center' }}>해당 항목이 없습니다.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {filteredItems.map(item => (
            <li key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              marginBottom: '4px',
              background: item.type === 'fruit' ? '#fff7ed' : '#f0fdf4',
              borderRadius: '8px',
            }}>
              <span style={{ fontSize: '1.3rem' }}>{item.emoji}</span>
              <span style={{ fontWeight: 600 }}>{item.name}</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: '#94a3b8' }}>
                {item.type}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p style={{ marginTop: '10px', fontSize: '0.82rem', color: '#94a3b8' }}>
        {filteredItems.length}개 표시 중 (전체 {items.length}개)
      </p>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 공통 스타일
// ─────────────────────────────────────────────────────

const cardStyle = {
  padding: '20px 24px',
  border: '1px solid #e2e8f0',
  borderRadius: '14px',
  marginBottom: '16px',
  maxWidth: '480px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};

const primaryBtn = {
  padding: '8px 18px',
  background: '#7c3aed',
  color: '#fff',
  border: 'none',
  borderRadius: '7px',
  cursor: 'pointer',
  fontSize: '0.88rem',
  fontWeight: 600,
};

const secondaryBtn = {
  padding: '8px 18px',
  background: '#e2e8f0',
  color: '#1e293b',
  border: 'none',
  borderRadius: '7px',
  cursor: 'pointer',
  fontSize: '0.88rem',
};

const dangerBtn = {
  padding: '8px 18px',
  background: '#dc2626',
  color: '#fff',
  border: 'none',
  borderRadius: '7px',
  cursor: 'pointer',
  fontSize: '0.88rem',
  fontWeight: 600,
};


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
import { GreetingWithIf, GreetingWithTernary, NotificationPanel, AuthApp, ItemList } from './05_conditional_rendering';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <GreetingWithIf />
      <GreetingWithTernary />
      <NotificationPanel />
      <AuthApp />
      <ItemList />
    </div>
  );
}
*/
