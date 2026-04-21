/**
 * 01_router_setup.jsx — React Router 기본 설정과 Link/NavLink
 * =============================================================
 * React Router의 전체 설정 구조와 페이지 이동 방법을 배웁니다.
 *
 * ⚠️ 사전 설치 필요: npm install react-router-dom
 *
 * 이 파일은 각 개념의 구조와 코드 패턴을 보여주는 학습용 예제입니다.
 * 실제 라우팅은 main.jsx 또는 App.jsx에서 RouterProvider로 감싸야 동작합니다.
 * 각 예제의 주석에 실제 적용 방법이 안내되어 있습니다.
 */

import { useState } from 'react';
import {
  Link,
  NavLink,
  // 실제 프로젝트에서 필요한 것들:
  // createBrowserRouter,
  // RouterProvider,
  // BrowserRouter,
  // Routes,
  // Route,
} from 'react-router-dom';


// ─────────────────────────────────────────────────────
// 라우터 전체 설정 구조 안내 (실제 코드)
// ─────────────────────────────────────────────────────

/**
 * ✅ 방법 1: createBrowserRouter (권장 - 최신 방식)
 *
 * main.jsx에 아래 코드를 작성합니다:
 *
 * import { createBrowserRouter, RouterProvider } from 'react-router-dom';
 * import RootLayout from './layouts/RootLayout';
 * import Home from './pages/Home';
 * import VideoList from './pages/VideoList';
 * import VideoDetail from './pages/VideoDetail';
 *
 * const router = createBrowserRouter([
 *   {
 *     path: '/',
 *     element: <RootLayout />,       // 공통 레이아웃
 *     children: [
 *       { index: true, element: <Home /> },              // '/'
 *       { path: 'videos', element: <VideoList /> },      // '/videos'
 *       { path: 'videos/:id', element: <VideoDetail /> } // '/videos/123'
 *     ],
 *   },
 * ]);
 *
 * ReactDOM.createRoot(document.getElementById('root')).render(
 *   <RouterProvider router={router} />
 * );
 */

/**
 * ✅ 방법 2: BrowserRouter + Routes (구 방식)
 *
 * App.jsx에 아래 코드를 작성합니다:
 *
 * import { BrowserRouter, Routes, Route } from 'react-router-dom';
 *
 * function App() {
 *   return (
 *     <BrowserRouter>
 *       <Routes>
 *         <Route path="/" element={<RootLayout />}>
 *           <Route index element={<Home />} />
 *           <Route path="videos" element={<VideoList />} />
 *           <Route path="videos/:id" element={<VideoDetail />} />
 *         </Route>
 *       </Routes>
 *     </BrowserRouter>
 *   );
 * }
 */


// ─────────────────────────────────────────────────────
// 예제 1: Link vs <a> 태그 비교
// ─────────────────────────────────────────────────────

/**
 * HTML의 <a> 태그를 사용하면 페이지 전체가 새로고침됩니다.
 * React Router의 <Link>는 새로고침 없이 컴포넌트만 교체합니다.
 *
 * 이 컴포넌트는 react-router-dom의 <Link> 안에서 렌더링될 때만 동작합니다.
 * (BrowserRouter 또는 RouterProvider 안에 있어야 함)
 */
export function LinkVsAnchorDemo() {
  const [clickLog, setClickLog] = useState([]);

  const log = (type) => {
    setClickLog(prev => [
      `[${new Date().toLocaleTimeString()}] ${type} 클릭`,
      ...prev,
    ].slice(0, 5));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '520px' }}>
      <h2>Link vs &lt;a&gt; 태그</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {/* <a> 태그 — 실제로 클릭하면 전체 새로고침 */}
        <div style={{ padding: '14px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fca5a5' }}>
          <p style={{ margin: '0 0 10px', fontWeight: 700, color: '#dc2626', fontSize: '0.88rem' }}>
            ❌ HTML &lt;a&gt; 태그
          </p>
          <a
            href="/videos"
            onClick={(e) => { e.preventDefault(); log('<a> 태그 (새로고침 발생!)'); }}
            style={{ display: 'block', padding: '8px 12px', background: '#fee2e2', borderRadius: '6px', color: '#dc2626', textDecoration: 'none', textAlign: 'center', fontSize: '0.88rem', fontWeight: 600 }}
          >
            영상 목록으로 이동
          </a>
          <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: '#dc2626' }}>
            전체 새로고침 → 입력값, 상태 모두 초기화
          </p>
        </div>

        {/* <Link> — SPA 방식 이동 */}
        <div style={{ padding: '14px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #86efac' }}>
          <p style={{ margin: '0 0 10px', fontWeight: 700, color: '#16a34a', fontSize: '0.88rem' }}>
            ✅ React Router &lt;Link&gt;
          </p>
          <Link
            to="/videos"
            onClick={() => log('<Link> (새로고침 없음!)')}
            style={{ display: 'block', padding: '8px 12px', background: '#dcfce7', borderRadius: '6px', color: '#16a34a', textDecoration: 'none', textAlign: 'center', fontSize: '0.88rem', fontWeight: 600 }}
          >
            영상 목록으로 이동
          </Link>
          <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: '#16a34a' }}>
            컴포넌트만 교체 → 상태, 입력값 유지
          </p>
        </div>
      </div>

      {/* 클릭 로그 */}
      {clickLog.length > 0 && (
        <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.8rem' }}>
          <p style={{ margin: '0 0 6px', fontWeight: 600, color: '#374151' }}>클릭 기록:</p>
          {clickLog.map((log, i) => (
            <p key={i} style={{ margin: '2px 0', color: '#6b7280', fontFamily: 'monospace' }}>{log}</p>
          ))}
        </div>
      )}

      <div style={{ marginTop: '12px', padding: '12px', background: '#eff6ff', borderRadius: '8px', fontSize: '0.82rem', color: '#1e40af' }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700 }}>코드 비교</p>
        <p style={{ margin: '2px 0' }}>❌ <code>{'<a href="/videos">이동</a>'}</code></p>
        <p style={{ margin: '2px 0' }}>✅ <code>{'<Link to="/videos">이동</Link>'}</code></p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: NavLink — 현재 경로 강조 스타일
// ─────────────────────────────────────────────────────

/**
 * NavLink는 현재 URL과 to 경로가 일치하면 isActive가 true가 됩니다.
 * 네비게이션 메뉴에서 "지금 어느 페이지인지" 표시할 때 사용합니다.
 *
 * 이 컴포넌트는 실제 라우터 환경에서 isActive가 동작합니다.
 * 아래 예제는 useState로 isActive를 시뮬레이션합니다.
 */
export function NavLinkDemo() {
  const [activePath, setActivePath] = useState('/');

  const navItems = [
    { to: '/', label: '홈' },
    { to: '/videos', label: '영상 목록' },
    { to: '/profile', label: '내 프로필' },
    { to: '/settings', label: '설정' },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '480px' }}>
      <h2>NavLink — 현재 경로 강조</h2>
      <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '14px' }}>
        메뉴를 클릭해 활성 상태가 어떻게 바뀌는지 확인하세요
      </p>

      {/* 네비게이션 바 시뮬레이션 */}
      <nav style={{ display: 'flex', gap: '4px', background: '#1e293b', padding: '10px 14px', borderRadius: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {navItems.map(({ to, label }) => {
          const isActive = activePath === to;
          return (
            // 실제 코드: <NavLink to={to} style={({ isActive }) => ({ ... })}>
            <button
              key={to}
              onClick={() => setActivePath(to)}
              style={{
                padding: '7px 14px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.88rem',
                fontWeight: isActive ? 700 : 400,
                background: isActive ? '#6366f1' : 'transparent',
                color: isActive ? 'white' : '#94a3b8',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          );
        })}
      </nav>

      {/* 현재 경로 표시 */}
      <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '10px', marginBottom: '14px' }}>
        <p style={{ margin: '0 0 4px', fontSize: '0.85rem', color: '#6b7280' }}>현재 경로:</p>
        <p style={{ margin: 0, fontFamily: 'monospace', fontWeight: 700, color: '#6366f1', fontSize: '1.05rem' }}>
          {activePath}
        </p>
      </div>

      {/* 실제 NavLink 코드 예시 */}
      <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.8rem', color: '#475569' }}>
        <p style={{ margin: '0 0 6px', fontWeight: 700 }}>실제 NavLink 코드</p>
        <pre style={{ margin: 0, fontSize: '0.78rem', overflowX: 'auto', color: '#334155' }}>{`<NavLink
  to="/videos"
  style={({ isActive }) => ({
    color: isActive ? '#6366f1' : '#374151',
    fontWeight: isActive ? 700 : 400,
    background: isActive ? '#ede9fe' : 'transparent',
  })}
>
  영상 목록
</NavLink>`}</pre>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: 전체 라우터 설정 구조 시각화
// ─────────────────────────────────────────────────────

/**
 * 실제 프로젝트의 라우터 설정 구조를 시각적으로 보여줍니다.
 * 파일 구조와 라우터 설정이 어떻게 대응되는지 확인하세요.
 */
export function RouterStructureGuide() {
  const [view, setView] = useState('structure');

  const codeExamples = {
    structure: {
      title: '프로젝트 파일 구조',
      code: `src/
├── main.jsx          ← 라우터 설정
├── layouts/
│   └── RootLayout.jsx  ← 헤더+푸터 공통 레이아웃
└── pages/
    ├── Home.jsx        ← '/' 경로
    ├── VideoList.jsx   ← '/videos' 경로
    ├── VideoDetail.jsx ← '/videos/:id' 경로
    ├── Login.jsx       ← '/login' 경로
    └── NotFound.jsx    ← 404 경로`,
    },
    router: {
      title: 'main.jsx — 라우터 설정',
      code: `import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true,           element: <Home /> },
      { path: 'videos',        element: <VideoList /> },
      { path: 'videos/:id',    element: <VideoDetail /> },
      { path: 'login',         element: <Login /> },
      { path: '*',             element: <NotFound /> },  // 404
    ],
  },
]);

<RouterProvider router={router} />`,
    },
    layout: {
      title: 'RootLayout.jsx — 공통 레이아웃',
      code: `import { Outlet, NavLink } from 'react-router-dom';

function RootLayout() {
  return (
    <>
      <header>
        <NavLink to="/">홈</NavLink>
        <NavLink to="/videos">영상</NavLink>
      </header>

      <main>
        <Outlet />
        {/* ↑ 현재 경로의 자식 컴포넌트가 여기 삽입됨 */}
      </main>

      <footer>© 2025 MyApp</footer>
    </>
  );
}`,
    },
  };

  return (
    <div style={{ padding: '20px', maxWidth: '560px' }}>
      <h2>라우터 설정 구조 가이드</h2>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {Object.entries(codeExamples).map(([key, { title }]) => (
          <button
            key={key}
            onClick={() => setView(key)}
            style={{
              padding: '7px 14px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: view === key ? 700 : 400,
              background: view === key ? '#6366f1' : '#f1f5f9',
              color: view === key ? 'white' : '#374151',
            }}
          >
            {title}
          </button>
        ))}
      </div>

      <div style={{ background: '#1e293b', borderRadius: '10px', padding: '16px', overflow: 'auto' }}>
        <p style={{ margin: '0 0 8px', color: '#94a3b8', fontSize: '0.78rem' }}>
          {codeExamples[view].title}
        </p>
        <pre style={{ margin: 0, color: '#e2e8f0', fontSize: '0.82rem', lineHeight: 1.7, overflowX: 'auto' }}>
          {codeExamples[view].code}
        </pre>
      </div>

      <div style={{ marginTop: '14px', padding: '12px', background: '#fffbeb', borderRadius: '8px', fontSize: '0.82rem', color: '#713f12' }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700 }}>💡 경로 패턴 정리</p>
        <ul style={{ margin: 0, paddingLeft: '16px', lineHeight: 1.9 }}>
          <li><code>'/'</code> → 정확히 루트 경로</li>
          <li><code>'videos'</code> → /videos (부모 경로 하위)</li>
          <li><code>'videos/:id'</code> → /videos/무엇이든</li>
          <li><code>'*'</code> → 위에서 매칭 안 된 모든 경로 (404)</li>
          <li><code>index: true</code> → 부모 경로와 정확히 일치할 때</li>
        </ul>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
// ⚠️ BrowserRouter 안에서 렌더링해야 Link/NavLink가 동작합니다

import { BrowserRouter } from 'react-router-dom';
import { LinkVsAnchorDemo, NavLinkDemo, RouterStructureGuide } from './01_router_setup';

function App() {
  return (
    <BrowserRouter>
      <LinkVsAnchorDemo />
      <NavLinkDemo />
      <RouterStructureGuide />
    </BrowserRouter>
  );
}
*/
