/**
 * 02_state_design.jsx — state 설계 4원칙
 * ==========================================
 * 좋은 React 코드를 작성하기 위한 상태 설계 원칙 4가지를 배웁니다.
 *
 * 원칙 1: 연관된 state 묶기
 * 원칙 2: 불필요한 state 피하기
 * 원칙 3: state 모순 피하기
 * 원칙 4: 불변성 유지하기
 *
 * 이 파일은 학습용 예제입니다.
 * Vite + React 프로젝트에서 App.jsx에 import하여 확인하세요.
 */

import { useState } from 'react';


// ─────────────────────────────────────────────────────
// 원칙 1: 연관된 state 묶기
// ─────────────────────────────────────────────────────

/**
 * x와 y 좌표처럼 항상 함께 변경되는 state는 하나의 객체로 묶습니다.
 * Bad: setX, setY 두 번 호출
 * Good: setPosition 한 번 호출
 */

// ❌ 나쁜 예: x, y를 각각 관리
export function MovingDotBad() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  return (
    <div style={{ padding: '20px' }}>
      <h2>원칙 1 — 나쁜 예 ❌</h2>
      <p style={{ fontSize: '0.88rem', color: '#dc2626', marginBottom: '12px' }}>
        x와 y를 별도 state로 관리 → setX, setY 두 번 호출
      </p>

      <div
        onPointerMove={(e) => {
          setX(e.clientX);  // ← 두 번
          setY(e.clientY);  // ← 호출
        }}
        style={{ position: 'relative', width: '100%', height: '150px', background: '#fef2f2', borderRadius: '10px', cursor: 'crosshair', overflow: 'hidden' }}
      >
        <div style={{
          position: 'absolute',
          background: '#dc2626',
          borderRadius: '50%',
          width: 20, height: 20,
          left: x - 10,
          top: y - 10,
          pointerEvents: 'none',
        }} />
        <p style={{ textAlign: 'center', color: '#dc2626', marginTop: '60px', opacity: 0.5 }}>
          마우스를 움직여 보세요
        </p>
      </div>

      <div style={{ marginTop: '8px', padding: '10px', background: '#fef2f2', borderRadius: '6px', fontSize: '0.8rem', color: '#991b1b' }}>
        <code>const [x, setX] = useState(0);</code><br />
        <code>const [y, setY] = useState(0);</code> ← 중복!
      </div>
    </div>
  );
}

// ✅ 좋은 예: position 객체로 묶기
export function MovingDotGood() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <div style={{ padding: '20px' }}>
      <h2>원칙 1 — 좋은 예 ✅</h2>
      <p style={{ fontSize: '0.88rem', color: '#16a34a', marginBottom: '12px' }}>
        position 객체 하나로 묶어 setPosition 한 번만 호출
      </p>

      <div
        onPointerMove={(e) => {
          setPosition({ x: e.clientX, y: e.clientY }); // ← 한 번에!
        }}
        style={{ position: 'relative', width: '100%', height: '150px', background: '#f0fdf4', borderRadius: '10px', cursor: 'crosshair', overflow: 'hidden' }}
      >
        <div style={{
          position: 'absolute',
          background: '#16a34a',
          borderRadius: '50%',
          width: 20, height: 20,
          left: position.x - 10,
          top: position.y - 10,
          pointerEvents: 'none',
        }} />
        <p style={{ textAlign: 'center', color: '#16a34a', marginTop: '60px', opacity: 0.5 }}>
          마우스를 움직여 보세요
        </p>
      </div>

      <div style={{ marginTop: '8px', padding: '10px', background: '#f0fdf4', borderRadius: '6px', fontSize: '0.8rem', color: '#166534' }}>
        <code>const [position, setPosition] = useState({'{ x: 0, y: 0 }'})</code> ← 하나로!
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 원칙 2: 불필요한 state 피하기
// ─────────────────────────────────────────────────────

/**
 * firstName + lastName으로 fullName을 계산할 수 있다면
 * fullName을 별도 state로 만들 필요가 없습니다.
 */

// ❌ 나쁜 예: fullName을 별도 state로 관리
export function FullNameFormBad() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState(''); // ← 불필요한 state!

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>원칙 2 — 나쁜 예 ❌</h2>
      <p style={{ fontSize: '0.88rem', color: '#dc2626', marginBottom: '12px' }}>
        fullName을 별도 state로 관리 → 항상 3개 상태를 동기화해야 함
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '0.88rem' }}>
          이름:
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value);
              setFullName(e.target.value + ' ' + lastName); // ← 2번 업데이트!
            }}
            style={{ marginLeft: '8px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </label>
        <label style={{ fontSize: '0.88rem' }}>
          성:
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value);
              setFullName(firstName + ' ' + e.target.value); // ← 2번 업데이트!
            }}
            style={{ marginLeft: '8px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </label>
        <p style={{ margin: 0, fontWeight: 700 }}>전체 이름: {fullName}</p>
      </div>

      <div style={{ marginTop: '10px', padding: '10px', background: '#fef2f2', borderRadius: '6px', fontSize: '0.8rem', color: '#991b1b' }}>
        문제: 이벤트 핸들러마다 setFirstName + setFullName 두 개를 호출해야 합니다.
      </div>
    </div>
  );
}

// ✅ 좋은 예: fullName을 렌더링 시 계산
export function FullNameFormGood() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const fullName = `${firstName} ${lastName}`; // ← state 아님! 계산값

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>원칙 2 — 좋은 예 ✅</h2>
      <p style={{ fontSize: '0.88rem', color: '#16a34a', marginBottom: '12px' }}>
        fullName은 계산값으로 처리 → 이벤트 핸들러가 단순해짐
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '0.88rem' }}>
          이름:
          <input
            value={firstName}
            onChange={e => setFirstName(e.target.value)} // ← 1번만!
            style={{ marginLeft: '8px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </label>
        <label style={{ fontSize: '0.88rem' }}>
          성:
          <input
            value={lastName}
            onChange={e => setLastName(e.target.value)} // ← 1번만!
            style={{ marginLeft: '8px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </label>
        <p style={{ margin: 0, fontWeight: 700 }}>전체 이름: {fullName}</p>
      </div>

      <div style={{ marginTop: '10px', padding: '10px', background: '#f0fdf4', borderRadius: '6px', fontSize: '0.8rem', color: '#166534' }}>
        fullName은 state가 아니라 firstName + lastName을 조합한 계산값입니다.
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 원칙 3: state 모순 피하기
// ─────────────────────────────────────────────────────

/**
 * isSending과 isSent가 동시에 true가 되는 논리적 모순을 방지합니다.
 * 하나의 status 변수로 통합하면 이런 버그를 원천 차단할 수 있습니다.
 */

// ❌ 나쁜 예: isSending, isSent 두 개의 boolean state
export function FeedbackFormBad() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false); // ← 모순 가능!

  async function handleSubmit() {
    setIsSending(true);
    // 전송 중에 버그가 발생하면 isSending=true, isSent=true 동시 발생 가능
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSending(false);
    setIsSent(true);
  }

  if (isSent) return (
    <div style={{ padding: '20px' }}>
      <h2>원칙 3 — 나쁜 예 ❌</h2>
      <p style={{ color: '#16a34a' }}>✅ 피드백 감사합니다!</p>
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>원칙 3 — 나쁜 예 ❌</h2>
      <p style={{ fontSize: '0.88rem', color: '#dc2626', marginBottom: '12px' }}>
        isSending + isSent 두 개 boolean → 모순 발생 가능
      </p>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        disabled={isSending}
        placeholder="강의 피드백을 작성해주세요..."
        style={{ width: '100%', height: '80px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', resize: 'none', boxSizing: 'border-box' }}
      />
      <button
        onClick={handleSubmit}
        disabled={isSending || !text}
        style={{ marginTop: '8px', padding: '8px 18px', borderRadius: '6px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer' }}
      >
        {isSending ? '전송 중...' : '전송'}
      </button>

      <div style={{ marginTop: '10px', padding: '10px', background: '#fef2f2', borderRadius: '6px', fontSize: '0.8rem', color: '#991b1b' }}>
        isSending=true이면서 isSent=true인 불가능한 상태가 버그로 발생할 수 있습니다.
      </div>
    </div>
  );
}

// ✅ 좋은 예: status 하나로 통합
export function FeedbackFormGood() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('typing'); // 'typing' | 'sending' | 'sent'

  // status에서 파생된 계산값 (state X)
  const isSending = status === 'sending';
  const isSent = status === 'sent';

  async function handleSubmit() {
    setStatus('sending');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('sent');
  }

  if (isSent) return (
    <div style={{ padding: '20px' }}>
      <h2>원칙 3 — 좋은 예 ✅</h2>
      <p style={{ color: '#16a34a', fontWeight: 700 }}>✅ 피드백 감사합니다! 😊</p>
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>원칙 3 — 좋은 예 ✅</h2>
      <p style={{ fontSize: '0.88rem', color: '#16a34a', marginBottom: '12px' }}>
        status 하나로 통합 → 'typing' | 'sending' | 'sent' 세 값만 가능
      </p>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        disabled={isSending}
        placeholder="강의 피드백을 작성해주세요..."
        style={{ width: '100%', height: '80px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', resize: 'none', boxSizing: 'border-box' }}
      />
      <button
        onClick={handleSubmit}
        disabled={isSending || !text}
        style={{ marginTop: '8px', padding: '8px 18px', borderRadius: '6px', border: 'none', background: '#16a34a', color: 'white', cursor: 'pointer' }}
      >
        {isSending ? '전송 중...' : '전송'}
      </button>

      <div style={{ marginTop: '10px', padding: '10px', background: '#f0fdf4', borderRadius: '6px', fontSize: '0.8rem', color: '#166534' }}>
        현재 상태: <strong>{status}</strong> — 세 값 중 하나만 가능해 모순이 없습니다.
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 원칙 4: 불변성 유지하기
// ─────────────────────────────────────────────────────

/**
 * React는 state 참조 주소를 비교해 변경 여부를 판단합니다.
 * 객체를 직접 수정하면 주소가 같아 React가 감지 못합니다.
 * 반드시 새 객체/배열을 만들어 setState에 전달해야 합니다.
 */

export function ImmutabilityDemo() {
  const [count, setCount] = useState(0);
  const [brokenCount, setBrokenCount] = useState({ value: 0 }); // 직접 수정 시도용
  const [brokenLog, setBrokenLog] = useState([]);

  // ✅ 올바른 방법: 새 값을 setState에 전달
  const handleCorrect = () => {
    setCount(count + 1);
  };

  // ❌ 잘못된 방법: 객체를 직접 수정
  const handleBroken = () => {
    brokenCount.value = brokenCount.value + 1; // 원본 직접 수정!
    setBrokenLog(prev => [...prev, `시도 ${prev.length + 1}: value=${brokenCount.value}`]);
    // setBrokenCount(brokenCount) 를 호출해도 참조 주소가 같아 리렌더링 안 됨
    // 아래처럼 강제로 같은 참조 전달해봐도 React는 변경을 감지 못함
    setBrokenCount(brokenCount); // 같은 참조 → 리렌더링 없음
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>원칙 4 — 불변성 유지하기</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {/* 올바른 방법 */}
        <div style={{ padding: '14px', background: '#f0fdf4', borderRadius: '10px' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#15803d', fontSize: '0.88rem' }}>
            ✅ 올바른 방법
          </p>
          <p style={{ margin: '0 0 8px', fontSize: '1.3rem', fontWeight: 700, textAlign: 'center' }}>
            {count}
          </p>
          <button
            onClick={handleCorrect}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', background: '#16a34a', color: 'white', cursor: 'pointer' }}
          >
            +1 (새 값 전달)
          </button>
          <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: '#166534' }}>
            setCount(count + 1)<br />→ 새 숫자 전달 → 리렌더링 ✅
          </p>
        </div>

        {/* 잘못된 방법 */}
        <div style={{ padding: '14px', background: '#fef2f2', borderRadius: '10px' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#dc2626', fontSize: '0.88rem' }}>
            ❌ 잘못된 방법
          </p>
          <p style={{ margin: '0 0 8px', fontSize: '1.3rem', fontWeight: 700, textAlign: 'center' }}>
            {brokenCount.value} <span style={{ fontSize: '0.7rem', color: '#dc2626' }}>(화면 안 바뀜)</span>
          </p>
          <button
            onClick={handleBroken}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer' }}
          >
            +1 (직접 수정)
          </button>
          <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: '#991b1b' }}>
            obj.value++ 직접 수정<br />→ 주소 같음 → 리렌더링 ❌
          </p>
        </div>
      </div>

      {brokenLog.length > 0 && (
        <div style={{ padding: '10px', background: '#fef2f2', borderRadius: '8px', fontSize: '0.8rem', color: '#991b1b' }}>
          <p style={{ margin: '0 0 4px', fontWeight: 700 }}>직접 수정 시도 기록 (메모리엔 바뀌지만 화면은 안 바뀜)</p>
          {brokenLog.map((log, i) => <p key={i} style={{ margin: '2px 0' }}>{log}</p>)}
        </div>
      )}
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
import {
  MovingDotBad, MovingDotGood,
  FullNameFormBad, FullNameFormGood,
  FeedbackFormBad, FeedbackFormGood,
  ImmutabilityDemo
} from './02_state_design';

function App() {
  return (
    <div>
      <MovingDotBad />
      <MovingDotGood />
      <FullNameFormBad />
      <FullNameFormGood />
      <FeedbackFormBad />
      <FeedbackFormGood />
      <ImmutabilityDemo />
    </div>
  );
}
*/
