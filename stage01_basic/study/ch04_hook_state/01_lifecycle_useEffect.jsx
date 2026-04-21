/**
 * 01_lifecycle_useEffect.jsx — 컴포넌트 생명 주기와 useEffect
 * =============================================================
 * 컴포넌트는 마운트(등장) → 업데이트 → 언마운트(사라짐) 과정을 거칩니다.
 * useEffect는 이 각 단계에서 실행할 작업을 등록하는 훅입니다.
 *
 * 이 파일은 학습용 예제입니다.
 * Vite + React 프로젝트에서 App.jsx에 import하여 확인하세요.
 */

import { useState, useEffect } from 'react';


// ─────────────────────────────────────────────────────
// 예제 1: 컴포넌트 생명 주기 시각화
// ─────────────────────────────────────────────────────

/**
 * 마운트, 업데이트, 언마운트 시 콘솔에 메시지를 출력해
 * 생명 주기가 언제 발생하는지 직접 확인합니다.
 * 브라우저 개발자 도구(F12) 콘솔을 열고 확인하세요.
 */
function LifecycleChild({ count }) {
  useEffect(() => {
    // 마운트 & 업데이트 시 실행
    console.log(`[설정] count = ${count} 로 화면이 그려졌습니다.`);

    return () => {
      // 언마운트 & 다음 업데이트 직전 실행 (이전 값 기반)
      console.log(`[정리] count = ${count} 시절의 효과를 정리합니다.`);
    };
  }, [count]); // count가 바뀔 때마다 재실행

  return (
    <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '8px', marginTop: '8px' }}>
      <p style={{ margin: 0 }}>자식 컴포넌트 — count: <strong>{count}</strong></p>
      <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
        콘솔(F12)을 확인하세요
      </p>
    </div>
  );
}

export function LifecycleDemo() {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(true);

  return (
    <div style={{ padding: '20px', maxWidth: '480px' }}>
      <h2>생명 주기 시각화</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button
          onClick={() => setCount(c => c + 1)}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          카운트 증가 (업데이트)
        </button>
        <button
          onClick={() => setShow(s => !s)}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          {show ? '컴포넌트 제거 (언마운트)' : '컴포넌트 추가 (마운트)'}
        </button>
      </div>

      {show && <LifecycleChild count={count} />}

      <div style={{ marginTop: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.82rem', color: '#475569' }}>
        <p style={{ margin: '0 0 6px', fontWeight: 700 }}>콘솔에서 확인할 메시지</p>
        <ul style={{ margin: 0, paddingLeft: '16px', lineHeight: 1.8 }}>
          <li><strong>마운트</strong>: "[설정] count = 0 로 화면이 그려졌습니다."</li>
          <li><strong>업데이트</strong>: [정리] 이전 값 → [설정] 새 값 순서로 출력</li>
          <li><strong>언마운트</strong>: "[정리] count = X 시절의 효과를 정리합니다."</li>
        </ul>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: 마운트 시 데이터 불러오기 (빈 의존성 배열)
// ─────────────────────────────────────────────────────

/**
 * useEffect + 빈 배열 [] → 마운트 시 1번만 실행
 * 컴포넌트가 처음 나타날 때 API 데이터를 불러오는 가장 흔한 패턴입니다.
 */
export function DataLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log('데이터를 불러오기 시작합니다...');

    // 실제 API 호출 대신 2초 후 데이터가 도착했다고 시뮬레이션
    const timerId = setTimeout(() => {
      setData({ message: '사용자 정보 로드 완료!' });
      setIsLoading(false);
      console.log('데이터 로드 완료!');
    }, 2000);

    // 정리 함수: 컴포넌트가 사라지면 타이머도 정리
    return () => clearTimeout(timerId);
  }, []); // 빈 배열 → 마운트 시 1번만

  return (
    <div style={{ padding: '20px', maxWidth: '480px' }}>
      <h2>마운트 시 데이터 불러오기</h2>

      <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', textAlign: 'center' }}>
        {isLoading ? (
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '1.1rem' }}>⏳ 로딩 중...</p>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#6b7280' }}>2초 후 데이터가 표시됩니다</p>
          </div>
        ) : (
          <div>
            <p style={{ margin: '0 0 4px', fontSize: '1.1rem', color: '#16a34a' }}>✅ {data.message}</p>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#6b7280' }}>useEffect의 빈 배열 덕분에 딱 한 번만 실행됐습니다</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '12px', padding: '12px', background: '#eff6ff', borderRadius: '8px', fontSize: '0.82rem', color: '#1e40af' }}>
        <strong>패턴</strong>: useEffect(() =&gt; {'{ ... }'}, []) — 마운트 시 1번
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: 조건부 데이터 불러오기 (의존성 배열에 값 포함)
// ─────────────────────────────────────────────────────

/**
 * isLoggedIn 값이 바뀔 때마다 useEffect가 재실행됩니다.
 * 로그인 상태에 따라 다른 동작을 수행하는 패턴입니다.
 */
function UserInfo({ isLoggedIn }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      // 로그인 상태 → 사용자 정보 불러오기 시뮬레이션
      const timerId = setTimeout(() => {
        setUser({
          username: 'JohnDoe',
          watchedVideos: [
            { id: 101, title: 'React 기초 강의' },
            { id: 102, title: 'useState 완전 정복' },
          ],
        });
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
      // 로그아웃 → 사용자 정보 초기화
      setUser(null);
    }
  }, [isLoggedIn]); // isLoggedIn이 바뀔 때마다 재실행

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '16px', background: '#fef2f2', borderRadius: '8px', color: '#dc2626' }}>
        🔒 로그인해 주세요.
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', color: '#6b7280' }}>
        ⏳ 사용자 정보 불러오는 중...
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '8px' }}>
      <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#15803d' }}>
        👋 {user.username}님 환영합니다!
      </p>
      <p style={{ margin: '0 0 4px', fontSize: '0.88rem', color: '#374151' }}>시청한 영상:</p>
      <ul style={{ margin: 0, paddingLeft: '16px' }}>
        {user.watchedVideos.map(video => (
          <li key={video.id} style={{ fontSize: '0.88rem', color: '#374151' }}>{video.title}</li>
        ))}
      </ul>
    </div>
  );
}

export function ConditionalFetchDemo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div style={{ padding: '20px', maxWidth: '480px' }}>
      <h2>조건부 데이터 불러오기</h2>

      <button
        onClick={() => setIsLoggedIn(v => !v)}
        style={{
          padding: '10px 20px',
          marginBottom: '12px',
          borderRadius: '6px',
          border: 'none',
          background: isLoggedIn ? '#dc2626' : '#2563eb',
          color: 'white',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        {isLoggedIn ? '로그아웃' : '로그인'}
      </button>

      <UserInfo isLoggedIn={isLoggedIn} />

      <div style={{ marginTop: '12px', padding: '12px', background: '#eff6ff', borderRadius: '8px', fontSize: '0.82rem', color: '#1e40af' }}>
        <strong>패턴</strong>: useEffect(() =&gt; {'{ ... }'}, [isLoggedIn]) — 값이 바뀔 때마다
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 4: 이벤트 리스너 등록 + 정리 함수 (마우스 포인터)
// ─────────────────────────────────────────────────────

/**
 * 정리 함수(cleanup function)의 중요성을 보여주는 예제입니다.
 * 이벤트 리스너는 반드시 정리 함수에서 해제해야 메모리 누수가 없습니다.
 */
export function MousePointer() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return; // 비활성 상태면 등록하지 않음

    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }

    window.addEventListener('pointermove', handleMove); // 이벤트 등록
    console.log('포인터 이벤트 리스너 등록됨');

    return () => {
      window.removeEventListener('pointermove', handleMove); // 이벤트 해제
      console.log('포인터 이벤트 리스너 해제됨 (메모리 누수 방지)');
    };
  }, [isActive]); // isActive가 바뀔 때마다 재실행

  return (
    <div style={{ padding: '20px', maxWidth: '480px' }}>
      <h2>마우스 위치 추적</h2>

      <button
        onClick={() => setIsActive(v => !v)}
        style={{
          padding: '8px 18px',
          borderRadius: '6px',
          border: 'none',
          background: isActive ? '#dc2626' : '#7c3aed',
          color: 'white',
          fontWeight: 700,
          cursor: 'pointer',
          marginBottom: '12px',
        }}
      >
        {isActive ? '추적 중지' : '추적 시작'}
      </button>

      <div style={{
        padding: '16px',
        background: isActive ? '#f5f3ff' : '#f8fafc',
        borderRadius: '10px',
        border: `1px solid ${isActive ? '#c4b5fd' : '#e2e8f0'}`,
        fontFamily: 'monospace',
        fontSize: '0.95rem',
      }}>
        {isActive ? (
          <>
            <p style={{ margin: '0 0 4px', color: '#7c3aed', fontWeight: 700 }}>🖱 추적 중...</p>
            <p style={{ margin: 0 }}>X: {position.x}px / Y: {position.y}px</p>
          </>
        ) : (
          <p style={{ margin: 0, color: '#9ca3af' }}>추적 시작 버튼을 클릭하세요</p>
        )}
      </div>

      <div style={{ marginTop: '12px', padding: '12px', background: '#fef9c3', borderRadius: '8px', fontSize: '0.82rem', color: '#713f12' }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700 }}>⚠️ 정리 함수가 없으면?</p>
        <p style={{ margin: 0 }}>
          추적을 중지해도 이벤트 리스너가 계속 동작합니다.
          컴포넌트가 사라져도 메모리에 남아 <strong>메모리 누수</strong>가 발생합니다.
        </p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
import { LifecycleDemo, DataLoader, ConditionalFetchDemo, MousePointer } from './01_lifecycle_useEffect';

function App() {
  return (
    <div>
      <LifecycleDemo />
      <DataLoader />
      <ConditionalFetchDemo />
      <MousePointer />
    </div>
  );
}
*/
