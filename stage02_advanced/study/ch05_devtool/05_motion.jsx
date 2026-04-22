/**
 * 05_motion.jsx — Motion 애니메이션
 * =====================================
 * ⚠️ 설치 필요: npm install motion
 *
 * Motion은 선언형으로 애니메이션을 정의하는 라이브러리입니다.
 * CSS 애니메이션보다 코드가 직관적이고, React 상태와 연동이 쉽습니다.
 *
 * 1. 기본 등장 애니메이션 (initial → animate)
 * 2. 호버/탭 제스처 (whileHover, whileTap)
 * 3. 퇴장 애니메이션 (exit + AnimatePresence)
 * 4. 리스트 스태거 (staggerChildren)
 * 5. CSS 애니메이션과 비교
 *
 * [설치 없이 실행] Motion이 없어도 이 파일은 동작합니다.
 * Motion 코드는 주석으로 표시하고, 동일한 효과를 CSS transition으로 구현합니다.
 */

import { useState, useEffect } from 'react';

// ─────────────────────────────────────────────
// Motion 개념 설명 컴포넌트
// ─────────────────────────────────────────────

export function MotionConceptGuide() {
  const [activeTab, setActiveTab] = useState('basic');

  const examples = {
    basic: {
      title: '기본 등장 애니메이션',
      code: `import { motion } from 'motion/react';

// initial: 시작 상태 (안 보이고 아래에 있음)
// animate: 최종 상태 (보이고 제자리)
// transition: 애니메이션 설정

function FadeInCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      카드 내용
    </motion.div>
  );
}`,
      description: '컴포넌트가 처음 나타날 때 아래에서 위로 페이드인합니다.',
    },
    gesture: {
      title: '호버 & 탭 제스처',
      code: `import { motion } from 'motion/react';

function AnimatedButton() {
  return (
    <motion.button
      // 마우스를 올리면 살짝 커짐
      whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(99,102,241,0.4)' }}
      // 클릭할 때 살짝 눌리는 효과
      whileTap={{ scale: 0.95 }}
      // 일반 CSS처럼 스타일도 적용 가능
      style={{ padding: '12px 24px', background: '#6366f1', color: 'white',
               border: 'none', borderRadius: '8px', cursor: 'pointer' }}
    >
      클릭해보세요
    </motion.button>
  );
}`,
      description: '마우스 올리면 커지고, 클릭하면 눌리는 효과를 CSS 없이 구현합니다.',
    },
    exit: {
      title: '퇴장 애니메이션 (AnimatePresence)',
      code: `import { motion, AnimatePresence } from 'motion/react';

function NotificationList({ notifications }) {
  return (
    // AnimatePresence: 자식이 사라질 때 exit 애니메이션 실행
    <AnimatePresence>
      {notifications.map(n => (
        <motion.div
          key={n.id}
          initial={{ opacity: 0, x: 50 }}   // 오른쪽에서 등장
          animate={{ opacity: 1, x: 0 }}     // 제자리
          exit={{ opacity: 0, x: -50 }}      // 왼쪽으로 사라짐
          transition={{ duration: 0.3 }}
        >
          {n.message}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}`,
      description: '알림이 목록에서 제거될 때 왼쪽으로 밀려 사라지는 애니메이션입니다.',
    },
    stagger: {
      title: '리스트 스태거 (순차 등장)',
      code: `import { motion } from 'motion/react';

// variants: 애니메이션 상태를 이름으로 미리 정의
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 자식들이 0.1초 간격으로 순차 등장
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible:  { opacity: 1, y: 0 },
};

function StaggerList({ items }) {
  return (
    <motion.ul variants={listVariants} initial="hidden" animate="visible">
      {items.map(item => (
        <motion.li key={item.id} variants={itemVariants}>
          {item.name}
        </motion.li>
      ))}
    </motion.ul>
  );
}`,
      description: '리스트 아이템들이 0.1초 간격으로 하나씩 순차적으로 나타납니다.',
    },
  };

  const ex = examples[activeTab];

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {Object.entries(examples).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: '5px 10px',
              background: activeTab === key ? '#6366f1' : '#f3f4f6',
              color: activeTab === key ? 'white' : '#374151',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '0.78rem',
            }}
          >
            {val.title}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.82rem', color: '#374151', marginBottom: '10px', padding: '8px 12px', background: '#f9fafb', borderRadius: '6px' }}>
        💡 {ex.description}
      </p>
      <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '12px', borderRadius: '8px', fontSize: '0.74rem', overflow: 'auto', maxHeight: '220px', lineHeight: '1.6' }}>
        {ex.code}
      </pre>
    </div>
  );
}

// ─────────────────────────────────────────────
// CSS transition으로 Motion 효과 재현 (설치 불필요)
// ─────────────────────────────────────────────

/** CSS로 구현한 페이드인 카드 (Motion의 initial/animate와 동일한 효과) */
export function FadeInDemo() {
  const [items, setItems] = useState([]);
  const [visible, setVisible] = useState({});

  const addItem = () => {
    const id = Date.now();
    setItems(prev => [...prev, { id, text: `항목 ${prev.length + 1}` }]);
    // 살짝 지연 후 visible 처리 (CSS transition 트리거)
    setTimeout(() => setVisible(prev => ({ ...prev, [id]: true })), 10);
  };

  const removeItem = (id) => {
    setVisible(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    // transition이 완료된 후 실제 제거 (300ms)
    setTimeout(() => setItems(prev => prev.filter(i => i.id !== id)), 300);
  };

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '10px' }}>
        CSS transition으로 구현한 등장/퇴장 애니메이션 (Motion 없이도 동작)
      </p>
      <button
        onClick={addItem}
        style={{ marginBottom: '12px', padding: '7px 16px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
      >
        + 항목 추가
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map(item => (
          <div
            key={item.id}
            style={{
              padding: '10px 14px',
              background: '#eef2ff',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              // CSS transition — Motion의 initial/animate/exit 역할
              opacity: visible[item.id] ? 1 : 0,
              transform: visible[item.id] ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}
          >
            <span style={{ fontSize: '0.9rem', color: '#4f46e5' }}>{item.text}</span>
            <button
              onClick={() => removeItem(item.id)}
              style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              ✕
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '16px', fontSize: '0.85rem' }}>
            항목을 추가해보세요
          </p>
        )}
      </div>
    </div>
  );
}

/** CSS로 구현한 호버/탭 제스처 효과 */
export function GestureDemo() {
  const buttons = [
    { label: '기본 버튼 (transition)', style: { transition: 'transform 0.15s, box-shadow 0.15s' }, hoverStyle: 'scale(1.05)', color: '#6366f1' },
    { label: '튀어오르는 버튼', style: { transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }, hoverStyle: 'scale(1.1)', color: '#10b981' },
    { label: '흔들리는 버튼', style: { transition: 'transform 0.1s' }, hoverStyle: 'rotate(2deg) scale(1.03)', color: '#f59e0b' },
  ];

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '12px' }}>
        CSS transform + transition으로 구현한 제스처 효과 (Motion의 whileHover/whileTap과 유사)
      </p>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {buttons.map(({ label, color }) => (
          <button
            key={label}
            style={{
              padding: '10px 18px',
              background: color,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = `0 8px 20px ${color}60`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.95)'; }}
            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** CSS로 구현한 리스트 스태거 효과 */
export function StaggerDemo() {
  const [show, setShow] = useState(false);
  const items = ['🎨 디자인', '⚡ 성능', '📱 반응형', '♿ 접근성', '🔒 보안'];

  useEffect(() => {
    if (show) return;
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const restart = () => {
    setShow(false);
    setTimeout(() => setShow(true), 50);
  };

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
          각 아이템이 0.1초 간격으로 순차 등장 (Motion staggerChildren과 동일 효과)
        </p>
        <button
          onClick={restart}
          style={{ padding: '4px 10px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' }}
        >
          다시 실행
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item, i) => (
          <li
            key={item}
            style={{
              padding: '10px 14px',
              background: '#eef2ff',
              borderRadius: '8px',
              marginBottom: '6px',
              fontWeight: '500',
              color: '#4f46e5',
              // 각 아이템마다 delay를 다르게 → 스태거 효과
              opacity: show ? 1 : 0,
              transform: show ? 'translateX(0)' : 'translateX(-20px)',
              transition: `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`,
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────
// CSS vs Motion 비교 가이드
// ─────────────────────────────────────────────

export function CSSvsMotionGuide() {
  const comparisons = [
    {
      label: '단순 등장 효과',
      css: `/* CSS */
.card {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.4s ease forwards;
}
@keyframes fadeIn {
  to { opacity: 1; transform: translateY(0); }
}`,
      motion: `/* Motion */
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
/>`,
    },
    {
      label: '조건부 애니메이션',
      css: `/* CSS — 클래스를 직접 토글해야 함 */
.card { transition: opacity 0.3s; opacity: 0; }
.card.visible { opacity: 1; }

// JS에서:
el.classList.toggle('visible', isVisible);`,
      motion: `/* Motion — state 연동이 직관적 */
<motion.div
  animate={{ opacity: isVisible ? 1 : 0 }}
  transition={{ duration: 0.3 }}
/>`,
    },
  ];

  const [active, setActive] = useState(0);

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        {comparisons.map((c, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{ padding: '5px 12px', background: active === i ? '#6366f1' : '#f3f4f6', color: active === i ? 'white' : '#374151', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', marginBottom: '4px' }}>CSS + JS</p>
          <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '10px', borderRadius: '6px', fontSize: '0.71rem', overflow: 'auto', minHeight: '110px', lineHeight: '1.5' }}>
            {comparisons[active].css}
          </pre>
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#6366f1', marginBottom: '4px' }}>Motion</p>
          <pre style={{ background: '#1e1b4b', color: '#c7d2fe', padding: '10px', borderRadius: '6px', fontSize: '0.71rem', overflow: 'auto', minHeight: '110px', lineHeight: '1.5' }}>
            {comparisons[active].motion}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 전체 데모
// ─────────────────────────────────────────────
export default function MotionDemo() {
  const sectionStyle = {
    marginBottom: '24px',
    padding: '16px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  };

  return (
    <div style={{ maxWidth: '620px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>Motion 애니메이션</h1>
      <div style={{ padding: '8px 12px', background: '#fef9c3', borderRadius: '6px', marginBottom: '20px', fontSize: '0.82rem', color: '#92400e' }}>
        ⚠️ 실제 Motion 사용 시: <code>npm install motion</code>
        &nbsp;· 아래 인터랙티브 예제는 CSS로 동일 효과를 재현합니다.
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>① Motion 코드 패턴</h2>
        <MotionConceptGuide />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>② 등장/퇴장 애니메이션 (CSS 구현)</h2>
        <FadeInDemo />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>③ 호버/탭 제스처 (CSS 구현)</h2>
        <GestureDemo />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>④ 리스트 스태거 (CSS 구현)</h2>
        <StaggerDemo />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>⑤ CSS vs Motion 코드 비교</h2>
        <CSSvsMotionGuide />
      </div>
    </div>
  );
}
