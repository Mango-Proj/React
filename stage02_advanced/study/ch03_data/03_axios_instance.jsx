/**
 * 03_axios_instance.jsx — axios 인스턴스와 인터셉터
 * ====================================================
 * axios.create()로 공통 설정을 한 곳에서 관리하고,
 * interceptor로 모든 요청/응답에 공통 처리를 적용합니다.
 *
 * ⚠️ 사전 설치 필요: npm install axios
 *
 * 이 파일은 학습용 예제입니다.
 */

import { useState, useEffect } from 'react';
// import axios from 'axios'; // 실제 사용 시 주석 해제


// ─────────────────────────────────────────────────────
// 실제 프로젝트에서 사용하는 인스턴스 설정 코드
// (아래 코드를 src/api/instance.js 파일로 분리해 사용합니다)
// ─────────────────────────────────────────────────────

/**
 * ✅ src/api/instance.js
 *
 * import axios from 'axios';
 *
 * // axios 인스턴스 생성 — 공통 설정을 한 번만 정의
 * export const api = axios.create({
 *   baseURL: 'https://jsonplaceholder.typicode.com',
 *   timeout: 5000,
 *   headers: { 'Content-Type': 'application/json' },
 * });
 *
 * // 요청 인터셉터 — 모든 요청에 자동으로 인증 토큰 추가
 * api.interceptors.request.use(
 *   (config) => {
 *     const token = localStorage.getItem('token');
 *     if (token) config.headers.Authorization = `Bearer ${token}`;
 *     return config;
 *   },
 *   (error) => Promise.reject(error)
 * );
 *
 * // 응답 인터셉터 — 공통 에러 처리
 * api.interceptors.response.use(
 *   (response) => response,
 *   (error) => {
 *     if (error.response?.status === 401) {
 *       window.location.href = '/login';
 *     }
 *     return Promise.reject(error);
 *   }
 * );
 */

/**
 * ✅ src/api/posts.js — API 함수 모듈화
 *
 * import { api } from './instance';
 *
 * export const getPosts    = ()         => api.get('/posts');
 * export const getPost     = (id)       => api.get(`/posts/${id}`);
 * export const createPost  = (data)     => api.post('/posts', data);
 * export const updatePost  = (id, data) => api.put(`/posts/${id}`, data);
 * export const deletePost  = (id)       => api.delete(`/posts/${id}`);
 */


// ─────────────────────────────────────────────────────
// 예제 1: 인스턴스 사용 전 vs 후 비교
// ─────────────────────────────────────────────────────

export function InstanceCompareGuide() {
  return (
    <div style={{ padding: '20px', maxWidth: '640px' }}>
      <h2>axios 인스턴스 — 사용 전 vs 후</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
        {/* 인스턴스 없이 */}
        <div style={{ padding: '14px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fca5a5' }}>
          <p style={{ margin: '0 0 10px', fontWeight: 700, color: '#dc2626', fontSize: '0.82rem' }}>
            ❌ 인스턴스 없이 — 매번 반복
          </p>
          <pre style={{ margin: 0, fontSize: '0.72rem', color: '#991b1b', background: '#fee2e2', padding: '10px', borderRadius: '6px', lineHeight: 1.7, overflowX: 'auto' }}>{`// 게시글 조회
axios.get(
  'https://api.example.com/posts',
  { headers: { Authorization: token } }
);

// 유저 조회
axios.get(
  'https://api.example.com/users',
  { headers: { Authorization: token } }
);

// 댓글 생성
axios.post(
  'https://api.example.com/comments',
  data,
  { headers: { Authorization: token } }
);
// ← URL과 토큰을 매번 반복!`}</pre>
        </div>

        {/* 인스턴스 사용 */}
        <div style={{ padding: '14px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #86efac' }}>
          <p style={{ margin: '0 0 10px', fontWeight: 700, color: '#16a34a', fontSize: '0.82rem' }}>
            ✅ 인스턴스 사용 — 깔끔하게
          </p>
          <pre style={{ margin: 0, fontSize: '0.72rem', color: '#166534', background: '#dcfce7', padding: '10px', borderRadius: '6px', lineHeight: 1.7, overflowX: 'auto' }}>{`// 한 번만 설정
const api = axios.create({
  baseURL: 'https://api.example.com',
});
api.interceptors.request.use(/* 토큰 자동 추가 */);

// 어디서든 짧고 깔끔하게 사용
api.get('/posts');
api.get('/users');
api.post('/comments', data);
// ← URL과 토큰 설정 한 번으로 끝!`}</pre>
        </div>
      </div>

      <div style={{ padding: '12px', background: '#fffbeb', borderRadius: '8px', fontSize: '0.82rem', color: '#713f12' }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700 }}>인스턴스의 3가지 장점</p>
        <ol style={{ margin: 0, paddingLeft: '16px', lineHeight: 1.8 }}>
          <li><strong>중복 제거</strong>: baseURL, 토큰을 한 번만 설정</li>
          <li><strong>유지보수</strong>: API 서버 주소 바뀌면 한 곳만 수정</li>
          <li><strong>공통 처리</strong>: 인터셉터로 토큰 추가·에러 처리 자동화</li>
        </ol>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: 인스턴스 설정 시각화
// ─────────────────────────────────────────────────────

export function InstanceConfigGuide() {
  const [activeOption, setActiveOption] = useState('baseURL');

  const options = {
    baseURL: {
      label: 'baseURL',
      desc: '모든 요청의 기본 URL. 경로만 입력하면 자동으로 앞에 붙습니다.',
      code: `const api = axios.create({
  baseURL: 'https://api.example.com',
});

api.get('/posts');
// → https://api.example.com/posts

api.get('/users/1');
// → https://api.example.com/users/1`,
    },
    timeout: {
      label: 'timeout',
      desc: '설정한 시간(ms) 내에 응답이 없으면 자동으로 요청을 취소합니다.',
      code: `const api = axios.create({
  timeout: 5000, // 5000ms = 5초
});

// 5초 안에 응답 없으면 에러 발생:
// "timeout of 5000ms exceeded"
// → 네트워크 지연 시 무한 대기 방지`,
    },
    headers: {
      label: 'headers',
      desc: '모든 요청에 공통으로 포함할 HTTP 헤더를 설정합니다.',
      code: `const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
    // 서버에 "JSON 형식으로 보냄"을 알림
  },
});

// 모든 POST/PUT 요청에 자동 적용
api.post('/posts', { title: '제목' });
// Content-Type 자동 포함`,
    },
  };

  return (
    <div style={{ padding: '20px', maxWidth: '520px' }}>
      <h2>axios.create() 주요 옵션</h2>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
        {Object.entries(options).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setActiveOption(key)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: activeOption === key ? 700 : 400,
              background: activeOption === key ? '#7c3aed' : '#f1f5f9',
              color: activeOption === key ? 'white' : '#374151',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: '12px', background: '#f5f3ff', borderRadius: '8px', marginBottom: '10px', fontSize: '0.85rem', color: '#5b21b6' }}>
        {options[activeOption].desc}
      </div>

      <pre style={{ margin: 0, fontSize: '0.78rem', background: '#1e293b', color: '#e2e8f0', padding: '14px', borderRadius: '8px', lineHeight: 1.8, overflowX: 'auto' }}>
        {options[activeOption].code}
      </pre>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: 인터셉터 동작 원리 시각화
// ─────────────────────────────────────────────────────

/**
 * 인터셉터는 모든 요청/응답을 "가로채서" 공통 처리를 합니다.
 * 요청에 자동으로 토큰을 붙이거나, 응답 에러를 공통으로 처리합니다.
 */
export function InterceptorVisualizer() {
  const [hasToken, setHasToken] = useState(true);
  const [simulateError, setSimulateError] = useState(false);
  const [log, setLog] = useState([]);

  const addLog = (emoji, msg, color = '#374151') => {
    setLog(prev => [{ emoji, msg, color, id: Date.now() }, ...prev].slice(0, 8));
  };

  const simulateRequest = () => {
    setLog([]);

    setTimeout(() => addLog('📤', '요청 시작: GET /posts'), 100);

    setTimeout(() => {
      // 요청 인터셉터 실행
      if (hasToken) {
        addLog('🔑', '요청 인터셉터: Authorization 토큰 자동 추가', '#7c3aed');
      } else {
        addLog('⚠️', '요청 인터셉터: 토큰 없음 — 헤더 추가 안 함', '#f59e0b');
      }
    }, 400);

    setTimeout(() => addLog('🌐', '서버로 요청 전송...', '#6b7280'), 700);

    setTimeout(() => {
      if (simulateError) {
        addLog('❌', '서버 응답: 401 Unauthorized', '#dc2626');
        setTimeout(() => {
          addLog('🔄', '응답 인터셉터: 401 감지 → /login으로 리다이렉트', '#dc2626');
        }, 300);
      } else {
        addLog('✅', '서버 응답: 200 OK — 데이터 수신', '#16a34a');
        setTimeout(() => {
          addLog('📥', '응답 인터셉터: 정상 응답 통과', '#16a34a');
        }, 300);
      }
    }, 1200);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '520px' }}>
      <h2>인터셉터 동작 시뮬레이션</h2>

      {/* 설정 */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={hasToken} onChange={e => setHasToken(e.target.checked)} />
          로그인 토큰 있음
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={simulateError} onChange={e => setSimulateError(e.target.checked)} />
          401 에러 시뮬레이션
        </label>
      </div>

      <button
        onClick={simulateRequest}
        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: '#7c3aed', color: 'white', fontWeight: 700, cursor: 'pointer', marginBottom: '14px', fontSize: '0.9rem' }}
      >
        API 요청 시뮬레이션 실행
      </button>

      {/* 다이어그램 */}
      <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', marginBottom: '12px', fontSize: '0.78rem', textAlign: 'center', color: '#475569' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ padding: '4px 10px', background: '#eff6ff', borderRadius: '4px', color: '#2563eb', fontWeight: 700 }}>컴포넌트</span>
          <span>→</span>
          <span style={{ padding: '4px 10px', background: '#f5f3ff', borderRadius: '4px', color: '#7c3aed', fontWeight: 700 }}>요청 인터셉터</span>
          <span>→</span>
          <span style={{ padding: '4px 10px', background: '#f0fdf4', borderRadius: '4px', color: '#16a34a', fontWeight: 700 }}>서버</span>
          <span>→</span>
          <span style={{ padding: '4px 10px', background: '#f5f3ff', borderRadius: '4px', color: '#7c3aed', fontWeight: 700 }}>응답 인터셉터</span>
          <span>→</span>
          <span style={{ padding: '4px 10px', background: '#eff6ff', borderRadius: '4px', color: '#2563eb', fontWeight: 700 }}>컴포넌트</span>
        </div>
      </div>

      {/* 로그 */}
      {log.length > 0 && (
        <div style={{ padding: '10px 12px', background: '#1e293b', borderRadius: '8px' }}>
          {log.map((entry) => (
            <p key={entry.id} style={{ margin: '3px 0', fontSize: '0.8rem', fontFamily: 'monospace', color: entry.color }}>
              {entry.emoji} {entry.msg}
            </p>
          ))}
        </div>
      )}

      {/* 코드 예시 */}
      <div style={{ marginTop: '12px', padding: '12px', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.78rem', color: '#475569' }}>
        <p style={{ margin: '0 0 6px', fontWeight: 700 }}>인터셉터 코드</p>
        <pre style={{ margin: 0, color: '#334155', lineHeight: 1.7, overflowX: 'auto' }}>{`// 요청 인터셉터 — 토큰 자동 주입
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// 응답 인터셉터 — 공통 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);`}</pre>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 4: API 함수 모듈화 실전 패턴
// ─────────────────────────────────────────────────────

/**
 * 실제 프로젝트에서 axios API 함수를 모듈화하는 방법을 보여줍니다.
 * 컴포넌트에서는 함수 이름만 호출하면 됩니다.
 */
export function ApiModulePatternGuide() {
  const [activeFile, setActiveFile] = useState('instance');

  const files = {
    instance: {
      name: 'src/api/instance.js',
      code: `import axios from 'axios';

// 인스턴스 생성
export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);`,
    },
    posts: {
      name: 'src/api/posts.js',
      code: `import { api } from './instance';

// API 함수 모듈화 — 컴포넌트에서 URL 직접 안 써도 됨
export const getPosts = () =>
  api.get('/posts');

export const getPost = (id) =>
  api.get(\`/posts/\${id}\`);

export const createPost = (data) =>
  api.post('/posts', data);

export const updatePost = (id, data) =>
  api.put(\`/posts/\${id}\`, data);

export const deletePost = (id) =>
  api.delete(\`/posts/\${id}\`);`,
    },
    component: {
      name: 'src/components/PostList.jsx',
      code: `import { useEffect, useState } from 'react';
import { getPosts, deletePost } from '../api/posts';

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await getPosts(); // URL 몰라도 됨!
      setPosts(data);
    };
    fetch();
  }, []);

  const handleDelete = async (id) => {
    await deletePost(id);
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          {post.title}
          <button onClick={() => handleDelete(post.id)}>
            삭제
          </button>
        </li>
      ))}
    </ul>
  );
}`,
    },
  };

  return (
    <div style={{ padding: '20px', maxWidth: '580px' }}>
      <h2>API 함수 모듈화 패턴</h2>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {Object.entries(files).map(([key, { name }]) => (
          <button
            key={key}
            onClick={() => setActiveFile(key)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: activeFile === key ? 700 : 400,
              background: activeFile === key ? '#2563eb' : '#f1f5f9',
              color: activeFile === key ? 'white' : '#374151',
              fontFamily: 'monospace',
            }}
          >
            {files[key].name.split('/').pop()}
          </button>
        ))}
      </div>

      <div style={{ background: '#1e293b', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ padding: '8px 14px', background: '#0f172a', fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>
          {files[activeFile].name}
        </div>
        <pre style={{ margin: 0, padding: '14px', fontSize: '0.78rem', color: '#e2e8f0', lineHeight: 1.8, overflowX: 'auto' }}>
          {files[activeFile].code}
        </pre>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
import {
  InstanceCompareGuide,
  InstanceConfigGuide,
  InterceptorVisualizer,
  ApiModulePatternGuide
} from './03_axios_instance';

function App() {
  return (
    <div>
      <InstanceCompareGuide />
      <InstanceConfigGuide />
      <InterceptorVisualizer />
      <ApiModulePatternGuide />
    </div>
  );
}
*/
