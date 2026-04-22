/**
 * 07_zustand.jsx — Zustand 전역 상태 관리
 * ==========================================
 * Context API보다 간결하고, 선택적 구독이 가능한 Zustand를 살펴봅니다.
 *
 * ⚠️ 실행 전 설치 필요:
 *    npm install zustand
 *
 * 1. 기본 카운터 스토어 — create, set
 * 2. 선택적 구독 — 필요한 state만 구독
 * 3. 장바구니 스토어 — 배열 상태, 복잡한 액션
 * 4. Context API vs Zustand 비교
 */

import { create } from 'zustand';
import { useState } from 'react';

// ═══════════════════════════════════════════════
// 스토어 1: 카운터 — 가장 기본적인 Zustand 스토어
// ═══════════════════════════════════════════════

/**
 * create(set => ({ ... }))
 * - set: 상태를 업데이트하는 함수 (React의 setState와 유사)
 * - 반환 객체: 초기 상태 값 + 상태를 변경하는 액션 함수들
 */
const useCountStore = create((set) => ({
  // 상태 값
  count: 0,

  // 상태를 변경하는 액션 함수들
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset:     () => set({ count: 0 }),
  setCount:  (n) => set({ count: n }),
}));

// ═══════════════════════════════════════════════
// 스토어 2: 장바구니 — 복잡한 배열 상태
// ═══════════════════════════════════════════════

const useCartStore = create((set) => ({
  cart: [],

  addToCart: (item) =>
    set((state) => {
      const exists = state.cart.find(c => c.id === item.id);
      if (exists) {
        // 이미 있으면 수량 증가
        return {
          cart: state.cart.map(c =>
            c.id === item.id ? { ...c, qty: c.qty + 1 } : c
          ),
        };
      }
      // 없으면 새로 추가
      return { cart: [...state.cart, { ...item, qty: 1 }] };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter(c => c.id !== id),
    })),

  clearCart: () => set({ cart: [] }),
}));

// ═══════════════════════════════════════════════
// UI 컴포넌트들
// ═══════════════════════════════════════════════

/** 카운터 컴포넌트 — 스토어 전체를 구독 */
function Counter() {
  // 스토어에서 필요한 값과 함수를 한 번에 가져옵니다
  const { count, increment, decrement, reset } = useCountStore();

  return (
    <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
      <p style={{ fontSize: '2rem', fontWeight: '800', textAlign: 'center', color: '#6366f1', marginBottom: '12px' }}>
        {count}
      </p>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button
          onClick={decrement}
          style={{ padding: '7px 20px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '1.1rem' }}
        >
          −
        </button>
        <button
          onClick={increment}
          style={{ padding: '7px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '1.1rem' }}
        >
          +
        </button>
        <button
          onClick={reset}
          style={{ padding: '7px 14px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          초기화
        </button>
      </div>
    </div>
  );
}

/**
 * 선택적 구독 예제 — count 값만 구독
 * count가 바뀔 때만 리렌더링됩니다.
 * 스토어에 다른 상태가 추가되어도 이 컴포넌트는 영향을 받지 않습니다.
 */
function CountDisplay() {
  // 셀렉터 함수로 필요한 값만 구독
  const count = useCountStore((state) => state.count);
  return (
    <div style={{ padding: '10px 14px', background: '#eef2ff', borderRadius: '6px', textAlign: 'center' }}>
      <p style={{ fontSize: '0.75rem', color: '#6366f1', marginBottom: '2px' }}>count만 구독</p>
      <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#4f46e5' }}>{count}</p>
    </div>
  );
}

/**
 * 선택적 구독 — increment 함수만 구독
 * count가 바뀌어도 이 컴포넌트는 리렌더링되지 않습니다.
 */
function IncrementOnlyButton() {
  const increment = useCountStore((state) => state.increment);
  return (
    <button
      onClick={increment}
      style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
    >
      +1 (increment만 구독)
    </button>
  );
}

/** 상품 목록 — 장바구니에 담기 */
function ProductList() {
  const addToCart = useCartStore((state) => state.addToCart);

  const products = [
    { id: 1, name: '아이폰 15', price: 1_350_000, emoji: '📱' },
    { id: 2, name: '맥북 프로', price: 2_800_000, emoji: '💻' },
    { id: 3, name: '에어팟 프로', price: 350_000, emoji: '🎧' },
    { id: 4, name: '애플 워치', price: 580_000, emoji: '⌚' },
  ];

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {products.map(p => (
        <li
          key={p.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 10px',
            background: '#f9fafb',
            borderRadius: '6px',
            marginBottom: '6px',
          }}
        >
          <span style={{ fontSize: '0.9rem' }}>{p.emoji} {p.name}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>{p.price.toLocaleString()}원</span>
            <button
              onClick={() => addToCart(p)}
              style={{ padding: '4px 10px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              담기
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** 장바구니 — 여러 값을 한 번에 구독 */
function CartPanel() {
  const { cart, removeFromCart, clearCart } = useCartStore();
  const totalPrice = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const totalCount = cart.reduce((sum, c) => sum + c.qty, 0);

  if (cart.length === 0) {
    return (
      <p style={{ fontSize: '0.85rem', color: '#9ca3af', textAlign: 'center', padding: '16px' }}>
        장바구니가 비어 있습니다
      </p>
    );
  }

  return (
    <div>
      <ul style={{ listStyle: 'none', padding: 0, marginBottom: '10px' }}>
        {cart.map(item => (
          <li
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '7px 10px',
              background: '#f9fafb',
              borderRadius: '6px',
              marginBottom: '5px',
              fontSize: '0.85rem',
            }}
          >
            <span>{item.emoji} {item.name} × {item.qty}</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ color: '#6366f1', fontWeight: '600' }}>
                {(item.price * item.qty).toLocaleString()}원
              </span>
              <button
                onClick={() => removeFromCart(item.id)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '0.8rem' }}
              >✕</button>
            </div>
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 10px 0', borderTop: '1px solid #e5e7eb' }}>
        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>
          총 {totalCount}개 · {totalPrice.toLocaleString()}원
        </span>
        <button
          onClick={clearCart}
          style={{ padding: '5px 10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.82rem' }}
        >
          전체 삭제
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 전체 데모
// ─────────────────────────────────────────────
export default function ZustandDemo() {
  const [tab, setTab] = useState('shop');
  const cart = useCartStore((state) => state.cart);
  const totalCount = cart.reduce((s, c) => s + c.qty, 0);

  const sectionStyle = {
    marginBottom: '24px',
    padding: '16px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>Zustand 예제</h1>
      <p style={{ color: '#6b7280', marginBottom: '6px', fontSize: '0.9rem' }}>
        Provider 없이 어디서든 스토어를 직접 구독합니다.
      </p>
      <div style={{
        marginBottom: '20px',
        padding: '8px 12px',
        background: '#fef9c3',
        borderRadius: '6px',
        fontSize: '0.82rem',
        color: '#92400e',
      }}>
        ⚠️ 실행하려면 <code>npm install zustand</code>이 필요합니다.
      </div>

      {/* 카운터 섹션 */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>① 기본 카운터 스토어</h2>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '12px' }}>
          <code>create()</code>로 스토어를 만들고, <code>useCountStore()</code>로 어디서든 사용합니다.
        </p>
        <Counter />
      </div>

      {/* 선택적 구독 섹션 */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>② 선택적 구독 (셀렉터)</h2>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '12px' }}>
          필요한 값만 골라서 구독하면 관련 없는 상태가 바뀌어도 리렌더링되지 않습니다.
        </p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <CountDisplay />
          <IncrementOnlyButton />
        </div>
        <pre style={{
          marginTop: '12px',
          background: '#1e293b',
          color: '#e2e8f0',
          padding: '10px 14px',
          borderRadius: '6px',
          fontSize: '0.78rem',
          overflow: 'auto',
        }}>{`// 전체 구독 (비효율)
const { count, increment, ... } = useCountStore();

// 선택적 구독 (효율적)
const count     = useCountStore(state => state.count);
const increment = useCountStore(state => state.increment);`}</pre>
      </div>

      {/* 장바구니 섹션 */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>③ 장바구니 스토어</h2>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
          복잡한 배열 상태도 스토어 하나로 관리합니다.
        </p>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          <button
            onClick={() => setTab('shop')}
            style={{ padding: '5px 14px', background: tab === 'shop' ? '#6366f1' : '#f3f4f6', color: tab === 'shop' ? 'white' : '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            상품 목록
          </button>
          <button
            onClick={() => setTab('cart')}
            style={{ padding: '5px 14px', background: tab === 'cart' ? '#6366f1' : '#f3f4f6', color: tab === 'cart' ? 'white' : '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            장바구니 {totalCount > 0 && `(${totalCount})`}
          </button>
        </div>
        {tab === 'shop' ? <ProductList /> : <CartPanel />}
      </div>

      {/* Context API vs Zustand 비교 */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>④ Context API vs Zustand</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
          <div style={{ padding: '12px', background: '#fef9c3', borderRadius: '8px' }}>
            <p style={{ fontWeight: '700', color: '#92400e', marginBottom: '8px' }}>Context API</p>
            <ul style={{ paddingLeft: '14px', color: '#78350f', lineHeight: '1.7' }}>
              <li>Provider로 감싸야 함</li>
              <li>선택적 구독 어려움</li>
              <li>설정 코드 많음</li>
              <li>React 내장 (설치 불필요)</li>
              <li>가벼운 전역 값에 적합</li>
            </ul>
          </div>
          <div style={{ padding: '12px', background: '#dcfce7', borderRadius: '8px' }}>
            <p style={{ fontWeight: '700', color: '#166534', marginBottom: '8px' }}>Zustand</p>
            <ul style={{ paddingLeft: '14px', color: '#14532d', lineHeight: '1.7' }}>
              <li>Provider 불필요</li>
              <li>선택적 구독 쉬움</li>
              <li>코드 매우 간결</li>
              <li>npm install 필요</li>
              <li>복잡한 전역 상태에 적합</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
