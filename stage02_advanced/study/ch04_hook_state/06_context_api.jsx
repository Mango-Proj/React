/**
 * 06_context_api.jsx — Context API 완전 정복
 * =============================================
 * Props를 거치지 않고 전역으로 데이터를 공유하는 Context API를 살펴봅니다.
 *
 * 1. ThemeContext     — 기본 Context API (다크 모드)
 * 2. AuthContext      — useReducer + Context 조합 (로그인 상태)
 * 3. CartContext      — 여러 Context 중첩 (장바구니)
 * 4. 다중 Context 앱  — 세 Context를 함께 사용하는 예제
 *
 * [주의] 이 파일은 모든 Context와 컴포넌트가 하나의 파일에 있습니다.
 *        실제 프로젝트에서는 context/ThemeContext.jsx 처럼 파일을 분리합니다.
 */

import { createContext, useContext, useState, useReducer } from 'react';

// ═══════════════════════════════════════════════
// Context 1: ThemeContext — 다크 모드
// ═══════════════════════════════════════════════

/**
 * ① createContext(): Context 객체 생성 (방송국 채널 개설)
 * 인자로 기본값을 줄 수 있지만, Provider를 사용할 것이므로 여기선 생략합니다.
 */
const ThemeContext = createContext();

/** ② Provider: 데이터를 하위 컴포넌트에 공급하는 래퍼 */
function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** ③ useContext(): Context 값을 수신하는 훅 */
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('ThemeProvider 안에서만 사용하세요');
  return context;
}

// ═══════════════════════════════════════════════
// Context 2: AuthContext — 로그인 상태 (useReducer 조합)
// ═══════════════════════════════════════════════

const AuthContext = createContext();

const authInitialState = { isLoggedIn: false, user: null };

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { isLoggedIn: true, user: action.payload };
    case 'LOGOUT':
      return authInitialState;
    default:
      return state;
  }
}

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, authInitialState);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthProvider 안에서만 사용하세요');
  return context;
}

// ═══════════════════════════════════════════════
// Context 3: CartContext — 장바구니
// ═══════════════════════════════════════════════

const CartContext = createContext();

function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(c => c.id === item.id);
      if (exists) {
        return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));
  const clearCart = () => setCart([]);
  const totalCount = cart.reduce((sum, c) => sum + c.qty, 0);
  const totalPrice = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('CartProvider 안에서만 사용하세요');
  return context;
}

// ═══════════════════════════════════════════════
// UI 컴포넌트들 (Context를 useContext로 수신)
// ═══════════════════════════════════════════════

/** 어디서든 isDark를 받아 배경색을 바꾸는 컴포넌트 */
function ThemedBox({ children }) {
  const { isDark } = useTheme();
  return (
    <div style={{
      background: isDark ? '#1e293b' : '#f8fafc',
      color: isDark ? '#f1f5f9' : '#1e293b',
      borderRadius: '8px',
      padding: '14px',
      transition: 'all 0.2s',
    }}>
      {children}
    </div>
  );
}

/** 테마 토글 버튼 */
function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme(); // Props 없이 바로 수신!
  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '6px 14px',
        background: isDark ? '#f1f5f9' : '#1e293b',
        color: isDark ? '#1e293b' : '#f1f5f9',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: '600',
      }}
    >
      {isDark ? '☀️ 라이트 모드' : '🌙 다크 모드'}
    </button>
  );
}

/** 로그인/로그아웃 버튼 */
function LoginButton() {
  const { state, dispatch } = useAuth();

  const handleLogin = () => {
    dispatch({ type: 'LOGIN', payload: { name: '홍길동', email: 'hong@example.com' } });
  };
  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  if (state.isLoggedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.9rem' }}>👋 {state.user.name}님</span>
        <button
          onClick={handleLogout}
          style={{ padding: '5px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      style={{ padding: '5px 12px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}
    >
      로그인
    </button>
  );
}

/** 상품 목록 — 장바구니에 담는 기능 */
function ProductList() {
  const { addToCart } = useCart();
  const { state: authState } = useAuth();

  const products = [
    { id: 1, name: '아이폰 15', price: 1_350_000 },
    { id: 2, name: '갤럭시 S24', price: 1_200_000 },
    { id: 3, name: '픽셀 8', price: 890_000 },
  ];

  return (
    <div>
      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '8px' }}>
        {authState.isLoggedIn ? '로그인 중 — 장바구니 담기 가능' : '로그인 후 장바구니에 담을 수 있습니다'}
      </p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {products.map(p => (
          <li
            key={p.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 10px',
              background: 'rgba(255,255,255,0.5)',
              borderRadius: '6px',
              marginBottom: '6px',
            }}
          >
            <div>
              <span style={{ fontWeight: '500' }}>{p.name}</span>
              <span style={{ fontSize: '0.82rem', color: '#6b7280', marginLeft: '8px' }}>
                {p.price.toLocaleString()}원
              </span>
            </div>
            <button
              onClick={() => addToCart(p)}
              disabled={!authState.isLoggedIn}
              style={{
                padding: '4px 10px',
                background: authState.isLoggedIn ? '#6366f1' : '#e5e7eb',
                color: authState.isLoggedIn ? 'white' : '#9ca3af',
                border: 'none',
                borderRadius: '5px',
                cursor: authState.isLoggedIn ? 'pointer' : 'not-allowed',
                fontSize: '0.82rem',
              }}
            >
              담기
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 장바구니 목록 */
function CartSummary() {
  const { cart, removeFromCart, clearCart, totalCount, totalPrice } = useCart();

  if (cart.length === 0) {
    return <p style={{ fontSize: '0.85rem', color: '#9ca3af', textAlign: 'center', padding: '12px' }}>장바구니가 비어 있습니다</p>;
  }

  return (
    <div>
      <ul style={{ listStyle: 'none', padding: 0, marginBottom: '8px' }}>
        {cart.map(item => (
          <li
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px 10px',
              background: 'rgba(255,255,255,0.5)',
              borderRadius: '6px',
              marginBottom: '4px',
              fontSize: '0.85rem',
            }}
          >
            <span>{item.name} × {item.qty}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>
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

// ═══════════════════════════════════════════════
// 통합 앱 — 세 Context를 모두 사용
// ═══════════════════════════════════════════════

/**
 * Context가 3개여도 Provider를 중첩해서 감싸면 됩니다.
 * 각 컴포넌트는 필요한 Context만 useContext로 수신합니다.
 */
export function ContextApiApp() {
  return (
    // 다중 Context 중첩: 가장 바깥 Provider부터 안쪽으로
    <AuthProvider>
      <CartProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { cart } = useCart();
  const [view, setView] = useState('shop'); // 'shop' | 'cart'

  return (
    <ThemedBox>
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setView('shop')}
            style={{ padding: '5px 12px', background: view === 'shop' ? '#6366f1' : 'transparent', color: view === 'shop' ? 'white' : 'inherit', border: '1px solid #6366f1', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}
          >
            상품
          </button>
          <button
            onClick={() => setView('cart')}
            style={{ padding: '5px 12px', background: view === 'cart' ? '#6366f1' : 'transparent', color: view === 'cart' ? 'white' : 'inherit', border: '1px solid #6366f1', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}
          >
            장바구니 {cart.length > 0 && `(${cart.reduce((s,c)=>s+c.qty,0)})`}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <LoginButton />
          <ThemeToggleButton />
        </div>
      </div>

      {/* 본문 */}
      {view === 'shop' ? <ProductList /> : <CartSummary />}
    </ThemedBox>
  );
}

// ─────────────────────────────────────────────
// 전체 데모
// ─────────────────────────────────────────────
export default function ContextApiDemo() {
  const sectionStyle = {
    marginBottom: '24px',
    padding: '16px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>Context API 예제</h1>
      <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '0.9rem' }}>
        createContext → Provider → useContext 3단계로 전역 데이터를 공유합니다.
      </p>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>통합 예제 — Theme + Auth + Cart</h2>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '12px' }}>
          로그인 → 상품 담기 → 장바구니 확인 → 다크 모드 전환 순서로 테스트해보세요.
        </p>
        <ContextApiApp />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '8px' }}>Provider 중첩 구조</h2>
        <pre style={{
          background: '#1e293b',
          color: '#e2e8f0',
          padding: '14px',
          borderRadius: '8px',
          fontSize: '0.82rem',
          overflow: 'auto',
        }}>{`<AuthProvider>       ← 로그인 상태
  <CartProvider>     ← 장바구니 상태
    <ThemeProvider>  ← 테마 상태
      <App />        ← 모든 Context 수신 가능
    </ThemeProvider>
  </CartProvider>
</AuthProvider>`}</pre>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '8px' }}>
          ✅ Provider로 감싸진 컴포넌트만 해당 Context를 사용할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
