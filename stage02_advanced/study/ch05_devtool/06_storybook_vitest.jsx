/**
 * 06_storybook_vitest.jsx — Storybook & Vitest
 * ===============================================
 * ⚠️ 설치 필요:
 *   Storybook: npx storybook@latest init
 *   Vitest:    npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
 *
 * 1. Storybook — 컴포넌트 카탈로그 작성법
 * 2. Vitest    — 단위 테스트 & 컴포넌트 테스트 작성법
 * 3. 실전 패턴 — 테스트 가능한 컴포넌트 설계
 */

import { useState } from 'react';

// ═══════════════════════════════════════════════
// 테스트/스토리의 대상이 되는 예제 컴포넌트들
// (실제 프로젝트에서는 별도 파일에 분리합니다)
// ═══════════════════════════════════════════════

/**
 * Button 컴포넌트
 * - variant: 'primary' | 'secondary' | 'danger'
 * - size: 'sm' | 'md' | 'lg'
 * - disabled, loading, onClick 지원
 */
export function Button({ label, variant = 'primary', size = 'md', disabled = false, loading = false, onClick }) {
  const colors = {
    primary:   { bg: '#6366f1', hover: '#4f46e5', text: 'white' },
    secondary: { bg: '#f3f4f6', hover: '#e5e7eb', text: '#374151' },
    danger:    { bg: '#ef4444', hover: '#dc2626', text: 'white' },
  };
  const sizes = {
    sm: { padding: '5px 12px', fontSize: '0.8rem' },
    md: { padding: '8px 18px', fontSize: '0.9rem' },
    lg: { padding: '12px 24px', fontSize: '1rem' },
  };

  const c = colors[variant];
  const s = sizes[size];

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...s,
        background: (disabled || loading) ? '#e5e7eb' : c.bg,
        color: (disabled || loading) ? '#9ca3af' : c.text,
        border: 'none',
        borderRadius: '7px',
        cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
        fontWeight: '600',
        transition: 'background 0.15s',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      {loading && (
        <span style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
      )}
      {label}
    </button>
  );
}

/**
 * Badge 컴포넌트
 */
export function Badge({ label, color = 'purple' }) {
  const colors = {
    purple: { bg: '#eef2ff', text: '#4f46e5' },
    green:  { bg: '#dcfce7', text: '#16a34a' },
    red:    { bg: '#fee2e2', text: '#dc2626' },
    yellow: { bg: '#fef9c3', text: '#92400e' },
  };
  const c = colors[color] || colors.purple;
  return (
    <span style={{ background: c.bg, color: c.text, padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600' }}>
      {label}
    </span>
  );
}

/**
 * Counter 컴포넌트 (상태 포함)
 */
export function Counter({ initialCount = 0, step = 1, min = 0, max = Infinity }) {
  const [count, setCount] = useState(initialCount);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '10px 16px', background: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
      <button
        onClick={() => setCount(c => Math.max(min, c - step))}
        disabled={count <= min}
        aria-label="감소"
        style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #d1d5db', background: count <= min ? '#f3f4f6' : 'white', cursor: count <= min ? 'not-allowed' : 'pointer', fontSize: '1rem', color: '#374151' }}
      >
        −
      </button>
      <span style={{ fontWeight: '700', fontSize: '1.1rem', minWidth: '30px', textAlign: 'center' }} aria-label="현재 값">
        {count}
      </span>
      <button
        onClick={() => setCount(c => Math.min(max, c + step))}
        disabled={count >= max}
        aria-label="증가"
        style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #d1d5db', background: count >= max ? '#f3f4f6' : '#6366f1', cursor: count >= max ? 'not-allowed' : 'pointer', color: count >= max ? '#9ca3af' : 'white', fontSize: '1rem' }}
      >
        +
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════
// Section 1: Storybook 가이드
// ═══════════════════════════════════════════════

export function StorybookGuide() {
  const [activeTab, setActiveTab] = useState('concept');

  const tabs = {
    concept: {
      label: '개념',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ padding: '12px', background: '#fafafa', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <p style={{ fontWeight: '700', marginBottom: '6px', fontSize: '0.9rem' }}>Storybook이란?</p>
            <p style={{ fontSize: '0.82rem', color: '#6b7280', lineHeight: '1.7' }}>
              앱 전체를 실행하지 않고 <strong>컴포넌트 하나씩 독립적으로</strong> 개발하고 문서화하는 도구입니다.<br />
              버튼의 "비활성 상태", "로딩 중 상태", "에러 상태" 등을 각각 Story로 만들어 쉽게 테스트합니다.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { icon: '🧩', title: '독립 개발', desc: '앱 전체 없이 컴포넌트만 실행' },
              { icon: '📖', title: '자동 문서화', desc: 'props가 자동으로 문서로 정리' },
              { icon: '🤝', title: '협업', desc: '디자이너와 같은 카탈로그 공유' },
              { icon: '🐛', title: '엣지 케이스', desc: '비정상 데이터도 쉽게 테스트' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ padding: '10px', background: '#f9fafb', borderRadius: '8px' }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '3px' }}>{icon}</p>
                <p style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '2px' }}>{title}</p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    setup: {
      label: '설치 & 실행',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { step: '1. 설치', code: 'npx storybook@latest init', desc: '기존 React 프로젝트에 Storybook을 추가합니다.' },
            { step: '2. 실행', code: 'npm run storybook', desc: 'localhost:6006 에서 컴포넌트 카탈로그가 열립니다.' },
            { step: '3. 빌드', code: 'npm run build-storybook', desc: '정적 파일로 빌드해 팀에 공유할 수 있습니다.' },
          ].map(({ step, code, desc }) => (
            <div key={step} style={{ padding: '10px 12px', background: '#fafafa', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: '700', marginBottom: '4px' }}>{step}</p>
              <code style={{ display: 'block', background: '#1e293b', color: '#e2e8f0', padding: '6px 10px', borderRadius: '5px', fontSize: '0.82rem', marginBottom: '4px' }}>
                {code}
              </code>
              <p style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{desc}</p>
            </div>
          ))}
        </div>
      ),
    },
    story: {
      label: 'Story 작성법',
      content: (
        <div>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '8px' }}>
            Story 파일은 <code>컴포넌트명.stories.jsx</code> 형식으로 작성합니다.
          </p>
          <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '12px', borderRadius: '8px', fontSize: '0.73rem', overflow: 'auto', lineHeight: '1.65', maxHeight: '280px' }}>
{`// Button.stories.jsx

import Button from './Button';

// ① 메타 정보 — 이 파일이 어떤 컴포넌트의 스토리인지 설정
export default {
  title: 'Components/Button',  // 사이드바 경로
  component: Button,
  // argTypes: props의 컨트롤 UI 정의
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
    },
    onClick: { action: 'clicked' }, // 클릭 시 Actions 탭에 로그
  },
};

// ② Story = 컴포넌트의 한 가지 상태
// args에 props를 넣으면 Storybook Controls에서 실시간 수정 가능

export const Primary = {
  args: { label: '확인', variant: 'primary' },
};

export const Secondary = {
  args: { label: '취소', variant: 'secondary' },
};

export const Danger = {
  args: { label: '삭제', variant: 'danger' },
};

export const Disabled = {
  args: { label: '비활성', disabled: true },
};

export const Loading = {
  args: { label: '저장 중', loading: true },
};

// ③ 여러 버튼을 한 화면에 보여주는 Story
export const AllVariants = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button label="Primary" variant="primary" />
      <Button label="Secondary" variant="secondary" />
      <Button label="Danger" variant="danger" />
    </div>
  ),
};`}
          </pre>
        </div>
      ),
    },
  };

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        {Object.entries(tabs).map(([key, t]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{ padding: '5px 12px', background: activeTab === key ? '#f59e0b' : '#f3f4f6', color: activeTab === key ? 'white' : '#374151', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: activeTab === key ? '700' : '400' }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs[activeTab].content}
    </div>
  );
}

// ─────────────────────────────────────────────
// Story 미니 시뮬레이터 — Storybook 없이 체험
// ─────────────────────────────────────────────

export function StorybookSimulator() {
  const stories = {
    Primary:   <Button label="확인" variant="primary" />,
    Secondary: <Button label="취소" variant="secondary" />,
    Danger:    <Button label="삭제" variant="danger" />,
    Disabled:  <Button label="비활성" disabled />,
    Loading:   <Button label="저장 중" loading />,
    Small:     <Button label="Small" size="sm" />,
    Large:     <Button label="Large" size="lg" />,
  };
  const [active, setActive] = useState('Primary');

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
      {/* Storybook 사이드바 흉내 */}
      <div style={{ display: 'flex' }}>
        <div style={{ width: '130px', background: '#f9fafb', borderRight: '1px solid #e5e7eb', padding: '8px' }}>
          <p style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stories</p>
          {Object.keys(stories).map(name => (
            <button
              key={name}
              onClick={() => setActive(name)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '5px 8px',
                background: active === name ? '#eef2ff' : 'transparent',
                color: active === name ? '#4f46e5' : '#6b7280',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: active === name ? '700' : '400',
                marginBottom: '2px',
              }}
            >
              {name}
            </button>
          ))}
        </div>
        {/* 캔버스 영역 */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'white', minHeight: '100px' }}>
          {stories[active]}
        </div>
      </div>
      <div style={{ padding: '8px 12px', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
        <p style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
          💡 실제 Storybook에서는 props를 Controls 패널에서 실시간으로 수정할 수 있습니다.
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// Section 2: Vitest 가이드
// ═══════════════════════════════════════════════

export function VitestGuide() {
  const [activeTab, setActiveTab] = useState('concept');

  const tabs = {
    concept: {
      label: '개념',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ padding: '12px', background: '#fafafa', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <p style={{ fontWeight: '700', marginBottom: '6px', fontSize: '0.9rem' }}>Vitest란?</p>
            <p style={{ fontSize: '0.82rem', color: '#6b7280', lineHeight: '1.7' }}>
              Vite 기반의 테스트 러너입니다. Jest와 API가 거의 동일해 학습 비용이 낮고,
              Vite의 빌드 시스템을 공유해 <strong>매우 빠르게</strong> 실행됩니다.<br />
              React Testing Library와 함께 쓰면 <strong>"사용자 관점"</strong>의 테스트를 작성할 수 있습니다.
            </p>
          </div>
          <div style={{ padding: '10px 12px', background: '#fef9c3', borderRadius: '8px', fontSize: '0.82rem', color: '#92400e' }}>
            <p style={{ fontWeight: '700', marginBottom: '4px' }}>⚠️ 설치</p>
            <code style={{ display: 'block', background: '#1e293b', color: '#e2e8f0', padding: '6px 10px', borderRadius: '5px', fontSize: '0.8rem' }}>
              npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
            </code>
          </div>
          <div style={{ padding: '10px 12px', background: '#fafafa', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>vite.config.js 설정</p>
            <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '8px 10px', borderRadius: '5px', fontSize: '0.75rem', margin: 0, overflow: 'auto' }}>
{`export default defineConfig({
  test: {
    environment: 'jsdom',   // 브라우저 환경 시뮬레이션
    globals: true,          // describe, test, expect 전역 사용
    setupFiles: ['./src/setupTests.js'],
  },
});`}
            </pre>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '6px' }}>
              setupTests.js: <code>import '@testing-library/jest-dom';</code>
            </p>
          </div>
        </div>
      ),
    },
    unit: {
      label: '단위 테스트',
      content: (
        <div>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '8px' }}>
            순수 함수나 유틸리티의 입출력을 검증합니다.
          </p>
          <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '12px', borderRadius: '8px', fontSize: '0.73rem', overflow: 'auto', lineHeight: '1.65', maxHeight: '280px' }}>
{`// utils.test.js
import { describe, test, expect } from 'vitest';
import { formatPrice, validateEmail, clamp } from './utils';

// describe: 관련 테스트를 하나의 그룹으로 묶습니다
describe('formatPrice', () => {
  test('숫자를 한국 원화 형식으로 변환한다', () => {
    expect(formatPrice(1000)).toBe('1,000원');
    expect(formatPrice(1350000)).toBe('1,350,000원');
  });

  test('0원은 "무료"로 표시한다', () => {
    expect(formatPrice(0)).toBe('무료');
  });
});

describe('validateEmail', () => {
  test('올바른 이메일은 true를 반환한다', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.name+tag@domain.co.kr')).toBe(true);
  });

  test('잘못된 이메일은 false를 반환한다', () => {
    expect(validateEmail('not-an-email')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });
});

describe('clamp', () => {
  test('값이 범위 안에 있으면 그대로 반환', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  test('값이 최솟값보다 작으면 최솟값 반환', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  test('값이 최댓값보다 크면 최댓값 반환', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});`}
          </pre>
        </div>
      ),
    },
    component: {
      label: '컴포넌트 테스트',
      content: (
        <div>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '8px' }}>
            React Testing Library로 "사용자 관점"에서 컴포넌트를 테스트합니다.
          </p>
          <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '12px', borderRadius: '8px', fontSize: '0.73rem', overflow: 'auto', lineHeight: '1.65', maxHeight: '320px' }}>
{`// Button.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button 컴포넌트', () => {

  test('label이 화면에 표시된다', () => {
    render(<Button label="확인" />);
    // getByText: 텍스트로 요소 찾기
    expect(screen.getByText('확인')).toBeInTheDocument();
  });

  test('클릭하면 onClick이 호출된다', async () => {
    const handleClick = vi.fn(); // 가짜 함수 생성
    render(<Button label="클릭" onClick={handleClick} />);

    // userEvent: 실제 사용자 동작을 시뮬레이션
    await userEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('disabled 상태에서는 클릭이 동작하지 않는다', async () => {
    const handleClick = vi.fn();
    render(<Button label="비활성" disabled onClick={handleClick} />);

    await userEvent.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  test('loading 상태에서는 버튼이 비활성화된다', () => {
    render(<Button label="저장 중" loading />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

});

// Counter.test.jsx
describe('Counter 컴포넌트', () => {

  test('initialCount가 화면에 표시된다', () => {
    render(<Counter initialCount={5} />);
    expect(screen.getByLabelText('현재 값')).toHaveTextContent('5');
  });

  test('+버튼을 누르면 count가 증가한다', async () => {
    render(<Counter initialCount={0} />);
    await userEvent.click(screen.getByLabelText('증가'));
    expect(screen.getByLabelText('현재 값')).toHaveTextContent('1');
  });

  test('max에 도달하면 +버튼이 비활성화된다', () => {
    render(<Counter initialCount={10} max={10} />);
    expect(screen.getByLabelText('증가')).toBeDisabled();
  });

});`}
          </pre>
        </div>
      ),
    },
    matchers: {
      label: '주요 matcher',
      content: (
        <div>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '8px' }}>
            <code>expect(값).matcher()</code> 형태로 사용합니다.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {[
              { matcher: '.toBe(value)', desc: '정확히 같은 값인가 (===)' },
              { matcher: '.toEqual(obj)', desc: '객체/배열의 내용이 같은가 (깊은 비교)' },
              { matcher: '.toBeTruthy()', desc: 'truthy한 값인가' },
              { matcher: '.toBeFalsy()', desc: 'falsy한 값인가' },
              { matcher: '.toContain(item)', desc: '배열이나 문자열에 포함되어 있는가' },
              { matcher: '.toHaveLength(n)', desc: '길이가 n인가' },
              { matcher: '.toBeNull()', desc: 'null인가' },
              { matcher: '.toThrow()', desc: '함수가 에러를 던지는가' },
              { matcher: '.toBeInTheDocument()', desc: '[RTL] DOM에 존재하는가' },
              { matcher: '.toHaveTextContent(text)', desc: '[RTL] 텍스트를 포함하는가' },
              { matcher: '.toBeDisabled()', desc: '[RTL] 비활성화 상태인가' },
              { matcher: '.toHaveValue(value)', desc: '[RTL] input의 값이 일치하는가' },
              { matcher: '.toHaveBeenCalled()', desc: '[vi.fn] 한 번 이상 호출됐는가' },
              { matcher: '.toHaveBeenCalledTimes(n)', desc: '[vi.fn] 정확히 n번 호출됐는가' },
              { matcher: '.toHaveBeenCalledWith(args)', desc: '[vi.fn] 해당 인자로 호출됐는가' },
            ].map(({ matcher, desc }) => (
              <div key={matcher} style={{ display: 'flex', gap: '8px', padding: '5px 10px', background: '#f9fafb', borderRadius: '5px', alignItems: 'flex-start' }}>
                <code style={{ fontSize: '0.75rem', color: '#6366f1', whiteSpace: 'nowrap', flexShrink: 0, minWidth: '220px' }}>{matcher}</code>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  };

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {Object.entries(tabs).map(([key, t]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{ padding: '5px 12px', background: activeTab === key ? '#10b981' : '#f3f4f6', color: activeTab === key ? 'white' : '#374151', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: activeTab === key ? '700' : '400' }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs[activeTab].content}
    </div>
  );
}

// ─────────────────────────────────────────────
// 테스트 시뮬레이터 — 브라우저에서 직접 테스트 실행
// ─────────────────────────────────────────────

export function TestSimulator() {
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  /** 순수 함수들 (테스트 대상) */
  const formatPrice = (n) => n === 0 ? '무료' : `${n.toLocaleString()}원`;
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  /** 미니 테스트 러너 */
  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    const testCases = [
      {
        name: 'formatPrice(1000) → "1,000원"',
        run: () => formatPrice(1000) === '1,000원',
      },
      {
        name: 'formatPrice(0) → "무료"',
        run: () => formatPrice(0) === '무료',
      },
      {
        name: 'validateEmail("user@example.com") → true',
        run: () => validateEmail('user@example.com') === true,
      },
      {
        name: 'validateEmail("not-an-email") → false',
        run: () => validateEmail('not-an-email') === false,
      },
      {
        name: 'clamp(5, 0, 10) → 5 (범위 안)',
        run: () => clamp(5, 0, 10) === 5,
      },
      {
        name: 'clamp(-5, 0, 10) → 0 (최솟값)',
        run: () => clamp(-5, 0, 10) === 0,
      },
      {
        name: 'clamp(15, 0, 10) → 10 (최댓값)',
        run: () => clamp(15, 0, 10) === 10,
      },
    ];

    const newResults = [];
    for (const tc of testCases) {
      await new Promise(r => setTimeout(r, 120)); // 실행 애니메이션
      let passed = false;
      let error = null;
      try {
        passed = tc.run();
      } catch (e) {
        error = e.message;
      }
      newResults.push({ name: tc.name, passed, error });
      setResults([...newResults]);
    }

    setIsRunning(false);
  };

  const passCount = results.filter(r => r.passed).length;
  const failCount = results.filter(r => !r.passed).length;

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
        순수 함수 유닛 테스트를 브라우저에서 직접 실행해봅니다.
      </p>
      <button
        onClick={runTests}
        disabled={isRunning}
        style={{ padding: '8px 20px', background: isRunning ? '#d1d5db' : '#10b981', color: 'white', border: 'none', borderRadius: '7px', cursor: isRunning ? 'not-allowed' : 'pointer', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        {isRunning ? (
          <>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
            실행 중...
          </>
        ) : '▶ 테스트 실행'}
      </button>

      {results.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', background: '#dcfce7', color: '#16a34a', padding: '3px 10px', borderRadius: '999px', fontWeight: '700' }}>
              ✅ 통과 {passCount}
            </span>
            {failCount > 0 && (
              <span style={{ fontSize: '0.82rem', background: '#fee2e2', color: '#dc2626', padding: '3px 10px', borderRadius: '999px', fontWeight: '700' }}>
                ❌ 실패 {failCount}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {results.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: '7px 12px',
                  background: r.passed ? '#f0fdf4' : '#fff5f5',
                  borderRadius: '6px',
                  border: `1px solid ${r.passed ? '#bbf7d0' : '#fecaca'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8rem',
                }}
              >
                <span>{r.passed ? '✅' : '❌'}</span>
                <span style={{ color: r.passed ? '#166534' : '#dc2626' }}>{r.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 전체 데모
// ─────────────────────────────────────────────
export default function StorybookVitestDemo() {
  const sectionStyle = {
    marginBottom: '24px',
    padding: '16px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>Storybook & Vitest</h1>
      <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '0.9rem' }}>
        컴포넌트를 독립적으로 개발하고(Storybook), 자동으로 검증합니다(Vitest).
      </p>

      {/* Storybook 섹션 */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '4px', color: '#f59e0b' }}>
          📖 Storybook
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '12px' }}>
          컴포넌트 카탈로그 — 앱 전체 없이 컴포넌트를 독립적으로 개발/문서화합니다.
        </p>
        <StorybookGuide />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>Storybook 미리보기 시뮬레이터</h2>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
          왼쪽에서 Story를 선택하면 해당 상태의 컴포넌트가 캔버스에 표시됩니다.
        </p>
        <StorybookSimulator />
      </div>

      {/* Vitest 섹션 */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '4px', color: '#10b981' }}>
          ✅ Vitest
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '12px' }}>
          빠른 테스트 러너 — 코드가 제대로 동작하는지 자동으로 검증합니다.
        </p>
        <VitestGuide />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>테스트 시뮬레이터</h2>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
          실제 Vitest처럼 테스트를 실행하고 결과를 확인합니다.
        </p>
        <TestSimulator />
      </div>

      {/* Storybook + Vitest 조합 가이드 */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>Storybook + Vitest 조합 전략</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            {
              tool: 'Storybook',
              role: '시각적 확인',
              desc: '"버튼이 올바르게 보이는가?" — 디자이너와 함께 눈으로 확인',
              color: '#f59e0b',
              bg: '#fffbeb',
            },
            {
              tool: 'Vitest (단위 테스트)',
              role: '로직 검증',
              desc: '"함수가 올바른 값을 반환하는가?" — 순수 함수, 유틸리티',
              color: '#10b981',
              bg: '#f0fdf4',
            },
            {
              tool: 'Vitest + RTL (컴포넌트 테스트)',
              role: '동작 검증',
              desc: '"버튼 클릭 시 올바르게 반응하는가?" — 사용자 인터랙션',
              color: '#6366f1',
              bg: '#eef2ff',
            },
          ].map(({ tool, role, desc, color, bg }) => (
            <div
              key={tool}
              style={{ padding: '12px 14px', background: bg, borderRadius: '8px', borderLeft: `4px solid ${color}` }}
            >
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '3px' }}>
                <span style={{ fontWeight: '700', color, fontSize: '0.85rem' }}>{tool}</span>
                <span style={{ fontSize: '0.75rem', background: color + '20', color, padding: '1px 8px', borderRadius: '999px' }}>{role}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#6b7280' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
