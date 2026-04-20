/**
 * 04_useEffect.jsx — 사이드 이펙트 예제
 * ========================================
 * useEffect는 렌더링 이후에 실행되어야 하는 작업을 처리하는 훅입니다.
 * API 호출, 타이머 설정, 이벤트 리스너 등록 등이 대표적인 사이드 이펙트입니다.
 *
 * 이 파일은 학습용 예제입니다.
 * Vite + React 프로젝트에서 각 컴포넌트를 App.jsx에 import하여 확인하세요.
 */

import { useState, useEffect } from 'react';


// ─────────────────────────────────────────────────────
// 예제 1: useEffect 기본 — 의존성 배열 3가지 패턴
// ─────────────────────────────────────────────────────

/**
 * useEffect(콜백, 의존성배열)
 *
 * 의존성 배열에 따라 실행 시점이 달라집니다:
 *   [] (빈 배열)   → 마운트(첫 렌더링) 시 1번만 실행
 *   [a, b]        → a 또는 b가 바뀔 때마다 실행
 *   생략           → 매 렌더링마다 실행 (거의 사용하지 않음)
 */
export function EffectPatterns() {
  const [count, setCount]     = useState(0);
  const [name, setName]       = useState('홍길동');
  const [log, setLog]         = useState([]);

  const addLog = (msg) => {
    setLog(prev => [...prev, `[${new Date().toLocaleTimeString('ko-KR')}] ${msg}`]);
  };

  // 패턴 1: 마운트 시 1번만 실행
  useEffect(() => {
    addLog('컴포넌트가 마운트되었습니다 (최초 1회)');
    // 정리 함수: 컴포넌트가 언마운트될 때 실행됩니다
    return () => {
      addLog('컴포넌트가 언마운트됩니다 (정리)');
    };
  }, []); // ← 빈 배열

  // 패턴 2: count가 바뀔 때마다 실행
  useEffect(() => {
    if (count > 0) {
      addLog(`count가 ${count}으로 바뀌었습니다`);
    }
  }, [count]); // ← count를 의존성으로 지정

  // 패턴 3: name이 바뀔 때마다 문서 제목 변경
  useEffect(() => {
    document.title = `안녕, ${name}님!`;
  }, [name]);

  return (
    <div style={{ padding: '16px', maxWidth: '480px' }}>
      <h2>useEffect 패턴</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <button onClick={() => setCount(count + 1)}>count 증가 ({count})</button>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="이름 변경"
          style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
        />
      </div>

      {/* 실행 로그 */}
      <div style={{ background: '#1e293b', color: '#94a3b8', padding: '12px', borderRadius: '8px', fontSize: '0.78rem', maxHeight: '200px', overflowY: 'auto' }}>
        <p style={{ color: '#7c3aed', margin: '0 0 6px', fontSize: '0.8rem' }}>실행 로그</p>
        {log.length === 0 ? (
          <p style={{ margin: 0 }}>아직 없음</p>
        ) : (
          log.map((entry, idx) => <p key={idx} style={{ margin: '2px 0' }}>{entry}</p>)
        )}
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: API 데이터 가져오기 (fetch)
// ─────────────────────────────────────────────────────

/**
 * 가장 흔한 useEffect 사용 패턴입니다.
 * 컴포넌트가 마운트되거나 userId가 바뀔 때 API를 호출합니다.
 *
 * 실제 API: https://jsonplaceholder.typicode.com (테스트용 무료 API)
 */
export function UserFetcher() {
  const [userId, setUserId]   = useState(1);
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    // 비동기 함수를 useEffect 안에서 정의하고 바로 호출합니다
    // (useEffect 콜백 자체를 async로 만들면 안 됩니다)
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        if (!res.ok) throw new Error(`HTTP 오류: ${res.status}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]); // userId가 바뀔 때마다 재실행

  return (
    <div style={{ padding: '16px', maxWidth: '400px' }}>
      <h2>사용자 정보 가져오기</h2>

      {/* userId 선택 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[1, 2, 3, 4, 5].map(id => (
          <button
            key={id}
            onClick={() => setUserId(id)}
            style={{
              padding: '6px 12px',
              background: userId === id ? '#7c3aed' : '#e2e8f0',
              color: userId === id ? '#fff' : '#1e293b',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            사용자 {id}
          </button>
        ))}
      </div>

      {/* 로딩 상태 */}
      {loading && <p style={{ color: '#7c3aed' }}>⏳ 불러오는 중…</p>}

      {/* 에러 상태 */}
      {error && <p style={{ color: '#dc2626' }}>❌ 오류: {error}</p>}

      {/* 데이터 표시 */}
      {!loading && !error && user && (
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
          <p><strong>이름:</strong> {user.name}</p>
          <p><strong>이메일:</strong> {user.email}</p>
          <p><strong>도시:</strong> {user.address?.city}</p>
          <p><strong>회사:</strong> {user.company?.name}</p>
        </div>
      )}
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: 타이머 — setInterval과 Cleanup
// ─────────────────────────────────────────────────────

/**
 * 타이머는 Cleanup 함수가 왜 필요한지 잘 보여주는 예시입니다.
 *
 * Cleanup이 없으면:
 * - 컴포넌트가 화면에서 사라진 후에도 타이머가 계속 실행됩니다
 * - 메모리 누수 + "언마운트된 컴포넌트에 상태 설정" 경고가 발생합니다
 */
export function Stopwatch() {
  const [seconds, setSeconds]   = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // isRunning이 false면 타이머를 실행하지 않습니다
    if (!isRunning) return;

    // setInterval: 1000ms마다 seconds를 1 증가시킵니다
    const id = setInterval(() => {
      setSeconds(prev => prev + 1); // 함수형 업데이트: 최신 prev 값 보장
    }, 1000);

    // Cleanup 함수: 타이머를 정지합니다
    // 이 함수는 isRunning이 바뀌거나 컴포넌트가 사라질 때 호출됩니다
    return () => {
      clearInterval(id);
    };
  }, [isRunning]); // isRunning이 바뀔 때마다 effect를 재실행

  const format = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div style={{ textAlign: 'center', padding: '24px', maxWidth: '240px' }}>
      <h2>스톱워치</h2>
      <p style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'monospace', margin: '16px 0' }}>
        {format(seconds)}
      </p>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button
          onClick={() => setIsRunning(prev => !prev)}
          style={{
            padding: '8px 20px',
            background: isRunning ? '#dc2626' : '#16a34a',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          {isRunning ? '일시정지' : '시작'}
        </button>
        <button
          onClick={() => { setIsRunning(false); setSeconds(0); }}
          style={{ padding: '8px 20px', background: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          초기화
        </button>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 4: window 이벤트 리스너 등록·해제
// ─────────────────────────────────────────────────────

/**
 * window 이벤트 리스너도 Cleanup이 필요합니다.
 * Cleanup 없이 addEventListener만 하면 컴포넌트가 사라져도 리스너가 남아있습니다.
 */
export function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (!isTracking) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    // 이벤트 리스너 등록
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup: 이벤트 리스너 해제
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isTracking]);

  return (
    <div style={{ padding: '16px' }}>
      <h2>마우스 위치 추적</h2>
      <button
        onClick={() => setIsTracking(prev => !prev)}
        style={{
          padding: '8px 16px',
          background: isTracking ? '#dc2626' : '#7c3aed',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '12px',
        }}
      >
        {isTracking ? '추적 중지' : '추적 시작'}
      </button>
      <p style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
        X: {position.x}, Y: {position.y}
      </p>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 5: useEffect 올바른 사용 패턴 정리
// ─────────────────────────────────────────────────────

/**
 * useEffect 안에서 async 함수를 쓰는 올바른 패턴
 *
 * useEffect 콜백을 직접 async로 만들면 안 됩니다.
 * (async 함수는 Promise를 반환하는데, useEffect는 Cleanup 함수 또는 undefined만 기대합니다)
 */
export function AsyncEffectPattern() {
  const [data, setData] = useState(null);

  // ❌ 잘못된 패턴 — useEffect 콜백을 async로 선언
  // useEffect(async () => {
  //   const res = await fetch('/api/data');  // Promise를 반환해 경고 발생
  // }, []);

  // ✅ 올바른 패턴 1 — 내부에 async 함수를 선언하고 즉시 호출
  useEffect(() => {
    const fetchData = async () => {
      const res  = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      const json = await res.json();
      setData(json);
    };

    fetchData(); // 즉시 호출
  }, []);

  // ✅ 올바른 패턴 2 — .then() 체인 사용 (async/await 없이)
  // useEffect(() => {
  //   fetch('/api/data')
  //     .then(res => res.json())
  //     .then(json => setData(json));
  // }, []);

  if (!data) return <p>로딩 중…</p>;

  return (
    <div style={{ padding: '16px', maxWidth: '400px' }}>
      <h2>async useEffect 패턴</h2>
      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
        <p><strong>제목:</strong> {data.title}</p>
        <p><strong>내용:</strong> {data.body?.substring(0, 80)}…</p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
import { EffectPatterns, UserFetcher, Stopwatch, MouseTracker, AsyncEffectPattern } from './04_useEffect';

function App() {
  return (
    <div>
      <EffectPatterns />
      <UserFetcher />
      <Stopwatch />
      <MouseTracker />
      <AsyncEffectPattern />
    </div>
  );
}
*/
