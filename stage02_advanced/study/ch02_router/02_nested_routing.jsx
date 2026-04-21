/**
 * 02_nested_routing.jsx — 중첩 라우팅과 공통 레이아웃
 * ======================================================
 * RootLayout + <Outlet>을 사용해 헤더/푸터를 유지한 채
 * 내용 영역만 교체하는 중첩 라우팅 패턴을 배웁니다.
 *
 * ⚠️ 사전 설치 필요: npm install react-router-dom
 *
 * 이 파일의 컴포넌트들은 실제 라우터 안에서 동작합니다.
 * 마지막의 NestedRoutingSimulator로 브라우저 내에서 시뮬레이션할 수 있습니다.
 *
 * 이 파일은 학습용 예제입니다.
 */

import { useState } from 'react';
import { Outlet, Link, NavLink, useParams } from 'react-router-dom';


// ─────────────────────────────────────────────────────
// 실제 프로젝트 코드 패턴
// ─────────────────────────────────────────────────────

/**
 * 실제 프로젝트에서 main.jsx에 아래처럼 설정합니다:
 *
 * const router = createBrowserRouter([
 *   {
 *     path: '/',
 *     element: <RootLayout />,        // 공통 레이아웃 (헤더+푸터)
 *     children: [
 *       { index: true,  element: <HomePage /> },      // '/'
 *       { path: 'videos', element: <VideoListPage /> }, // '/videos'
 *       { path: 'about',  element: <AboutPage /> },   // '/about'
 *     ],
 *   },
 * ]);
 */


// ─────────────────────────────────────────────────────
// 레이아웃 & 페이지 컴포넌트
// ─────────────────────────────────────────────────────

/**
 * RootLayout — 모든 페이지에 공통으로 표시되는 레이아웃
 * <Outlet />이 자식 라우트 컴포넌트가 삽입되는 자리입니다.
 */
export function RootLayout() {
  const navLinks = [
    { to: '/', label: '홈', end: true },
    { to: '/videos', label: '영상 목록' },
    { to: '/about', label: '소개' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui' }}>
      {/* 헤더 — 항상 표시 */}
      <header style={{ background: '#1e293b', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '24px', height: '56px' }}>
        <span style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>🎬 MyTube</span>
        <nav style={{ display: 'flex', gap: '4px' }}>
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                padding: '6px 14px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '0.88rem',
                fontWeight: isActive ? 700 : 400,
                color: isActive ? 'white' : '#94a3b8',
                background: isActive ? '#6366f1' : 'transparent',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* 메인 콘텐츠 영역 — 자식 라우트가 여기 삽입됨 */}
      <main style={{ flex: 1, padding: '32px 24px', maxWidth: '900px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <Outlet />
        {/*
          ↑ 중첩 라우팅의 핵심!
          현재 URL에 따라 아래 컴포넌트 중 하나가 여기에 렌더링됩니다:
          '/'       → <HomePage />
          '/videos' → <VideoListPage />
          '/about'  → <AboutPage />
        */}
      </main>

      {/* 푸터 — 항상 표시 */}
      <footer style={{ background: '#f1f5f9', padding: '16px 24px', textAlign: 'center', color: '#6b7280', fontSize: '0.82rem' }}>
        © 2025 MyTube — RootLayout의 푸터 (항상 표시됩니다)
      </footer>
    </div>
  );
}

/** 홈 페이지 컴포넌트 — path: '/' (index: true) */
export function HomePage() {
  return (
    <div>
      <h1 style={{ margin: '0 0 16px' }}>홈 페이지</h1>
      <p style={{ color: '#6b7280', marginBottom: '20px' }}>
        이 컴포넌트는 '/' 경로일 때 RootLayout의 {'<Outlet />'}에 삽입됩니다.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {['리액트 입문', 'useState 완전 정복', 'useEffect 마스터'].map((title, i) => (
          <Link
            key={i}
            to={`/videos/video-${i + 1}`}
            style={{ padding: '16px', background: '#eff6ff', borderRadius: '10px', textDecoration: 'none', color: '#1e40af', fontWeight: 600, fontSize: '0.9rem' }}
          >
            🎬 {title}
          </Link>
        ))}
      </div>
    </div>
  );
}

/** 영상 목록 페이지 — path: 'videos' */
export function VideoListPage() {
  const videos = [
    { id: 'video-1', title: '리액트 입문', views: '12만회' },
    { id: 'video-2', title: 'useState 완전 정복', views: '8.5만회' },
    { id: 'video-3', title: 'useEffect 마스터', views: '6.2만회' },
  ];

  return (
    <div>
      <h1 style={{ margin: '0 0 16px' }}>영상 목록</h1>
      <p style={{ color: '#6b7280', marginBottom: '20px' }}>
        '/videos' 경로일 때 {'<Outlet />'}에 삽입됩니다.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {videos.map((video) => (
          <Link
            key={video.id}
            to={`/videos/${video.id}`}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: '#f8fafc', borderRadius: '10px', textDecoration: 'none', color: 'inherit', border: '1px solid #e2e8f0' }}
          >
            <span style={{ fontWeight: 600 }}>🎬 {video.title}</span>
            <span style={{ fontSize: '0.82rem', color: '#9ca3af' }}>조회수 {video.views}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** 소개 페이지 — path: 'about' */
export function AboutPage() {
  return (
    <div>
      <h1 style={{ margin: '0 0 16px' }}>소개 페이지</h1>
      <p style={{ color: '#6b7280' }}>
        '/about' 경로일 때 {'<Outlet />'}에 삽입됩니다.
        헤더와 푸터는 항상 RootLayout이 렌더링하므로 여기선 내용만 작성합니다.
      </p>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// Outlet의 역할 시각화
// ─────────────────────────────────────────────────────

/**
 * <Outlet />이 어떤 역할을 하는지 시각적으로 보여줍니다.
 * 실제 라우터 없이 useState로 시뮬레이션합니다.
 */
export function OutletVisualizer() {
  const [currentPage, setCurrentPage] = useState('home');

  const pages = {
    home: {
      label: '홈 (/)',
      content: (
        <div style={{ padding: '20px', background: '#eff6ff', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px', color: '#1d4ed8' }}>🏠 홈 페이지</h3>
          <p style={{ margin: 0, color: '#374151', fontSize: '0.9rem' }}>
            index: true → '/' 경로와 정확히 일치할 때 이 컴포넌트가 Outlet 자리에 들어갑니다.
          </p>
        </div>
      ),
    },
    videos: {
      label: '영상 목록 (/videos)',
      content: (
        <div style={{ padding: '20px', background: '#f0fdf4', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px', color: '#15803d' }}>🎬 영상 목록 페이지</h3>
          <p style={{ margin: 0, color: '#374151', fontSize: '0.9rem' }}>
            path: 'videos' → '/videos' 경로일 때 이 컴포넌트가 Outlet 자리에 들어갑니다.
          </p>
        </div>
      ),
    },
    about: {
      label: '소개 (/about)',
      content: (
        <div style={{ padding: '20px', background: '#fef9c3', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px', color: '#713f12' }}>ℹ️ 소개 페이지</h3>
          <p style={{ margin: 0, color: '#374151', fontSize: '0.9rem' }}>
            path: 'about' → '/about' 경로일 때 이 컴포넌트가 Outlet 자리에 들어갑니다.
          </p>
        </div>
      ),
    },
  };

  return (
    <div style={{ padding: '20px', maxWidth: '560px' }}>
      <h2>{'<Outlet />'} 동작 시각화</h2>
      <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '16px' }}>
        버튼을 클릭해 Outlet 자리의 내용이 어떻게 바뀌는지 확인하세요
      </p>

      {/* 공통 레이아웃 (RootLayout 시뮬레이션) */}
      <div style={{ border: '2px solid #6366f1', borderRadius: '12px', overflow: 'hidden' }}>
        {/* 헤더 — 항상 표시 */}
        <div style={{ background: '#1e293b', padding: '12px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ color: 'white', fontWeight: 700, marginRight: '8px', fontSize: '0.88rem' }}>RootLayout</span>
          {Object.entries(pages).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setCurrentPage(key)}
              style={{
                padding: '5px 12px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.78rem',
                background: currentPage === key ? '#6366f1' : '#334155',
                color: currentPage === key ? 'white' : '#94a3b8',
                fontWeight: currentPage === key ? 700 : 400,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Outlet 영역 — 경로에 따라 내용 교체 */}
        <div style={{ padding: '16px', background: 'white' }}>
          <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', background: '#6366f1', color: 'white', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
              {'<Outlet />'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>← 여기 내용이 교체됩니다</span>
          </div>
          {pages[currentPage].content}
        </div>

        {/* 푸터 — 항상 표시 */}
        <div style={{ background: '#f1f5f9', padding: '10px 16px', textAlign: 'center', fontSize: '0.78rem', color: '#6b7280' }}>
          RootLayout 푸터 — 항상 표시
        </div>
      </div>

      <div style={{ marginTop: '14px', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.8rem', color: '#475569' }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700 }}>핵심 포인트</p>
        <ul style={{ margin: 0, paddingLeft: '16px', lineHeight: 1.8 }}>
          <li>헤더·푸터는 RootLayout에 한 번만 작성</li>
          <li>{'<Outlet />'} 자리에 현재 경로의 컴포넌트가 삽입됨</li>
          <li>페이지가 바뀌어도 헤더·푸터는 다시 그려지지 않음 (효율적!)</li>
        </ul>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 라우터 설정 코드 (실제 main.jsx에 사용)
// ─────────────────────────────────────────────────────

/**
 * 실제 main.jsx에서 아래 코드를 사용합니다.
 * (이 파일에서는 createBrowserRouter import가 없으므로 주석 처리)
 *
 * import { createBrowserRouter, RouterProvider } from 'react-router-dom';
 * import {
 *   RootLayout, HomePage, VideoListPage, AboutPage
 * } from './study/ch02_router/02_nested_routing';
 *
 * const router = createBrowserRouter([
 *   {
 *     path: '/',
 *     element: <RootLayout />,
 *     children: [
 *       { index: true,    element: <HomePage /> },
 *       { path: 'videos', element: <VideoListPage /> },
 *       { path: 'about',  element: <AboutPage /> },
 *     ],
 *   },
 * ]);
 *
 * ReactDOM.createRoot(document.getElementById('root')).render(
 *   <RouterProvider router={router} />
 * );
 */


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
// OutletVisualizer는 라우터 없이도 동작합니다
import { OutletVisualizer } from './02_nested_routing';

function App() {
  return <OutletVisualizer />;
}

// RootLayout, HomePage 등은 RouterProvider 안에서 사용합니다
// → main.jsx 설정 코드 참고
*/
