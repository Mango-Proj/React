/**
 * 06_props_state.jsx — props와 state 비교 및 함께 사용하기
 * ===========================================================
 * props와 state의 핵심 차이를 이해하고,
 * defaultProps와 함께 두 가지를 조합해 사용하는 패턴을 배웁니다.
 *
 * 이 파일은 학습용 예제입니다.
 * Vite + React 프로젝트의 App.jsx에서 import하여 확인하세요.
 */

import { useState } from 'react';


// ─────────────────────────────────────────────────────
// 예제 1: props vs state 차이 시각화
// ─────────────────────────────────────────────────────

/**
 * props: 부모가 자식에게 전달하는 외부 데이터 → 읽기만 가능
 * state: 컴포넌트 자신이 관리하는 내부 데이터 → setState로 변경 가능
 */

// props만 사용하는 컴포넌트 (상태 없음)
function ProductBadge({ name, price, isNew }) {
  // props는 받아서 표시만 합니다. 변경하면 안 됩니다.
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 14px',
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '20px',
      fontSize: '0.88rem',
    }}>
      <span style={{ fontWeight: 700 }}>{name}</span>
      <span style={{ color: '#7c3aed' }}>{price.toLocaleString('ko-KR')}원</span>
      {/* isNew prop이 true일 때만 "NEW" 뱃지 표시 */}
      {isNew && (
        <span style={{ background: '#dc2626', color: '#fff', fontSize: '0.7rem', padding: '1px 6px', borderRadius: '10px' }}>
          NEW
        </span>
      )}
    </div>
  );
}

// state만 사용하는 컴포넌트 (부모 데이터 없음)
function LikeButton() {
  // state: 이 컴포넌트 자신만의 좋아요 여부 관리
  const [liked, setLiked]   = useState(false);
  const [count, setCount]   = useState(0);

  const handleLike = () => {
    if (!liked) setCount(c => c + 1);
    else        setCount(c => c - 1);
    setLiked(p => !p);
  };

  return (
    <button
      onClick={handleLike}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 14px',
        background: liked ? '#fee2e2' : '#f8fafc',
        border: `1px solid ${liked ? '#fca5a5' : '#e2e8f0'}`,
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '0.88rem',
        fontWeight: 600,
        color: liked ? '#dc2626' : '#64748b',
      }}
    >
      {liked ? '❤️' : '🤍'} {count}
    </button>
  );
}

export function PropsVsStateDemo() {
  return (
    <div style={cardStyle}>
      <h3>props vs state</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div style={{ padding: '14px', background: '#eff6ff', borderRadius: '10px' }}>
          <p style={{ fontWeight: 700, color: '#1d4ed8', margin: '0 0 8px', fontSize: '0.88rem' }}>props (외부 데이터)</p>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.82rem', color: '#1e40af', lineHeight: 1.8 }}>
            <li>부모에서 전달받음</li>
            <li>읽기 전용</li>
            <li>변경 불가</li>
            <li>부모가 바꾸면 갱신</li>
          </ul>
        </div>
        <div style={{ padding: '14px', background: '#f0fdf4', borderRadius: '10px' }}>
          <p style={{ fontWeight: 700, color: '#15803d', margin: '0 0 8px', fontSize: '0.88rem' }}>state (내부 상태)</p>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.82rem', color: '#166534', lineHeight: 1.8 }}>
            <li>자신이 관리</li>
            <li>읽기 + 변경 가능</li>
            <li>setState로 변경</li>
            <li>변경 시 화면 갱신</li>
          </ul>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 6px' }}>props 예시 (부모가 이름·가격·신상품여부를 전달)</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <ProductBadge name="에어팟" price={189000} isNew={true} />
            <ProductBadge name="충전기" price={35000} isNew={false} />
            <ProductBadge name="갤럭시" price={990000} isNew={true} />
          </div>
        </div>
        <div>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 6px' }}>state 예시 (각자 독립적으로 좋아요 관리)</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <LikeButton />
            <LikeButton />
            <LikeButton />
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
            3개의 LikeButton은 각자 독립적인 liked/count state를 가집니다
          </p>
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: props 기본값 — defaultProps와 구조 분해 기본값
// ─────────────────────────────────────────────────────

/**
 * 부모가 props를 전달하지 않았을 때 사용할 기본값을 설정하는 두 가지 방법입니다.
 *
 * 방법 1: defaultProps (클래식 방식, 여전히 유효)
 * 방법 2: 구조 분해 기본값 (= 기본값, 현대적 방식)
 */

// 방법 1: defaultProps
function GreetingV1(props) {
  return (
    <div style={{ padding: '8px 14px', background: '#fef9c3', borderRadius: '8px', marginBottom: '6px', fontSize: '0.88rem' }}>
      {props.number}. Hello, <strong>{props.name}</strong>!
    </div>
  );
}
// 컴포넌트 정의 밖에서 기본값을 지정합니다
GreetingV1.defaultProps = {
  name: 'Guest',   // name prop이 없으면 'Guest' 사용
};

// 방법 2: 구조 분해 기본값 (더 현대적, 권장)
function GreetingV2({ number, name = 'Guest', role = '방문자' }) {
  return (
    <div style={{ padding: '8px 14px', background: '#dcfce7', borderRadius: '8px', marginBottom: '6px', fontSize: '0.88rem' }}>
      {number}. Hello, <strong>{name}</strong>! ({role})
    </div>
  );
}

export function DefaultPropsDemo() {
  return (
    <div style={cardStyle}>
      <h3>props 기본값 설정</h3>

      <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 8px' }}>방법 1: defaultProps</p>
      <GreetingV1 number={1} />              {/* name 없음 → 기본값 'Guest' */}
      <GreetingV1 number={2} name="Jane" />  {/* name 있음 → 'Jane' 사용 */}

      <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: '12px 0 8px' }}>방법 2: 구조 분해 기본값 (권장)</p>
      <GreetingV2 number={1} />                          {/* name, role 없음 → 기본값 */}
      <GreetingV2 number={2} name="철수" />              {/* name만 전달, role은 기본값 */}
      <GreetingV2 number={3} name="영희" role="관리자" /> {/* 모두 전달 */}

      <div style={{ marginTop: '12px', padding: '10px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.82rem' }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700 }}>💡 어떤 방법을 쓸까?</p>
        <p style={{ margin: 0, color: '#64748b' }}>
          두 방법 모두 유효하지만, 현대 React에서는 <code>구조 분해 기본값</code>을 더 많이 사용합니다.
          함수 선언부에서 기본값을 한눈에 볼 수 있어 가독성이 좋습니다.
        </p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: props + state 함께 사용하기 — 동영상 좋아요
// ─────────────────────────────────────────────────────

/**
 * 실무 패턴:
 * - props: 변하지 않는 데이터 (제목, 채널명, 조회수 등)
 * - state: 사용자 상호작용으로 변하는 데이터 (좋아요 여부, 재생 상태 등)
 */
function Video({ title, channel, views }) {
  // state: 이 컴포넌트 안에서 직접 관리하는 좋아요 여부
  const [liked, setLiked] = useState(false);

  const toggleLike = () => setLiked(p => !p);

  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '12px',
    }}>
      {/* 썸네일 플레이스홀더 */}
      <div style={{
        height: '140px',
        background: '#1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        color: '#94a3b8',
      }}>
        ▶
      </div>

      <div style={{ padding: '12px' }}>
        {/* props: 부모에서 전달받은 데이터 */}
        <h3 style={{ margin: '0 0 4px', fontSize: '0.95rem' }}>{title}</h3>
        <p style={{ margin: '0 0 8px', color: '#64748b', fontSize: '0.82rem' }}>
          {channel} · 조회수 {views.toLocaleString('ko-KR')}회
        </p>

        {/* state: 이 컴포넌트가 직접 관리하는 좋아요 상태 */}
        <button
          onClick={toggleLike}
          style={{
            padding: '6px 14px',
            background: liked ? '#fee2e2' : '#f8fafc',
            border: `1px solid ${liked ? '#fca5a5' : '#e2e8f0'}`,
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '0.82rem',
            color: liked ? '#dc2626' : '#64748b',
            fontWeight: 600,
          }}
        >
          {liked ? '❤️ Liked' : '🤍 Like'}
        </button>
      </div>
    </div>
  );
}

export function VideoApp() {
  // 부모 App이 동영상 목록 데이터를 가지고 있습니다
  const videos = [
    { id: 1, title: '리액트 완전 정복 1편',  channel: '코딩채널', views: 125000 },
    { id: 2, title: '자바스크립트 핵심 개념', channel: '웹개발TV',  views: 87500 },
    { id: 3, title: 'CSS 실전 프로젝트',     channel: '디자인코드', views: 43200 },
  ];

  return (
    <div style={cardStyle}>
      <h3>props + state 함께 사용하기</h3>
      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
        title·channel·views는 <strong>props</strong> (부모에서 전달),<br />
        좋아요 상태는 <strong>state</strong> (각 Video가 독립적으로 관리)
      </p>

      {/* 같은 Video 컴포넌트에 다른 props를 전달 */}
      {videos.map(video => (
        <Video
          key={video.id}
          title={video.title}
          channel={video.channel}
          views={video.views}
        />
      ))}

      <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
        각 Video의 좋아요는 서로 독립적입니다 — 하나의 좋아요가 다른 것에 영향을 주지 않습니다.
      </p>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 4: 부모의 state를 props로 자식에게 전달
// ─────────────────────────────────────────────────────

/**
 * 부모가 state를 가지고 있고, 그 값을 자식 컴포넌트에 props로 내려주는 패턴입니다.
 * 여러 자식이 같은 데이터를 공유해야 할 때 사용합니다.
 * (이것을 "State Lifting Up" 또는 "상태 끌어올리기"라고 합니다)
 */

// 자식 컴포넌트 — 부모의 state를 props로 받습니다
function TemperatureDisplay({ celsius }) {
  const fahrenheit = (celsius * 9) / 5 + 32;
  const description = celsius < 10 ? '🥶 춥네요' : celsius < 25 ? '😊 쾌적해요' : '🥵 덥네요';

  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: '12px',
    }}>
      <div style={tempCard('#eff6ff', '#1d4ed8')}>
        <p style={{ margin: '0 0 2px', fontSize: '0.78rem' }}>섭씨</p>
        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{celsius}°C</p>
      </div>
      <div style={tempCard('#fff7ed', '#c2410c')}>
        <p style={{ margin: '0 0 2px', fontSize: '0.78rem' }}>화씨</p>
        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{fahrenheit.toFixed(1)}°F</p>
      </div>
      <div style={tempCard('#f0fdf4', '#15803d')}>
        <p style={{ margin: '0 0 2px', fontSize: '0.78rem' }}>날씨</p>
        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{description}</p>
      </div>
    </div>
  );
}

function tempCard(bg, color) {
  return {
    padding: '12px 20px',
    background: bg,
    borderRadius: '10px',
    textAlign: 'center',
    color,
    minWidth: '90px',
  };
}

export function TemperatureApp() {
  // 부모가 celsius state를 관리합니다
  const [celsius, setCelsius] = useState(20);

  return (
    <div style={cardStyle}>
      <h3>부모 state → 자식 props 전달</h3>

      {/* 슬라이더로 부모의 state를 변경 */}
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <input
          type="range"
          min="-20"
          max="40"
          value={celsius}
          onChange={e => setCelsius(Number(e.target.value))}
          style={{ width: '100%', marginBottom: '6px' }}
        />
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
          슬라이더를 움직이면 부모의 celsius state가 바뀌고,<br />
          자식 컴포넌트(TemperatureDisplay)가 props로 받아 화면을 갱신합니다.
        </p>
      </div>

      {/* 자식 컴포넌트에 부모의 state를 props로 전달 */}
      <TemperatureDisplay celsius={celsius} />
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 공통 스타일
// ─────────────────────────────────────────────────────

const cardStyle = {
  padding: '20px 24px',
  border: '1px solid #e2e8f0',
  borderRadius: '14px',
  marginBottom: '16px',
  maxWidth: '520px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
import { PropsVsStateDemo, DefaultPropsDemo, VideoApp, TemperatureApp } from './06_props_state';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <PropsVsStateDemo />
      <DefaultPropsDemo />
      <VideoApp />
      <TemperatureApp />
    </div>
  );
}
*/
