/**
 * 03_useState.jsx — 상태 관리 예제
 * ==================================
 * useState는 컴포넌트 안에서 변하는 값(상태)을 관리하는 훅입니다.
 * 상태가 바뀌면 React가 해당 컴포넌트를 자동으로 다시 렌더링합니다.
 *
 * 이 파일은 학습용 예제입니다.
 * Vite + React 프로젝트에서 각 컴포넌트를 App.jsx에 import하여 확인하세요.
 */

import { useState } from 'react';


// ─────────────────────────────────────────────────────
// 예제 1: 가장 기본적인 카운터
// ─────────────────────────────────────────────────────

/**
 * useState 기본 문법:
 *   const [값, 값을바꾸는함수] = useState(초기값);
 *
 * 규칙:
 * - 훅은 컴포넌트 함수 최상단에서만 호출합니다 (if·for 안에서 호출 금지)
 * - 상태를 바꿀 때는 반드시 setter 함수(setCount 등)를 사용합니다
 */
export function Counter() {
  // count: 현재 상태값 / setCount: 상태를 바꾸는 함수 / 0: 초기값
  const [count, setCount] = useState(0);

  return (
    <div style={{ textAlign: 'center', padding: '24px' }}>
      <h2>카운터</h2>
      <p style={{ fontSize: '3rem', fontWeight: 800, margin: '16px 0' }}>
        {count}
      </p>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button onClick={() => setCount(count - 1)}>− 감소</button>
        <button onClick={() => setCount(0)}>초기화</button>
        <button onClick={() => setCount(count + 1)}>+ 증가</button>
      </div>

      {/* 상태에 따른 메시지 */}
      <p style={{ marginTop: '12px', color: count > 0 ? 'blue' : count < 0 ? 'red' : 'gray' }}>
        {count > 0 ? '양수' : count < 0 ? '음수' : '0'}
      </p>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: 일반 변수 vs useState 비교
// ─────────────────────────────────────────────────────

/**
 * 일반 변수를 바꿔도 화면이 갱신되지 않는 이유:
 * React는 "상태가 바뀌었다"는 신호를 받아야 렌더링을 다시 합니다.
 * 일반 변수는 그 신호를 보내지 못합니다.
 */

// ❌ 일반 변수 — 클릭해도 화면이 바뀌지 않습니다
export function BadCounter() {
  let count = 0; // 일반 변수

  const handleClick = () => {
    count += 1;
    console.log('count:', count); // 콘솔에는 증가하지만 화면은 그대로!
  };

  return (
    <div style={{ padding: '16px', border: '2px solid red', borderRadius: '8px', marginBottom: '12px' }}>
      <p>❌ 일반 변수 (클릭해도 화면 불변): {count}</p>
      <button onClick={handleClick}>클릭</button>
    </div>
  );
}

// ✅ useState — 클릭할 때마다 화면이 갱신됩니다
export function GoodCounter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '16px', border: '2px solid green', borderRadius: '8px' }}>
      <p>✅ useState (클릭하면 화면 갱신): {count}</p>
      <button onClick={() => setCount(count + 1)}>클릭</button>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: 토글 — boolean 상태
// ─────────────────────────────────────────────────────

/**
 * 켜짐/꺼짐, 보임/숨김 같은 두 가지 값을 오가는 패턴입니다.
 */
export function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div style={{ padding: '16px' }}>
      <h2>토글 스위치</h2>

      {/* 현재 상태에 따라 스타일과 텍스트가 바뀝니다 */}
      <div
        onClick={() => setIsOn(prev => !prev)} // prev를 이용해 현재 값 반전
        style={{
          display: 'inline-block',
          width: '52px',
          height: '28px',
          borderRadius: '14px',
          background: isOn ? '#7c3aed' : '#cbd5e1',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.2s',
        }}
      >
        <div style={{
          position: 'absolute',
          top: '3px',
          left: isOn ? '27px' : '3px',
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.2s',
        }} />
      </div>

      <p style={{ marginTop: '12px' }}>
        현재 상태: <strong>{isOn ? '켜짐 ✅' : '꺼짐 ❌'}</strong>
      </p>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 4: 폼 입력 상태 관리 (Controlled Component)
// ─────────────────────────────────────────────────────

/**
 * Controlled Component: input의 value를 React 상태로 관리하는 패턴입니다.
 * input에 입력된 값이 항상 state와 동기화됩니다.
 *
 * 비유: 상태가 input의 "실시간 거울"입니다.
 */
export function LoginForm() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage]   = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // 폼 기본 동작(페이지 새로고침) 방지

    if (!email || !password) {
      setMessage('이메일과 비밀번호를 입력하세요.');
      return;
    }
    setMessage(`로그인 시도: ${email}`);
  };

  return (
    <div style={{ maxWidth: '320px', padding: '24px' }}>
      <h2>로그인</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.88rem' }}>
            이메일
          </label>
          <input
            type="email"
            value={email}                          // ← state가 input의 값을 제어
            onChange={e => setEmail(e.target.value)} // ← 타이핑할 때마다 state 업데이트
            placeholder="example@email.com"
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.88rem' }}>
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <button
          type="submit"
          style={{ width: '100%', padding: '10px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          로그인
        </button>
      </form>

      {/* message 상태가 있을 때만 표시 */}
      {message && (
        <p style={{ marginTop: '12px', color: '#7c3aed', fontSize: '0.88rem' }}>{message}</p>
      )}

      {/* 현재 입력 상태를 실시간으로 보여줍니다 (학습용) */}
      <div style={{ marginTop: '16px', padding: '10px', background: '#f8fafc', borderRadius: '6px', fontSize: '0.8rem', color: '#64748b' }}>
        <p>📋 현재 상태 (실시간)</p>
        <p>email: "{email}"</p>
        <p>password: "{password.replace(/./g, '*')}"</p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 5: 객체 상태 — 불변성 유지
// ─────────────────────────────────────────────────────

/**
 * 상태가 객체일 때 주의사항:
 * 객체를 직접 수정하면 React가 변경을 감지하지 못합니다.
 * spread 연산자로 새 객체를 만들어야 합니다.
 *
 * 이유: React는 이전 상태와 새 상태를 === 로 비교합니다.
 * 같은 객체를 수정하면 참조가 같아서 "바뀐 게 없다"고 판단합니다.
 */
export function ProfileEditor() {
  const [profile, setProfile] = useState({
    name: '홍길동',
    age: 25,
    job: '개발자',
  });

  const handleNameChange = (e) => {
    // ❌ 직접 수정 — 화면 갱신 안 됨
    // profile.name = e.target.value;

    // ✅ spread로 새 객체 생성 — 화면 갱신됨
    setProfile({ ...profile, name: e.target.value });
  };

  const increaseAge = () => {
    // 이전 상태를 기반으로 업데이트할 때는 함수형 업데이트를 권장합니다
    setProfile(prev => ({ ...prev, age: prev.age + 1 }));
  };

  return (
    <div style={{ padding: '16px', maxWidth: '320px' }}>
      <h2>프로필 편집</h2>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '0.88rem' }}>이름</label>
        <input
          value={profile.name}
          onChange={handleNameChange}
          style={{ display: 'block', width: '100%', padding: '6px', marginTop: '4px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '0.88rem' }}>나이: {profile.age}</span>
        <button onClick={increaseAge} style={{ padding: '4px 10px', fontSize: '0.8rem' }}>+1</button>
      </div>

      {/* 현재 상태 확인 */}
      <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.82rem' }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700 }}>현재 profile 상태</p>
        <pre style={{ margin: 0, color: '#475569' }}>{JSON.stringify(profile, null, 2)}</pre>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 6: 배열 상태 — 항목 추가·삭제
// ─────────────────────────────────────────────────────

/**
 * 배열 상태도 객체와 마찬가지로 직접 수정하면 안 됩니다.
 * - 추가: [...기존배열, 새항목]
 * - 삭제: filter()로 새 배열 생성
 * - 수정: map()으로 새 배열 생성
 */
export function TodoList() {
  const [todos, setTodos]   = useState([
    { id: 1, text: 'React 공부하기', done: false },
    { id: 2, text: '예제 실습하기',   done: false },
  ]);
  const [input, setInput] = useState('');

  // 추가: spread로 새 배열
  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), text: input, done: false },
    ]);
    setInput('');
  };

  // 토글: map으로 해당 항목만 done을 반전한 새 배열
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  // 삭제: filter로 해당 항목을 제외한 새 배열
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div style={{ maxWidth: '360px', padding: '16px' }}>
      <h2>할 일 목록 ({todos.filter(t => !t.done).length}개 남음)</h2>

      {/* 입력 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="할 일 입력"
          style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
        />
        <button onClick={addTodo} style={{ padding: '8px 14px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          추가
        </button>
      </div>

      {/* 목록 */}
      {todos.length === 0 ? (
        <p style={{ color: '#94a3b8', textAlign: 'center' }}>할 일이 없습니다!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {todos.map(todo => (
            <li key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <span style={{
                flex: 1,
                textDecoration: todo.done ? 'line-through' : 'none',
                color: todo.done ? '#94a3b8' : 'inherit',
              }}>
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{ padding: '2px 8px', fontSize: '0.75rem', background: 'transparent', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '4px', cursor: 'pointer' }}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
import { Counter, BadCounter, GoodCounter, Toggle, LoginForm, ProfileEditor, TodoList } from './03_useState';

function App() {
  return (
    <div>
      <Counter />
      <BadCounter />
      <GoodCounter />
      <Toggle />
      <LoginForm />
      <ProfileEditor />
      <TodoList />
    </div>
  );
}
*/
