/**
 * 04_custom_hook.jsx — 커스텀 훅 만들기
 * =========================================
 * 반복되는 로직을 커스텀 훅으로 분리하는 방법을 살펴봅니다.
 *
 * 1. useFetchData    — 데이터 요청 로직을 분리한 커스텀 훅
 * 2. useFetchWithCache — 캐시를 추가한 버전
 * 3. useLocalStorage — localStorage 연동 커스텀 훅
 * 4. useDebounce     — 디바운스 커스텀 훅
 *
 * [규칙] 커스텀 훅의 이름은 반드시 'use'로 시작해야 합니다.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// ─────────────────────────────────────────────
// 커스텀 훅 1: useFetchData — 기본 데이터 요청
// ─────────────────────────────────────────────
/**
 * 데이터 요청에 필요한 3가지 상태(data, loading, error)를 한 번에 관리합니다.
 * 컴포넌트는 UI 표시에만 집중할 수 있게 됩니다.
 *
 * @param {string} url - 데이터를 가져올 주소
 * @returns {{ data, loading, error, refetch }}
 */
function useFetchData(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}: 데이터를 가져올 수 없어요.`);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // refetch: 수동으로 다시 불러올 수 있는 함수도 함께 반환합니다
  return { data, loading, error, refetch: fetchData };
}

// ─────────────────────────────────────────────
// 커스텀 훅 2: useFetchWithCache — 캐시 추가
// ─────────────────────────────────────────────
/**
 * 한 번 요청한 URL의 결과를 모듈 스코프의 cache 객체에 저장합니다.
 * 같은 URL을 다시 요청하면 네트워크 없이 캐시에서 바로 반환합니다.
 *
 * ⚠️ 캐시는 페이지를 새로고침하면 초기화됩니다.
 *    영구 저장이 필요하면 TanStack Query 같은 라이브러리를 사용하세요.
 */
const cache = {}; // 모듈 스코프: 앱 전체에서 공유되는 캐시 저장소

function useFetchWithCache(url) {
  const [data, setData] = useState(cache[url] || null);
  const [loading, setLoading] = useState(!cache[url]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache[url]) {
      // 캐시 히트: 네트워크 요청 없이 즉시 반환
      setData(cache[url]);
      setLoading(false);
      return;
    }

    let cancelled = false; // 언마운트 시 상태 업데이트 방지

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('요청 실패');
        const result = await response.json();
        cache[url] = result; // 캐시에 저장
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; }; // cleanup: 언마운트 시 취소 플래그
  }, [url]);

  return { data, loading, error };
}

// ─────────────────────────────────────────────
// 커스텀 훅 3: useLocalStorage
// ─────────────────────────────────────────────
/**
 * useState처럼 사용하지만, 값이 localStorage에 자동으로 저장됩니다.
 * 새로고침 후에도 값이 유지됩니다.
 *
 * @param {string} key     - localStorage에 저장할 키
 * @param {*}      initial - 저장된 값이 없을 때 사용할 초기값
 */
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });

  const setStoredValue = useCallback((newValue) => {
    setValue(newValue);
    try {
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch {
      console.warn('localStorage 저장 실패');
    }
  }, [key]);

  return [value, setStoredValue];
}

// ─────────────────────────────────────────────
// 커스텀 훅 4: useDebounce
// ─────────────────────────────────────────────
/**
 * 값이 바뀐 뒤 일정 시간(delay)이 지나야 debouncedValue가 업데이트됩니다.
 * 검색창에서 매 키 입력마다 요청하지 않도록 할 때 사용합니다.
 *
 * @param {*}      value - 디바운스를 적용할 값
 * @param {number} delay - 대기 시간 (ms)
 */
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value); // delay ms 후에야 업데이트
    }, delay);

    return () => clearTimeout(timer); // 값이 또 바뀌면 이전 타이머 취소
  }, [value, delay]);

  return debouncedValue;
}

// ─────────────────────────────────────────────
// 사용 예제 컴포넌트들
// ─────────────────────────────────────────────

/** useFetchData 사용 예제 */
export function PostListDemo() {
  const [postId, setPostId] = useState(1);
  const { data, loading, error, refetch } = useFetchData(
    `https://jsonplaceholder.typicode.com/posts/${postId}`
  );

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
        커스텀 훅 덕분에 컴포넌트 코드가 매우 짧아졌습니다.
      </p>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
        <label>Post ID:</label>
        <input
          type="number"
          value={postId}
          min={1}
          max={100}
          onChange={e => setPostId(Number(e.target.value))}
          style={{ width: '60px', padding: '5px 8px', border: '1px solid #d1d5db', borderRadius: '5px' }}
        />
        <button
          onClick={refetch}
          style={{ padding: '5px 12px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          새로고침
        </button>
      </div>

      {loading && <p style={{ color: '#6b7280' }}>불러오는 중...</p>}
      {error && <p style={{ color: '#ef4444' }}>에러: {error}</p>}
      {data && !loading && (
        <div style={{ padding: '10px', background: '#f9fafb', borderRadius: '6px' }}>
          <p style={{ fontWeight: '600', marginBottom: '4px' }}>{data.title}</p>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>{data.body}</p>
        </div>
      )}
    </div>
  );
}

/** useFetchWithCache 사용 예제 */
export function CachedFetchDemo() {
  const [tab, setTab] = useState(1);
  const { data, loading } = useFetchWithCache(
    `https://jsonplaceholder.typicode.com/users/${tab}`
  );
  const loadRef = useRef(0);
  if (loading) loadRef.current += 1;

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '8px' }}>
        한 번 로드된 탭은 다시 로딩 없이 즉시 표시됩니다. 탭을 왔다 갔다 해보세요.
      </p>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
        {[1, 2, 3].map(id => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              padding: '5px 14px',
              background: tab === id ? '#6366f1' : '#f3f4f6',
              color: tab === id ? 'white' : '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            사용자 {id}
          </button>
        ))}
      </div>
      {loading && <p style={{ color: '#6b7280' }}>불러오는 중...</p>}
      {data && !loading && (
        <div style={{ padding: '10px', background: '#f9fafb', borderRadius: '6px' }}>
          <p><strong>{data.name}</strong> (@{data.username})</p>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>{data.email} · {data.company?.name}</p>
          {cache[`https://jsonplaceholder.typicode.com/users/${tab}`] && (
            <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>
              ✅ 캐시에서 로드됨 (네트워크 요청 없음)
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/** useLocalStorage 사용 예제 */
export function LocalStorageDemo() {
  const [name, setName] = useLocalStorage('demo-name', '');
  const [theme, setTheme] = useLocalStorage('demo-theme', 'light');

  return (
    <div style={{
      padding: '12px',
      background: theme === 'dark' ? '#1e293b' : '#f9fafb',
      color: theme === 'dark' ? 'white' : '#1e293b',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
    }}>
      <p style={{ fontSize: '0.82rem', color: theme === 'dark' ? '#94a3b8' : '#6b7280', marginBottom: '10px' }}>
        값을 입력하고 새로고침해도 그대로 유지됩니다.
      </p>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="이름 입력..."
          style={{
            flex: 1,
            padding: '7px 10px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            background: theme === 'dark' ? '#334155' : 'white',
            color: theme === 'dark' ? 'white' : '#1e293b',
          }}
        />
        <button
          onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
          style={{ padding: '7px 12px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          {theme === 'light' ? '다크 모드' : '라이트 모드'}
        </button>
      </div>
      {name && <p>안녕하세요, <strong>{name}</strong>님!</p>}
      <p style={{ fontSize: '0.75rem', color: theme === 'dark' ? '#94a3b8' : '#9ca3af', marginTop: '6px' }}>
        localStorage 키: demo-name, demo-theme
      </p>
    </div>
  );
}

/** useDebounce 사용 예제 */
export function DebounceSearchDemo() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400); // 400ms 대기
  const [requestCount, setRequestCount] = useState(0);
  const [keystrokeCount, setKeystrokeCount] = useState(0);

  // debouncedQuery가 바뀔 때만 "실제 요청" 카운트 증가
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    if (debouncedQuery.trim()) {
      setRequestCount(c => c + 1);
    }
  }, [debouncedQuery]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    setKeystrokeCount(c => c + 1); // 키 입력마다 카운트
  };

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
        빠르게 타이핑하면 실제 요청 횟수가 키 입력 횟수보다 훨씬 적습니다.
      </p>
      <input
        value={query}
        onChange={handleChange}
        placeholder="빠르게 타이핑해보세요..."
        style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #6366f1', borderRadius: '6px', marginBottom: '10px', boxSizing: 'border-box' }}
      />
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ padding: '8px 14px', background: '#fee2e2', borderRadius: '6px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: '#dc2626' }}>키 입력 횟수</p>
          <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#dc2626' }}>{keystrokeCount}</p>
        </div>
        <div style={{ padding: '8px 14px', background: '#dcfce7', borderRadius: '6px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: '#16a34a' }}>실제 요청 횟수</p>
          <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#16a34a' }}>{requestCount}</p>
        </div>
        <div style={{ padding: '8px 14px', background: '#eef2ff', borderRadius: '6px', flex: 1, minWidth: '120px' }}>
          <p style={{ fontSize: '0.75rem', color: '#6366f1' }}>디바운스된 검색어</p>
          <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#4f46e5' }}>"{debouncedQuery}"</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 전체 데모
// ─────────────────────────────────────────────
export default function CustomHookDemo() {
  const sectionStyle = {
    marginBottom: '24px',
    padding: '16px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>커스텀 훅 예제</h1>
      <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '0.9rem' }}>
        반복 로직을 훅으로 분리하면 컴포넌트가 UI에만 집중할 수 있게 됩니다.
      </p>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '2px' }}>① useFetchData — 데이터 요청 훅</h2>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '10px' }}>data / loading / error 3가지 상태를 한 번에 관리</p>
        <PostListDemo />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '2px' }}>② useFetchWithCache — 캐시 추가</h2>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '10px' }}>한 번 가져온 데이터는 다시 요청하지 않음</p>
        <CachedFetchDemo />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '2px' }}>③ useLocalStorage — 영구 저장</h2>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '10px' }}>새로고침 후에도 값이 유지됨</p>
        <LocalStorageDemo />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '2px' }}>④ useDebounce — 디바운스</h2>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '10px' }}>빠른 입력 중 불필요한 요청 방지</p>
        <DebounceSearchDemo />
      </div>
    </div>
  );
}
