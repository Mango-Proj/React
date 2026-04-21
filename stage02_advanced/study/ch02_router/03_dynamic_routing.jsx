/**
 * 03_dynamic_routing.jsx — 동적 라우팅과 useParams, useNavigate
 * ================================================================
 * URL의 일부를 파라미터로 사용해 같은 컴포넌트에서
 * 다양한 데이터를 보여주는 동적 라우팅을 배웁니다.
 *
 * ⚠️ 사전 설치 필요: npm install react-router-dom
 *
 * 핵심 개념:
 *   - 동적 라우팅: path='videos/:videoId' → :videoId 가 파라미터
 *   - useParams(): URL 파라미터 값을 읽는 훅
 *   - useNavigate(): 코드로 페이지를 이동시키는 훅
 *
 * 이 파일은 학습용 예제입니다.
 */

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';


// ─────────────────────────────────────────────────────
// 예제용 데이터 (실제로는 서버에서 받아옵니다)
// ─────────────────────────────────────────────────────

const VIDEOS = [
  {
    id: 'react-101',
    title: '리액트 첫걸음 강의',
    description: 'React의 기본 개념부터 시작합니다. JSX, 컴포넌트, props를 배웁니다.',
    views: '12만회',
    duration: '1시간 23분',
    tags: ['React', '입문', 'JSX'],
    emoji: '🎬',
  },
  {
    id: 'usestate-deep',
    title: 'useState 완전 정복',
    description: 'useState의 동작 원리와 올바른 사용법을 깊이 있게 다룹니다.',
    views: '8.5만회',
    duration: '54분',
    tags: ['React', 'Hook', 'useState'],
    emoji: '🔥',
  },
  {
    id: 'useeffect-master',
    title: 'useEffect 마스터',
    description: '생명 주기, 의존성 배열, 정리 함수까지 완전 정복합니다.',
    views: '6.2만회',
    duration: '1시간 12분',
    tags: ['React', 'Hook', 'useEffect'],
    emoji: '⚡',
  },
  {
    id: 'router-guide',
    title: 'React Router 완벽 가이드',
    description: '중첩 라우팅, 동적 라우팅, useNavigate까지 실전 예제로 배웁니다.',
    views: '5.1만회',
    duration: '1시간 8분',
    tags: ['React', 'Router', 'SPA'],
    emoji: '🗺️',
  },
];


// ─────────────────────────────────────────────────────
// 예제 1: 동적 라우팅 설정 안내
// ─────────────────────────────────────────────────────

/**
 * main.jsx에서 아래처럼 동적 라우팅을 설정합니다.
 *
 * const router = createBrowserRouter([
 *   {
 *     path: '/',
 *     element: <RootLayout />,
 *     children: [
 *       { index: true,          element: <VideoListPage /> },
 *       { path: 'videos/:videoId', element: <VideoDetailPage /> },
 *       // :videoId 는 어떤 문자열이든 매칭됩니다:
 *       // /videos/react-101      → videoId = 'react-101'
 *       // /videos/usestate-deep  → videoId = 'usestate-deep'
 *       // /videos/anything       → videoId = 'anything'
 *     ],
 *   },
 * ]);
 */


// ─────────────────────────────────────────────────────
// 예제 2: 영상 목록 페이지 (Link로 상세 이동)
// ─────────────────────────────────────────────────────

/**
 * 각 영상 카드를 클릭하면 `/videos/:videoId` 경로로 이동합니다.
 * Link의 to 속성에 동적으로 videoId를 포함합니다.
 */
export function VideoListPage() {
  return (
    <div style={{ padding: '24px', maxWidth: '720px', margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 8px' }}>🎬 영상 목록</h1>
      <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '0.9rem' }}>
        영상을 클릭하면 <code>/videos/:videoId</code> 경로로 이동합니다
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {VIDEOS.map((video) => (
          <Link
            key={video.id}
            to={`/videos/${video.id}`}  // ← 동적으로 URL 구성
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{
              padding: '16px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              transition: 'border-color 0.2s',
              cursor: 'pointer',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{video.emoji}</div>
              <h3 style={{ margin: '0 0 6px', fontSize: '0.95rem', color: '#1e293b' }}>
                {video.title}
              </h3>
              <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.5 }}>
                {video.description.slice(0, 50)}...
              </p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {video.tags.map((tag) => (
                  <span key={tag} style={{ padding: '2px 8px', background: '#eff6ff', color: '#2563eb', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600 }}>
                    {tag}
                  </span>
                ))}
              </div>
              <p style={{ margin: '10px 0 0', fontSize: '0.78rem', color: '#9ca3af' }}>
                조회수 {video.views} · {video.duration}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: '20px', padding: '12px', background: '#eff6ff', borderRadius: '8px', fontSize: '0.8rem', color: '#1e40af' }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700 }}>Link에서 동적 URL 구성</p>
        <code>{`<Link to={\`/videos/\${video.id}\`}>`}</code>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: 영상 상세 페이지 — useParams()
// ─────────────────────────────────────────────────────

/**
 * useParams()로 URL의 :videoId 파라미터 값을 읽어
 * 해당 영상 데이터를 찾아 화면에 표시합니다.
 */
export function VideoDetailPage() {
  const { videoId } = useParams();  // URL의 :videoId 값을 가져옴
  const navigate = useNavigate();

  // videoId로 해당 영상 데이터 조회
  const video = VIDEOS.find((v) => v.id === videoId);

  // 해당 ID의 영상이 없으면 404 처리
  if (!video) {
    return (
      <div style={{ padding: '40px 24px', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
        <p style={{ fontSize: '3rem', margin: '0 0 16px' }}>🔍</p>
        <h2 style={{ margin: '0 0 8px', color: '#1e293b' }}>영상을 찾을 수 없습니다</h2>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>
          요청한 videoId: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{videoId}</code>
        </p>
        <button
          onClick={() => navigate('/videos')}
          style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#6366f1', color: 'white', cursor: 'pointer', fontWeight: 700 }}
        >
          영상 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '720px', margin: '0 auto' }}>
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate(-1)}  // 브라우저 히스토리 뒤로
        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', marginBottom: '20px', fontSize: '0.85rem', color: '#374151' }}
      >
        ← 뒤로가기
      </button>

      {/* 영상 상세 내용 */}
      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '40px', textAlign: 'center', marginBottom: '20px' }}>
        <span style={{ fontSize: '4rem' }}>{video.emoji}</span>
        <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '12px', marginBottom: 0 }}>
          현재 URL: /videos/<strong style={{ color: '#6366f1' }}>{videoId}</strong>
        </p>
      </div>

      <h1 style={{ margin: '0 0 12px', fontSize: '1.4rem' }}>{video.title}</h1>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>👁 조회수 {video.views}</span>
        <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>⏱ {video.duration}</span>
      </div>

      <p style={{ color: '#374151', lineHeight: 1.7, marginBottom: '16px' }}>{video.description}</p>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
        {video.tags.map((tag) => (
          <span key={tag} style={{ padding: '4px 10px', background: '#eff6ff', color: '#2563eb', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
            {tag}
          </span>
        ))}
      </div>

      {/* useParams 코드 설명 */}
      <div style={{ padding: '14px', background: '#f1f5f9', borderRadius: '10px', fontSize: '0.82rem', color: '#475569' }}>
        <p style={{ margin: '0 0 6px', fontWeight: 700 }}>이 페이지에서 useParams() 동작</p>
        <pre style={{ margin: 0, color: '#334155', lineHeight: 1.8 }}>{`const { videoId } = useParams();
// videoId = '${videoId}'

const video = VIDEOS.find(v => v.id === videoId);
// → "${video.title}" 영상 데이터 조회`}</pre>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 4: useNavigate — 다양한 이동 방법
// ─────────────────────────────────────────────────────

/**
 * useNavigate의 다양한 사용 패턴을 보여줍니다.
 * 조건 처리 후 이동, 뒤로가기, 히스토리 교체 등을 다룹니다.
 */
export function NavigateDemo() {
  const navigate = useNavigate();
  const [log, setLog] = useState([]);

  const addLog = (msg) => setLog(prev => [`→ ${msg}`, ...prev].slice(0, 6));

  return (
    <div style={{ padding: '20px', maxWidth: '520px' }}>
      <h2>useNavigate 사용 패턴</h2>
      <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '16px' }}>
        실제 이동은 라우터 환경에서만 동작합니다. 아래는 코드 패턴 안내입니다.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        {/* 특정 경로로 이동 */}
        <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: '0.88rem' }}>1. 특정 경로로 이동</p>
          <code style={{ fontSize: '0.8rem', color: '#1e40af', display: 'block', marginBottom: '8px' }}>
            navigate('/videos')
          </code>
          <button
            onClick={() => addLog("navigate('/videos') 호출")}
            style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontSize: '0.82rem' }}
          >
            영상 목록으로 이동
          </button>
        </div>

        {/* 뒤로가기 */}
        <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: '0.88rem' }}>2. 브라우저 뒤로가기</p>
          <code style={{ fontSize: '0.8rem', color: '#1e40af', display: 'block', marginBottom: '8px' }}>
            navigate(-1)
          </code>
          <button
            onClick={() => addLog('navigate(-1) 호출 → 히스토리 1단계 뒤로')}
            style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: '#7c3aed', color: 'white', cursor: 'pointer', fontSize: '0.82rem' }}
          >
            뒤로가기
          </button>
        </div>

        {/* 히스토리 교체 (replace) */}
        <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '0.88rem' }}>3. 히스토리 교체 (replace: true)</p>
          <p style={{ margin: '0 0 6px', fontSize: '0.78rem', color: '#6b7280' }}>
            이동 후 뒤로가기 버튼으로 현재 페이지로 돌아올 수 없게 합니다 (로그인 완료 후 사용)
          </p>
          <code style={{ fontSize: '0.8rem', color: '#1e40af', display: 'block', marginBottom: '8px' }}>
            {`navigate('/', { replace: true })`}
          </code>
          <button
            onClick={() => addLog("navigate('/', { replace: true }) 호출 → 히스토리 교체")}
            style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: '#16a34a', color: 'white', cursor: 'pointer', fontSize: '0.82rem' }}
          >
            홈으로 이동 (히스토리 교체)
          </button>
        </div>

        {/* 조건부 이동 — 로그인 시뮬레이션 */}
        <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '0.88rem' }}>4. 조건 처리 후 이동 (실전 패턴)</p>
          <p style={{ margin: '0 0 6px', fontSize: '0.78rem', color: '#6b7280' }}>
            폼 제출, 로그인 완료 등 처리 후 페이지를 이동합니다
          </p>
          <pre style={{ margin: '0 0 8px', fontSize: '0.78rem', color: '#334155', background: '#f1f5f9', padding: '8px', borderRadius: '6px', overflowX: 'auto' }}>{`async function handleLogin() {
  const success = await login(email, password);
  if (success) {
    navigate('/', { replace: true }); // 홈으로
  } else {
    setError('로그인 실패');
  }
}`}</pre>
        </div>
      </div>

      {/* 동작 로그 */}
      {log.length > 0 && (
        <div style={{ padding: '10px 12px', background: '#1e293b', borderRadius: '8px', fontSize: '0.78rem' }}>
          <p style={{ margin: '0 0 6px', color: '#94a3b8', fontWeight: 600 }}>실행 로그:</p>
          {log.map((entry, i) => (
            <p key={i} style={{ margin: '2px 0', color: '#6ee7b7', fontFamily: 'monospace' }}>{entry}</p>
          ))}
        </div>
      )}

      <div style={{ marginTop: '12px', padding: '12px', background: '#fffbeb', borderRadius: '8px', fontSize: '0.82rem', color: '#713f12' }}>
        <p style={{ margin: '0 0 6px', fontWeight: 700 }}>Link vs useNavigate 선택 기준</p>
        <ul style={{ margin: 0, paddingLeft: '16px', lineHeight: 1.8 }}>
          <li><code>{'<Link to="...">'}텍스트{'</Link>'}</code> — 단순 이동 링크</li>
          <li><code>navigate()</code> — 조건 처리 후, 버튼 클릭 후 이동</li>
          <li><code>{'<NavLink>'}</code> — 현재 경로 강조 필요한 메뉴</li>
        </ul>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 5: 전체 동적 라우팅 시뮬레이터 (라우터 없이 동작)
// ─────────────────────────────────────────────────────

/**
 * 실제 react-router-dom 없이도 동적 라우팅의 동작 방식을 시뮬레이션합니다.
 * URL 파라미터를 직접 입력하고 어떤 데이터가 조회되는지 확인하세요.
 */
export function DynamicRoutingSimulator() {
  const [inputId, setInputId] = useState('');
  const [currentId, setCurrentId] = useState(null);

  const video = currentId ? VIDEOS.find((v) => v.id === currentId) : null;

  const handleNavigate = (id) => {
    setCurrentId(id);
    setInputId(id);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>동적 라우팅 시뮬레이터</h2>
      <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '16px' }}>
        URL 파라미터를 직접 입력하거나 영상을 클릭해 동적 라우팅을 체험하세요
      </p>

      {/* URL 파라미터 입력 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', alignItems: 'center' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '0.88rem', color: '#6b7280', whiteSpace: 'nowrap' }}>
          /videos/
        </span>
        <input
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleNavigate(inputId.trim())}
          placeholder="videoId 입력..."
          style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontFamily: 'monospace', fontSize: '0.88rem' }}
        />
        <button
          onClick={() => handleNavigate(inputId.trim())}
          style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#6366f1', color: 'white', cursor: 'pointer', fontWeight: 700, whiteSpace: 'nowrap' }}
        >
          이동
        </button>
      </div>

      {/* 빠른 이동 버튼 */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {VIDEOS.map((v) => (
          <button
            key={v.id}
            onClick={() => handleNavigate(v.id)}
            style={{
              padding: '5px 12px',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              fontSize: '0.78rem',
              background: currentId === v.id ? '#ede9fe' : 'white',
              color: currentId === v.id ? '#6366f1' : '#374151',
              fontWeight: currentId === v.id ? 700 : 400,
            }}
          >
            {v.id}
          </button>
        ))}
        <button
          onClick={() => handleNavigate('invalid-id')}
          style={{ padding: '5px 12px', borderRadius: '20px', border: '1px solid #fca5a5', cursor: 'pointer', fontSize: '0.78rem', background: currentId === 'invalid-id' ? '#fef2f2' : 'white', color: '#dc2626' }}
        >
          invalid-id (404 테스트)
        </button>
      </div>

      {/* 결과 표시 */}
      {currentId === null ? (
        <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '10px', textAlign: 'center', color: '#9ca3af' }}>
          videoId를 입력하거나 위 버튼을 클릭하세요
        </div>
      ) : video ? (
        <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #86efac' }}>
          <p style={{ margin: '0 0 4px', fontSize: '0.78rem', color: '#16a34a', fontWeight: 700 }}>
            ✅ /videos/<strong>{currentId}</strong> → 데이터 찾음!
          </p>
          <div style={{ margin: '10px 0', padding: '10px', background: '#f1f5f9', borderRadius: '6px', fontSize: '0.78rem', fontFamily: 'monospace', color: '#334155' }}>
            {`const { videoId } = useParams();\n// videoId = '${currentId}'\nconst video = VIDEOS.find(v => v.id === videoId);\n// → { title: '${video.title}', ... }`}
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '1.8rem' }}>{video.emoji}</span>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>{video.title}</p>
              <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#6b7280' }}>
                {video.views} · {video.duration}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: '16px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fca5a5' }}>
          <p style={{ margin: '0 0 4px', fontSize: '0.78rem', color: '#dc2626', fontWeight: 700 }}>
            ❌ /videos/<strong>{currentId}</strong> → 데이터 없음! (404)
          </p>
          <div style={{ margin: '10px 0', padding: '10px', background: '#f1f5f9', borderRadius: '6px', fontSize: '0.78rem', fontFamily: 'monospace', color: '#334155' }}>
            {`const { videoId } = useParams();\n// videoId = '${currentId}'\nconst video = VIDEOS.find(v => v.id === videoId);\n// → undefined → NotFound 컴포넌트 렌더링`}
          </div>
          <p style={{ margin: 0, color: '#991b1b', fontSize: '0.85rem' }}>
            해당 ID의 영상이 없어 404 페이지를 보여줍니다.
          </p>
        </div>
      )}
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
// DynamicRoutingSimulator와 NavigateDemo는 라우터 없이도 동작합니다
import { DynamicRoutingSimulator, NavigateDemo } from './03_dynamic_routing';

// VideoListPage와 VideoDetailPage는 RouterProvider 안에서 사용합니다
// main.jsx:
// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <RootLayout />,
//     children: [
//       { index: true,             element: <VideoListPage /> },
//       { path: 'videos/:videoId', element: <VideoDetailPage /> },
//     ],
//   },
// ]);

function App() {
  return (
    <div>
      <DynamicRoutingSimulator />
    </div>
  );
}
*/
