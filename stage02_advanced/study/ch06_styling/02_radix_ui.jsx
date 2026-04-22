/**
 * 02_radix_ui.jsx — Radix UI (Headless UI)
 * ==========================================
 * ⚠️ 설치 필요:
 *   npm install radix-ui@latest
 *   npm install @radix-ui/themes     (테마 포함 버전)
 *
 * Radix UI는 기능(동작, 접근성)만 있고 스타일이 없는 Headless 라이브러리입니다.
 * Tailwind CSS와 조합하면 완전히 커스텀된 UI를 쉽게 만들 수 있습니다.
 *
 * 1. Headless 개념 이해
 * 2. Radix UI 코드 패턴 가이드
 * 3. 직접 만드는 Headless 컴포넌트 (아코디언, 토글, 탭)
 * 4. themes 컴포넌트 코드 패턴
 */

import { useState, useRef } from 'react';

// ─────────────────────────────────────────────
// 개념 설명: Headless란?
// ─────────────────────────────────────────────

export function HeadlessConceptGuide() {
  const [activeTab, setActiveTab] = useState('concept');

  const tabs = {
    concept: {
      label: '개념',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ padding: '12px', background: '#fafafa', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <p style={{ fontWeight: '700', marginBottom: '8px' }}>Headless UI = 기능 ✅ / 스타일 ❌</p>
            <p style={{ fontSize: '0.82rem', color: '#6b7280', lineHeight: '1.7' }}>
              일반 UI 라이브러리는 버튼의 색깔, 크기, 폰트까지 모두 결정되어 있습니다.<br />
              <strong>Radix UI (Headless)</strong>는 "모달이 열리고 닫히는 동작", "ESC 키로 닫기",
              "포커스 트랩", "ARIA 속성" 같은 <strong>기능만</strong> 제공합니다.<br />
              겉모양은 개발자가 Tailwind나 CSS로 자유롭게 결정합니다.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { icon: '🎨', title: '완전한 디자인 자유', desc: '색상, 폰트, 크기를 100% 직접 결정' },
              { icon: '♿', title: '접근성 자동 처리', desc: 'ARIA, 키보드 탐색, 포커스 관리 내장' },
              { icon: '🏗️', title: '디자인 시스템에 적합', desc: '브랜드 가이드라인 그대로 구현 가능' },
              { icon: '🤝', title: 'Tailwind와 최상의 조합', desc: 'className에 Tailwind 클래스 바로 적용' },
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
    radix_code: {
      label: 'Radix 코드 패턴',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontSize: '0.82rem', color: '#6b7280' }}>
            Radix primitive의 Dialog 예시입니다. 기능은 Radix가, 스타일은 Tailwind가 담당합니다.
          </p>
          <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '12px', borderRadius: '8px', fontSize: '0.73rem', overflow: 'auto', maxHeight: '280px', lineHeight: '1.65' }}>
{`// npm install @radix-ui/react-dialog
import * as Dialog from '@radix-ui/react-dialog';

function ConfirmDialog() {
  return (
    <Dialog.Root>
      {/* 트리거: asChild = Dialog 래퍼 없이 내 버튼을 그대로 사용 */}
      <Dialog.Trigger asChild>
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
          삭제하기
        </button>
      </Dialog.Trigger>

      {/* Portal: body 바로 아래에 렌더링 (z-index 문제 방지) */}
      <Dialog.Portal>
        {/* Overlay: 배경 어둡게 + 클릭 시 닫힘 */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Content: 모달 본체 */}
        <Dialog.Content className="
          fixed top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2
          bg-white rounded-2xl p-6 w-96
          shadow-2xl
        ">
          <Dialog.Title className="text-xl font-bold mb-2 text-gray-900">
            정말 삭제하시겠어요?
          </Dialog.Title>
          <Dialog.Description className="text-gray-500 text-sm mb-6">
            삭제한 데이터는 복구할 수 없습니다.
          </Dialog.Description>

          <div className="flex gap-3 justify-end">
            <Dialog.Close asChild>
              <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                취소
              </button>
            </Dialog.Close>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              삭제
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}`}
          </pre>
        </div>
      ),
    },
    themes_code: {
      label: 'themes 코드 패턴',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontSize: '0.82rem', color: '#6b7280' }}>
            @radix-ui/themes는 기본 스타일이 포함된 컴포넌트를 제공합니다.
          </p>
          <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '12px', borderRadius: '8px', fontSize: '0.73rem', overflow: 'auto', maxHeight: '280px', lineHeight: '1.65' }}>
{`// main.jsx — Theme으로 앱 전체 감싸기
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

ReactDOM.render(
  <Theme accentColor="indigo" radius="medium" scaling="100%">
    <App />
  </Theme>,
  document.getElementById('root')
);

// 컴포넌트 사용 예시
import { Button, TextField, Card, Badge, Flex } from '@radix-ui/themes';

function ProductCard({ name, price, stock }) {
  return (
    <Card size="3">
      <Flex direction="column" gap="3">
        <Flex justify="between" align="center">
          <h3 style={{ fontWeight: 700 }}>{name}</h3>
          <Badge color={stock > 0 ? "green" : "red"} size="2">
            {stock > 0 ? "재고 있음" : "품절"}
          </Badge>
        </Flex>

        <p style={{ color: "var(--gray-11)" }}>
          {price.toLocaleString()}원
        </p>

        <Flex gap="2">
          <Button color="indigo" size="2" variant="solid">
            장바구니 담기
          </Button>
          <Button color="indigo" size="2" variant="outline">
            위시리스트
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}`}
          </pre>
        </div>
      ),
    },
  };

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        {Object.entries(tabs).map(([key, t]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            style={{ padding: '5px 12px', background: activeTab === key ? '#6366f1' : '#f3f4f6', color: activeTab === key ? 'white' : '#374151', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: activeTab === key ? '700' : '400' }}>
            {t.label}
          </button>
        ))}
      </div>
      {tabs[activeTab].content}
    </div>
  );
}

// ─────────────────────────────────────────────
// 직접 만드는 Headless 아코디언
// (Radix 없이 Headless 패턴을 직접 구현)
// ─────────────────────────────────────────────

/**
 * Radix UI의 Accordion primitive가 하는 일을 직접 구현합니다.
 * - 열고 닫는 상태 관리
 * - 키보드 접근성 (Enter/Space로 열기)
 * - ARIA 속성 자동 적용
 */
export function HandmadeAccordion() {
  const [openItem, setOpenItem] = useState(null);

  const items = [
    {
      id: 'q1',
      question: 'Headless UI가 무엇인가요?',
      answer: '기능(동작, 접근성)만 제공하고 스타일은 포함하지 않는 UI 컴포넌트 방식입니다. 개발자가 CSS나 Tailwind로 원하는 대로 스타일링할 수 있습니다.',
    },
    {
      id: 'q2',
      question: 'Radix UI를 쓰면 어떤 점이 좋은가요?',
      answer: 'ARIA 속성, 키보드 탐색, 포커스 트랩 등 접근성 처리를 자동으로 해줍니다. 복잡한 UI(모달, 드롭다운, 탭 등)를 처음부터 구현할 필요가 없습니다.',
    },
    {
      id: 'q3',
      question: 'Tailwind CSS와 조합하면?',
      answer: 'Radix는 기능, Tailwind는 스타일을 담당하는 이상적인 조합입니다. className에 Tailwind 클래스를 바로 적용할 수 있어 코드가 간결해집니다.',
    },
    {
      id: 'q4',
      question: 'shadcn/ui와의 관계는?',
      answer: 'shadcn/ui는 Radix UI + Tailwind CSS로 만들어진 컴포넌트 라이브러리입니다. Radix의 기능 위에 Tailwind 스타일을 입힌 완성된 컴포넌트를 제공합니다.',
    },
  ];

  const toggle = (id) => setOpenItem(prev => prev === id ? null : id);

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '12px' }}>
        Radix Accordion의 동작 방식을 직접 구현한 예제입니다. (ARIA 속성 포함)
      </p>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
        {items.map((item, i) => {
          const isOpen = openItem === item.id;
          return (
            <div key={item.id} style={{ borderBottom: i < items.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
              {/* 트리거 버튼 — ARIA 속성으로 접근성 처리 */}
              <button
                onClick={() => toggle(item.id)}
                // aria-expanded: 펼쳐진 상태를 스크린 리더에 알림
                aria-expanded={isOpen}
                // aria-controls: 제어하는 콘텐츠 영역 ID 연결
                aria-controls={`content-${item.id}`}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 16px',
                  background: isOpen ? '#fafafa' : 'white',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                  fontWeight: isOpen ? '700' : '500',
                  fontSize: '0.9rem',
                  color: isOpen ? '#4f46e5' : '#1e293b',
                }}
              >
                {item.question}
                <span style={{
                  fontSize: '0.85rem',
                  color: '#9ca3af',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  flexShrink: 0,
                  marginLeft: '12px',
                }}>▼</span>
              </button>

              {/* 콘텐츠 영역 — aria-labelledby로 트리거와 연결 */}
              <div
                id={`content-${item.id}`}
                role="region"
                aria-labelledby={`trigger-${item.id}`}
                style={{
                  maxHeight: isOpen ? '200px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.25s ease',
                }}
              >
                <p style={{
                  padding: '0 16px 14px',
                  fontSize: '0.85rem',
                  color: '#6b7280',
                  lineHeight: '1.7',
                }}>
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Radix 코드와 비교 */}
      <details style={{ marginTop: '12px' }}>
        <summary style={{ fontSize: '0.8rem', color: '#6366f1', cursor: 'pointer', fontWeight: '600' }}>
          Radix Accordion 실제 코드 보기
        </summary>
        <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '10px', borderRadius: '6px', fontSize: '0.73rem', overflow: 'auto', lineHeight: '1.65', marginTop: '8px' }}>
{`// npm install @radix-ui/react-accordion
import * as Accordion from '@radix-ui/react-accordion';

function FAQAccordion() {
  return (
    <Accordion.Root type="single" collapsible>
      <Accordion.Item value="q1">
        {/* Radix가 aria-expanded, aria-controls를 자동으로 처리 */}
        <Accordion.Trigger className="flex justify-between w-full p-4 font-semibold hover:bg-gray-50">
          Headless UI가 무엇인가요?
          <ChevronDownIcon className="transition-transform data-[state=open]:rotate-180" />
        </Accordion.Trigger>
        {/* 애니메이션도 자동 처리 */}
        <Accordion.Content className="overflow-hidden data-[state=open]:animate-slideDown">
          <p className="px-4 pb-4 text-gray-600">설명 내용...</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}`}
        </pre>
      </details>
    </div>
  );
}

// ─────────────────────────────────────────────
// 직접 만드는 Headless 토글 그룹 (탭 스타일)
// ─────────────────────────────────────────────

export function HandmadeTabs() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: '개요', icon: '📋' },
    { id: 'features', label: '기능', icon: '⚡' },
    { id: 'pricing',  label: '요금제', icon: '💰' },
    { id: 'support',  label: '지원', icon: '🛟' },
  ];

  const contents = {
    overview: { title: '서비스 개요', body: 'Radix UI를 사용하면 탭 컴포넌트의 포커스 관리, 키보드 탐색 (← → 키), ARIA role="tablist/tab/tabpanel" 등을 자동으로 처리합니다.' },
    features: { title: '주요 기능', body: '다이얼로그, 드롭다운, 팝오버, 툴팁, 토스트, 아코디언 등 복잡한 UI 패턴을 모두 제공합니다. 각 컴포넌트는 WAI-ARIA 명세를 완벽히 준수합니다.' },
    pricing:  { title: '요금제 안내', body: 'Radix UI는 완전 무료 오픈소스입니다. MIT 라이선스로 상업용 프로젝트에도 제한 없이 사용할 수 있습니다.' },
    support:  { title: '기술 지원', body: 'GitHub Issues와 Discord 커뮤니티를 통해 지원받을 수 있습니다. 공식 문서는 radix-ui.com에서 확인하세요.' },
  };

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '12px' }}>
        Radix Tabs primitive의 동작 방식을 직접 구현 (키보드 접근성 포함)
      </p>
      {/* 탭 목록 — role="tablist" */}
      <div
        role="tablist"
        aria-label="서비스 정보"
        style={{ display: 'flex', borderBottom: '2px solid #e5e7eb', marginBottom: '0' }}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={e => {
              // 키보드 탐색: ← → 키로 탭 이동
              const idx = tabs.findIndex(t => t.id === activeTab);
              if (e.key === 'ArrowRight') setActiveTab(tabs[(idx + 1) % tabs.length].id);
              if (e.key === 'ArrowLeft')  setActiveTab(tabs[(idx - 1 + tabs.length) % tabs.length].id);
            }}
            style={{
              padding: '10px 14px',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #6366f1' : '2px solid transparent',
              marginBottom: '-2px',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: activeTab === tab.id ? '700' : '400',
              color: activeTab === tab.id ? '#4f46e5' : '#6b7280',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 패널 */}
      {tabs.map(tab => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          style={{ padding: '16px 4px' }}
        >
          <p style={{ fontWeight: '700', marginBottom: '6px', color: '#1e293b' }}>
            {contents[tab.id].title}
          </p>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: '1.7' }}>
            {contents[tab.id].body}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#c4b5fd', marginTop: '8px' }}>
            💡 ← → 키보드로 탭을 이동할 수 있습니다 (접근성)
          </p>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Radix themes 컴포넌트 시각화 (설치 없이 재현)
// ─────────────────────────────────────────────

export function RadixThemesPreview() {
  const [modalOpen, setModalOpen] = useState(false);

  const btnVariants = [
    { label: 'solid (기본)', bg: '#6366f1', color: 'white', border: 'none' },
    { label: 'soft', bg: '#eef2ff', color: '#4f46e5', border: 'none' },
    { label: 'outline', bg: 'transparent', color: '#4f46e5', border: '1.5px solid #6366f1' },
    { label: 'ghost', bg: 'transparent', color: '#4f46e5', border: 'none' },
  ];

  const badgeColors = [
    { label: 'green', bg: '#dcfce7', text: '#166534' },
    { label: 'red', bg: '#fee2e2', text: '#dc2626' },
    { label: 'yellow', bg: '#fef9c3', text: '#92400e' },
    { label: 'blue', bg: '#dbeafe', text: '#1d4ed8' },
    { label: 'purple', bg: '#f3e8ff', text: '#7c3aed' },
  ];

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '14px' }}>
        @radix-ui/themes 컴포넌트들을 재현한 미리보기입니다.
      </p>

      {/* Button variants */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Button 컴포넌트 variants</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {btnVariants.map(v => (
            <button key={v.label}
              style={{ padding: '7px 16px', background: v.bg, color: v.color, border: v.border, borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600' }}>
              {v.label}
            </button>
          ))}
        </div>
        <pre style={{ marginTop: '8px', background: '#1e293b', color: '#c7d2fe', padding: '8px 10px', borderRadius: '5px', fontSize: '0.72rem', overflow: 'auto' }}>
{`<Button variant="solid">solid</Button>
<Button variant="soft">soft</Button>
<Button variant="outline">outline</Button>
<Button variant="ghost">ghost</Button>`}
        </pre>
      </div>

      {/* Badge */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Badge 컴포넌트</p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {badgeColors.map(b => (
            <span key={b.label} style={{ background: b.bg, color: b.text, padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600' }}>
              {b.label}
            </span>
          ))}
        </div>
      </div>

      {/* Dialog 시뮬레이터 */}
      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Dialog 컴포넌트</p>
        <button
          onClick={() => setModalOpen(true)}
          style={{ padding: '8px 18px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
        >
          모달 열기
        </button>
        {modalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
            onClick={() => setModalOpen(false)}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', width: '360px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}
              onClick={e => e.stopPropagation()}>
              <h3 style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '8px' }}>Radix Dialog 미리보기</h3>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '20px' }}>
                실제 Radix Dialog는 이 구조에 ARIA, 포커스 트랩, ESC 키 닫기 등이 자동으로 추가됩니다.
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={() => setModalOpen(false)}
                  style={{ padding: '8px 16px', background: '#f3f4f6', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>
                  취소
                </button>
                <button onClick={() => setModalOpen(false)}
                  style={{ padding: '8px 16px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 전체 데모
// ─────────────────────────────────────────────
export default function RadixUIDemo() {
  const sectionStyle = {
    marginBottom: '24px',
    padding: '16px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>Radix UI</h1>
      <div style={{ padding: '8px 12px', background: '#fef9c3', borderRadius: '6px', marginBottom: '20px', fontSize: '0.82rem', color: '#92400e' }}>
        ⚠️ 실제 Radix UI 사용: <code>npm install radix-ui@latest</code>
        &nbsp;· 아래 예제는 Headless 패턴을 직접 구현합니다.
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>① Headless 개념 & 코드 패턴</h2>
        <HeadlessConceptGuide />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>② 직접 만드는 Headless 아코디언</h2>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
          Radix Accordion이 제공하는 기능을 직접 구현해봅니다. (ARIA 속성, 애니메이션 포함)
        </p>
        <HandmadeAccordion />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>③ 직접 만드는 Headless 탭</h2>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
          ← → 키보드로 탭을 이동해보세요. (접근성 직접 구현)
        </p>
        <HandmadeTabs />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>④ @radix-ui/themes 컴포넌트 미리보기</h2>
        <RadixThemesPreview />
      </div>
    </div>
  );
}
