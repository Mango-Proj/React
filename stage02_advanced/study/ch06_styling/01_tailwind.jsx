/**
 * 01_tailwind.jsx — Tailwind CSS 완전 정복
 * ==========================================
 * ⚠️ Tailwind가 없어도 이 파일은 실행됩니다.
 *    Tailwind 코드는 주석/코드 가이드로 보여주고,
 *    동일한 스타일을 인라인 CSS로 구현했습니다.
 *
 * ⚠️ 실제 Tailwind 사용 시 설치:
 *    npm install tailwindcss @tailwindcss/vite
 *    vite.config.js에 플러그인 추가
 *    src/index.css에 @import 'tailwindcss'; 추가
 *
 * 1. 기존 CSS vs Tailwind 클래스 비교
 * 2. 자주 쓰는 유틸리티 클래스 카탈로그
 * 3. 반응형 / 상태(hover·focus) / 다크모드 클래스
 * 4. Tailwind로 만든 실전 UI 컴포넌트들
 */

import { useState } from 'react';

// ─────────────────────────────────────────────
// 비교 가이드: 기존 CSS 방식 vs Tailwind 방식
// ─────────────────────────────────────────────

export function CSSvstailwindGuide() {
  const [activeTab, setActiveTab] = useState('button');

  const examples = {
    button: {
      label: '버튼',
      css: `.primary-btn {
  width: 100%;
  background-color: #0ea5e9;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
}
.primary-btn:hover {
  background-color: #0369a1;
}`,
      tailwind: `<button
  className="
    w-full
    bg-sky-500
    text-white
    px-4 py-2
    rounded
    hover:bg-sky-700
    cursor-pointer
    border-none
  "
>
  Click Me
</button>`,
      preview: (
        <button style={{ width: '100%', background: '#0ea5e9', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: '600' }}
          onMouseEnter={e => e.target.style.background = '#0369a1'}
          onMouseLeave={e => e.target.style.background = '#0ea5e9'}
        >
          Click Me
        </button>
      ),
    },
    card: {
      label: '카드',
      css: `.card {
  max-width: 20rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  overflow: hidden;
  margin: 1rem;
}
.card-body { padding: 1rem; }
.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}`,
      tailwind: `<div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden m-4">
  <img
    className="w-full h-48 object-cover"
    src="..." alt="..."
  />
  <div className="p-4">
    <h2 className="text-xl font-bold text-gray-800 mb-2">
      Card Title
    </h2>
    <p className="text-gray-600 text-sm mb-4">
      설명 텍스트
    </p>
    <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      Learn More
    </button>
  </div>
</div>`,
      preview: (
        <div style={{ maxWidth: '280px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ width: '100%', height: '120px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem' }}>🖼</div>
          <div style={{ padding: '14px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1f2937', marginBottom: '6px' }}>Card Title</h3>
            <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>Tailwind CSS로 만든 카드 컴포넌트입니다.</p>
            <button style={{ width: '100%', background: '#3b82f6', color: 'white', padding: '7px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>
              Learn More
            </button>
          </div>
        </div>
      ),
    },
    flex: {
      label: 'Flex 레이아웃',
      css: `.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.nav-links {
  display: flex;
  gap: 1.5rem;
}`,
      tailwind: `<nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
  <span className="text-xl font-bold text-indigo-600">
    Logo
  </span>
  <div className="flex gap-6">
    <a className="text-gray-600 hover:text-indigo-600">홈</a>
    <a className="text-gray-600 hover:text-indigo-600">소개</a>
    <a className="text-gray-600 hover:text-indigo-600">연락</a>
  </div>
  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
    시작하기
  </button>
</nav>`,
      preview: (
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
          <span style={{ fontSize: '1rem', fontWeight: '800', color: '#6366f1' }}>Logo</span>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#6b7280' }}>
            <span>홈</span><span>소개</span><span>연락</span>
          </div>
          <button style={{ background: '#6366f1', color: 'white', padding: '5px 12px', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '0.82rem' }}>시작하기</button>
        </nav>
      ),
    },
  };

  const ex = examples[activeTab];

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        {Object.entries(examples).map(([key, v]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            style={{ padding: '5px 12px', background: activeTab === key ? '#6366f1' : '#f3f4f6', color: activeTab === key ? 'white' : '#374151', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: activeTab === key ? '700' : '400' }}>
            {v.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        <div>
          <p style={{ fontSize: '0.72rem', fontWeight: '700', color: '#6b7280', marginBottom: '4px' }}>❌ 기존 CSS</p>
          <pre style={{ background: '#1e293b', color: '#fca5a5', padding: '10px', borderRadius: '6px', fontSize: '0.72rem', overflow: 'auto', minHeight: '130px', lineHeight: '1.6', margin: 0 }}>
            {ex.css}
          </pre>
        </div>
        <div>
          <p style={{ fontSize: '0.72rem', fontWeight: '700', color: '#6366f1', marginBottom: '4px' }}>✅ Tailwind CSS</p>
          <pre style={{ background: '#1e1b4b', color: '#c7d2fe', padding: '10px', borderRadius: '6px', fontSize: '0.72rem', overflow: 'auto', minHeight: '130px', lineHeight: '1.6', margin: 0 }}>
            {ex.tailwind}
          </pre>
        </div>
      </div>

      <div style={{ padding: '14px', background: '#f9fafb', borderRadius: '8px', border: '1px dashed #d1d5db' }}>
        <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '8px' }}>▶ 미리보기</p>
        {ex.preview}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 유틸리티 클래스 카탈로그
// ─────────────────────────────────────────────

export function ClassCatalog() {
  const categories = [
    {
      name: '간격 (Spacing)',
      color: '#6366f1',
      classes: [
        { cls: 'p-4', css: 'padding: 1rem', preview: <div style={{ padding: '16px', background: '#eef2ff', borderRadius: '4px', fontSize: '0.75rem', textAlign: 'center' }}>p-4</div> },
        { cls: 'px-6 py-3', css: 'padding: 0.75rem 1.5rem', preview: <div style={{ padding: '12px 24px', background: '#eef2ff', borderRadius: '4px', fontSize: '0.75rem', textAlign: 'center', display: 'inline-block' }}>px-6 py-3</div> },
        { cls: 'mt-4 mb-2', css: 'margin-top: 1rem; margin-bottom: 0.5rem', preview: <div style={{ marginTop: '8px', marginBottom: '4px', background: '#eef2ff', borderRadius: '4px', padding: '6px', fontSize: '0.75rem', textAlign: 'center' }}>mt-4 mb-2</div> },
        { cls: 'gap-4', css: 'gap: 1rem (flex/grid)', preview: <div style={{ display: 'flex', gap: '16px' }}><span style={{ background: '#eef2ff', padding: '4px 8px', borderRadius: '3px', fontSize: '0.7rem' }}>A</span><span style={{ background: '#eef2ff', padding: '4px 8px', borderRadius: '3px', fontSize: '0.7rem' }}>B</span></div> },
      ],
    },
    {
      name: '색상 & 배경',
      color: '#f59e0b',
      classes: [
        { cls: 'bg-indigo-500', css: 'background: #6366f1', preview: <div style={{ background: '#6366f1', height: '24px', borderRadius: '4px' }} /> },
        { cls: 'bg-indigo-100', css: 'background: #e0e7ff', preview: <div style={{ background: '#e0e7ff', height: '24px', borderRadius: '4px' }} /> },
        { cls: 'text-gray-600', css: 'color: #4b5563', preview: <span style={{ color: '#4b5563', fontSize: '0.82rem' }}>text-gray-600</span> },
        { cls: 'text-indigo-600', css: 'color: #4f46e5', preview: <span style={{ color: '#4f46e5', fontWeight: '700', fontSize: '0.82rem' }}>text-indigo-600</span> },
      ],
    },
    {
      name: '크기',
      color: '#10b981',
      classes: [
        { cls: 'w-full', css: 'width: 100%', preview: <div style={{ width: '100%', background: '#dcfce7', height: '20px', borderRadius: '4px' }} /> },
        { cls: 'w-1/2', css: 'width: 50%', preview: <div style={{ width: '50%', background: '#dcfce7', height: '20px', borderRadius: '4px' }} /> },
        { cls: 'h-48', css: 'height: 12rem', preview: <div style={{ width: '30px', height: '48px', background: '#dcfce7', borderRadius: '4px', display: 'inline-block' }} /> },
        { cls: 'max-w-sm', css: 'max-width: 24rem', preview: <div style={{ maxWidth: '80px', background: '#dcfce7', height: '20px', borderRadius: '4px', fontSize: '0.7rem', textAlign: 'center', lineHeight: '20px' }}>max</div> },
      ],
    },
    {
      name: '테두리 & 그림자',
      color: '#ef4444',
      classes: [
        { cls: 'rounded-lg', css: 'border-radius: 0.5rem', preview: <div style={{ width: '40px', height: '40px', background: '#fee2e2', borderRadius: '8px' }} /> },
        { cls: 'rounded-full', css: 'border-radius: 9999px', preview: <div style={{ width: '40px', height: '40px', background: '#fee2e2', borderRadius: '9999px' }} /> },
        { cls: 'shadow-md', css: 'box-shadow: 0 4px 6px rgba(0,0,0,0.1)', preview: <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '6px', boxShadow: '0 4px 6px rgba(0,0,0,0.15)' }} /> },
        { cls: 'border border-gray-200', css: 'border: 1px solid #e5e7eb', preview: <div style={{ width: '40px', height: '40px', border: '1px solid #e5e7eb', borderRadius: '4px' }} /> },
      ],
    },
  ];

  const [activeCategory, setActiveCategory] = useState(0);
  const cat = categories[activeCategory];

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {categories.map((c, i) => (
          <button key={i} onClick={() => setActiveCategory(i)}
            style={{ padding: '5px 10px', background: activeCategory === i ? c.color : '#f3f4f6', color: activeCategory === i ? 'white' : '#374151', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: activeCategory === i ? '700' : '400' }}>
            {c.name}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {cat.classes.map(({ cls, css, preview }) => (
          <div key={cls} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 80px', gap: '8px', alignItems: 'center', padding: '8px 10px', background: '#fafafa', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
            <code style={{ fontSize: '0.78rem', color: cat.color, fontWeight: '700' }}>{cls}</code>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{css}</span>
            <div>{preview}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 상태 접두사 (hover, focus, active, disabled)
// ─────────────────────────────────────────────

export function StatePrefixDemo() {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '14px' }}>
        Tailwind의 상태 접두사: <code>hover:</code> <code>focus:</code> <code>active:</code> <code>disabled:</code>
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* hover */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '180px', fontSize: '0.75rem' }}>
            <code style={{ color: '#6366f1' }}>hover:bg-indigo-700</code>
          </div>
          <button
            style={{ padding: '7px 18px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={e => e.target.style.background = '#4338ca'}
            onMouseLeave={e => e.target.style.background = '#6366f1'}
          >
            마우스를 올려보세요
          </button>
        </div>

        {/* focus */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '180px', fontSize: '0.75rem' }}>
            <code style={{ color: '#6366f1' }}>focus:ring-2 focus:ring-indigo-500</code>
          </div>
          <input
            placeholder="클릭해서 포커스"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              padding: '7px 12px',
              border: `2px solid ${focused ? '#6366f1' : '#d1d5db'}`,
              borderRadius: '6px',
              outline: 'none',
              boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.2)' : 'none',
              transition: 'all 0.15s',
            }}
          />
        </div>

        {/* active */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '180px', fontSize: '0.75rem' }}>
            <code style={{ color: '#6366f1' }}>active:scale-95</code>
          </div>
          <button
            style={{ padding: '7px 18px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'transform 0.1s' }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            클릭하면 눌림
          </button>
        </div>

        {/* disabled */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '180px', fontSize: '0.75rem' }}>
            <code style={{ color: '#6366f1' }}>disabled:opacity-50 disabled:cursor-not-allowed</code>
          </div>
          <button
            disabled
            style={{ padding: '7px 18px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', opacity: 0.5, cursor: 'not-allowed' }}
          >
            비활성화됨
          </button>
        </div>
      </div>

      {/* Tailwind 코드 */}
      <pre style={{ marginTop: '14px', background: '#1e293b', color: '#c7d2fe', padding: '10px', borderRadius: '6px', fontSize: '0.74rem', overflow: 'auto', lineHeight: '1.6' }}>
{`{/* hover: 마우스 오버 */}
<button className="bg-indigo-600 hover:bg-indigo-800">버튼</button>

{/* focus: 포커스 상태 */}
<input className="border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" />

{/* active: 클릭 중 */}
<button className="active:scale-95 transition-transform">버튼</button>

{/* disabled: 비활성 */}
<button className="disabled:opacity-50 disabled:cursor-not-allowed" disabled>버튼</button>`}
      </pre>
    </div>
  );
}

// ─────────────────────────────────────────────
// 반응형 클래스 (md:, lg:)
// ─────────────────────────────────────────────

export function ResponsiveDemo() {
  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
        접두사 없음 = 모바일, <code>md:</code> = 768px 이상, <code>lg:</code> = 1024px 이상
      </p>

      <pre style={{ background: '#1e293b', color: '#c7d2fe', padding: '12px', borderRadius: '8px', fontSize: '0.74rem', overflow: 'auto', lineHeight: '1.7', marginBottom: '12px' }}>
{`{/* 그리드: 모바일 1열 → 태블릿 2열 → PC 3열 */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  ...
</div>

{/* 텍스트: 모바일 기본 → 태블릿 커짐 → PC 더 커짐 */}
<h1 className="text-xl md:text-2xl lg:text-4xl font-bold">
  제목
</h1>

{/* 보이기/숨기기: 모바일엔 숨김, PC엔 보임 */}
<nav className="hidden lg:flex gap-6">...</nav>
<button className="lg:hidden">☰ 메뉴</button>

{/* 패딩: 모바일엔 작게, PC엔 넉넉하게 */}
<section className="px-4 md:px-8 lg:px-16 py-8 md:py-16">
  ...
</section>`}
      </pre>

      {/* 반응형 그리드 시뮬레이터 */}
      <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '8px' }}>
        아래 카드들은 실제 화면 너비에 따라 1 → 2 → 3열로 변합니다.
        (브라우저 창 크기를 조절해보세요)
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '8px',
      }}>
        {['카드 A', '카드 B', '카드 C'].map(c => (
          <div key={c} style={{ padding: '14px', background: '#eef2ff', borderRadius: '8px', textAlign: 'center', fontSize: '0.85rem', fontWeight: '600', color: '#4f46e5' }}>
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 실전 컴포넌트: Tailwind 스타일 카드 & 알림
// ─────────────────────────────────────────────

export function TailwindStyledComponents() {
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'success', msg: '저장이 완료되었습니다.' },
    { id: 2, type: 'error',   msg: '네트워크 오류가 발생했습니다.' },
    { id: 3, type: 'warning', msg: '입력값을 다시 확인해주세요.' },
    { id: 4, type: 'info',    msg: '새로운 업데이트가 있습니다.' },
  ]);

  const alertStyles = {
    success: { bg: '#f0fdf4', border: '#86efac', text: '#166534', icon: '✅' },
    error:   { bg: '#fff5f5', border: '#fca5a5', text: '#dc2626', icon: '❌' },
    warning: { bg: '#fffbeb', border: '#fcd34d', text: '#92400e', icon: '⚠️' },
    info:    { bg: '#eff6ff', border: '#93c5fd', text: '#1d4ed8', icon: 'ℹ️' },
  };

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '12px' }}>
        Tailwind 유틸리티 클래스로 만든 알림 배너 (✕ 클릭으로 닫기)
      </p>

      <pre style={{ background: '#1e293b', color: '#c7d2fe', padding: '10px', borderRadius: '6px', fontSize: '0.73rem', overflow: 'auto', lineHeight: '1.6', marginBottom: '12px' }}>
{`{/* Tailwind 클래스로 만든 성공 알림 */}
<div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
  <span>✅</span>
  <p className="flex-1 text-sm font-medium">저장이 완료되었습니다.</p>
  <button className="text-green-500 hover:text-green-700">✕</button>
</div>`}
      </pre>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {alerts.map(alert => {
          const s = alertStyles[alert.type];
          return (
            <div key={alert.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: s.bg, border: `1px solid ${s.border}`, borderRadius: '8px' }}>
              <span>{s.icon}</span>
              <p style={{ flex: 1, fontSize: '0.85rem', color: s.text, fontWeight: '500' }}>{alert.msg}</p>
              <button
                onClick={() => setAlerts(a => a.filter(x => x.id !== alert.id))}
                style={{ background: 'none', border: 'none', color: s.text, opacity: 0.6, cursor: 'pointer', fontSize: '0.85rem', padding: '0 4px' }}
              >
                ✕
              </button>
            </div>
          );
        })}
        {alerts.length === 0 && (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '12px', fontSize: '0.85rem' }}>모든 알림이 닫혔습니다.</p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 전체 데모
// ─────────────────────────────────────────────
export default function TailwindDemo() {
  const sectionStyle = {
    marginBottom: '24px',
    padding: '16px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>Tailwind CSS 예제</h1>
      <div style={{ padding: '8px 12px', background: '#fef9c3', borderRadius: '6px', marginBottom: '20px', fontSize: '0.82rem', color: '#92400e' }}>
        ⚠️ 실제 Tailwind 사용: <code>npm install tailwindcss @tailwindcss/vite</code>
        · 아래 예제는 인라인 스타일로 동일 효과를 재현합니다.
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>① 기존 CSS vs Tailwind 비교</h2>
        <CSSvstailwindGuide />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>② 유틸리티 클래스 카탈로그</h2>
        <ClassCatalog />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>③ 상태 접두사 (hover·focus·active·disabled)</h2>
        <StatePrefixDemo />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>④ 반응형 접두사 (md·lg)</h2>
        <ResponsiveDemo />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>⑤ 실전 — 알림 배너</h2>
        <TailwindStyledComponents />
      </div>
    </div>
  );
}
