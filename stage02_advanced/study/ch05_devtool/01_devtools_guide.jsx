/**
 * 01_devtools_guide.jsx — React Developer Tools 실습용 예제
 * ============================================================
 * 이 파일의 컴포넌트들은 React DevTools의 주요 기능을 체험하도록 설계되었습니다.
 *
 * 사용법:
 *   1. Chrome에 "React Developer Tools" 확장 설치
 *   2. 이 컴포넌트를 앱에 렌더링
 *   3. F12 → Components / Profiler 탭 열기
 *
 * 실습 포인트:
 *   - Components 탭: 컴포넌트 트리, props/state/hooks 실시간 확인
 *   - Profiler 탭:   렌더링 성능 분석, 불필요한 리렌더링 탐지
 */

import { useState, useEffect, useCallback, memo } from 'react';

// ─────────────────────────────────────────────
// 실습 1: Components 탭 탐색
// ─────────────────────────────────────────────

/**
 * [DevTools 실습]
 * Components 탭에서 이 컴포넌트를 클릭하면:
 *   - 오른쪽 패널에 props (name, score, isActive) 값이 보입니다
 *   - props 값을 직접 수정하면 화면에 즉시 반영됩니다!
 */
const PlayerCard = memo(({ name, score, isActive }) => {
  return (
    <div style={{
      padding: '12px 16px',
      background: isActive ? '#eef2ff' : '#f9fafb',
      border: `2px solid ${isActive ? '#6366f1' : '#e5e7eb'}`,
      borderRadius: '10px',
      marginBottom: '8px',
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontWeight: '700', color: isActive ? '#4f46e5' : '#374151' }}>
            {isActive ? '🎮 ' : ''}{name}
          </span>
          {isActive && (
            <span style={{ marginLeft: '8px', fontSize: '0.75rem', background: '#c7d2fe', color: '#3730a3', padding: '2px 8px', borderRadius: '999px' }}>
              현재 활성
            </span>
          )}
        </div>
        <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#6366f1' }}>{score}점</span>
      </div>
    </div>
  );
});

// DevTools Components 탭에서 이 컴포넌트를 펼치면
// 내부의 PlayerCard들과 각각의 props를 확인할 수 있습니다
function PlayerBoard() {
  const [players, setPlayers] = useState([
    { id: 1, name: '플레이어 A', score: 1200 },
    { id: 2, name: '플레이어 B', score: 850 },
    { id: 3, name: '플레이어 C', score: 2100 },
  ]);
  const [activeId, setActiveId] = useState(1);

  const addScore = (id) => {
    setPlayers(prev =>
      prev.map(p => p.id === id ? { ...p, score: p.score + 100 } : p)
    );
  };

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '10px' }}>
        💡 DevTools Components 탭에서 각 PlayerCard의 props 값을 확인해보세요.
        props를 직접 수정해 화면 변화를 실험할 수도 있습니다.
      </p>
      {players.map(p => (
        <div key={p.id}>
          <PlayerCard name={p.name} score={p.score} isActive={p.id === activeId} />
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
            <button
              onClick={() => setActiveId(p.id)}
              style={{ flex: 1, padding: '5px', background: p.id === activeId ? '#6366f1' : '#f3f4f6', color: p.id === activeId ? 'white' : '#374151', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.82rem' }}
            >
              활성화
            </button>
            <button
              onClick={() => addScore(p.id)}
              style={{ flex: 1, padding: '5px', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.82rem' }}
            >
              +100점
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// 실습 2: 훅(Hooks) 상태 추적
// ─────────────────────────────────────────────

/**
 * [DevTools 실습]
 * Components 탭에서 이 컴포넌트를 선택하면 오른쪽에:
 *   - State 0: count 값
 *   - State 1: message 값
 *   - State 2: history 배열
 *   이렇게 훅 순서대로 상태가 표시됩니다.
 */
function HooksInspector() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('안녕하세요!');
  const [history, setHistory] = useState([]);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    setHistory(prev => [...prev, `${new Date().toLocaleTimeString()} — count: ${newCount}`]);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '10px' }}>
        💡 DevTools에서 이 컴포넌트를 선택하면 count, message, history를 실시간으로 볼 수 있습니다.
      </p>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={handleIncrement}
          style={{ padding: '7px 16px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          카운트: {count}
        </button>
        <input
          value={message}
          onChange={handleMessageChange}
          placeholder="메시지 입력..."
          style={{ flex: 1, padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: '6px', minWidth: '120px' }}
        />
      </div>
      <p style={{ fontSize: '0.9rem', marginBottom: '8px', fontStyle: 'italic', color: '#4f46e5' }}>"{message}"</p>
      {history.length > 0 && (
        <div style={{ maxHeight: '80px', overflowY: 'auto', fontSize: '0.75rem', color: '#9ca3af' }}>
          {history.slice(-5).map((h, i) => <div key={i}>{h}</div>)}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 실습 3: Profiler — 불필요한 리렌더링 탐지
// ─────────────────────────────────────────────

/**
 * [DevTools 실습 - 문제 케이스]
 * Profiler에서 "Start Profiling" → 버튼 클릭 → "Stop Profiling":
 *   UnnecessaryChild가 매번 리렌더링되는 것을 확인할 수 있습니다.
 *   (parent의 count가 바뀌면 아무 관련 없는 자식도 다시 렌더링됨)
 */
function UnnecessaryChild({ label }) {
  // 콘솔에서 렌더링 횟수 확인
  console.log(`❌ UnnecessaryChild "${label}" 렌더링`);
  return (
    <div style={{ padding: '8px 12px', background: '#fee2e2', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid #fca5a5' }}>
      {label} <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>(매번 리렌더링)</span>
    </div>
  );
}

/**
 * [DevTools 실습 - 최적화 케이스]
 * memo로 감싼 컴포넌트는 props가 바뀌지 않으면 Profiler에서
 * "Did not render" 표시가 됩니다.
 */
const OptimizedChild = memo(function OptimizedChild({ label }) {
  console.log(`✅ OptimizedChild "${label}" 렌더링`);
  return (
    <div style={{ padding: '8px 12px', background: '#dcfce7', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid #86efac' }}>
      {label} <span style={{ fontSize: '0.75rem', color: '#16a34a' }}>(props 동일 시 스킵)</span>
    </div>
  );
});

function ProfilerDemo() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '10px' }}>
        💡 Profiler 탭에서 기록 후 버튼을 클릭하면 어느 컴포넌트가 리렌더링되는지 확인할 수 있습니다.
      </p>
      <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => setCount(c => c + 1)}
          style={{ padding: '8px 18px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}
        >
          부모 리렌더링 (count: {count})
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <UnnecessaryChild label="memo 없는 자식" />
        <UnnecessaryChild label="memo 없는 자식 2" />
        <OptimizedChild label="React.memo 자식" />
        <OptimizedChild label="React.memo 자식 2" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 실습 4: useEffect 의존성 추적
// ─────────────────────────────────────────────

/**
 * [DevTools 실습]
 * Components 탭에서 이 컴포넌트를 선택하면
 * Effect 0, Effect 1 처럼 useEffect가 목록으로 보입니다.
 * (의존성 배열도 함께 표시됩니다)
 */
function EffectTracker() {
  const [userId, setUserId] = useState(1);
  const [userData, setUserData] = useState(null);
  const [tick, setTick] = useState(0);

  // 의존성: [userId] — userId가 바뀔 때만 실행
  useEffect(() => {
    setUserData(null);
    const timer = setTimeout(() => {
      setUserData({ id: userId, name: `사용자 ${userId}`, email: `user${userId}@example.com` });
    }, 500);
    return () => clearTimeout(timer);
  }, [userId]);

  // 의존성: [] — 마운트 시 한 번만, 1초마다 틱
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '10px' }}>
        💡 DevTools Hooks 섹션에서 useEffect가 2개 등록된 것과 의존성 배열을 확인하세요.
      </p>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
        <label style={{ fontSize: '0.9rem' }}>User ID:</label>
        {[1, 2, 3].map(id => (
          <button
            key={id}
            onClick={() => setUserId(id)}
            style={{ padding: '5px 12px', background: userId === id ? '#6366f1' : '#f3f4f6', color: userId === id ? 'white' : '#374151', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            {id}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#9ca3af' }}>⏱ {tick}s</span>
      </div>
      {userData ? (
        <div style={{ padding: '10px', background: '#f9fafb', borderRadius: '6px' }}>
          <p style={{ fontWeight: '600' }}>{userData.name}</p>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>{userData.email}</p>
        </div>
      ) : (
        <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>불러오는 중...</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 전체 데모
// ─────────────────────────────────────────────
export default function DevToolsGuide() {
  const sectionStyle = {
    marginBottom: '24px',
    padding: '16px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  };

  return (
    <div style={{ maxWidth: '620px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>React DevTools 실습</h1>
      <div style={{ padding: '10px 14px', background: '#fef9c3', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', color: '#92400e' }}>
        💡 Chrome 확장 "React Developer Tools" 설치 후 F12 → Components / Profiler 탭을 열고 아래 예제들을 조작해보세요.
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '2px' }}>① Components 탭 — Props 실시간 추적</h2>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '10px' }}>
          각 PlayerCard의 name, score, isActive props를 DevTools에서 확인하고 직접 수정해보세요.
        </p>
        <PlayerBoard />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '2px' }}>② Components 탭 — Hooks 상태 추적</h2>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '10px' }}>
          DevTools에서 count, message, history State가 실시간으로 업데이트되는 것을 확인하세요.
        </p>
        <HooksInspector />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '2px' }}>③ Profiler 탭 — 불필요한 리렌더링 탐지</h2>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '10px' }}>
          Profiler에서 "Start Profiling" → 버튼 클릭 → "Stop Profiling" 후 빨간/초록 컴포넌트를 비교하세요.
        </p>
        <ProfilerDemo />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '2px' }}>④ Components 탭 — useEffect 의존성 확인</h2>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '10px' }}>
          DevTools Hooks 섹션에서 등록된 Effect와 의존성 배열을 확인하세요.
        </p>
        <EffectTracker />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '8px' }}>📋 DevTools 주요 단축키</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem' }}>
          {[
            ['F12', '개발자 도구 열기'],
            ['Ctrl+Shift+C', '요소 선택 모드'],
            ['ESC', '콘솔 패널 토글'],
            ['Ctrl+[', '이전 탭으로'],
          ].map(([key, desc]) => (
            <div key={key} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '6px 10px', background: '#f9fafb', borderRadius: '6px' }}>
              <code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{key}</code>
              <span style={{ color: '#6b7280' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
