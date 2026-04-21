/**
 * 02_fragment.jsx — Fragment 컴포넌트 예제
 * ==========================================
 * Fragment는 여러 자식 요소를 묶어 반환하되,
 * 실제 DOM에는 아무 요소도 추가하지 않는 특별한 컴포넌트입니다.
 *
 * 이 파일은 학습용 예제입니다.
 * Vite + React 프로젝트의 App.jsx에서 import하여 확인하세요.
 */

import { Fragment } from 'react';


// ─────────────────────────────────────────────────────
// 예제 1: div 문제점과 Fragment의 필요성
// ─────────────────────────────────────────────────────

/**
 * React 컴포넌트는 반드시 하나의 루트 요소를 반환해야 합니다.
 *
 * ❌ 에러 발생 예시:
 * function BadComponent() {
 *   return (
 *     <h1>제목</h1>   ← 두 개의 요소를 나란히 반환하면
 *     <p>내용</p>     ← "Adjacent JSX elements must be wrapped" 에러 발생!
 *   );
 * }
 */

// ⚠️ div로 해결하면 — DOM에 불필요한 div가 쌓입니다
function VideoDetailWithDiv() {
  return (
    <div>   {/* ← 이 div가 DOM에 실제로 추가됩니다 */}
      <h1>비디오 제목</h1>
      <p>비디오에 대한 설명입니다.</p>
    </div>
  );
}

// ✅ Fragment로 해결하면 — DOM에 아무것도 추가되지 않습니다
function VideoDetailWithFragment() {
  return (
    <Fragment>  {/* ← DOM에 아무 요소도 추가되지 않습니다 */}
      <h1>비디오 제목</h1>
      <p>비디오에 대한 설명입니다.</p>
    </Fragment>
  );
}

// ✅ 단축 문법 <></> — Fragment를 import 없이 사용할 수 있습니다 (가장 많이 사용)
function VideoDetailWithShorthand() {
  return (
    <>   {/* ← Fragment와 동일, import 불필요 */}
      <h1>비디오 제목</h1>
      <p>비디오에 대한 설명입니다.</p>
    </>
  );
}

// div vs Fragment 시각적 비교
export function DivVsFragment() {
  return (
    <div style={{ padding: '24px', maxWidth: '600px' }}>
      <h2>div vs Fragment 비교</h2>

      {/* div 사용 */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ color: '#dc2626', fontWeight: 700 }}>⚠️ div 사용 (DOM에 div가 추가됨)</p>
        <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '8px' }}>
          <VideoDetailWithDiv />
        </div>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px' }}>
          개발자도구로 확인하면: &lt;div&gt; → &lt;div&gt; → &lt;h1&gt;, &lt;p&gt;
        </p>
      </div>

      {/* Fragment 사용 */}
      <div>
        <p style={{ color: '#16a34a', fontWeight: 700 }}>✅ Fragment 사용 (DOM에 아무것도 추가 안 됨)</p>
        <div style={{ background: '#dcfce7', padding: '12px', borderRadius: '8px' }}>
          <VideoDetailWithFragment />
        </div>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px' }}>
          개발자도구로 확인하면: &lt;div&gt; → &lt;h1&gt;, &lt;p&gt; (중간 wrapper 없음)
        </p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: Fragment가 특히 중요한 경우 — 테이블 구조
// ─────────────────────────────────────────────────────

/**
 * HTML 테이블 구조: <table> → <tbody> → <tr> → <td>
 * 중간에 <div>를 끼워 넣으면 HTML 구조가 깨집니다.
 * Fragment를 사용하면 올바른 테이블 구조를 유지할 수 있습니다.
 */

// ❌ div를 쓰면 테이블 구조가 깨집니다
// function BadTableRow({ item }) {
//   return (
//     <div>          ← <tr> 바로 밑에 <div>가 들어가면 HTML 오류
//       <tr>
//         <td>{item.name}</td>
//         <td>{item.price}</td>
//       </tr>
//     </div>
//   );
// }

// ✅ Fragment를 쓰면 테이블 구조가 유지됩니다
function TableRow({ item }) {
  return (
    // key가 필요할 때는 <></> 대신 <Fragment key={...}>를 써야 합니다
    <Fragment key={item.id}>
      <tr>
        <td style={{ padding: '8px 12px', borderBottom: '1px solid #e2e8f0' }}>{item.name}</td>
        <td style={{ padding: '8px 12px', borderBottom: '1px solid #e2e8f0' }}>{item.category}</td>
        <td style={{ padding: '8px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>
          {item.price.toLocaleString('ko-KR')}원
        </td>
      </tr>
    </Fragment>
  );
}

export function ProductTable() {
  const products = [
    { id: 1, name: '사과',   category: '과일', price: 1500 },
    { id: 2, name: '당근',   category: '채소', price: 1200 },
    { id: 3, name: '바나나', category: '과일', price: 800  },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '480px' }}>
      <h2>상품 테이블</h2>
      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '12px' }}>
        <code>&lt;Fragment key=&#123;id&#125;&gt;</code>로 테이블 구조를 유지하면서 key를 부여합니다.
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#7c3aed', color: '#fff' }}>
            <th style={{ padding: '10px 12px', textAlign: 'left' }}>상품명</th>
            <th style={{ padding: '10px 12px', textAlign: 'left' }}>카테고리</th>
            <th style={{ padding: '10px 12px', textAlign: 'right' }}>가격</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <TableRow key={product.id} item={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: <></> 단축 문법 실전 활용
// ─────────────────────────────────────────────────────

/**
 * 실무에서 <></> 단축 문법을 가장 많이 씁니다.
 * Fragment를 import할 필요가 없어 코드가 간결해집니다.
 */
export function CommentSection() {
  const comments = [
    { id: 1, author: '홍길동', text: '좋은 영상입니다!', likes: 5 },
    { id: 2, author: '김철수', text: '정말 도움이 됐어요.', likes: 3 },
    { id: 3, author: '이영희', text: '구독하고 갑니다!', likes: 8 },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '480px' }}>
      <h2>댓글 섹션</h2>
      {comments.map(comment => (
        // 리스트에서 key가 필요할 때는 <></> 대신 <Fragment key={...}> 사용
        <Fragment key={comment.id}>
          <div style={{
            padding: '12px',
            borderBottom: '1px solid #f1f5f9',
          }}>
            {/* 여러 요소를 Fragment로 묶어 반환 — DOM에 불필요한 div 없음 */}
            <p style={{ fontWeight: 700, margin: '0 0 4px', fontSize: '0.9rem' }}>
              {comment.author}
            </p>
            <p style={{ margin: '0 0 4px', fontSize: '0.88rem' }}>{comment.text}</p>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              👍 {comment.likes}
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 4: Fragment 사용 규칙 정리 컴포넌트
// ─────────────────────────────────────────────────────

export function FragmentGuide() {
  return (
    <div style={{ padding: '24px', maxWidth: '520px' }}>
      <h2>Fragment 사용 가이드</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* 규칙 1 */}
        <div style={{ padding: '14px', background: '#f0fdf4', borderRadius: '8px', borderLeft: '4px solid #16a34a' }}>
          <p style={{ fontWeight: 700, margin: '0 0 4px' }}>✅ 대부분의 경우: &lt;&gt;&lt;/&gt; 사용</p>
          <code style={{ fontSize: '0.82rem', color: '#15803d' }}>
            {'return (<><h1>제목</h1><p>내용</p></>);'}
          </code>
          <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: '#64748b' }}>import 불필요, 가장 간결</p>
        </div>

        {/* 규칙 2 */}
        <div style={{ padding: '14px', background: '#eff6ff', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
          <p style={{ fontWeight: 700, margin: '0 0 4px' }}>⚡ key가 필요할 때: &lt;Fragment key={'{id}'}&gt; 사용</p>
          <code style={{ fontSize: '0.82rem', color: '#1d4ed8' }}>
            {'items.map(item => <Fragment key={item.id}>...</Fragment>)'}
          </code>
          <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
            &lt;&gt;&lt;/&gt;에는 key를 붙일 수 없으므로 Fragment를 import해서 사용
          </p>
        </div>

        {/* 규칙 3 */}
        <div style={{ padding: '14px', background: '#fef2f2', borderRadius: '8px', borderLeft: '4px solid #dc2626' }}>
          <p style={{ fontWeight: 700, margin: '0 0 4px' }}>❌ 피해야 할 것: 불필요한 div 중첩</p>
          <code style={{ fontSize: '0.82rem', color: '#dc2626' }}>
            {'return (<div><div><div>내용</div></div></div>);'}
          </code>
          <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
            CSS 레이아웃에 의도치 않은 영향을 줄 수 있습니다
          </p>
        </div>

      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
import { DivVsFragment, ProductTable, CommentSection, FragmentGuide } from './02_fragment';

function App() {
  return (
    <div>
      <DivVsFragment />
      <ProductTable />
      <CommentSection />
      <FragmentGuide />
    </div>
  );
}
*/
