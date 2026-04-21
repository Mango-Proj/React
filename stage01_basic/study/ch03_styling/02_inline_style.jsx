/**
 * 02_inline_style.jsx — 인라인 스타일 예제
 * ==========================================
 * JSX 안에서 style 속성에 객체를 전달해 스타일을 적용하는 방법을 배웁니다.
 * CSS 파일 없이 컴포넌트 안에서 직접 스타일을 정의합니다.
 *
 * 핵심: CSS 속성은 camelCase로 작성합니다.
 *   CSS:    font-size, background-color, border-radius
 *   인라인:  fontSize,  backgroundColor,  borderRadius
 *
 * 이 파일은 학습용 예제입니다.
 * Vite + React 프로젝트의 App.jsx에서 import하여 확인하세요.
 */

import { useState } from 'react';


// ─────────────────────────────────────────────────────
// 예제 1: 기본 인라인 스타일 사용
// ─────────────────────────────────────────────────────

/**
 * 스타일 객체를 변수로 선언하고 style 속성에 전달합니다.
 * style={{ 속성명: '값' }} 형태로 직접 쓸 수도 있습니다.
 */
export function InlineStyleBasic() {
  // 스타일 객체를 변수로 선언하면 재사용이 가능합니다
  const counterStyle = {
    padding: '20px',
    border: '2px solid #cbd5e1',
    borderRadius: '10px',   // CSS: border-radius
    textAlign: 'center',    // CSS: text-align
    width: '200px',
    margin: '0 auto',
    backgroundColor: '#f8fafc',  // CSS: background-color
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',       // CSS: font-size
    margin: '5px',
    cursor: 'pointer',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#7c3aed',
    color: '#fff',
    fontWeight: '600',      // CSS: font-weight
  };

  const [count, setCount] = useState(0);

  return (
    <div style={counterStyle}>
      <h2 style={{ margin: '0 0 16px', fontSize: '1.1rem' }}>카운터</h2>
      <h1 style={{ margin: '0 0 12px', fontSize: '3rem', color: '#7c3aed' }}>
        {count}
      </h1>
      <button style={buttonStyle} onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
      <button
        style={{ ...buttonStyle, backgroundColor: '#dc2626' }}  /* spread로 일부만 변경 */
        onClick={() => setCount(c => c - 1)}
      >
        Decrement
      </button>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: camelCase 변환 규칙
// ─────────────────────────────────────────────────────

/**
 * 인라인 스타일에서 CSS 속성명은 camelCase로 씁니다.
 * 하이픈(-)을 없애고 다음 단어의 첫 글자를 대문자로 바꿉니다.
 */
export function CamelCaseGuide() {
  const commonConversions = [
    { css: 'font-size',        js: 'fontSize',        value: '18px' },
    { css: 'background-color', js: 'backgroundColor', value: '#7c3aed' },
    { css: 'border-radius',    js: 'borderRadius',    value: '8px' },
    { css: 'text-align',       js: 'textAlign',       value: 'center' },
    { css: 'font-weight',      js: 'fontWeight',      value: 'bold' },
    { css: 'box-shadow',       js: 'boxShadow',       value: '0 2px 8px rgba(0,0,0,0.1)' },
    { css: 'z-index',          js: 'zIndex',          value: '10' },
    { css: 'flex-direction',   js: 'flexDirection',   value: 'column' },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '560px' }}>
      <h2>camelCase 변환 규칙</h2>
      <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '12px' }}>
        CSS 파일에서는 하이픈(-) 사용, 인라인 스타일에서는 camelCase 사용
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: '#7c3aed', color: '#fff' }}>
            <th style={thStyle}>CSS 파일</th>
            <th style={thStyle}>인라인 스타일 (JS)</th>
            <th style={thStyle}>예시 값</th>
          </tr>
        </thead>
        <tbody>
          {commonConversions.map((item, idx) => (
            <tr key={idx} style={{ background: idx % 2 === 0 ? '#f8fafc' : '#fff' }}>
              <td style={tdStyle}>
                <code style={{ color: '#dc2626' }}>{item.css}</code>
              </td>
              <td style={tdStyle}>
                <code style={{ color: '#16a34a' }}>{item.js}</code>
              </td>
              <td style={tdStyle}>
                <code style={{ color: '#64748b' }}>'{item.value}'</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '14px', padding: '12px', background: '#fffbeb', borderRadius: '8px', fontSize: '0.82rem', borderLeft: '4px solid #fbbf24' }}>
        <p style={{ margin: 0, color: '#92400e' }}>
          <strong>예외: vendor prefix</strong>
          <br />
          <code>-webkit-transform</code> → <code>WebkitTransform</code> (첫 글자도 대문자)
        </p>
      </div>
    </div>
  );
}

const thStyle = { padding: '10px 12px', textAlign: 'left', fontWeight: 700 };
const tdStyle = { padding: '8px 12px', borderBottom: '1px solid #e2e8f0' };


// ─────────────────────────────────────────────────────
// 예제 3: 동적 스타일 — 상태에 따라 스타일 변경
// ─────────────────────────────────────────────────────

/**
 * 인라인 스타일의 가장 큰 장점: 상태(state)나 props에 따라 스타일을 쉽게 변경할 수 있습니다.
 * 삼항 연산자를 사용해 조건부 스타일을 적용합니다.
 */
export function DynamicStyledButton() {
  const [isClicked, setIsClicked] = useState(false);

  const buttonStyle = {
    backgroundColor: isClicked ? 'green' : 'red',  // 상태에 따라 배경색 변경
    color: 'white',
    padding: '12px 28px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '700',
    transition: 'all 0.2s ease',  // CSS transition도 인라인으로 지정 가능
  };

  return (
    <div style={{ padding: '16px', maxWidth: '300px' }}>
      <h3>동적 스타일 버튼</h3>
      <button style={buttonStyle} onClick={() => setIsClicked(p => !p)}>
        {isClicked ? '✅ 클릭됨' : '클릭해보세요'}
      </button>
      <p style={{ marginTop: '10px', fontSize: '0.82rem', color: '#64748b' }}>
        isClicked: {String(isClicked)}<br />
        배경색: {isClicked ? 'green' : 'red'}
      </p>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 4: 조건부 카드 스타일링
// ─────────────────────────────────────────────────────

/**
 * 클릭할 때마다 카드 스타일이 바뀌는 예제입니다.
 * 스타일 객체의 여러 속성을 상태에 따라 동시에 변경합니다.
 */
export function ConditionalStyledCard() {
  const [isHighlighted, setIsHighlighted] = useState(false);

  const cardStyle = {
    padding: '20px',
    width: '280px',
    border: isHighlighted ? '2px solid #7c3aed' : '2px solid #cbd5e1',
    backgroundColor: isHighlighted ? '#ede9fe' : '#ffffff',
    boxShadow: isHighlighted
      ? '0 0 16px rgba(124, 58, 237, 0.4)'
      : '0 2px 6px rgba(0,0,0,0.06)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',  // 스타일 전환 애니메이션
    userSelect: 'none',
  };

  const titleStyle = {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: isHighlighted ? '#7c3aed' : '#1e293b',
    margin: '0 0 8px',
    transition: 'color 0.3s ease',
  };

  return (
    <div style={{ padding: '16px' }}>
      <h3>조건부 카드 스타일</h3>
      <div style={cardStyle} onClick={() => setIsHighlighted(p => !p)}>
        <h2 style={titleStyle}>
          {isHighlighted ? '✨ 효과 카드' : '일반 카드'}
        </h2>
        <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
          현재 카드는{' '}
          <strong>{isHighlighted ? '하이라이트 효과가 적용된' : '일반'}</strong>{' '}
          카드입니다.
          <br />
          클릭하면 효과가 {isHighlighted ? '해제' : '적용'}됩니다.
        </p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 5: 다크 모드 토글 (인라인 스타일로 구현)
// ─────────────────────────────────────────────────────

/**
 * 인라인 스타일만으로 전체 컴포넌트의 테마를 전환하는 예제입니다.
 * 테마 상태에 따라 모든 색상을 한 번에 바꿉니다.
 */
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // 테마에 따른 색상 세트를 객체로 관리합니다
  const theme = {
    container: {
      background: isDark ? '#1e293b' : '#f8fafc',
      color: isDark ? '#e2e8f0' : '#1e293b',
      padding: '24px',
      borderRadius: '14px',
      maxWidth: '360px',
      transition: 'all 0.3s ease',
    },
    card: {
      background: isDark ? '#334155' : '#ffffff',
      border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
      borderRadius: '10px',
      padding: '14px',
      marginBottom: '10px',
      transition: 'all 0.3s ease',
    },
    button: {
      padding: '8px 18px',
      border: 'none',
      borderRadius: '20px',
      background: isDark ? '#a78bfa' : '#7c3aed',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: '700',
      fontSize: '0.88rem',
      marginTop: '12px',
    },
  };

  return (
    <div style={theme.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>다크 모드 토글</h3>
        <span style={{ fontSize: '1.5rem' }}>{isDark ? '🌙' : '☀️'}</span>
      </div>

      {['카드 1', '카드 2', '카드 3'].map((card, idx) => (
        <div key={idx} style={theme.card}>
          <p style={{ margin: 0, fontSize: '0.88rem' }}>{card} 내용</p>
        </div>
      ))}

      <button style={theme.button} onClick={() => setIsDark(p => !p)}>
        {isDark ? '☀️ 라이트 모드' : '🌙 다크 모드'}로 전환
      </button>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 6: 인라인 스타일의 한계
// ─────────────────────────────────────────────────────

/**
 * 인라인 스타일로는 :hover, ::before 같은 가상 선택자와
 * @media 미디어 쿼리를 직접 사용할 수 없습니다.
 * 이런 기능이 필요하면 CSS 모듈이나 styled-components를 사용하세요.
 */
export function InlineStyleLimitations() {
  const [isHovered, setIsHovered] = useState(false);

  // ❌ 인라인 스타일에서 :hover를 쓸 수 없으므로
  // ✅ onMouseEnter/onMouseLeave 이벤트로 대신 구현해야 합니다
  const btnStyle = {
    padding: '10px 20px',
    background: isHovered ? '#5b21b6' : '#7c3aed',  // hover 효과를 이벤트로 대신 구현
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.88rem',
    transform: isHovered ? 'scale(1.03)' : 'scale(1)',
    transition: 'all 0.15s ease',
  };

  return (
    <div style={{ padding: '16px', maxWidth: '420px' }}>
      <h3>인라인 스타일의 한계</h3>

      <div style={{ padding: '14px', background: '#fef2f2', borderRadius: '10px', marginBottom: '12px', fontSize: '0.85rem' }}>
        <p style={{ fontWeight: 700, color: '#dc2626', margin: '0 0 6px' }}>❌ 인라인으로 직접 불가능한 것</p>
        <ul style={{ margin: 0, paddingLeft: '16px', color: '#991b1b', lineHeight: 1.8 }}>
          <li><code>:hover</code>, <code>:focus</code>, <code>:active</code> 가상 선택자</li>
          <li><code>::before</code>, <code>::after</code> 가상 요소</li>
          <li><code>@media</code> 미디어 쿼리 (반응형)</li>
          <li><code>@keyframes</code> 애니메이션</li>
        </ul>
      </div>

      <div style={{ padding: '14px', background: '#f0fdf4', borderRadius: '10px', marginBottom: '12px', fontSize: '0.85rem' }}>
        <p style={{ fontWeight: 700, color: '#15803d', margin: '0 0 6px' }}>✅ 대안: 이벤트 핸들러로 구현</p>
        <p style={{ margin: '0 0 8px', color: '#166534' }}>
          hover 효과는 <code>onMouseEnter</code> / <code>onMouseLeave</code>로 흉내낼 수 있습니다:
        </p>
        <button
          style={btnStyle}
          onMouseEnter={() => setIsHovered(true)}   // 마우스 올림 → hover 상태 ON
          onMouseLeave={() => setIsHovered(false)}   // 마우스 뗌  → hover 상태 OFF
        >
          마우스를 올려보세요 (hover 효과)
        </button>
      </div>

      <div style={{ padding: '14px', background: '#eff6ff', borderRadius: '10px', fontSize: '0.85rem' }}>
        <p style={{ fontWeight: 700, color: '#1d4ed8', margin: '0 0 4px' }}>💡 권장사항</p>
        <p style={{ margin: 0, color: '#1e40af' }}>
          :hover, 미디어 쿼리가 필요하면{' '}
          <strong>CSS 모듈</strong> 또는 <strong>styled-components</strong>를 사용하세요.
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
  InlineStyleBasic, CamelCaseGuide, DynamicStyledButton,
  ConditionalStyledCard, ThemeToggle, InlineStyleLimitations
} from './02_inline_style';

function App() {
  return (
    <div>
      <InlineStyleBasic />
      <CamelCaseGuide />
      <DynamicStyledButton />
      <ConditionalStyledCard />
      <ThemeToggle />
      <InlineStyleLimitations />
    </div>
  );
}
*/
