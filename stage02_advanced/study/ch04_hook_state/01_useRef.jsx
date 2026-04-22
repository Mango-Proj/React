/**
 * 01_useRef.jsx — useRef 완전 정복
 * ====================================
 * useRef의 3가지 핵심 사용 사례를 예제로 살펴봅니다.
 *
 * 1. DOM 요소 직접 접근 (포커스, 스크롤)
 * 2. 리렌더링 없이 이전 값 기억하기
 * 3. 타이머 ID 관리 (cleanup)
 * 4. useState vs useRef 차이 체감하기
 */

import { useState, useRef, useEffect } from 'react';

// ─────────────────────────────────────────────
// 예제 1: DOM 요소 접근 — 자동 포커스
// ─────────────────────────────────────────────
/**
 * 컴포넌트가 화면에 나타나자마자 입력창에 자동으로 포커스를 맞춥니다.
 * document.querySelector 없이 ref만으로 DOM 요소에 접근할 수 있습니다.
 */
export function AutoFocusInput() {
  const inputRef = useRef(null); // 처음엔 null, <input>이 마운트되면 채워짐

  useEffect(() => {
    // 컴포넌트가 처음 렌더링된 뒤 실행됩니다
    inputRef.current.focus(); // 실제 DOM 요소의 focus() 메서드를 직접 호출
  }, []); // 빈 배열 → 마운트 시 한 번만

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '8px' }}>
        ✅ 페이지가 열리면 아래 입력창에 자동 포커스됩니다
      </p>
      <input
        ref={inputRef}  {/* ref 연결 → inputRef.current = 이 input DOM 요소 */}
        type="text"
        placeholder="자동으로 포커스됩니다..."
        style={{ padding: '8px 12px', border: '1.5px solid #6366f1', borderRadius: '6px', width: '100%' }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// 예제 2: 이전 값 기억하기
// ─────────────────────────────────────────────
/**
 * count가 바뀔 때 "이전 값"을 화면에 함께 표시합니다.
 *
 * - count는 useState → 바뀌면 화면이 다시 그려집니다
 * - prevCount는 useRef → 바뀌어도 화면을 다시 그리지 않습니다
 *   대신 useEffect 안에서 렌더링 직후 저장합니다
 */
export function PreviousValueTracker() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef(0); // 이전 count를 저장하는 ref

  useEffect(() => {
    // 렌더링이 완료된 후 "현재 count"를 "이전 값"으로 저장
    prevCountRef.current = count;
  }, [count]);

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p>현재 카운트: <strong style={{ color: '#6366f1' }}>{count}</strong></p>
      <p>이전 카운트: <strong style={{ color: '#9ca3af' }}>{prevCountRef.current}</strong></p>
      <button
        onClick={() => setCount(c => c + 1)}
        style={{ marginTop: '8px', padding: '6px 16px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
      >
        +1
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// 예제 3: 타이머 관리 (ref로 ID 보관)
// ─────────────────────────────────────────────
/**
 * interval 타이머를 시작/정지합니다.
 *
 * timerRef에 interval ID를 저장합니다.
 * - useRef를 쓰는 이유: ID 저장이 화면 업데이트와 무관하기 때문입니다
 * - 만약 useState로 ID를 저장하면 setState 호출 시 불필요한 리렌더링 발생
 */
export function TimerWithRef() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null); // interval ID를 저장할 ref

  const handleStart = () => {
    if (isRunning) return;
    setIsRunning(true);
    // interval ID를 ref에 저장 (setState 없이 저장 → 리렌더링 없음)
    timerRef.current = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
  };

  const handleStop = () => {
    clearInterval(timerRef.current); // ref에서 ID를 꺼내 정리
    timerRef.current = null;
    setIsRunning(false);
  };

  // 컴포넌트가 언마운트될 때 타이머 정리 (메모리 누수 방지)
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6366f1' }}>
        {count}초
      </p>
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button
          onClick={handleStart}
          disabled={isRunning}
          style={{ padding: '6px 16px', background: isRunning ? '#ddd6fe' : '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: isRunning ? 'not-allowed' : 'pointer' }}
        >
          시작
        </button>
        <button
          onClick={handleStop}
          disabled={!isRunning}
          style={{ padding: '6px 16px', background: !isRunning ? '#f3f4f6' : '#ef4444', color: !isRunning ? '#9ca3af' : 'white', border: 'none', borderRadius: '6px', cursor: !isRunning ? 'not-allowed' : 'pointer' }}
        >
          정지
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 예제 4: useState vs useRef 차이 체감
// ─────────────────────────────────────────────
/**
 * 두 카운터를 나란히 보여줍니다.
 * - 왼쪽: useState  → 버튼 클릭마다 화면 업데이트
 * - 오른쪽: useRef  → 버튼 클릭해도 화면은 그대로
 *
 * useRef 카운터의 "실제 값 확인" 버튼을 누르면
 * 그때서야 최신 ref 값이 화면에 반영됩니다.
 */
export function StateVsRef() {
  const [stateCount, setStateCount] = useState(0); // 화면에 즉시 반영
  const refCount = useRef(0);                       // 화면에 반영되지 않음
  const [refDisplay, setRefDisplay] = useState(0);  // ref 값을 강제로 표시할 때 사용

  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      {/* useState 카운터 */}
      <div style={{ flex: 1, minWidth: '140px', padding: '12px', background: '#eef2ff', borderRadius: '8px' }}>
        <p style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: '700', marginBottom: '4px' }}>useState</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stateCount}</p>
        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>클릭 즉시 화면 반영 ✅</p>
        <button
          onClick={() => setStateCount(c => c + 1)}
          style={{ marginTop: '8px', padding: '5px 12px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          +1
        </button>
      </div>

      {/* useRef 카운터 */}
      <div style={{ flex: 1, minWidth: '140px', padding: '12px', background: '#faf5ff', borderRadius: '8px' }}>
        <p style={{ fontSize: '0.8rem', color: '#7c3aed', fontWeight: '700', marginBottom: '4px' }}>useRef</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{refDisplay}</p>
        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>클릭해도 화면 그대로 ❌</p>
        <div style={{ display: 'flex', gap: '4px', marginTop: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => { refCount.current += 1; }} // 화면 업데이트 없음!
            style={{ padding: '5px 10px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            +1
          </button>
          <button
            onClick={() => setRefDisplay(refCount.current)} // 강제로 표시
            style={{ padding: '5px 10px', background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            실제 값 확인
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 전체 데모
// ─────────────────────────────────────────────
export default function UseRefDemo() {
  const sectionStyle = {
    marginBottom: '24px',
    padding: '16px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>useRef 예제</h1>
      <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '0.9rem' }}>
        화면을 바꾸지 않고 값을 기억하거나, DOM 요소에 직접 접근할 때 사용합니다.
      </p>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>① DOM 접근 — 자동 포커스</h2>
        <AutoFocusInput />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>② 이전 값 기억하기</h2>
        <PreviousValueTracker />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>③ 타이머 관리</h2>
        <TimerWithRef />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>④ useState vs useRef 차이</h2>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
          useRef +1은 여러 번 눌러도 화면이 변하지 않습니다. "실제 값 확인"을 눌러야 최신 값이 표시됩니다.
        </p>
        <StateVsRef />
      </div>
    </div>
  );
}
