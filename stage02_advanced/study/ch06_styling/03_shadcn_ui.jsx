/**
 * 03_shadcn_ui.jsx — shadcn/ui
 * ==============================
 * ⚠️ 설치 필요:
 *   npm install tailwindcss @tailwindcss/vite
 *   npx shadcn@latest init
 *   npx shadcn@latest add button accordion dialog card
 *
 * shadcn/ui는 Radix UI + Tailwind CSS 조합으로 만든 컴포넌트입니다.
 * 특이점: 패키지를 설치하는 게 아니라 코드를 프로젝트에 직접 복사합니다.
 * 따라서 생성된 코드를 자유롭게 수정할 수 있습니다.
 *
 * 1. shadcn/ui의 특징과 다른 라이브러리와의 차이
 * 2. 설치 흐름 가이드
 * 3. 주요 컴포넌트 코드 패턴 (Button, Card, Accordion, Dialog)
 * 4. 직접 구현으로 동작 체험
 */

import { useState } from 'react';

// ─────────────────────────────────────────────
// shadcn/ui 개념 & 특징 가이드
// ─────────────────────────────────────────────

export function ShadcnConceptGuide() {
  const [activeTab, setActiveTab] = useState('difference');

  const tabs = {
    difference: {
      label: '다른 라이브러리와의 차이',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            {
              lib: 'Material-UI / Chakra UI',
              emoji: '🏪',
              install: 'npm install @mui/material',
              howItWorks: 'node_modules 안에 있는 컴포넌트를 import해서 사용',
              customization: '테마 시스템으로만 가능. 내부 코드 수정 불가',
              bg: '#fff5f5',
              border: '#fca5a5',
            },
            {
              lib: 'shadcn/ui',
              emoji: '📋',
              install: 'npx shadcn@latest add button',
              howItWorks: 'src/components/ui/button.jsx 파일이 내 프로젝트에 생성됨',
              customization: '생성된 코드를 직접 열어서 수정. 100% 자유로움',
              bg: '#f0fdf4',
              border: '#86efac',
            },
          ].map(item => (
            <div key={item.lib} style={{ padding: '12px 14px', background: item.bg, borderRadius: '8px', border: `1px solid ${item.border}` }}>
              <p style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '8px' }}>{item.emoji} {item.lib}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#9ca3af', minWidth: '60px' }}>설치</span>
                  <code style={{ color: '#374151' }}>{item.install}</code>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#9ca3af', minWidth: '60px' }}>동작</span>
                  <span style={{ color: '#374151' }}>{item.howItWorks}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#9ca3af', minWidth: '60px' }}>수정</span>
                  <span style={{ color: '#374151' }}>{item.customization}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    setup: {
      label: '설치 흐름',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            {
              step: 'Step 1',
              title: 'Tailwind CSS 설치',
              code: 'npm install tailwindcss @tailwindcss/vite',
              note: 'vite.config.js에 플러그인 추가, index.css에 @import 추가',
            },
            {
              step: 'Step 2',
              title: 'jsconfig.json 경로 별칭 설정',
              code: `{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}`,
              note: '@/ 로 src/ 폴더를 짧게 참조할 수 있습니다',
            },
            {
              step: 'Step 3',
              title: 'vite.config.js 별칭 추가',
              code: `import path from 'path';
// resolve: { alias: { '@': path.resolve(__dirname, './src') } }`,
              note: '',
            },
            {
              step: 'Step 4',
              title: 'shadcn/ui 초기화',
              code: 'npx shadcn@latest init',
              note: '프로젝트 설정(테마, 스타일 등)을 선택하는 인터랙티브 CLI가 실행됩니다',
            },
            {
              step: 'Step 5',
              title: '필요한 컴포넌트 추가',
              code: `npx shadcn@latest add button
npx shadcn@latest add accordion
npx shadcn@latest add dialog card`,
              note: 'src/components/ui/ 안에 컴포넌트 파일이 생성됩니다',
            },
          ].map(({ step, title, code, note }) => (
            <div key={step} style={{ padding: '10px 12px', background: '#fafafa', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.7rem', background: '#6366f1', color: 'white', padding: '2px 8px', borderRadius: '999px', fontWeight: '700' }}>{step}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>{title}</span>
              </div>
              <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '7px 10px', borderRadius: '5px', fontSize: '0.75rem', overflow: 'auto', margin: '0 0 4px' }}>
                {code}
              </pre>
              {note && <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>💡 {note}</p>}
            </div>
          ))}
        </div>
      ),
    },
    file_structure: {
      label: '생성되는 파일 구조',
      content: (
        <div>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
            <code>npx shadcn@latest add button accordion</code> 실행 후 생성되는 파일 구조:
          </p>
          <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '14px', borderRadius: '8px', fontSize: '0.78rem', lineHeight: '1.8' }}>
{`src/
├── components/
│   └── ui/                   ← shadcn이 생성하는 폴더
│       ├── button.jsx         ← 내 프로젝트 안에 있는 진짜 코드!
│       ├── accordion.jsx      ← 열어서 직접 수정 가능
│       ├── dialog.jsx
│       └── card.jsx
├── lib/
│   └── utils.js               ← cn() 유틸리티 (clsx + tailwind-merge)
└── App.jsx`}
          </pre>
          <div style={{ marginTop: '10px', padding: '10px 12px', background: '#eef2ff', borderRadius: '8px', fontSize: '0.82rem', color: '#4f46e5' }}>
            <p style={{ fontWeight: '700', marginBottom: '4px' }}>💡 핵심 차이점</p>
            <p>일반 라이브러리: <code>node_modules/@mui/material/Button.js</code> (수정 불가)</p>
            <p style={{ marginTop: '3px' }}>shadcn/ui: <code>src/components/ui/button.jsx</code> (직접 수정 가능!) </p>
          </div>
        </div>
      ),
    },
  };

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
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
// shadcn/ui 컴포넌트 코드 패턴 가이드
// ─────────────────────────────────────────────

export function ShadcnComponentCodeGuide() {
  const [activeComponent, setActiveComponent] = useState('button');

  const components = {
    button: {
      label: 'Button',
      usage: `import { Button } from '@/components/ui/button';

// variant: default | destructive | outline | secondary | ghost | link
// size: default | sm | lg | icon

function Example() {
  return (
    <div className="flex gap-2">
      <Button>기본</Button>
      <Button variant="destructive">삭제</Button>
      <Button variant="outline">외곽선</Button>
      <Button variant="secondary">보조</Button>
      <Button variant="ghost">고스트</Button>
      <Button size="sm">작게</Button>
      <Button size="lg">크게</Button>
      <Button disabled>비활성</Button>
    </div>
  );
}`,
      preview: (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { label: '기본', bg: '#1e293b', color: 'white', border: 'none' },
            { label: '삭제', bg: '#dc2626', color: 'white', border: 'none' },
            { label: '외곽선', bg: 'white', color: '#1e293b', border: '1px solid #e5e7eb' },
            { label: '보조', bg: '#f1f5f9', color: '#1e293b', border: 'none' },
            { label: '고스트', bg: 'transparent', color: '#1e293b', border: 'none' },
          ].map(b => (
            <button key={b.label} style={{ padding: '7px 14px', background: b.bg, color: b.color, border: b.border, borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '500' }}>
              {b.label}
            </button>
          ))}
        </div>
      ),
    },
    card: {
      label: 'Card',
      usage: `import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

function ProductCard() {
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>아이폰 15</CardTitle>
        <CardDescription>Apple의 최신 스마트폰</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">1,350,000원</p>
        <p className="text-sm text-gray-500 mt-1">무료 배송 · 재고 있음</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button className="flex-1">구매하기</Button>
        <Button variant="outline" className="flex-1">위시리스트</Button>
      </CardFooter>
    </Card>
  );
}`,
      preview: (
        <div style={{ width: '280px', border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', background: 'white' }}>
          <div style={{ padding: '16px 16px 0' }}>
            <p style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '3px' }}>아이폰 15</p>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '12px' }}>Apple의 최신 스마트폰</p>
          </div>
          <div style={{ padding: '0 16px 16px' }}>
            <p style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '3px' }}>1,350,000원</p>
            <p style={{ fontSize: '0.78rem', color: '#9ca3af' }}>무료 배송 · 재고 있음</p>
          </div>
          <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '8px' }}>
            <button style={{ flex: 1, padding: '7px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}>구매하기</button>
            <button style={{ flex: 1, padding: '7px', background: 'white', color: '#1e293b', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}>위시리스트</button>
          </div>
        </div>
      ),
    },
    accordion: {
      label: 'Accordion',
      usage: `import {
  Accordion, AccordionItem,
  AccordionTrigger, AccordionContent
} from '@/components/ui/accordion';

// type="single": 한 번에 하나만 열림
// type="multiple": 여러 개 동시에 열림 가능
// collapsible: 열린 것을 다시 클릭해서 닫을 수 있음

function FAQSection() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="q1">
        <AccordionTrigger>배송은 얼마나 걸리나요?</AccordionTrigger>
        <AccordionContent>
          주문 후 2~3 영업일 내에 배송됩니다.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="q2">
        <AccordionTrigger>교환/반품이 가능한가요?</AccordionTrigger>
        <AccordionContent>
          구매일로부터 7일 이내 가능합니다.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`,
      preview: null, // 아래 별도 예제 컴포넌트 사용
    },
    dialog: {
      label: 'Dialog',
      usage: `import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose
} from '@/components/ui/dialog';

function DeleteConfirm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">삭제하기</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>정말 삭제하시겠어요?</DialogTitle>
          <DialogDescription>
            이 작업은 되돌릴 수 없습니다.
            삭제 후 데이터를 복구할 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button variant="destructive">삭제</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`,
      preview: null,
    },
  };

  const comp = components[activeComponent];

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {Object.entries(components).map(([key, c]) => (
          <button key={key} onClick={() => setActiveComponent(key)}
            style={{ padding: '5px 12px', background: activeComponent === key ? '#1e293b' : '#f3f4f6', color: activeComponent === key ? 'white' : '#374151', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: activeComponent === key ? '700' : '400' }}>
            {c.label}
          </button>
        ))}
      </div>

      {comp.preview && (
        <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', marginBottom: '10px', border: '1px dashed #d1d5db' }}>
          <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '10px' }}>▶ 미리보기</p>
          {comp.preview}
        </div>
      )}

      <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '12px', borderRadius: '8px', fontSize: '0.73rem', overflow: 'auto', maxHeight: '260px', lineHeight: '1.65' }}>
        {comp.usage}
      </pre>
    </div>
  );
}

// ─────────────────────────────────────────────
// 실전 구현: shadcn/ui 스타일 컴포넌트 직접 만들기
// ─────────────────────────────────────────────

/** shadcn/ui의 cn() 유틸리티 — 조건부 클래스 조합 함수 (설치 없이 간단히 구현) */
const cn = (...classes) => classes.filter(Boolean).join(' ');

/**
 * shadcn/ui의 Button 컴포넌트 구조를 직접 구현합니다.
 * 실제 shadcn Button은 cva(class-variance-authority)로 variant를 관리합니다.
 */
function ShadcnStyleButton({ children, variant = 'default', size = 'default', disabled = false, onClick, className = '' }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '6px', fontWeight: '500', cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none', transition: 'all 0.15s', opacity: disabled ? 0.5 : 1,
  };
  const variants = {
    default:     { background: '#18181b', color: 'white' },
    destructive: { background: '#dc2626', color: 'white' },
    outline:     { background: 'transparent', color: '#18181b', border: '1px solid #e4e4e7' },
    secondary:   { background: '#f4f4f5', color: '#18181b' },
    ghost:       { background: 'transparent', color: '#18181b' },
  };
  const sizes = {
    sm:      { padding: '5px 10px', fontSize: '0.78rem' },
    default: { padding: '8px 16px', fontSize: '0.85rem' },
    lg:      { padding: '11px 24px', fontSize: '0.95rem' },
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{ ...base, ...variants[variant], ...sizes[size] }}
    >
      {children}
    </button>
  );
}

export function ShadcnStyleShowcase() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(null);
  const [tab, setTab] = useState('buttons');

  const faqItems = [
    { id: '1', q: '배송은 얼마나 걸리나요?', a: '주문 후 2~3 영업일 내 배송됩니다. 도서산간 지역은 추가로 1~2일 더 소요될 수 있습니다.' },
    { id: '2', q: '교환/반품이 가능한가요?', a: '구매일로부터 7일 이내에 교환 및 반품이 가능합니다. 단, 사용한 제품은 반품이 불가능합니다.' },
    { id: '3', q: '영수증 발급이 가능한가요?', a: '마이페이지 > 주문 내역에서 현금영수증 및 세금계산서 발급이 가능합니다.' },
  ];

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>
        {['buttons', 'card', 'accordion', 'dialog'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '5px 12px', background: tab === t ? '#18181b' : '#f3f4f6', color: tab === t ? 'white' : '#374151', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.82rem' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Buttons */}
      {tab === 'buttons' && (
        <div>
          <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: '10px' }}>shadcn/ui Button variants</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {['default', 'destructive', 'outline', 'secondary', 'ghost'].map(v => (
              <ShadcnStyleButton key={v} variant={v}>{v}</ShadcnStyleButton>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <ShadcnStyleButton size="sm">Small</ShadcnStyleButton>
            <ShadcnStyleButton size="default">Default</ShadcnStyleButton>
            <ShadcnStyleButton size="lg">Large</ShadcnStyleButton>
            <ShadcnStyleButton disabled>Disabled</ShadcnStyleButton>
          </div>
        </div>
      )}

      {/* Card */}
      {tab === 'card' && (
        <div style={{ border: '1px solid #e4e4e7', borderRadius: '10px', overflow: 'hidden', maxWidth: '320px', background: 'white' }}>
          <div style={{ padding: '20px 20px 0' }}>
            <p style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '3px' }}>아이폰 15 Pro</p>
            <p style={{ fontSize: '0.8rem', color: '#71717a', marginBottom: '14px' }}>최강의 성능, 티타늄 디자인</p>
          </div>
          <div style={{ padding: '0 20px 16px' }}>
            <p style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>1,650,000원</p>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['자연 티타늄', '블루 티타늄', '화이트'].map(color => (
                <span key={color} style={{ fontSize: '0.72rem', background: '#f4f4f5', color: '#3f3f46', padding: '2px 8px', borderRadius: '999px' }}>{color}</span>
              ))}
            </div>
          </div>
          <div style={{ padding: '12px 20px', borderTop: '1px solid #f4f4f5', display: 'flex', gap: '8px' }}>
            <ShadcnStyleButton size="default" className="flex-1" onClick={() => {}}>구매하기</ShadcnStyleButton>
            <ShadcnStyleButton variant="outline" size="default" onClick={() => {}}>비교하기</ShadcnStyleButton>
          </div>
        </div>
      )}

      {/* Accordion */}
      {tab === 'accordion' && (
        <div style={{ border: '1px solid #e4e4e7', borderRadius: '8px', overflow: 'hidden' }}>
          {faqItems.map((item, i) => {
            const isOpen = accordionOpen === item.id;
            return (
              <div key={item.id} style={{ borderBottom: i < faqItems.length - 1 ? '1px solid #f4f4f5' : 'none' }}>
                <button
                  onClick={() => setAccordionOpen(isOpen ? null : item.id)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: '500', fontSize: '0.88rem' }}
                >
                  {item.q}
                  <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', fontSize: '0.75rem', color: '#a1a1aa' }}>▼</span>
                </button>
                <div style={{ maxHeight: isOpen ? '120px' : '0', overflow: 'hidden', transition: 'max-height 0.25s ease' }}>
                  <p style={{ padding: '0 16px 14px', fontSize: '0.83rem', color: '#71717a', lineHeight: '1.7' }}>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog */}
      {tab === 'dialog' && (
        <div>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '12px' }}>
            Dialog 트리거 버튼을 클릭하면 shadcn/ui 스타일 모달이 열립니다.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <ShadcnStyleButton onClick={() => setDialogOpen(true)}>모달 열기</ShadcnStyleButton>
            <ShadcnStyleButton variant="destructive" onClick={() => setDialogOpen(true)}>삭제 확인</ShadcnStyleButton>
          </div>

          {dialogOpen && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}
              onClick={() => setDialogOpen(false)}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}
                onClick={e => e.stopPropagation()}>
                <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '6px' }}>정말 삭제하시겠어요?</h3>
                <p style={{ fontSize: '0.85rem', color: '#71717a', marginBottom: '20px', lineHeight: '1.6' }}>
                  이 작업은 되돌릴 수 없습니다. 삭제 후 데이터를 복구할 수 없습니다.
                </p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <ShadcnStyleButton variant="outline" onClick={() => setDialogOpen(false)}>취소</ShadcnStyleButton>
                  <ShadcnStyleButton variant="destructive" onClick={() => setDialogOpen(false)}>삭제</ShadcnStyleButton>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 전체 데모
// ─────────────────────────────────────────────
export default function ShadcnUIDemo() {
  const sectionStyle = {
    marginBottom: '24px',
    padding: '16px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>shadcn/ui</h1>
      <div style={{ padding: '8px 12px', background: '#fef9c3', borderRadius: '6px', marginBottom: '20px', fontSize: '0.82rem', color: '#92400e' }}>
        ⚠️ 실제 사용: <code>npx shadcn@latest init</code> 후 <code>npx shadcn@latest add [컴포넌트]</code>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>① 개념 & 설치 흐름</h2>
        <ShadcnConceptGuide />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>② 주요 컴포넌트 코드 패턴</h2>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
          실제 shadcn/ui 사용 코드와 동작 미리보기입니다.
        </p>
        <ShadcnComponentCodeGuide />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>③ 직접 구현 — shadcn/ui 스타일 체험</h2>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
          설치 없이 shadcn/ui와 동일한 디자인의 컴포넌트를 체험합니다.
        </p>
        <ShadcnStyleShowcase />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '10px' }}>④ 세 가지 스타일링 방식 최종 비교</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { name: 'Tailwind CSS', emoji: '🎨', pros: '완전한 자유도, 빠른 작성', cons: '복잡한 컴포넌트 직접 구현 필요', when: '커스텀 디자인, 처음부터 구축' },
            { name: 'Radix UI', emoji: '🧱', pros: '접근성 자동 처리, 기능 완성도', cons: '스타일 직접 구현 필요', when: '디자인 시스템 구축, Tailwind와 조합' },
            { name: 'shadcn/ui', emoji: '📋', pros: '코드 수정 자유, 스타일 포함', cons: '초기 설정 필요, Tailwind 의존', when: '빠른 개발 + 커스텀 필요한 모든 상황' },
          ].map(({ name, emoji, pros, cons, when }) => (
            <div key={name} style={{ padding: '12px 14px', background: '#fafafa', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <p style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '6px' }}>{emoji} {name}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.78rem' }}>
                <div style={{ padding: '5px 8px', background: '#dcfce7', borderRadius: '5px' }}>
                  <span style={{ color: '#166534' }}>👍 {pros}</span>
                </div>
                <div style={{ padding: '5px 8px', background: '#fee2e2', borderRadius: '5px' }}>
                  <span style={{ color: '#dc2626' }}>👎 {cons}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '5px' }}>💡 적합한 상황: {when}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
