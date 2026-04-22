/**
 * 04_tanstack_query.jsx — TanStack Query (useQuery / useMutation)
 * ================================================================
 * 서버 데이터를 캐싱하고 자동으로 관리하는 TanStack Query를 배웁니다.
 * useQuery(조회), useMutation(변경), invalidateQueries(갱신), 낙관적 업데이트까지 다룹니다.
 *
 * ⚠️ 사전 설치 필요: npm install @tanstack/react-query
 *
 * ⚠️ main.jsx 설정 필요:
 *   import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
 *   const queryClient = new QueryClient();
 *   <QueryClientProvider client={queryClient}>
 *     <App />
 *   </QueryClientProvider>
 *
 * 이 파일은 학습용 예제입니다.
 * 시뮬레이터 컴포넌트는 TanStack Query 없이도 동작합니다.
 */

import { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


// ─────────────────────────────────────────────────────
// TanStack Query 개념 설명
// ─────────────────────────────────────────────────────

/**
 * ✅ main.jsx 설정 (전체 앱에 한 번만)
 *
 * import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
 *
 * const queryClient = new QueryClient({
 *   defaultOptions: {
 *     queries: {
 *       staleTime: 1000 * 60 * 5,  // 5분: 이 시간 동안 캐시 데이터 사용
 *       gcTime: 1000 * 60 * 30,    // 30분: 이 시간 후 캐시 삭제
 *     },
 *   },
 * });
 *
 * ReactDOM.createRoot(document.getElementById('root')).render(
 *   <QueryClientProvider client={queryClient}>
 *     <App />
 *   </QueryClientProvider>
 * );
 */


// ─────────────────────────────────────────────────────
// 예제 1: useEffect vs useQuery 비교
// ─────────────────────────────────────────────────────

export function UseEffectVsUseQueryGuide() {
  return (
    <div style={{ padding: '20px', maxWidth: '640px' }}>
      <h2>useEffect vs useQuery 비교</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
        {/* useEffect + fetch */}
        <div style={{ padding: '14px', background: '#fef9c3', borderRadius: '10px', border: '1px solid #fde68a' }}>
          <p style={{ margin: '0 0 10px', fontWeight: 700, color: '#713f12', fontSize: '0.82rem' }}>
            🔧 useEffect + fetch (직접 구현)
          </p>
          <pre style={{ margin: 0, fontSize: '0.72rem', color: '#78350f', background: '#fef3c7', padding: '10px', borderRadius: '6px', lineHeight: 1.7, overflowX: 'auto' }}>{`const [data, setData] = useState(null);
const [isPending, setIsPending]
  = useState(false);
const [error, setError]
  = useState(null);

useEffect(() => {
  setIsPending(true);
  fetch('/api/posts')
    .then(r => r.json())
    .then(d => setData(d))
    .catch(e => setError(e))
    .finally(() =>
      setIsPending(false)
    );
}, []);
// 캐싱? ❌
// 자동 갱신? ❌
// 중복 요청 방지? ❌`}</pre>
        </div>

        {/* useQuery */}
        <div style={{ padding: '14px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #86efac' }}>
          <p style={{ margin: '0 0 10px', fontWeight: 700, color: '#15803d', fontSize: '0.82rem' }}>
            ✨ useQuery (자동 관리)
          </p>
          <pre style={{ margin: 0, fontSize: '0.72rem', color: '#166534', background: '#dcfce7', padding: '10px', borderRadius: '6px', lineHeight: 1.7, overflowX: 'auto' }}>{`const {
  data,
  isPending,
  isError,
  error,
  refetch,
} = useQuery({
  queryKey: ['posts'],
  queryFn: () =>
    fetch('/api/posts')
      .then(r => r.json()),
});
// 캐싱? ✅ 자동
// 자동 갱신? ✅ 백그라운드
// 중복 요청 방지? ✅ 자동`}</pre>
        </div>
      </div>

      {/* 장점 표 */}
      <div style={{ background: '#f8fafc', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ background: '#1e293b', color: 'white' }}>
              <th style={{ padding: '10px 12px', textAlign: 'left' }}>기능</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>useEffect</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>useQuery</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['로딩/에러 상태 관리', '직접 구현', '자동'],
              ['캐싱 (같은 데이터 재사용)', '❌', '✅'],
              ['백그라운드 자동 갱신', '❌', '✅'],
              ['여러 컴포넌트 간 데이터 공유', '❌', '✅'],
              ['중복 요청 방지', '❌', '✅'],
              ['수동 새로고침 (refetch)', '직접 구현', '내장'],
            ].map(([feature, useEffect, useQuery], i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                <td style={{ padding: '8px 12px', color: '#374151' }}>{feature}</td>
                <td style={{ padding: '8px 12px', textAlign: 'center', color: useEffect === '❌' ? '#dc2626' : '#6b7280', fontSize: '0.78rem' }}>{useEffect}</td>
                <td style={{ padding: '8px 12px', textAlign: 'center', color: useQuery === '✅' ? '#16a34a' : '#6b7280', fontSize: '0.78rem', fontWeight: useQuery === '✅' ? 700 : 400 }}>{useQuery}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: useQuery 실제 코드 패턴
// ─────────────────────────────────────────────────────

/**
 * 실제 useQuery를 사용하는 전체 코드 패턴을 보여줍니다.
 * (QueryClientProvider 설정이 완료된 환경에서 동작)
 *
 * 이 컴포넌트는 시뮬레이션입니다.
 * 실제 useQuery 코드는 아래 주석을 참고하세요.
 */
export function UseQueryPatternGuide() {
  const [activeSection, setActiveSection] = useState('basic');

  const sections = {
    basic: {
      label: '기본 사용',
      code: `// ✅ useQuery 기본 사용
import { useQuery } from '@tanstack/react-query';

function PostList() {
  const {
    data,       // 서버에서 받아온 데이터
    isPending,  // 요청 중 (true/false)
    isError,    // 에러 발생 (true/false)
    error,      // 에러 정보
    refetch,    // 수동 재요청 함수
  } = useQuery({
    queryKey: ['posts'],   // 캐시 키 (이름표)
    queryFn: () =>         // 실제 데이터 조회 함수
      fetch('https://jsonplaceholder.typicode.com/posts')
        .then(r => r.json()),
  });

  if (isPending) return <p>로딩 중...</p>;
  if (isError)   return <p>에러: {error.message}</p>;

  return (
    <>
      {data.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
      <button onClick={() => refetch()}>새로고침</button>
    </>
  );
}`,
    },
    dynamic: {
      label: '동적 queryKey',
      code: `// ✅ 동적 queryKey — userId가 바뀌면 자동 재요청
const [userId, setUserId] = useState(1);

const { data: user } = useQuery({
  queryKey: ['user', userId],  // userId 포함
  queryFn: () =>
    fetch(\`/api/users/\${userId}\`).then(r => r.json()),
});

// userId 변경 → queryKey 변경 → 자동으로 새 데이터 요청

// ✅ enabled — user 있을 때만 posts 요청 (순차 실행)
const { data: posts } = useQuery({
  queryKey: ['posts', userId],
  queryFn: () =>
    fetch(\`/api/users/\${userId}/posts\`).then(r => r.json()),
  enabled: !!user,  // user 데이터 있을 때만 실행
});`,
    },
    multiple: {
      label: '여러 useQuery',
      code: `// ✅ 한 컴포넌트에서 여러 useQuery 사용
// 이름 충돌 방지 위해 별칭(as) 사용
const {
  data: user,
  isPending: userPending,
} = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
});

const {
  data: posts,
  isPending: postsPending,
} = useQuery({
  queryKey: ['posts', userId],
  queryFn: fetchPosts,
  enabled: !!user, // user 있을 때만
});

// 두 요청 모두 완료되면 표시
if (userPending || postsPending) return <Spinner />;`,
    },
  };

  return (
    <div style={{ padding: '20px', maxWidth: '580px' }}>
      <h2>useQuery 코드 패턴</h2>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
        {Object.entries(sections).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: activeSection === key ? 700 : 400,
              background: activeSection === key ? '#16a34a' : '#f1f5f9',
              color: activeSection === key ? 'white' : '#374151',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <pre style={{ margin: 0, fontSize: '0.77rem', background: '#1e293b', color: '#e2e8f0', padding: '16px', borderRadius: '10px', lineHeight: 1.8, overflowX: 'auto' }}>
        {sections[activeSection].code}
      </pre>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: useMutation 패턴과 invalidateQueries
// ─────────────────────────────────────────────────────

export function UseMutationPatternGuide() {
  const [activeTab, setActiveTab] = useState('basic');

  const tabs = {
    basic: {
      label: 'useMutation 기본',
      code: `import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

function AddPostForm() {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    // 서버 데이터 변경 함수 (POST 요청)
    mutationFn: (newPost) =>
      axios.post('/api/posts', newPost),

    // 성공 시: 'posts' 캐시 무효화 → 자동으로 목록 새로고침
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts']
      });
      alert('게시글이 등록됐습니다!');
    },

    // 실패 시
    onError: (error) => {
      alert('실패: ' + error.message);
    },
  });

  const handleSubmit = () => {
    // mutate()로 실행
    mutate({ title: '새 글', body: '내용', userId: 1 });
  };

  return (
    <button onClick={handleSubmit} disabled={isPending}>
      {isPending ? '등록 중...' : '게시글 등록'}
    </button>
  );
}`,
    },
    invalidate: {
      label: 'invalidateQueries',
      code: `// invalidateQueries 동작 순서
//
// 1. mutate() 호출 → 서버에 POST 요청
// 2. 서버 응답 성공 → onSuccess 실행
// 3. invalidateQueries(['posts']) 호출
// 4. 'posts' 쿼리 "stale" 상태로 표시
// 5. useQuery(['posts'])가 자동으로 재요청
// 6. 최신 데이터로 화면 업데이트

// 특정 쿼리만 무효화
queryClient.invalidateQueries({ queryKey: ['posts'] });

// userId 관련 쿼리 전체 무효화
queryClient.invalidateQueries({ queryKey: ['posts', userId] });

// 'posts'로 시작하는 모든 쿼리 무효화
queryClient.invalidateQueries({ queryKey: ['posts'] });
// ['posts'], ['posts', 1], ['posts', 2] 등 모두 포함`,
    },
    lifecycle: {
      label: 'Mutation 생명주기',
      code: `const { mutate } = useMutation({
  mutationFn: createPost,

  // 요청 시작 직전 실행
  onMutate: async (variables) => {
    console.log('요청 시작:', variables);
    // 낙관적 업데이트 시 여기서 처리
  },

  // 요청 성공 시 실행
  onSuccess: (data, variables, context) => {
    console.log('성공:', data);
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  },

  // 요청 실패 시 실행
  onError: (error, variables, context) => {
    console.log('실패:', error.message);
    // 낙관적 업데이트 롤백
  },

  // 성공·실패 모두 실행
  onSettled: (data, error) => {
    console.log('완료 (성공 또는 실패)');
  },
});`,
    },
  };

  return (
    <div style={{ padding: '20px', maxWidth: '580px' }}>
      <h2>useMutation 코드 패턴</h2>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {Object.entries(tabs).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: activeTab === key ? 700 : 400,
              background: activeTab === key ? '#2563eb' : '#f1f5f9',
              color: activeTab === key ? 'white' : '#374151',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <pre style={{ margin: 0, fontSize: '0.77rem', background: '#1e293b', color: '#e2e8f0', padding: '16px', borderRadius: '10px', lineHeight: 1.8, overflowX: 'auto' }}>
        {tabs[activeTab].code}
      </pre>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 4: 낙관적 업데이트 시뮬레이터
// ─────────────────────────────────────────────────────

/**
 * 낙관적 업데이트(Optimistic Update): 서버 응답을 기다리지 않고 UI를 먼저 업데이트합니다.
 * 실패 시 이전 상태로 롤백합니다.
 *
 * 이 예제는 TanStack Query 없이 동일한 동작을 시뮬레이션합니다.
 */
export function OptimisticUpdateDemo() {
  const [likes, setLikes] = useState({ post1: 42, post2: 17, post3: 89 });
  const [pending, setPending] = useState({});
  const [log, setLog] = useState([]);
  const [failNext, setFailNext] = useState(false);

  const addLog = (msg, color = '#374151') =>
    setLog(prev => [{ msg, color, id: Date.now() + Math.random() }, ...prev].slice(0, 6));

  const handleLike = async (postId) => {
    const prevLikes = likes[postId];

    // ① 낙관적 업데이트: 서버 응답 전에 UI 먼저 업데이트
    setLikes(prev => ({ ...prev, [postId]: prev[postId] + 1 }));
    setPending(prev => ({ ...prev, [postId]: true }));
    addLog(`[${postId}] 낙관적 업데이트: ${prevLikes} → ${prevLikes + 1}`, '#7c3aed');

    // ② 서버 요청 시뮬레이션 (1초 대기)
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (failNext) {
      // ③-실패: 이전 상태로 롤백
      setLikes(prev => ({ ...prev, [postId]: prevLikes }));
      addLog(`[${postId}] ❌ 서버 실패 → 롤백: ${prevLikes + 1} → ${prevLikes}`, '#dc2626');
      setFailNext(false);
    } else {
      // ③-성공: 서버 데이터로 확정
      addLog(`[${postId}] ✅ 서버 성공 → 확정`, '#16a34a');
    }

    setPending(prev => ({ ...prev, [postId]: false }));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '520px' }}>
      <h2>낙관적 업데이트 시뮬레이터</h2>
      <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '14px' }}>
        하트를 누르면 서버 응답(1초) 전에 숫자가 먼저 올라갑니다
      </p>

      {/* 실패 시뮬레이션 토글 */}
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', fontSize: '0.88rem', cursor: 'pointer' }}>
        <input type="checkbox" checked={failNext} onChange={e => setFailNext(e.target.checked)} />
        <span style={{ color: failNext ? '#dc2626' : '#374151' }}>
          {failNext ? '⚠️ 다음 요청 실패 시뮬레이션 ON' : '다음 요청 실패 시뮬레이션'}
        </span>
      </label>

      {/* 게시글 카드 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
        {Object.entries(likes).map(([postId, count]) => (
          <div
            key={postId}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}
          >
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
              게시글 {postId.replace('post', '')}
            </span>
            <button
              onClick={() => handleLike(postId)}
              disabled={pending[postId]}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '20px',
                border: 'none',
                background: pending[postId] ? '#f1f5f9' : '#fef2f2',
                color: pending[postId] ? '#9ca3af' : '#dc2626',
                cursor: pending[postId] ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                fontSize: '0.88rem',
                transition: 'all 0.15s',
              }}
            >
              {pending[postId] ? '⏳' : '❤️'} {count}
            </button>
          </div>
        ))}
      </div>

      {/* 동작 로그 */}
      {log.length > 0 && (
        <div style={{ padding: '10px 12px', background: '#1e293b', borderRadius: '8px', marginBottom: '14px' }}>
          {log.map((entry) => (
            <p key={entry.id} style={{ margin: '2px 0', fontSize: '0.78rem', fontFamily: 'monospace', color: entry.color }}>
              {entry.msg}
            </p>
          ))}
        </div>
      )}

      {/* TanStack Query 코드 */}
      <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.78rem', color: '#475569' }}>
        <p style={{ margin: '0 0 6px', fontWeight: 700 }}>TanStack Query 낙관적 업데이트 코드</p>
        <pre style={{ margin: 0, color: '#334155', lineHeight: 1.7, overflowX: 'auto' }}>{`const { mutate } = useMutation({
  mutationFn: (postId) => likePost(postId),

  onMutate: async (postId) => {
    // 진행 중 쿼리 취소
    await queryClient.cancelQueries({ queryKey: ['posts'] });
    // 현재 상태 저장
    const prev = queryClient.getQueryData(['posts']);
    // 즉시 UI 업데이트
    queryClient.setQueryData(['posts'], old =>
      old.map(p => p.id === postId
        ? { ...p, likes: p.likes + 1 }
        : p
      )
    );
    return { prev }; // 실패 시 복원용
  },

  onError: (err, postId, context) => {
    // 실패 → 이전 상태로 롤백
    queryClient.setQueryData(['posts'], context.prev);
  },

  onSuccess: () => {
    // 성공 → 서버 데이터로 갱신
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  },
});`}</pre>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 5: staleTime과 gcTime 시각화
// ─────────────────────────────────────────────────────

export function CacheTimeGuide() {
  const [elapsed, setElapsed] = useState(0);
  const staleTime = 5;   // 5초 (시뮬레이션용)
  const gcTime = 10;     // 10초

  const getStatus = () => {
    if (elapsed === 0) return { label: '데이터 없음', color: '#9ca3af', bg: '#f8fafc' };
    if (elapsed <= staleTime) return { label: '신선 (Fresh) — 서버 재요청 없음', color: '#16a34a', bg: '#f0fdf4' };
    if (elapsed <= gcTime) return { label: '오래됨 (Stale) — 백그라운드 재요청 발생', color: '#f59e0b', bg: '#fffbeb' };
    return { label: '만료 (Gone) — 캐시에서 삭제됨', color: '#dc2626', bg: '#fef2f2' };
  };

  const status = getStatus();

  return (
    <div style={{ padding: '20px', maxWidth: '480px' }}>
      <h2>staleTime vs gcTime 시각화</h2>
      <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '14px' }}>
        "데이터 받기"를 클릭 후 시간 경과에 따른 캐시 상태 변화를 확인하세요
        <br />(staleTime: {staleTime}초, gcTime: {gcTime}초)
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setElapsed(0)}
          style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#6366f1', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
        >
          데이터 받기 (elapsed=0)
        </button>
        {[2, 5, 7, 12].map(t => (
          <button
            key={t}
            onClick={() => setElapsed(t)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '0.78rem', color: '#374151', fontWeight: elapsed === t ? 700 : 400 }}
          >
            {t}초
          </button>
        ))}
      </div>

      {/* 타임라인 */}
      <div style={{ position: 'relative', height: '40px', background: '#f1f5f9', borderRadius: '8px', marginBottom: '16px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${(staleTime / gcTime) * 100}%`, background: '#dcfce7' }} />
        <div style={{ position: 'absolute', left: `${(staleTime / gcTime) * 100}%`, top: 0, height: '100%', width: `${((gcTime - staleTime) / gcTime) * 100}%`, background: '#fef9c3' }} />
        {elapsed > 0 && (
          <div style={{ position: 'absolute', top: '50%', left: `${Math.min((elapsed / gcTime) * 100, 100)}%`, transform: 'translate(-50%, -50%)', width: '20px', height: '20px', borderRadius: '50%', background: '#6366f1', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
        )}
        <div style={{ position: 'absolute', bottom: '-18px', left: `${(staleTime / gcTime) * 100}%`, fontSize: '0.7rem', color: '#6b7280', transform: 'translateX(-50%)' }}>
          staleTime ({staleTime}s)
        </div>
      </div>

      {/* 상태 표시 */}
      <div style={{ padding: '14px', background: status.bg, borderRadius: '10px', border: `1px solid ${status.color}33`, marginTop: '10px' }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700, color: status.color, fontSize: '0.95rem' }}>
          {elapsed === 0 ? '⏸ 아직 데이터 없음' : `⏱ ${elapsed}초 경과 — ${status.label}`}
        </p>
        {elapsed > 0 && elapsed <= staleTime && (
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#166534' }}>
            같은 queryKey로 useQuery를 호출해도 서버 요청 없이 캐시 데이터 반환
          </p>
        )}
        {elapsed > staleTime && elapsed <= gcTime && (
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#713f12' }}>
            화면에 표시는 되지만 백그라운드에서 서버에 재요청을 보냅니다
          </p>
        )}
        {elapsed > gcTime && (
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#991b1b' }}>
            캐시가 완전히 삭제됨 — 다음 요청 시 처음부터 다시 로딩
          </p>
        )}
      </div>

      <div style={{ marginTop: '12px', padding: '12px', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.78rem', color: '#475569' }}>
        <pre style={{ margin: 0, lineHeight: 1.7 }}>{`new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5분 → Fresh
      gcTime:    1000 * 60 * 30, // 30분 → 캐시 유지
    },
  },
})`}</pre>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
// ⚠️ QueryClientProvider로 감싸야 useQuery/useMutation이 동작합니다
// 시뮬레이터 컴포넌트는 QueryClientProvider 없이도 동작합니다

import {
  UseEffectVsUseQueryGuide,
  UseQueryPatternGuide,
  UseMutationPatternGuide,
  OptimisticUpdateDemo,
  CacheTimeGuide
} from './04_tanstack_query';

function App() {
  return (
    <div>
      <UseEffectVsUseQueryGuide />
      <UseQueryPatternGuide />
      <UseMutationPatternGuide />
      <OptimisticUpdateDemo />
      <CacheTimeGuide />
    </div>
  );
}
*/
