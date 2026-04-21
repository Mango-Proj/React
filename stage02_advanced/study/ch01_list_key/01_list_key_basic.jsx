/**
 * 01_list_key_basic.jsx — 리스트와 key 기본 사용법
 * ==================================================
 * React에서 배열 데이터를 화면에 렌더링하는 방법과
 * key prop이 왜 필요한지 배웁니다.
 *
 * 이 파일은 학습용 예제입니다.
 * Vite + React 프로젝트에서 App.jsx에 import하여 확인하세요.
 */

import { useState } from 'react';


// ─────────────────────────────────────────────────────
// 예제 1: 가장 기본적인 리스트 렌더링
// ─────────────────────────────────────────────────────

/**
 * 배열을 map()으로 순회해 각 항목을 <li> 요소로 변환합니다.
 * 문자열 배열처럼 각 항목이 고유하다면 항목 자체를 key로 사용할 수 있습니다.
 */
export function SimpleMenuList() {
  const menus = ['아메리카노', '카페라떼', '녹차라떼', '딸기 스무디'];

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>기본 리스트 렌더링</h2>
      <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '12px' }}>
        배열.map()으로 각 항목을 화면 요소로 변환합니다
      </p>

      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {menus.map((menu) => (
          // 문자열이 고유할 때는 항목 자체를 key로 사용 가능
          <li
            key={menu}
            style={{
              padding: '10px 14px',
              borderBottom: '1px solid #f1f5f9',
              fontSize: '0.95rem',
            }}
          >
            {menu}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '12px', padding: '12px', background: '#eff6ff', borderRadius: '8px', fontSize: '0.82rem', color: '#1e40af' }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700 }}>코드 패턴</p>
        <code>
          {`{menus.map((menu) => (`}<br />
          {`  <li key={menu}>{menu}</li>`}<br />
          {`))}`}
        </code>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: 객체 배열 리스트 렌더링 (실무 패턴)
// ─────────────────────────────────────────────────────

/**
 * 실제 서비스에서 데이터는 대부분 객체 배열 형태입니다.
 * 서버에서 받은 id를 key로 사용하는 것이 가장 안전합니다.
 */
export function VideoList() {
  const [videos] = useState([
    { id: 'AB123', title: '리액트 첫걸음 강의', views: '12만회', thumbnail: '🎬' },
    { id: 'CD456', title: 'useState 완전 정복', views: '8.5만회', thumbnail: '🔥' },
    { id: 'EF789', title: 'useEffect 실전 패턴', views: '6.2만회', thumbnail: '⚡' },
    { id: 'GH012', title: 'CSS 모듈 vs styled-components', views: '4만회', thumbnail: '🎨' },
  ]);

  return (
    <div style={{ padding: '20px', maxWidth: '480px' }}>
      <h2>객체 배열 리스트 (실무 패턴)</h2>
      <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '12px' }}>
        서버에서 받은 id를 key로 사용합니다
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {videos.map((video) => (
          // ✅ 서버 ID를 key로 사용
          <div
            key={video.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              background: '#f8fafc',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
            }}
          >
            <span style={{ fontSize: '1.6rem' }}>{video.thumbnail}</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{video.title}</p>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#9ca3af' }}>
                조회수 {video.views} · key="{video.id}"
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '12px', padding: '12px', background: '#eff6ff', borderRadius: '8px', fontSize: '0.82rem', color: '#1e40af' }}>
        <code>
          {`{videos.map((video) => (`}<br />
          {`  <div key={video.id}>...</div>`}<br />
          {`  //       ↑ 서버 ID를 key로 사용`}<br />
          {`))}`}
        </code>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: key 없을 때 경고 vs key 있을 때 정상
// ─────────────────────────────────────────────────────

/**
 * key가 없으면 브라우저 콘솔에 경고가 표시됩니다.
 * "Each child in a list should have a unique 'key' prop."
 * 이 예제로 경고 메시지를 직접 확인해보세요.
 */
export function KeyWarningDemo() {
  const fruits = ['사과', '바나나', '딸기'];

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>key 경고 데모</h2>
      <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '16px' }}>
        F12 콘솔을 열고 두 목록의 차이를 확인하세요
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* key 없음 — 콘솔에 경고 발생 */}
        <div style={{ padding: '14px', background: '#fef2f2', borderRadius: '10px' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#dc2626', fontSize: '0.88rem' }}>
            ❌ key 없음 (경고 발생)
          </p>
          <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
            {fruits.map((fruit) => (
              // key가 없으면 콘솔에 경고 메시지 출력
              <li style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{fruit}</li>
            ))}
          </ul>
          <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: '#dc2626' }}>
            콘솔: "Each child in a list should have a unique 'key' prop."
          </p>
        </div>

        {/* key 있음 — 정상 동작 */}
        <div style={{ padding: '14px', background: '#f0fdf4', borderRadius: '10px' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#16a34a', fontSize: '0.88rem' }}>
            ✅ key 있음 (정상)
          </p>
          <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
            {fruits.map((fruit) => (
              <li key={fruit} style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{fruit}</li>
            ))}
          </ul>
          <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: '#16a34a' }}>
            콘솔 경고 없음 ✓
          </p>
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 4: 항목 추가/삭제와 key
// ─────────────────────────────────────────────────────

/**
 * 항목을 추가하고 삭제할 때 고유 ID key가 어떻게 동작하는지 확인합니다.
 * crypto.randomUUID()는 브라우저 내장 API로 라이브러리 설치 없이 사용 가능합니다.
 */
export function DynamicVideoList() {
  const [videos, setVideos] = useState([
    { id: crypto.randomUUID(), title: '리액트 첫걸음 강의' },
    { id: crypto.randomUUID(), title: '리액트 심화 강의' },
  ]);

  // 맨 앞에 새 영상 추가
  const addVideoToFront = () => {
    const newVideo = { id: crypto.randomUUID(), title: `새 강의 #${videos.length + 1}` };
    setVideos([newVideo, ...videos]); // 앞에 추가
  };

  // 맨 뒤에 새 영상 추가
  const addVideoToEnd = () => {
    const newVideo = { id: crypto.randomUUID(), title: `새 강의 #${videos.length + 1}` };
    setVideos([...videos, newVideo]); // 뒤에 추가
  };

  // 특정 영상 삭제
  const deleteVideo = (id) => {
    setVideos(videos.filter(v => v.id !== id));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '460px' }}>
      <h2>동적 리스트 — 추가·삭제</h2>
      <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '12px' }}>
        crypto.randomUUID()로 고유 ID를 생성합니다
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={addVideoToFront}
          style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', background: '#7c3aed', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          ↑ 맨 앞에 추가
        </button>
        <button
          onClick={addVideoToEnd}
          style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          ↓ 맨 뒤에 추가
        </button>
      </div>

      {videos.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>영상이 없습니다</p>
      ) : (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {videos.map((video) => (
            <li
              key={video.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                background: '#f8fafc',
                borderRadius: '8px',
                marginBottom: '6px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>{video.title}</p>
                <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#9ca3af', fontFamily: 'monospace' }}>
                  key: {video.id.slice(0, 8)}...
                </p>
              </div>
              <button
                onClick={() => deleteVideo(video.id)}
                style={{ padding: '4px 10px', borderRadius: '4px', border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.8rem', color: '#475569' }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700 }}>핵심</p>
        <p style={{ margin: 0 }}>
          맨 앞에 추가해도 기존 항목의 key는 바뀌지 않습니다.
          React는 key를 보고 "새 항목만 추가됐다"는 것을 정확히 알 수 있습니다.
        </p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
import {
  SimpleMenuList,
  VideoList,
  KeyWarningDemo,
  DynamicVideoList
} from './01_list_key_basic';

function App() {
  return (
    <div>
      <SimpleMenuList />
      <VideoList />
      <KeyWarningDemo />
      <DynamicVideoList />
    </div>
  );
}
*/
