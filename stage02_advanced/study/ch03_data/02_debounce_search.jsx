/**
 * 02_debounce_search.jsx — 디바운싱 검색과 axios 기본 사용
 * ===========================================================
 * 검색창 입력마다 API 요청을 보내면 서버에 과도한 부하가 걸립니다.
 * 디바운싱(Debouncing)으로 입력이 멈춘 후 일정 시간 뒤에만 요청합니다.
 *
 * ⚠️ axios 사용 시 설치 필요: npm install axios
 * fetch 버전도 함께 제공합니다 (설치 불필요).
 *
 * 이 파일은 학습용 예제입니다.
 */

import { useState, useEffect } from 'react';
// import axios from 'axios'; // axios 사용 시 주석 해제


// ─────────────────────────────────────────────────────
// 예제 1: 디바운싱 없는 검색 (문제 상황)
// ─────────────────────────────────────────────────────

/**
 * 디바운싱 없이 키 입력마다 요청을 보내면 어떤 문제가 생기는지 시각화합니다.
 * "react hooks" 입력 시 → 12번의 API 요청 발생
 */
export function SearchWithoutDebounce() {
  const [searchTerm, setSearchTerm] = useState('');
  const [requestLog, setRequestLog] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    // 입력할 때마다 요청 발생
    setRequestLog(prev => [
      { term: searchTerm, time: new Date().toLocaleTimeString('ko', { hour12: false }) },
      ...prev,
    ].slice(0, 8));

    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/posts?_limit=3&title_like=${encodeURIComponent(searchTerm)}`
        );
        const data = await res.json();
        setResults(data.slice(0, 3));
      } catch (e) {
        // 에러 무시 (예시용)
      }
    };

    fetchData();
  }, [searchTerm]);

  return (
    <div style={{ padding: '20px', maxWidth: '520px' }}>
      <h2>디바운싱 없는 검색 ❌</h2>
      <p style={{ fontSize: '0.88rem', color: '#dc2626', marginBottom: '12px' }}>
        키를 누를 때마다 API 요청이 발생합니다
      </p>

      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="검색어 입력..."
        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fca5a5', fontSize: '0.9rem', boxSizing: 'border-box', marginBottom: '12px' }}
      />

      {requestLog.length > 0 && (
        <div style={{ padding: '10px', background: '#fef2f2', borderRadius: '8px', marginBottom: '12px' }}>
          <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#dc2626', fontSize: '0.82rem' }}>
            요청 로그 (총 {requestLog.length}회 발생 중...)
          </p>
          {requestLog.map((log, i) => (
            <p key={i} style={{ margin: '2px 0', fontSize: '0.78rem', fontFamily: 'monospace', color: '#991b1b' }}>
              [{log.time}] "{log.term}" 검색 요청
            </p>
          ))}
        </div>
      )}
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: 디바운싱 적용 검색 (해결책)
// ─────────────────────────────────────────────────────

/**
 * setTimeout으로 타이머를 설정하고,
 * 새 입력이 오면 clearTimeout으로 이전 타이머를 취소합니다.
 * 입력이 멈춘 후 0.5초 뒤에만 실제 API 요청을 보냅니다.
 */
export function SearchWithDebounce() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [keystrokeCount, setKeystrokeCount] = useState(0);
  const [status, setStatus] = useState('idle'); // 'idle' | 'waiting' | 'fetching'

  useEffect(() => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      setResults([]);
      setStatus('idle');
      return;
    }

    setStatus('waiting'); // 타이머 대기 중

    // 0.5초 후 실행될 타이머 설정
    const timer = setTimeout(async () => {
      setStatus('fetching');
      setIsLoading(true);
      setRequestCount(c => c + 1);

      try {
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/posts?_limit=5`
        );
        const data = await res.json();
        // 클라이언트에서 간단히 필터링 (jsonplaceholder는 title_like가 제한적)
        const filtered = data.filter(p =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setResults(filtered.slice(0, 4));
      } catch (e) {
        setResults([]);
      } finally {
        setIsLoading(false);
        setStatus('idle');
      }
    }, 500); // 0.5초 대기

    // 정리 함수: 새 입력이 오면 이전 타이머 취소
    return () => {
      clearTimeout(timer);
      setStatus('idle');
    };
  }, [searchTerm]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setKeystrokeCount(c => c + 1);
  };

  const statusColors = {
    idle: '#9ca3af',
    waiting: '#f59e0b',
    fetching: '#6366f1',
  };
  const statusLabels = {
    idle: '대기 중',
    waiting: '⏱ 0.5초 후 요청 예정...',
    fetching: '🔄 요청 중...',
  };

  return (
    <div style={{ padding: '20px', maxWidth: '520px' }}>
      <h2>디바운싱 적용 검색 ✅</h2>
      <p style={{ fontSize: '0.88rem', color: '#16a34a', marginBottom: '12px' }}>
        입력이 멈춘 후 0.5초 뒤에만 API 요청을 보냅니다
      </p>

      <input
        value={searchTerm}
        onChange={handleChange}
        placeholder="검색어를 입력하세요... (2글자 이상)"
        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem', boxSizing: 'border-box', marginBottom: '10px' }}
      />

      {/* 통계 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#374151' }}>{keystrokeCount}</p>
          <p style={{ margin: 0, fontSize: '0.72rem', color: '#9ca3af' }}>키 입력 횟수</p>
        </div>
        <div style={{ padding: '10px', background: '#f0fdf4', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#16a34a' }}>{requestCount}</p>
          <p style={{ margin: 0, fontSize: '0.72rem', color: '#9ca3af' }}>실제 API 요청</p>
        </div>
        <div style={{ padding: '10px', background: '#eff6ff', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: statusColors[status] }}>
            {statusLabels[status]}
          </p>
          <p style={{ margin: 0, fontSize: '0.72rem', color: '#9ca3af' }}>현재 상태</p>
        </div>
      </div>

      {/* 결과 */}
      {isLoading ? (
        <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center', color: '#9ca3af', fontSize: '0.88rem' }}>
          🔍 검색 중...
        </div>
      ) : results.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {results.map((post) => (
            <div key={post.id} style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
              {post.title}
            </div>
          ))}
        </div>
      ) : searchTerm.length >= 2 && status === 'idle' ? (
        <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center', color: '#9ca3af', fontSize: '0.88rem' }}>
          검색 결과가 없습니다
        </div>
      ) : null}

      {/* 코드 설명 */}
      <div style={{ marginTop: '14px', padding: '12px', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.78rem', color: '#475569' }}>
        <p style={{ margin: '0 0 6px', fontWeight: 700 }}>디바운싱 핵심 코드</p>
        <pre style={{ margin: 0, color: '#334155', lineHeight: 1.7, overflowX: 'auto' }}>{`const timer = setTimeout(async () => {
  await fetchData(searchTerm); // 0.5초 후 실행
}, 500);

// 정리 함수: 새 입력 시 이전 타이머 취소
return () => clearTimeout(timer);`}</pre>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: axios 기본 사용법
// ─────────────────────────────────────────────────────

/**
 * axios는 fetch보다 편리한 HTTP 클라이언트입니다.
 * JSON 변환 자동, 에러 처리 자동, 공통 설정 편리.
 *
 * 설치: npm install axios
 * import axios from 'axios';
 */
export function AxiosBasicsGuide() {
  const [activeTab, setActiveTab] = useState('compare');

  const tabs = {
    compare: {
      label: 'fetch vs axios',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#6b7280', fontSize: '0.82rem' }}>fetch</p>
            <pre style={{ margin: 0, fontSize: '0.72rem', background: '#f8fafc', padding: '10px', borderRadius: '6px', color: '#475569', lineHeight: 1.7, overflowX: 'auto' }}>{`// GET 요청
const res = await fetch(url);
// ① 에러 직접 확인
if (!res.ok) throw new Error();
// ② JSON 직접 변환
const data = await res.json();

// POST 요청
const res = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
});`}</pre>
          </div>
          <div>
            <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#2563eb', fontSize: '0.82rem' }}>axios</p>
            <pre style={{ margin: 0, fontSize: '0.72rem', background: '#eff6ff', padding: '10px', borderRadius: '6px', color: '#1e40af', lineHeight: 1.7, overflowX: 'auto' }}>{`// GET 요청
// ① 에러 자동 감지
// ② JSON 자동 변환
const { data } = await axios.get(url);

// POST 요청
// 헤더·stringify 자동 처리
const { data } = await axios.post(
  url,
  payload
);`}</pre>
          </div>
        </div>
      ),
    },
    crud: {
      label: 'CRUD 예시',
      content: (
        <pre style={{ margin: 0, fontSize: '0.78rem', background: '#f8fafc', padding: '14px', borderRadius: '8px', color: '#334155', lineHeight: 1.9, overflowX: 'auto' }}>{`import axios from 'axios';

const BASE = 'https://jsonplaceholder.typicode.com';

// READ (GET) — 데이터 조회
const { data: posts } = await axios.get(\`\${BASE}/posts\`);
const { data: post } = await axios.get(\`\${BASE}/posts/1\`);

// CREATE (POST) — 데이터 생성
const { data: newPost } = await axios.post(\`\${BASE}/posts\`, {
  title: '새 글',
  body: '내용',
  userId: 1,
});

// UPDATE (PUT) — 전체 수정
const { data: updated } = await axios.put(\`\${BASE}/posts/1\`, {
  title: '수정된 제목',
  body: '수정된 내용',
  userId: 1,
});

// PATCH — 일부 수정
const { data: patched } = await axios.patch(\`\${BASE}/posts/1\`, {
  title: '제목만 수정',
});

// DELETE — 삭제
await axios.delete(\`\${BASE}/posts/1\`);`}</pre>
      ),
    },
    async_await: {
      label: 'async/await 패턴',
      content: (
        <pre style={{ margin: 0, fontSize: '0.78rem', background: '#f8fafc', padding: '14px', borderRadius: '8px', color: '#334155', lineHeight: 1.9, overflowX: 'auto' }}>{`// useEffect 안에서 axios + async/await 전체 패턴
useEffect(() => {
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        'https://jsonplaceholder.typicode.com/posts'
      );
      setPosts(data);
    } catch (error) {
      // axios는 4xx/5xx를 자동으로 에러로 처리
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  fetchPosts();
}, []);`}</pre>
      ),
    },
  };

  return (
    <div style={{ padding: '20px', maxWidth: '580px' }}>
      <h2>axios 기본 사용법</h2>
      <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '14px' }}>
        설치: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>npm install axios</code>
      </p>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
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

      {tabs[activeTab].content}
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
import {
  SearchWithoutDebounce,
  SearchWithDebounce,
  AxiosBasicsGuide
} from './02_debounce_search';

function App() {
  return (
    <div>
      <SearchWithoutDebounce />
      <SearchWithDebounce />
      <AxiosBasicsGuide />
    </div>
  );
}
*/
