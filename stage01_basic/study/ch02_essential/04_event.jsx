/**
 * 04_event.jsx — 이벤트 처리 예제
 * ==================================
 * React에서 사용자 상호작용(클릭, 입력, 키보드 등)을 처리하는 방법을 배웁니다.
 * HTML의 이벤트 속성과 React의 차이점을 이해합니다.
 *
 * 이 파일은 학습용 예제입니다.
 * Vite + React 프로젝트의 App.jsx에서 import하여 확인하세요.
 */

import { useState } from 'react';


// ─────────────────────────────────────────────────────
// HTML vs React 이벤트 차이점 정리
// ─────────────────────────────────────────────────────

/**
 * HTML:   onclick="alert('클릭!')"        → 소문자, 문자열로 코드 작성
 * React:  onClick={() => alert('클릭!')}  → camelCase, 함수 참조 전달
 *
 * 중요한 차이:
 * onClick={handleClick}    ✅ 함수 참조 — 클릭할 때 실행됨
 * onClick={handleClick()}  ❌ 함수 호출 — 렌더링할 때 바로 실행됨!
 */


// ─────────────────────────────────────────────────────
// 예제 1: onClick — 버튼 클릭 이벤트
// ─────────────────────────────────────────────────────

/**
 * onClick은 가장 기본적인 이벤트입니다.
 * 버튼, div, 이미지 등 대부분의 요소에 사용할 수 있습니다.
 */
export function ClickCounter() {
  const [count, setCount] = useState(0);

  // 이벤트 핸들러 함수 — 이름은 보통 handle로 시작합니다
  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div style={{ padding: '16px', maxWidth: '320px' }}>
      <h3>클릭 카운터</h3>
      <p style={{ fontSize: '2rem', fontWeight: 800, margin: '8px 0' }}>
        {count}번 클릭
      </p>

      {/* handleClick을 참조로 전달합니다 (호출하지 않음) */}
      <button onClick={handleClick} style={primaryBtn}>
        클릭하세요
      </button>

      <button
        onClick={() => setCount(0)}  // 간단한 경우 인라인으로 작성
        style={secondaryBtn}
      >
        초기화
      </button>

      {/* 이벤트 핸들러에 인자를 전달하는 방법 */}
      <div style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
        {[1, 5, 10].map(n => (
          <button
            key={n}
            onClick={() => setCount(count + n)} // 화살표 함수로 감싸서 인자 전달
            style={{ ...primaryBtn, flex: 1 }}
          >
            +{n}
          </button>
        ))}
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: onChange — 폼 입력 이벤트
// ─────────────────────────────────────────────────────

/**
 * onChange는 입력 필드 값이 바뀔 때마다 실시간으로 발생합니다.
 * 이벤트 객체(e)의 e.target.value로 현재 입력된 값을 가져옵니다.
 *
 * HTML의 onchange는 포커스가 벗어날 때 발생하지만,
 * React의 onChange는 타이핑할 때마다 실시간으로 발생합니다.
 */
export function NameForm() {
  const [name, setName] = useState('');

  // e = 이벤트 객체, e.target = 이벤트가 발생한 input 요소
  // e.target.value = input에 현재 입력된 값
  const handleChange = (e) => {
    setName(e.target.value);
  };

  return (
    <div style={{ padding: '16px', maxWidth: '360px' }}>
      <h3>실시간 입력 추적</h3>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '0.88rem', marginBottom: '4px' }}>
          이름을 입력하세요
        </label>
        <input
          type="text"
          value={name}           // state가 input의 현재 값을 제어합니다
          onChange={handleChange} // 타이핑할 때마다 handleChange 실행
          placeholder="홍길동"
          style={inputStyle}
        />
      </div>

      {/* 입력 즉시 화면에 반영됩니다 */}
      <p style={{
        padding: '12px',
        background: '#f0fdf4',
        borderRadius: '8px',
        fontWeight: name ? 600 : 400,
        color: name ? '#15803d' : '#94a3b8',
      }}>
        {name ? `안녕하세요, ${name}님!` : '이름을 입력하면 여기에 표시됩니다.'}
      </p>

      <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' }}>
        현재 입력값: "{name}" (글자 수: {name.length})
      </p>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: onKeyDown — 키보드 입력 이벤트
// ─────────────────────────────────────────────────────

/**
 * onKeyDown: 키를 누르는 순간 발생합니다 (키를 계속 누르면 반복 발생)
 * e.key: 눌린 키의 이름 ('Enter', 'a', 'Shift', 'ArrowUp' 등)
 * e.code: 물리적 키 코드 ('KeyA', 'Enter', 'Space' 등)
 */
export function KeyPressLogger() {
  const [lastKey, setLastKey] = useState('');
  const [keyLog, setKeyLog]   = useState([]);

  const handleKeyDown = (e) => {
    setLastKey(e.key);
    setKeyLog(prev => [e.key, ...prev].slice(0, 5)); // 최근 5개만 유지
  };

  return (
    <div style={{ padding: '16px', maxWidth: '360px' }}>
      <h3>키보드 입력 감지</h3>

      <input
        type="text"
        onKeyDown={handleKeyDown}
        placeholder="여기서 키보드를 눌러보세요"
        style={inputStyle}
      />

      <div style={{ marginTop: '12px', padding: '12px', background: '#1e293b', borderRadius: '8px', color: '#e2e8f0' }}>
        <p style={{ margin: '0 0 6px', fontSize: '0.8rem', color: '#94a3b8' }}>마지막으로 누른 키</p>
        <p style={{ margin: 0, fontSize: '1.5rem', fontFamily: 'monospace', fontWeight: 700, color: '#a78bfa' }}>
          {lastKey || '—'}
        </p>
      </div>

      {keyLog.length > 0 && (
        <div style={{ marginTop: '8px' }}>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 4px' }}>최근 5개 입력:</p>
          <div style={{ display: 'flex', gap: '4px' }}>
            {keyLog.map((k, idx) => (
              <span key={idx} style={{
                padding: '2px 8px',
                background: idx === 0 ? '#7c3aed' : '#e2e8f0',
                color: idx === 0 ? '#fff' : '#1e293b',
                borderRadius: '4px',
                fontSize: '0.82rem',
                fontFamily: 'monospace',
              }}>
                {k}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 4: Enter 키로 제출 — onKeyDown 실전 활용
// ─────────────────────────────────────────────────────

/**
 * 검색 입력창처럼 Enter 키를 누르면 제출하는 패턴입니다.
 * e.key === 'Enter'로 Enter 키를 감지합니다.
 */
export function SearchBox() {
  const [query, setQuery]   = useState('');
  const [results, setResults] = useState([]);

  const searchData = ['리액트', '리액트 훅', '자바스크립트', '타입스크립트', '넥스트JS', '뷰JS'];

  const handleSearch = () => {
    if (!query.trim()) return;
    const found = searchData.filter(item =>
      item.toLowerCase().includes(query.toLowerCase())
    );
    setResults(found);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {  // Enter 키를 누르면 검색 실행
      handleSearch();
    }
  };

  return (
    <div style={{ padding: '16px', maxWidth: '360px' }}>
      <h3>검색 (Enter 또는 버튼 클릭)</h3>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}             // Enter 키 감지
          placeholder="검색어 입력 후 Enter"
          style={{ ...inputStyle, flex: 1 }}
        />
        <button onClick={handleSearch} style={primaryBtn}>
          검색
        </button>
      </div>

      {results.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {results.map((r, idx) => (
            <li key={idx} style={{
              padding: '8px 12px',
              borderBottom: '1px solid #f1f5f9',
              fontSize: '0.88rem',
            }}>
              🔍 {r}
            </li>
          ))}
        </ul>
      ) : query && (
        <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>검색 결과가 없습니다.</p>
      )}
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 5: 이벤트 객체(e) 활용 — 여러 이벤트 모아보기
// ─────────────────────────────────────────────────────

/**
 * 다양한 이벤트를 한 곳에서 체험하는 종합 예제입니다.
 * 각 이벤트에서 이벤트 객체(e)의 다양한 속성을 활용합니다.
 */
export function EventPlayground() {
  const [log, setLog] = useState([]);

  const addLog = (msg) => {
    setLog(prev => [msg, ...prev].slice(0, 6)); // 최근 6개만 유지
  };

  return (
    <div style={{ padding: '16px', maxWidth: '480px' }}>
      <h3>이벤트 실험실</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>

        {/* onClick */}
        <button
          onClick={(e) => addLog(`클릭! (${e.type})`)}
          style={primaryBtn}
        >
          클릭해보세요 (onClick)
        </button>

        {/* onDoubleClick */}
        <button
          onDoubleClick={(e) => addLog(`더블클릭! (${e.type})`)}
          style={{ ...primaryBtn, background: '#0284c7' }}
        >
          더블클릭해보세요 (onDoubleClick)
        </button>

        {/* onChange */}
        <input
          type="text"
          onChange={(e) => addLog(`입력 변경: "${e.target.value}" (onChange)`)}
          placeholder="여기에 타이핑 (onChange)"
          style={inputStyle}
        />

        {/* onFocus / onBlur */}
        <input
          type="text"
          onFocus={() => addLog('포커스 들어옴 (onFocus)')}
          onBlur={() => addLog('포커스 나감 (onBlur)')}
          placeholder="클릭하고 다른 곳 클릭 (onFocus/onBlur)"
          style={inputStyle}
        />

        {/* onMouseEnter / onMouseLeave */}
        <div
          onMouseEnter={() => addLog('마우스 들어옴 (onMouseEnter)')}
          onMouseLeave={() => addLog('마우스 나감 (onMouseLeave)')}
          style={{
            padding: '12px',
            background: '#ede9fe',
            borderRadius: '8px',
            textAlign: 'center',
            cursor: 'default',
            fontSize: '0.88rem',
            color: '#7c3aed',
          }}
        >
          마우스를 올려보세요 (onMouseEnter/Leave)
        </div>
      </div>

      {/* 이벤트 로그 */}
      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '12px', minHeight: '120px' }}>
        <p style={{ color: '#7c3aed', margin: '0 0 8px', fontSize: '0.8rem', fontWeight: 700 }}>
          이벤트 로그 (최근 6개)
        </p>
        {log.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0 }}>
            위 요소들과 상호작용하면 여기에 표시됩니다.
          </p>
        ) : (
          log.map((entry, idx) => (
            <p key={idx} style={{
              color: idx === 0 ? '#a78bfa' : '#64748b',
              fontSize: '0.82rem',
              margin: '2px 0',
              fontFamily: 'monospace',
            }}>
              {idx === 0 ? '▶ ' : '  '}{entry}
            </p>
          ))
        )}
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 공통 스타일
// ─────────────────────────────────────────────────────

const primaryBtn = {
  padding: '8px 16px',
  background: '#7c3aed',
  color: '#fff',
  border: 'none',
  borderRadius: '7px',
  cursor: 'pointer',
  fontSize: '0.88rem',
  fontWeight: 600,
};

const secondaryBtn = {
  padding: '8px 16px',
  background: '#e2e8f0',
  color: '#1e293b',
  border: 'none',
  borderRadius: '7px',
  cursor: 'pointer',
  fontSize: '0.88rem',
  marginLeft: '8px',
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: '7px',
  fontSize: '0.88rem',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
import { ClickCounter, NameForm, KeyPressLogger, SearchBox, EventPlayground } from './04_event';

function App() {
  return (
    <div>
      <ClickCounter />
      <NameForm />
      <KeyPressLogger />
      <SearchBox />
      <EventPlayground />
    </div>
  );
}
*/
