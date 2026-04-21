/**
 * 03_object_array_state.jsx — 객체·배열 state 업데이트
 * ======================================================
 * 불변성을 유지하면서 객체와 배열 state를 올바르게 업데이트하는 방법입니다.
 * 핵심: 원본을 수정하지 않고 스프레드 연산자(...)로 새 복사본을 만들어야 합니다.
 *
 * 이 파일은 학습용 예제입니다.
 * Vite + React 프로젝트에서 App.jsx에 import하여 확인하세요.
 *
 * ⚠️ uuid 예제는 npm install uuid 후 주석 해제하여 사용하세요.
 * 이 파일에서는 uuid 없이 Date.now() + Math.random()으로 대체합니다.
 */

import { useState } from 'react';

// 간단한 고유 ID 생성 함수 (uuid 설치 없이 사용)
const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;


// ─────────────────────────────────────────────────────
// 예제 1: 객체 state 업데이트
// ─────────────────────────────────────────────────────

/**
 * { ...user, name: '새이름' }
 * 기존 user 객체를 펼쳐 복사하고, name 값만 덮어씁니다.
 * 나머지 속성(age, location)은 그대로 유지됩니다.
 */
export function ObjectStateUpdate() {
  const [user, setUser] = useState({
    name: 'John',
    age: 30,
    location: 'New York',
  });

  const updateName = () => {
    // ✅ 스프레드로 복사 후 name만 변경
    setUser({ ...user, name: 'Jane' });
  };

  const updateLocation = () => {
    setUser({ ...user, location: 'Seoul' });
  };

  const reset = () => {
    setUser({ name: 'John', age: 30, location: 'New York' });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '420px' }}>
      <h2>객체 state 업데이트</h2>

      <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', marginBottom: '12px' }}>
        <p style={{ margin: '0 0 4px' }}>이름: <strong>{user.name}</strong></p>
        <p style={{ margin: '0 0 4px' }}>나이: <strong>{user.age}</strong></p>
        <p style={{ margin: 0 }}>위치: <strong>{user.location}</strong></p>
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button onClick={updateName} style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer' }}>
          이름 변경
        </button>
        <button onClick={updateLocation} style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', background: '#7c3aed', color: 'white', cursor: 'pointer' }}>
          위치 변경
        </button>
        <button onClick={reset} style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', background: '#6b7280', color: 'white', cursor: 'pointer' }}>
          초기화
        </button>
      </div>

      <div style={{ marginTop: '12px', padding: '10px', background: '#eff6ff', borderRadius: '8px', fontSize: '0.8rem', color: '#1e40af' }}>
        <code>{'setUser({ ...user, name: \'Jane\' })'}</code>
        <p style={{ margin: '6px 0 0' }}>
          ...user로 기존 값을 모두 복사하고, name만 새 값으로 덮어씁니다.
        </p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: 중첩 객체 state 업데이트
// ─────────────────────────────────────────────────────

/**
 * 객체 안에 객체가 있을 때는 스프레드를 두 번 사용합니다.
 * 바깥 객체 복사 + 안쪽 객체 복사 + 변경할 값만 덮어쓰기
 */
export function NestedObjectStateUpdate() {
  const [user, setUser] = useState({
    name: 'John',
    age: 30,
    address: {
      city: 'New York',
      zip: '10001',
    },
  });

  const updateCity = () => {
    setUser({
      ...user,              // 바깥 객체 복사
      address: {
        ...user.address,   // 안쪽 address 복사
        city: 'Los Angeles', // city만 변경
      },
    });
  };

  const updateZip = () => {
    setUser({
      ...user,
      address: {
        ...user.address,
        zip: '90001',
      },
    });
  };

  const reset = () => {
    setUser({ name: 'John', age: 30, address: { city: 'New York', zip: '10001' } });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '420px' }}>
      <h2>중첩 객체 state 업데이트</h2>

      <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', marginBottom: '12px' }}>
        <p style={{ margin: '0 0 4px' }}>이름: <strong>{user.name}</strong></p>
        <p style={{ margin: '0 0 4px' }}>나이: <strong>{user.age}</strong></p>
        <p style={{ margin: '0 0 4px', color: '#6b7280', fontSize: '0.85rem' }}>주소:</p>
        <p style={{ margin: '0 0 2px', paddingLeft: '12px' }}>도시: <strong>{user.address.city}</strong></p>
        <p style={{ margin: 0, paddingLeft: '12px' }}>우편번호: <strong>{user.address.zip}</strong></p>
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button onClick={updateCity} style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer' }}>
          도시 변경
        </button>
        <button onClick={updateZip} style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', background: '#7c3aed', color: 'white', cursor: 'pointer' }}>
          우편번호 변경
        </button>
        <button onClick={reset} style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', background: '#6b7280', color: 'white', cursor: 'pointer' }}>
          초기화
        </button>
      </div>

      <div style={{ marginTop: '12px', padding: '10px', background: '#eff6ff', borderRadius: '8px', fontSize: '0.8rem', color: '#1e40af' }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700 }}>중첩 객체 패턴</p>
        <code style={{ display: 'block', lineHeight: 1.8 }}>
          {'setUser({'}<br />
          {'  ...user,'}<br />
          {'  address: {'}<br />
          {'    ...user.address,'}<br />
          {'    city: \'Los Angeles\','}<br />
          {'  },'}<br />
          {'})'}
        </code>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: 배열 state 업데이트 (추가 / 삭제 / 수정)
// ─────────────────────────────────────────────────────

/**
 * 배열 state는 push/splice 같은 직접 수정 메서드를 사용하지 않습니다.
 * 항상 새 배열을 반환하는 방법을 사용합니다:
 * - 추가: [...todos, newItem]  또는 concat
 * - 삭제: todos.filter(...)
 * - 수정: todos.map(...)
 */
export function TodoList() {
  const [todos, setTodos] = useState([
    { id: generateId(), text: '리액트 공부하기', done: false },
    { id: generateId(), text: 'useState 연습하기', done: false },
  ]);
  const [inputValue, setInputValue] = useState('');

  // 추가: 스프레드로 기존 배열 + 새 항목
  const addTodo = () => {
    if (!inputValue.trim()) return;
    const newTodo = { id: generateId(), text: inputValue.trim(), done: false };
    setTodos([...todos, newTodo]); // ✅ 새 배열 생성
    setInputValue('');
  };

  // 삭제: filter로 해당 항목만 제외한 새 배열 생성
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id)); // ✅ 새 배열 반환
  };

  // 완료 토글: map으로 해당 항목만 변경한 새 배열 생성
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo // ✅ 새 배열 반환
    ));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '420px' }}>
      <h2>배열 state 업데이트</h2>

      {/* 입력 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="할 일 입력..."
          style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        />
        <button
          onClick={addTodo}
          style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer' }}
        >
          추가
        </button>
      </div>

      {/* 목록 */}
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {todos.map(todo => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              background: todo.done ? '#f0fdf4' : '#f8fafc',
              borderRadius: '8px',
              marginBottom: '6px',
              border: `1px solid ${todo.done ? '#bbf7d0' : '#e2e8f0'}`,
            }}
          >
            <span
              onClick={() => toggleTodo(todo.id)}
              style={{
                flex: 1,
                cursor: 'pointer',
                textDecoration: todo.done ? 'line-through' : 'none',
                color: todo.done ? '#9ca3af' : '#1e293b',
              }}
            >
              {todo.done ? '✅' : '⬜'} {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{ padding: '4px 10px', borderRadius: '4px', border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p style={{ textAlign: 'center', color: '#9ca3af', margin: '16px 0' }}>
          할 일을 추가해보세요!
        </p>
      )}

      <div style={{ marginTop: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.8rem', color: '#475569' }}>
        <p style={{ margin: '0 0 6px', fontWeight: 700 }}>배열 업데이트 패턴</p>
        <p style={{ margin: '2px 0' }}>추가: <code>[...todos, newItem]</code></p>
        <p style={{ margin: '2px 0' }}>삭제: <code>todos.filter(t =&gt; t.id !== id)</code></p>
        <p style={{ margin: '2px 0' }}>수정: <code>todos.map(t =&gt; t.id === id ? {'{ ...t, done: !t.done }'} : t)</code></p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 4: 객체 안에 배열이 포함된 복합 state 업데이트
// ─────────────────────────────────────────────────────

/**
 * user 객체 안에 todos 배열이 있는 복합 구조입니다.
 * 바깥 객체와 내부 배열 모두 불변성을 유지해야 합니다.
 * prevUser 패턴(함수형 업데이트)을 사용해 최신 상태를 안전하게 참조합니다.
 */
export function UserWithTodos() {
  const [user, setUser] = useState({
    name: 'John',
    age: 30,
    todos: [
      { id: generateId(), text: '할 일 1' },
      { id: generateId(), text: '할 일 2' },
    ],
  });
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (!inputValue.trim()) return;
    const newTodo = { id: generateId(), text: inputValue.trim() };

    // prevUser를 인자로 받는 함수형 업데이트 사용
    setUser(prevUser => ({
      ...prevUser,                        // 바깥 객체 복사
      todos: [...prevUser.todos, newTodo], // 배열에 새 항목 추가
    }));
    setInputValue('');
  };

  const deleteTodo = (id) => {
    setUser(prevUser => ({
      ...prevUser,
      todos: prevUser.todos.filter(todo => todo.id !== id),
    }));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '420px' }}>
      <h2>복합 구조 state 업데이트</h2>
      <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '12px' }}>
        객체(user) 안에 배열(todos)이 있는 중첩 구조
      </p>

      {/* 사용자 정보 */}
      <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '8px', marginBottom: '12px', fontSize: '0.88rem' }}>
        <p style={{ margin: '0 0 2px' }}>👤 {user.name} (만 {user.age}세)</p>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem' }}>할 일 {user.todos.length}개</p>
      </div>

      {/* 할 일 추가 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="새 할 일..."
          style={{ flex: 1, padding: '7px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.88rem' }}
        />
        <button
          onClick={addTodo}
          style={{ padding: '7px 14px', borderRadius: '6px', border: 'none', background: '#7c3aed', color: 'white', cursor: 'pointer' }}
        >
          추가
        </button>
      </div>

      {/* 할 일 목록 */}
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {user.todos.map(todo => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              background: '#f8fafc',
              borderRadius: '6px',
              marginBottom: '5px',
              border: '1px solid #e2e8f0',
              fontSize: '0.88rem',
            }}
          >
            <span>{todo.text}</span>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{ padding: '3px 8px', borderRadius: '4px', border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: '0.78rem' }}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.8rem', color: '#475569' }}>
        <p style={{ margin: '0 0 6px', fontWeight: 700 }}>함수형 업데이트 패턴</p>
        <code style={{ display: 'block', lineHeight: 1.8, color: '#334155' }}>
          {'setUser(prevUser => ({\n'}
          {'  ...prevUser,\n'}
          {'  todos: [...prevUser.todos, newTodo],\n'}
          {'})'}
        </code>
        <p style={{ margin: '8px 0 0', color: '#64748b' }}>
          prevUser는 항상 최신 상태를 보장합니다. 연속 업데이트 시에도 안전합니다.
        </p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
import {
  ObjectStateUpdate,
  NestedObjectStateUpdate,
  TodoList,
  UserWithTodos
} from './03_object_array_state';

function App() {
  return (
    <div>
      <ObjectStateUpdate />
      <NestedObjectStateUpdate />
      <TodoList />
      <UserWithTodos />
    </div>
  );
}
*/
