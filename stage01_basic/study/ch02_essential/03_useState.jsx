/**
 * 03_useState.jsx — 상태 관리 예제
 * ==================================
 * 일반 변수와 state의 차이를 이해하고,
 * useState를 사용해 화면을 업데이트하는 방법을 배웁니다.
 *
 * 이 파일은 학습용 예제입니다.
 * Vite + React 프로젝트의 App.jsx에서 import하여 확인하세요.
 */

import { useState } from 'react';


// ─────────────────────────────────────────────────────
// 예제 1: 일반 변수 vs state — 왜 useState가 필요한가?
// ─────────────────────────────────────────────────────

/**
 * 일반 변수는 값이 바뀌어도 React가 감지하지 못해 화면이 갱신되지 않습니다.
 * useState를 써야만 값이 바뀔 때 화면이 자동으로 다시 그려집니다.
 */

// ❌ 일반 변수 — 클릭해도 화면의 숫자는 항상 0입니다
export function BadCounter() {
  let count = 0; // 일반 변수

  const increment = () => {
    count += 1;
    console.log('콘솔의 count:', count); // 콘솔엔 증가하지만 화면은 0 유지
  };

  return (
    <div style={{ padding: '16px', border: '2px dashed #fca5a5', borderRadius: '10px', marginBottom: '12px', maxWidth: '300px' }}>
      <p style={{ color: '#dc2626', fontWeight: 700, margin: '0 0 8px' }}>❌ 일반 변수 (작동 안 함)</p>
      <p style={{ margin: '0 0 8px' }}>Count: {count}</p>
      <button
        onClick={increment}
        style={{ padding: '6px 14px', background: '#fca5a5', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
      >
        클릭 (화면 변화 없음)
      </button>
      <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
        콘솔(F12)을 열어 클릭하면 콘솔엔 증가하지만 화면은 0 그대로
      </p>
    </div>
  );
}

// ✅ useState — 클릭할 때마다 화면이 갱신됩니다
export function GoodCounter() {
  const [count, setCount] = useState(0); // state 선언

  const increment = () => {
    setCount(count + 1); // setCount를 호출해야 화면이 갱신됨
  };

  return (
    <div style={{ padding: '16px', border: '2px solid #86efac', borderRadius: '10px', maxWidth: '300px' }}>
      <p style={{ color: '#16a34a', fontWeight: 700, margin: '0 0 8px' }}>✅ useState (정상 작동)</p>
      <p style={{ margin: '0 0 8px' }}>Count: {count}</p>
      <button
        onClick={increment}
        style={{ padding: '6px 14px', background: '#86efac', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
      >
        클릭 (화면이 바뀜)
      </button>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: 기본 카운터 — setState 인라인 vs 함수 분리
// ─────────────────────────────────────────────────────

/**
 * 이벤트 핸들러 함수를 JSX 안에 인라인으로 쓸 수도 있고,
 * 별도 함수로 분리해 관리할 수도 있습니다.
 * 로직이 복잡해지면 함수로 분리하는 것이 더 읽기 쉽습니다.
 */

// 방법 1: 인라인 (짧고 단순한 경우 적합)
export function CounterInline() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '16px', maxWidth: '300px' }}>
      <h3>인라인 방식</h3>
      <h2>Count: {count}</h2>
      {/* onClick 안에 직접 setCount를 씁니다 */}
      <button onClick={() => setCount(count + 1)} style={btnStyle('#7c3aed')}>+1</button>
      <button onClick={() => setCount(count - 1)} style={btnStyle('#dc2626')}>-1</button>
    </div>
  );
}

// 방법 2: 함수 분리 (로직이 복잡할 때 권장)
export function CounterSeparated() {
  const [count, setCount] = useState(0);

  // 핸들러 함수를 별도로 선언합니다
  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <div style={{ padding: '16px', maxWidth: '300px' }}>
      <h3>함수 분리 방식</h3>
      <h2>Count: {count}</h2>
      {/* 미리 선언한 함수 이름만 전달합니다 */}
      <button onClick={increment} style={btnStyle('#7c3aed')}>+1</button>
      <button onClick={decrement} style={btnStyle('#dc2626')}>-1</button>
      <button onClick={reset}     style={btnStyle('#94a3b8')}>초기화</button>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: state 변수 여러 개 사용하기
// ─────────────────────────────────────────────────────

/**
 * 한 컴포넌트에서 useState를 여러 번 호출해 여러 상태를 관리할 수 있습니다.
 * 어느 하나의 state가 바뀌면 컴포넌트가 다시 렌더링됩니다.
 */
export function StepCounter() {
  const [count, setCount] = useState(0);  // 현재 카운트
  const [step, setStep]   = useState(1);  // 증가/감소 단위

  const increment = () => setCount(count + step);
  const decrement = () => setCount(count - step);

  const updateStep = (e) => {
    const newStep = Number(e.target.value);
    if (newStep > 0) setStep(newStep); // 양수만 허용
  };

  return (
    <div style={{ padding: '16px', maxWidth: '320px' }}>
      <h3>Step 카운터</h3>
      <h2>Count: {count}</h2>
      <p style={{ margin: '0 0 12px', color: '#64748b', fontSize: '0.88rem' }}>
        Step: {step} (한 번에 {step}씩 변경)
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button onClick={increment} style={btnStyle('#7c3aed')}>+{step}</button>
        <button onClick={decrement} style={btnStyle('#dc2626')}>-{step}</button>
        <button onClick={() => setCount(0)} style={btnStyle('#94a3b8')}>초기화</button>
      </div>

      <label style={{ fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        Step 변경:
        <input
          type="number"
          defaultValue={step}
          min="1"
          onChange={updateStep}
          style={{ width: '60px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
        />
      </label>

      {/* 두 state 값을 모두 화면에 표시 */}
      <div style={{ marginTop: '12px', padding: '10px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.82rem' }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700 }}>현재 state 값</p>
        <p style={{ margin: '0 0 2px' }}>count: {count}</p>
        <p style={{ margin: 0 }}>step: {step}</p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 4: 다양한 타입의 state
// ─────────────────────────────────────────────────────

/**
 * state의 초기값으로 숫자, 문자열, 불리언, 배열, 객체 모두 사용할 수 있습니다.
 */
export function StateTypesDemo() {
  const [count, setCount]     = useState(0);         // 숫자
  const [name, setName]       = useState('');        // 문자열
  const [isOn, setIsOn]       = useState(false);     // 불리언
  const [items, setItems]     = useState(['사과', '바나나']); // 배열
  const [user, setUser]       = useState({ age: 20 }); // 객체

  return (
    <div style={{ padding: '16px', maxWidth: '400px' }}>
      <h3>다양한 state 타입</h3>

      {/* 숫자 state */}
      <div style={sectionStyle}>
        <p style={{ margin: '0 0 6px', fontSize: '0.85rem', color: '#64748b' }}>숫자 state</p>
        <p>count: {count}</p>
        <button onClick={() => setCount(c => c + 1)} style={btnStyle('#7c3aed')}>+1</button>
      </div>

      {/* 문자열 state */}
      <div style={sectionStyle}>
        <p style={{ margin: '0 0 6px', fontSize: '0.85rem', color: '#64748b' }}>문자열 state</p>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="이름 입력"
          style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', marginRight: '8px' }}
        />
        <span>안녕하세요, {name || '???'}님!</span>
      </div>

      {/* 불리언 state */}
      <div style={sectionStyle}>
        <p style={{ margin: '0 0 6px', fontSize: '0.85rem', color: '#64748b' }}>불리언 state</p>
        <button onClick={() => setIsOn(p => !p)} style={btnStyle(isOn ? '#16a34a' : '#94a3b8')}>
          {isOn ? '✅ 켜짐' : '❌ 꺼짐'}
        </button>
      </div>

      {/* 배열 state — 불변성: push() 대신 spread로 새 배열 생성 */}
      <div style={sectionStyle}>
        <p style={{ margin: '0 0 6px', fontSize: '0.85rem', color: '#64748b' }}>배열 state</p>
        <p>{items.join(', ')}</p>
        <button
          onClick={() => setItems([...items, '딸기'])} // spread로 새 배열 생성
          style={btnStyle('#7c3aed')}
        >
          딸기 추가
        </button>
      </div>

      {/* 객체 state — 불변성: 직접 수정 대신 spread로 새 객체 생성 */}
      <div style={sectionStyle}>
        <p style={{ margin: '0 0 6px', fontSize: '0.85rem', color: '#64748b' }}>객체 state</p>
        <p>나이: {user.age}</p>
        <button
          onClick={() => setUser({ ...user, age: user.age + 1 })} // spread로 새 객체 생성
          style={btnStyle('#7c3aed')}
        >
          나이 +1
        </button>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 공통 스타일 헬퍼
// ─────────────────────────────────────────────────────

function btnStyle(bg) {
  return {
    padding: '6px 14px',
    background: bg,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '6px',
    fontSize: '0.85rem',
  };
}

const sectionStyle = {
  marginBottom: '12px',
  padding: '12px',
  background: '#f8fafc',
  borderRadius: '8px',
};


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
import { BadCounter, GoodCounter, CounterInline, CounterSeparated, StepCounter, StateTypesDemo } from './03_useState';

function App() {
  return (
    <div>
      <BadCounter />
      <GoodCounter />
      <CounterInline />
      <CounterSeparated />
      <StepCounter />
      <StateTypesDemo />
    </div>
  );
}
*/
