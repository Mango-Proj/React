/**
 * 05_useReducer.jsx — Props Drilling 문제 & useReducer
 * ======================================================
 * 상태 전달 방식의 진화를 단계적으로 살펴봅니다.
 *
 * 1. Props Drilling 문제 — 중간 컴포넌트를 거치는 전달
 * 2. 상태 끌어올리기 (State Lifting)
 * 3. useReducer 기본 — dispatch/action/reducer 구조
 * 4. useReducer 실전 — 유튜브 영상 인터랙션
 */

import { useState, useReducer } from 'react';

// ─────────────────────────────────────────────
// 예제 1: Props Drilling 시각화
// ─────────────────────────────────────────────
/**
 * 컴포넌트 계층: Products → ProductCard → LikeBadge
 * isLiked 데이터가 최종 목적지(LikeBadge)까지 가려면
 * 중간의 ProductCard를 거쳐야 합니다.
 * ProductCard 자신은 isLiked를 사용하지 않는데도요.
 */

// 최하단: isLiked를 실제로 사용하는 컴포넌트
function LikeBadge({ isLiked, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        background: 'none',
        border: 'none',
        fontSize: '1.2rem',
        cursor: 'pointer',
        padding: '2px',
      }}
      title={isLiked ? '좋아요 취소' : '좋아요'}
    >
      {isLiked ? '❤️' : '🤍'}
    </button>
  );
}

// 중간: isLiked를 직접 사용하지 않지만 받아서 전달만 합니다
function ProductCard({ name, price, isLiked, onToggleLike }) {
  return (
    <div style={{
      padding: '12px 16px',
      background: '#f9fafb',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
    }}>
      <div>
        <p style={{ fontWeight: '600', marginBottom: '2px' }}>{name}</p>
        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>{price.toLocaleString()}원</p>
      </div>
      {/* isLiked와 onToggleLike를 그대로 LikeBadge에 전달 (drilling) */}
      <LikeBadge isLiked={isLiked} onToggle={onToggleLike} />
    </div>
  );
}

export function PropsDrillingDemo() {
  const [products, setProducts] = useState([
    { id: 1, name: '아이폰 15', price: 1_350_000, isLiked: false },
    { id: 2, name: '갤럭시 S24', price: 1_200_000, isLiked: true },
    { id: 3, name: '픽셀 8', price: 890_000, isLiked: false },
  ]);

  const handleToggleLike = (id) => {
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, isLiked: !p.isLiked } : p)
    );
  };

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <div style={{
        marginBottom: '12px',
        padding: '8px 12px',
        background: '#fef9c3',
        borderRadius: '6px',
        fontSize: '0.82rem',
        color: '#92400e',
      }}>
        ⚠️ Props Drilling: isLiked는 ProductCard를 거쳐야만 LikeBadge에 도달합니다.
        ProductCard는 isLiked를 전혀 쓰지 않는데도 받아서 전달만 합니다.
      </div>
      {products.map(p => (
        <ProductCard
          key={p.id}
          name={p.name}
          price={p.price}
          isLiked={p.isLiked}
          onToggleLike={() => handleToggleLike(p.id)}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// 예제 2: useReducer 기본 구조 이해
// ─────────────────────────────────────────────
/**
 * 은행 창구 비유:
 * - 고객(컴포넌트) → 번호표 뽑기 (dispatch)
 * - 번호표(action)  → { type: 'WITHDRAW', payload: 10000 }
 * - 창구(reducer)   → action을 보고 새로운 상태 처리
 */

const bankInitialState = {
  balance: 50000,
  transactions: [],
};

function bankReducer(state, action) {
  switch (action.type) {
    case 'DEPOSIT':
      return {
        balance: state.balance + action.payload,
        transactions: [
          ...state.transactions,
          { type: '입금', amount: action.payload, id: Date.now() },
        ],
      };
    case 'WITHDRAW':
      if (state.balance < action.payload) return state; // 잔액 부족 시 변경 없음
      return {
        balance: state.balance - action.payload,
        transactions: [
          ...state.transactions,
          { type: '출금', amount: action.payload, id: Date.now() },
        ],
      };
    case 'RESET':
      return bankInitialState;
    default:
      return state; // 알 수 없는 action은 현재 상태를 그대로 반환
  }
}

export function BankAccountDemo() {
  const [state, dispatch] = useReducer(bankReducer, bankInitialState);
  const [amount, setAmount] = useState(10000);

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
        dispatch(action) → reducer → 새 state. 상태 변경 로직이 reducer에 모여 있습니다.
      </p>

      {/* 잔액 표시 */}
      <div style={{ padding: '12px', background: '#eef2ff', borderRadius: '8px', marginBottom: '12px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: '#6366f1' }}>잔액</p>
        <p style={{ fontSize: '1.8rem', fontWeight: '800', color: '#4f46e5' }}>
          {state.balance.toLocaleString()}원
        </p>
      </div>

      {/* 입출금 컨트롤 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(Math.max(0, Number(e.target.value)))}
          step={10000}
          style={{ flex: 1, padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: '6px', minWidth: '80px' }}
        />
        <button
          onClick={() => dispatch({ type: 'DEPOSIT', payload: amount })}
          style={{ padding: '7px 14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
        >
          입금
        </button>
        <button
          onClick={() => dispatch({ type: 'WITHDRAW', payload: amount })}
          disabled={state.balance < amount}
          style={{
            padding: '7px 14px',
            background: state.balance < amount ? '#f3f4f6' : '#ef4444',
            color: state.balance < amount ? '#9ca3af' : 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: state.balance < amount ? 'not-allowed' : 'pointer',
            fontWeight: '600',
          }}
        >
          출금
        </button>
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          style={{ padding: '7px 12px', background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}
        >
          초기화
        </button>
      </div>

      {/* 거래 내역 */}
      {state.transactions.length > 0 && (
        <div>
          <p style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '6px' }}>거래 내역</p>
          <ul style={{ listStyle: 'none', padding: 0, maxHeight: '120px', overflowY: 'auto' }}>
            {[...state.transactions].reverse().map(t => (
              <li key={t.id} style={{
                padding: '5px 10px',
                background: t.type === '입금' ? '#dcfce7' : '#fee2e2',
                borderRadius: '5px',
                marginBottom: '4px',
                fontSize: '0.85rem',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <span>{t.type}</span>
                <strong style={{ color: t.type === '입금' ? '#16a34a' : '#dc2626' }}>
                  {t.type === '입금' ? '+' : '-'}{t.amount.toLocaleString()}원
                </strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 예제 3: useReducer 실전 — 유튜브 영상 인터랙션
// ─────────────────────────────────────────────
/**
 * 좋아요, 싫어요, 댓글 3가지 상태를 하나의 reducer로 관리합니다.
 * useState 3개로 관리하는 것보다 상태 변경 로직이 명확하고 한 곳에 집중됩니다.
 */

const videoInitialState = {
  likes: 1420,
  dislikes: 38,
  comments: [
    { id: 1, text: '영상 너무 유익해요!' },
    { id: 2, text: '구독 눌렀습니다 👍' },
  ],
  userVote: null, // null | 'like' | 'dislike'
};

function videoReducer(state, action) {
  switch (action.type) {
    case 'LIKE': {
      // 이미 좋아요를 눌렀으면 취소, 아니면 좋아요
      const cancel = state.userVote === 'like';
      return {
        ...state,
        likes: state.likes + (cancel ? -1 : 1),
        // 싫어요 상태였다면 싫어요도 취소
        dislikes: state.userVote === 'dislike' ? state.dislikes - 1 : state.dislikes,
        userVote: cancel ? null : 'like',
      };
    }
    case 'DISLIKE': {
      const cancel = state.userVote === 'dislike';
      return {
        ...state,
        dislikes: state.dislikes + (cancel ? -1 : 1),
        likes: state.userVote === 'like' ? state.likes - 1 : state.likes,
        userVote: cancel ? null : 'dislike',
      };
    }
    case 'ADD_COMMENT':
      return {
        ...state,
        comments: [
          ...state.comments,
          { id: Date.now(), text: action.payload },
        ],
      };
    case 'DELETE_COMMENT':
      return {
        ...state,
        comments: state.comments.filter(c => c.id !== action.payload),
      };
    default:
      return state;
  }
}

export function YouTubeDemo() {
  const [state, dispatch] = useReducer(videoReducer, videoInitialState);
  const [input, setInput] = useState('');

  const handleAddComment = () => {
    if (!input.trim()) return;
    dispatch({ type: 'ADD_COMMENT', payload: input.trim() });
    setInput('');
  };

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '12px' }}>
        좋아요/싫어요/댓글 3가지 관련 상태를 하나의 videoReducer가 관리합니다.
      </p>

      {/* 영상 썸네일 */}
      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '40px', textAlign: 'center', marginBottom: '12px', color: '#64748b', fontSize: '2rem' }}>
        ▶
      </div>

      {/* 좋아요 / 싫어요 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        <button
          onClick={() => dispatch({ type: 'LIKE' })}
          style={{
            padding: '7px 16px',
            background: state.userVote === 'like' ? '#6366f1' : '#f3f4f6',
            color: state.userVote === 'like' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          👍 {state.likes.toLocaleString()}
        </button>
        <button
          onClick={() => dispatch({ type: 'DISLIKE' })}
          style={{
            padding: '7px 16px',
            background: state.userVote === 'dislike' ? '#ef4444' : '#f3f4f6',
            color: state.userVote === 'dislike' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          👎 {state.dislikes.toLocaleString()}
        </button>
      </div>

      {/* 댓글 입력 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddComment()}
          placeholder="댓글 입력..."
          style={{ flex: 1, padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
        />
        <button
          onClick={handleAddComment}
          disabled={!input.trim()}
          style={{
            padding: '7px 14px',
            background: input.trim() ? '#6366f1' : '#ddd6fe',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          등록
        </button>
      </div>

      {/* 댓글 목록 */}
      <p style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px' }}>
        댓글 {state.comments.length}개
      </p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {state.comments.map(c => (
          <li
            key={c.id}
            style={{
              padding: '8px 12px',
              background: '#f9fafb',
              borderRadius: '6px',
              marginBottom: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.9rem',
            }}
          >
            <span>{c.text}</span>
            <button
              onClick={() => dispatch({ type: 'DELETE_COMMENT', payload: c.id })}
              style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '0 4px', fontSize: '0.85rem' }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────
// 전체 데모
// ─────────────────────────────────────────────
export default function UseReducerDemo() {
  const sectionStyle = {
    marginBottom: '24px',
    padding: '16px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>Props Drilling & useReducer</h1>
      <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '0.9rem' }}>
        상태 전달 방식이 어떻게 발전하는지 단계적으로 살펴봅니다.
      </p>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>① Props Drilling 문제</h2>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
          ProductCard는 isLiked를 쓰지 않는데 받아서 전달만 합니다.
        </p>
        <PropsDrillingDemo />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>② useReducer 기본 — 은행 계좌</h2>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
          dispatch(action) → reducer → 새 state 흐름을 체험합니다.
        </p>
        <BankAccountDemo />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>③ useReducer 실전 — 유튜브 인터랙션</h2>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
          복잡한 상태 로직을 하나의 reducer로 깔끔하게 관리합니다.
        </p>
        <YouTubeDemo />
      </div>
    </div>
  );
}
