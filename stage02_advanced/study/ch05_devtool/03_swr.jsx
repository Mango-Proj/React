/**
 * 03_swr.jsx — SWR 데이터 페칭
 * ================================
 * ⚠️ 설치 필요: npm install swr
 *
 * SWR(stale-while-revalidate)은 캐싱 + 자동 재검증을 지원하는
 * 데이터 페칭 훅 라이브러리입니다.
 *
 * 1. useEffect 방식 vs SWR 방식 비교
 * 2. SWR 주요 기능 시뮬레이터
 * 3. SWR 옵션 가이드
 * 4. mutate — 캐시 수동 업데이트 (낙관적 업데이트)
 */

import { useState, useEffect } from 'react';

// ─────────────────────────────────────────────
// 헬퍼: 가짜 API (SWR 없이도 동작하는 시뮬레이터용)
// ─────────────────────────────────────────────

let callCount = 0; // 실제 네트워크 요청 횟수를 추적

async function fakeFetch(userId) {
  callCount += 1;
  await new Promise(r => setTimeout(r, 600)); // 네트워크 지연 시뮬레이션
  if (userId > 5) throw new Error('사용자를 찾을 수 없습니다 (404)');
  return {
    id: userId,
    name: `사용자 ${userId}`,
    email: `user${userId}@example.com`,
    posts: Math.floor(Math.random() * 50) + 5,
    requestCount: callCount,
  };
}

// ─────────────────────────────────────────────
// 예제 1: useEffect 방식 (기존 방법)
// ─────────────────────────────────────────────

/**
 * 전통적인 useEffect 방식의 문제점:
 * - 같은 userId로 다시 요청해도 캐시 없이 매번 새로 요청
 * - 포커스 복귀 시 자동 갱신 없음
 * - 로딩/에러 상태를 매번 직접 구현
 * - 컴포넌트 언마운트 시 메모리 누수 방지를 직접 처리
 */
export function UserCardWithEffect({ userId }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false; // 언마운트 시 상태 업데이트 방지

    setIsLoading(true);
    setError(null);
    setData(null);

    fakeFetch(userId)
      .then(result => { if (!cancelled) setData(result); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [userId]);

  return (
    <div style={{ padding: '12px', background: '#fff5f5', borderRadius: '8px', border: '1px solid #fca5a5' }}>
      <p style={{ fontSize: '0.78rem', fontWeight: '700', color: '#dc2626', marginBottom: '8px' }}>❌ useEffect 방식</p>
      <UserCardContent data={data} isLoading={isLoading} error={error} />
    </div>
  );
}

// ─────────────────────────────────────────────
// 예제 2: SWR 방식 (코드 스니펫 + 시뮬레이터)
// ─────────────────────────────────────────────

/**
 * 실제 SWR 코드 (npm install swr 후 사용):
 *
 * import useSWR from 'swr';
 *
 * const fetcher = (url) => fetch(url).then(res => res.json());
 *
 * function UserCard({ userId }) {
 *   const { data, error, isLoading, mutate } = useSWR(
 *     `/api/users/${userId}`,  // 캐시 키 = URL
 *     fetcher,                  // 데이터를 가져오는 함수
 *     {
 *       revalidateOnFocus: true,      // 탭 복귀 시 자동 재검증
 *       refreshInterval: 30000,       // 30초마다 자동 갱신
 *       dedupingInterval: 2000,       // 2초 내 동일 요청 중복 제거
 *     }
 *   );
 *
 *   if (isLoading) return <p>불러오는 중...</p>;
 *   if (error)     return <p>에러: {error.message}</p>;
 *   return <p>{data.name}</p>;
 * }
 */

// SWR을 흉내낸 간단한 시뮬레이터 훅
const swr_cache = {}; // 전역 캐시 (SWR과 동일한 모듈 스코프 캐시)

function useSimulatedSWR(key, fetcher) {
  const [data, setData] = useState(swr_cache[key] || null);
  const [isLoading, setIsLoading] = useState(!swr_cache[key]);
  const [error, setError] = useState(null);

  const revalidate = () => {
    if (!key) return;
    setIsLoading(true);
    setError(null);
    fetcher(key)
      .then(result => {
        swr_cache[key] = result; // 캐시에 저장
        setData(result);
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (swr_cache[key]) {
      // 캐시 히트: 즉시 반환 후 백그라운드 재검증
      setData(swr_cache[key]);
      setIsLoading(false);
      revalidate(); // SWR의 "stale-while-revalidate" 동작
    } else {
      revalidate();
    }
  }, [key]);

  const mutate = (newData) => {
    swr_cache[key] = newData;
    setData(newData);
  };

  return { data, isLoading, error, mutate, revalidate };
}

export function UserCardWithSWR({ userId }) {
  const { data, isLoading, error } = useSimulatedSWR(userId, fakeFetch);

  return (
    <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
      <p style={{ fontSize: '0.78rem', fontWeight: '700', color: '#16a34a', marginBottom: '8px' }}>
        ✅ SWR 방식 (시뮬레이터) — 캐시 히트 시 즉시 반환
      </p>
      <UserCardContent data={data} isLoading={isLoading} error={error} />
    </div>
  );
}

/** 공통 카드 UI */
function UserCardContent({ data, isLoading, error }) {
  if (isLoading && !data) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', fontSize: '0.85rem' }}>
      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #d1d5db', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }} />
      불러오는 중...
    </div>
  );
  if (error) return <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>⚠️ {error}</p>;
  if (!data) return null;

  return (
    <div>
      <p style={{ fontWeight: '700', marginBottom: '4px' }}>{data.name}</p>
      <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '2px' }}>{data.email}</p>
      <div style={{ display: 'flex', gap: '10px', fontSize: '0.78rem', marginTop: '6px' }}>
        <span style={{ background: '#eef2ff', color: '#4f46e5', padding: '2px 8px', borderRadius: '999px' }}>
          게시물 {data.posts}개
        </span>
        <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '999px' }}>
          요청 #{data.requestCount}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 예제 3: SWR 캐시 효과 시각화
// ─────────────────────────────────────────────

/**
 * 같은 userId를 두 번 요청하면:
 * - useEffect: 두 번 모두 네트워크 요청 발생
 * - SWR: 첫 번째 요청 후 캐시에 저장, 두 번째는 캐시 반환
 */
export function CacheComparisonDemo() {
  const [userId, setUserId] = useState(1);
  const [log, setLog] = useState([]);

  const addLog = (msg, type = 'info') => {
    setLog(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
  };

  const handleUserChange = (id) => {
    setUserId(id);
    const isCached = !!swr_cache[id];
    addLog(
      `User ${id} 요청 → ${isCached ? '✅ 캐시 히트 (즉시 반환)' : '🌐 네트워크 요청 발생'}`,
      isCached ? 'cache' : 'network'
    );
  };

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
        같은 ID를 두 번 클릭하면 두 번째부터 캐시에서 즉시 반환됩니다.
      </p>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {[1, 2, 3, 4, 5].map(id => (
          <button
            key={id}
            onClick={() => handleUserChange(id)}
            style={{
              padding: '6px 14px',
              background: userId === id ? '#6366f1' : '#f3f4f6',
              color: userId === id ? 'white' : '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: userId === id ? '700' : '400',
            }}
          >
            User {id} {swr_cache[id] ? '📦' : ''}
          </button>
        ))}
      </div>

      <UserCardWithSWR userId={userId} />

      {log.length > 0 && (
        <div style={{ marginTop: '10px', maxHeight: '100px', overflowY: 'auto' }}>
          {log.slice(-6).reverse().map((entry, i) => (
            <div
              key={i}
              style={{
                fontSize: '0.75rem',
                padding: '3px 8px',
                borderRadius: '4px',
                marginBottom: '3px',
                background: entry.type === 'cache' ? '#dcfce7' : '#fef9c3',
                color: entry.type === 'cache' ? '#166534' : '#92400e',
              }}
            >
              [{entry.time}] {entry.msg}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 예제 4: SWR 주요 옵션 가이드
// ─────────────────────────────────────────────

export function SWROptionsGuide() {
  const [activeOption, setActiveOption] = useState(0);

  const options = [
    {
      name: 'revalidateOnFocus',
      desc: '탭을 전환했다가 돌아오면 자동으로 최신 데이터를 다시 가져옵니다',
      default: 'true',
      code: `useSWR('/api/data', fetcher, {
  revalidateOnFocus: true, // 기본값
})`,
      useCase: '실시간 알림, 가격 정보 등 자주 바뀌는 데이터',
    },
    {
      name: 'refreshInterval',
      desc: '설정한 간격(ms)마다 자동으로 데이터를 새로고침합니다',
      default: '0 (비활성)',
      code: `useSWR('/api/notifications', fetcher, {
  refreshInterval: 10000, // 10초마다 갱신
})`,
      useCase: '주식 가격, 채팅 메시지, 실시간 대시보드',
    },
    {
      name: 'dedupingInterval',
      desc: '짧은 시간 안에 같은 키로 여러 번 요청해도 한 번만 실제 요청됩니다',
      default: '2000ms',
      code: `useSWR('/api/user', fetcher, {
  dedupingInterval: 5000, // 5초 내 중복 요청 제거
})`,
      useCase: '여러 컴포넌트가 같은 데이터를 동시에 요청할 때',
    },
    {
      name: 'mutate',
      desc: '서버 요청 없이 로컬 캐시를 즉시 업데이트합니다 (낙관적 업데이트)',
      default: '—',
      code: `const { data, mutate } = useSWR('/api/likes', fetcher);

// 좋아요 버튼 클릭 시
const handleLike = async () => {
  mutate({ ...data, likes: data.likes + 1 }, false); // 즉시 UI 업데이트
  await addLike();  // 서버에 반영
  mutate();         // 서버 데이터로 재검증
};`,
      useCase: '좋아요, 팔로우, 장바구니 등 즉각적인 피드백이 필요한 UI',
    },
  ];

  const opt = options[activeOption];

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {options.map((o, i) => (
          <button
            key={o.name}
            onClick={() => setActiveOption(i)}
            style={{
              padding: '5px 10px',
              background: activeOption === i ? '#6366f1' : '#f3f4f6',
              color: activeOption === i ? 'white' : '#374151',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: activeOption === i ? '700' : '400',
            }}
          >
            {o.name}
          </button>
        ))}
      </div>
      <div style={{ padding: '12px', background: '#fafafa', borderRadius: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <code style={{ fontSize: '0.85rem', fontWeight: '700', color: '#6366f1' }}>{opt.name}</code>
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>기본값: {opt.default}</span>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#374151', marginBottom: '8px' }}>{opt.desc}</p>
        <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '10px', borderRadius: '6px', fontSize: '0.75rem', overflow: 'auto' }}>
          {opt.code}
        </pre>
        <p style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '8px' }}>
          💡 사용 사례: {opt.useCase}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 전체 데모
// ─────────────────────────────────────────────
export default function SWRDemo() {
  const sectionStyle = {
    marginBottom: '24px',
    padding: '16px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>SWR</h1>
      <div style={{ padding: '8px 12px', background: '#fef9c3', borderRadius: '6px', marginBottom: '20px', fontSize: '0.82rem', color: '#92400e' }}>
        ⚠️ 실제 SWR 사용 시: <code>npm install swr</code>
        &nbsp;· 아래 예제는 SWR 동작 방식을 시뮬레이션합니다.
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>① useEffect vs SWR 비교</h2>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '12px' }}>
          같은 userId를 여러 번 요청해보세요. SWR은 캐시에서 즉시 반환합니다.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <UserCardWithEffect userId={1} />
          <UserCardWithSWR userId={1} />
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>② 캐시 효과 시각화</h2>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
          📦 표시가 있는 사용자는 이미 캐시에 저장된 데이터입니다.
        </p>
        <CacheComparisonDemo />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>③ SWR 주요 옵션</h2>
        <SWROptionsGuide />
      </div>
    </div>
  );
}
