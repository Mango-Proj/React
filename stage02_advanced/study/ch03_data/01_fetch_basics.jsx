/**
 * 01_fetch_basics.jsx — fetch와 데이터 요청 기초
 * ==================================================
 * 브라우저 내장 fetch API로 서버에서 데이터를 가져오는 방법을 배웁니다.
 * useEffect 안에서 비동기 요청을 올바르게 처리하는 패턴을 익힙니다.
 *
 * 사용 API: https://jsonplaceholder.typicode.com (무료 테스트 API)
 *
 * 이 파일은 학습용 예제입니다.
 * Vite + React 프로젝트에서 App.jsx에 import하여 확인하세요.
 */

import { useState, useEffect } from 'react';


// ─────────────────────────────────────────────────────
// 예제 1: async를 useEffect에 잘못 쓰는 예시 vs 올바른 방법
// ─────────────────────────────────────────────────────

/**
 * useEffect의 콜백을 async로 선언하면 안 됩니다.
 * async 함수는 Promise를 반환하는데, useEffect는 반환값으로
 * cleanup 함수(또는 undefined)만 허용하기 때문입니다.
 */
export function AsyncPatternGuide() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>useEffect + async 올바른 패턴</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* 잘못된 방법 */}
        <div style={{ padding: '14px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fca5a5' }}>
          <p style={{ margin: '0 0 10px', fontWeight: 700, color: '#dc2626', fontSize: '0.88rem' }}>
            ❌ 잘못된 방법
          </p>
          <pre style={{ margin: 0, fontSize: '0.75rem', color: '#991b1b', background: '#fee2e2', padding: '10px', borderRadius: '6px', overflowX: 'auto', lineHeight: 1.7 }}>{`useEffect(async () => {
  // ← async를 직접 붙이면
  //   Promise 반환 → 에러!
  const res = await fetch(URL);
  const data = await res.json();
}, []);`}</pre>
          <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: '#dc2626' }}>
            async 함수는 Promise를 반환 → useEffect가 cleanup으로 오해
          </p>
        </div>

        {/* 올바른 방법 */}
        <div style={{ padding: '14px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #86efac' }}>
          <p style={{ margin: '0 0 10px', fontWeight: 700, color: '#16a34a', fontSize: '0.88rem' }}>
            ✅ 올바른 방법
          </p>
          <pre style={{ margin: 0, fontSize: '0.75rem', color: '#166534', background: '#dcfce7', padding: '10px', borderRadius: '6px', overflowX: 'auto', lineHeight: 1.7 }}>{`useEffect(() => {
  // 내부에서 별도 함수 정의
  const fetchData = async () => {
    const res = await fetch(URL);
    const data = await res.json();
  };

  fetchData(); // 즉시 호출
}, []);`}</pre>
          <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: '#16a34a' }}>
            useEffect 콜백 자체는 일반 함수 → OK
          </p>
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: 데이터·로딩·에러 3가지 상태 관리
// ─────────────────────────────────────────────────────

/**
 * 서버 요청 시 항상 3가지 상태를 함께 관리합니다.
 * - data: 받아온 실제 데이터
 * - isLoading: 요청 중인지 여부 (로딩 스피너 표시용)
 * - error: 실패 시 에러 정보
 *
 * jsonplaceholder.typicode.com의 /posts API를 실제로 호출합니다.
 */
export function PostList() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null); // 재요청 시 이전 에러 초기화

      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/posts?_limit=5'
        );

        // fetch는 4xx/5xx에도 에러를 던지지 않으므로 직접 확인 필요
        if (!response.ok) {
          throw new Error(`서버 오류: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false); // 성공·실패 무관하게 로딩 종료
      }
    };

    fetchPosts();
  }, []); // 마운트 시 1번만 실행

  // ① 로딩 중
  if (isLoading) {
    return (
      <div style={{ padding: '20px', maxWidth: '560px' }}>
        <h2>게시글 목록</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: '64px', background: '#f1f5f9', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
        <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: '12px' }}>
          ⏳ 데이터를 불러오는 중...
        </p>
      </div>
    );
  }

  // ② 에러 발생
  if (error) {
    return (
      <div style={{ padding: '20px', maxWidth: '560px' }}>
        <h2>게시글 목록</h2>
        <div style={{ padding: '16px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fca5a5', textAlign: 'center' }}>
          <p style={{ margin: '0 0 4px', color: '#dc2626', fontWeight: 700 }}>❌ 에러가 발생했습니다</p>
          <p style={{ margin: 0, color: '#991b1b', fontSize: '0.85rem' }}>{error.message}</p>
        </div>
      </div>
    );
  }

  // ③ 데이터 표시
  return (
    <div style={{ padding: '20px', maxWidth: '560px' }}>
      <h2>게시글 목록</h2>
      <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '14px' }}>
        jsonplaceholder.typicode.com API에서 실제로 가져온 데이터입니다
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {posts.map((post) => (
          <div
            key={post.id}
            style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}
          >
            <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
              {post.title}
            </p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.5 }}>
              {post.body.slice(0, 60)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: response.ok — fetch 에러 처리의 함정
// ─────────────────────────────────────────────────────

/**
 * fetch는 네트워크 오류(인터넷 끊김)에만 에러를 던집니다.
 * 서버가 404, 500을 반환해도 fetch는 에러로 처리하지 않습니다!
 * response.ok를 반드시 확인해야 합니다.
 */
export function FetchErrorHandlingDemo() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const testUrl = async (label, url) => {
    setLoading(prev => ({ ...prev, [label]: true }));
    try {
      const response = await fetch(url);

      // response.ok: status 200-299면 true
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(prev => ({ ...prev, [label]: { ok: true, msg: `성공! 데이터 수신 (status: ${response.status})` } }));
    } catch (err) {
      setResults(prev => ({ ...prev, [label]: { ok: false, msg: err.message } }));
    } finally {
      setLoading(prev => ({ ...prev, [label]: false }));
    }
  };

  const urls = [
    { label: '정상 요청', url: 'https://jsonplaceholder.typicode.com/posts/1' },
    { label: '404 요청', url: 'https://jsonplaceholder.typicode.com/posts/99999' },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '520px' }}>
      <h2>fetch 에러 처리 — response.ok</h2>
      <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '14px' }}>
        fetch는 404 응답도 에러로 던지지 않습니다. response.ok를 직접 확인해야 합니다.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {urls.map(({ label, url }) => (
          <div key={label} style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{label}</span>
              <button
                onClick={() => testUrl(label, url)}
                disabled={loading[label]}
                style={{ padding: '5px 12px', borderRadius: '5px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                {loading[label] ? '요청 중...' : '요청 보내기'}
              </button>
            </div>
            <code style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '6px' }}>{url}</code>
            {results[label] && (
              <div style={{ padding: '8px', background: results[label].ok ? '#f0fdf4' : '#fef2f2', borderRadius: '5px', fontSize: '0.8rem', color: results[label].ok ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                {results[label].ok ? '✅' : '❌'} {results[label].msg}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '14px', padding: '12px', background: '#fffbeb', borderRadius: '8px', fontSize: '0.82rem', color: '#713f12' }}>
        <p style={{ margin: '0 0 6px', fontWeight: 700 }}>⚠️ fetch의 함정</p>
        <p style={{ margin: '0 0 4px' }}>fetch는 <strong>네트워크 오류만</strong> catch로 잡힙니다.</p>
        <p style={{ margin: 0 }}>404, 500 같은 HTTP 에러는 <strong>response.ok를 직접 확인</strong>해야 합니다.</p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 4: 의존성 배열 활용 — userId 변경 시 재요청
// ─────────────────────────────────────────────────────

/**
 * userId가 바뀔 때마다 useEffect가 재실행되어 새 유저 데이터를 요청합니다.
 * 의존성 배열에 변수를 넣으면 그 변수가 바뀔 때마다 재실행됩니다.
 */
export function UserFetcher() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);
      setUser(null);

      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userId}`
        );
        if (!response.ok) throw new Error(`유저 #${userId}를 찾을 수 없습니다`);
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]); // userId가 바뀔 때마다 재실행

  return (
    <div style={{ padding: '20px', maxWidth: '480px' }}>
      <h2>유저 정보 조회 (의존성 배열)</h2>
      <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '14px' }}>
        userId가 바뀔 때마다 새 API 요청이 자동으로 발생합니다
      </p>

      {/* 유저 ID 선택 */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[1, 2, 3, 4, 5].map((id) => (
          <button
            key={id}
            onClick={() => setUserId(id)}
            style={{
              padding: '7px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: userId === id ? 700 : 400,
              background: userId === id ? '#6366f1' : '#f1f5f9',
              color: userId === id ? 'white' : '#374151',
            }}
          >
            유저 #{id}
          </button>
        ))}
      </div>

      {/* 결과 */}
      {isLoading && (
        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center', color: '#9ca3af' }}>
          ⏳ 유저 #{userId} 정보 불러오는 중...
        </div>
      )}

      {error && (
        <div style={{ padding: '14px', background: '#fef2f2', borderRadius: '8px', color: '#dc2626' }}>
          ❌ {error.message}
        </div>
      )}

      {user && !isLoading && (
        <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #86efac' }}>
          <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>
            👤 {user.name}
          </p>
          <p style={{ margin: '0 0 2px', fontSize: '0.85rem', color: '#6b7280' }}>📧 {user.email}</p>
          <p style={{ margin: '0 0 2px', fontSize: '0.85rem', color: '#6b7280' }}>📞 {user.phone}</p>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>🌐 {user.website}</p>
        </div>
      )}

      <div style={{ marginTop: '12px', padding: '10px 12px', background: '#eff6ff', borderRadius: '8px', fontSize: '0.8rem', color: '#1e40af' }}>
        <code>useEffect(() =&gt; {'{ fetchUser(); }'}, [userId])</code>
        <p style={{ margin: '4px 0 0' }}>userId 변경 → useEffect 재실행 → 새 API 요청</p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
import {
  AsyncPatternGuide,
  PostList,
  FetchErrorHandlingDemo,
  UserFetcher
} from './01_fetch_basics';

function App() {
  return (
    <div>
      <AsyncPatternGuide />
      <PostList />
      <FetchErrorHandlingDemo />
      <UserFetcher />
    </div>
  );
}
*/
