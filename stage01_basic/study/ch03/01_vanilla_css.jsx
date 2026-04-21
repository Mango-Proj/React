/**
 * 01_vanilla_css.jsx — 바닐라 CSS 스타일링 예제
 * ===============================================
 * 전통적인 CSS 파일 import 방식을 배웁니다.
 * 클래스 충돌 문제가 왜 발생하는지 직접 확인합니다.
 *
 * 이 파일은 학습용 예제입니다.
 * Vite + React 프로젝트에서 App.jsx에 import하여 확인하세요.
 *
 * 함께 필요한 파일:
 *   - 01_vanilla_Header.css
 *   - 01_vanilla_Footer.css
 */

/**
 * ⚠️ 실제 프로젝트에서 바닐라 CSS를 import하려면 아래 주석을 해제하세요.
 * 여기서는 CSS 파일 import 없이 인라인 스타일로 충돌 문제를 시뮬레이션합니다.
 */
// import './01_vanilla_Header.css';
// import './01_vanilla_Footer.css';


// ─────────────────────────────────────────────────────
// 예제 1: 기본 바닐라 CSS 사용 방법
// ─────────────────────────────────────────────────────

/**
 * 바닐라 CSS 사용 패턴:
 * 1. CSS 파일에 스타일 정의
 * 2. JSX 파일에서 CSS 파일을 import
 * 3. HTML과 다르게 class 대신 className을 사용
 */

// 실제 프로젝트에서는 이렇게 사용합니다:
//
// import './Header.css';
//
// function Header() {
//   return (
//     <header className="header-wrap">
//       <h1 className="title">Header</h1>  ← HTML의 class가 아닌 className!
//     </header>
//   );
// }

// 학습용: CSS 파일 없이 같은 결과를 시뮬레이션하는 컴포넌트
export function VanillaHeader() {
  return (
    <div>
      {/* className="title" 이 적용되었다면 Header.css의 스타일이 들어갑니다 */}
      <div style={{ background: '#1e40af', padding: '16px 24px' }}>
        <h1
          className="title"  /* ← 실제에서는 이 className이 CSS 파일과 연결됩니다 */
          style={{ fontSize: '24px', color: 'blue', margin: 0 }}
        >
          Header (바닐라 CSS 방식)
        </h1>
        <p style={{ color: '#93c5fd', fontSize: '0.82rem', marginTop: '4px' }}>
          className="title" → Header.css의 .title 스타일 적용
        </p>
      </div>
    </div>
  );
}

export function VanillaFooter() {
  return (
    <div>
      {/* className="title" — Footer.css가 마지막에 import됐다면 이쪽 스타일이 Header에도 적용됩니다 */}
      <div style={{ background: '#1e293b', padding: '14px 24px' }}>
        <h1
          className="title"
          style={{ fontSize: '18px', color: 'green', margin: 0 }}
        >
          Footer (바닐라 CSS 방식)
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '4px' }}>
          className="title" → Footer.css의 .title 스타일 적용
        </p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: 클래스 충돌 문제 시각화
// ─────────────────────────────────────────────────────

/**
 * 두 컴포넌트가 같은 클래스명 "title"을 사용합니다.
 * Header.css → .title { color: blue }
 * Footer.css → .title { color: green }
 *
 * App에서 두 파일을 import하면 마지막에 import된 CSS가 이전 것을 덮어씁니다.
 * 결과: Header도 green으로 표시됩니다! (의도하지 않은 결과)
 */
export function CSSConflictDemo() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>CSS 클래스 충돌 문제</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {/* 의도한 결과 */}
        <div style={{ padding: '14px', background: '#f0fdf4', borderRadius: '10px' }}>
          <p style={{ fontWeight: 700, color: '#15803d', margin: '0 0 10px', fontSize: '0.88rem' }}>
            ✅ 개발자가 의도한 결과
          </p>
          <div style={{ padding: '10px', background: '#dbeafe', borderRadius: '6px', marginBottom: '6px', textAlign: 'center' }}>
            <span style={{ color: 'blue', fontWeight: 700 }}>Header</span>
            <span style={{ fontSize: '0.75rem', color: '#1d4ed8', display: 'block' }}>.title → color: blue</span>
          </div>
          <div style={{ padding: '10px', background: '#f0fdf4', borderRadius: '6px', textAlign: 'center' }}>
            <span style={{ color: 'green', fontWeight: 700 }}>Footer</span>
            <span style={{ fontSize: '0.75rem', color: '#15803d', display: 'block' }}>.title → color: green</span>
          </div>
        </div>

        {/* 실제 결과 */}
        <div style={{ padding: '14px', background: '#fef2f2', borderRadius: '10px' }}>
          <p style={{ fontWeight: 700, color: '#dc2626', margin: '0 0 10px', fontSize: '0.88rem' }}>
            ❌ 실제 결과 (Footer.css가 Header.css를 덮어씀)
          </p>
          <div style={{ padding: '10px', background: '#fef2f2', borderRadius: '6px', marginBottom: '6px', textAlign: 'center' }}>
            <span style={{ color: 'green', fontWeight: 700 }}>Header</span>
            <span style={{ fontSize: '0.75rem', color: '#dc2626', display: 'block' }}>
              .title → color: green ← 의도치 않게 초록색!
            </span>
          </div>
          <div style={{ padding: '10px', background: '#f0fdf4', borderRadius: '6px', textAlign: 'center' }}>
            <span style={{ color: 'green', fontWeight: 700 }}>Footer</span>
            <span style={{ fontSize: '0.75rem', color: '#15803d', display: 'block' }}>.title → color: green</span>
          </div>
        </div>
      </div>

      {/* 충돌 원인 설명 */}
      <div style={{ padding: '14px', background: '#fff7ed', borderRadius: '10px', fontSize: '0.85rem' }}>
        <p style={{ fontWeight: 700, color: '#c2410c', margin: '0 0 8px' }}>⚠️ 충돌이 발생하는 이유</p>
        <ol style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.8', color: '#92400e' }}>
          <li>Header.css와 Footer.css 모두 <code>.title</code> 클래스를 정의합니다</li>
          <li>두 CSS 파일이 App에서 모두 import 됩니다</li>
          <li>브라우저는 <strong>나중에 로드된 CSS를 우선 적용</strong>합니다</li>
          <li>Footer.css가 마지막에 import 되어 Header의 <code>.title</code>까지 초록색으로 바꿉니다</li>
        </ol>
      </div>

      {/* 해결 방법 안내 */}
      <div style={{ padding: '14px', background: '#eff6ff', borderRadius: '10px', fontSize: '0.85rem', marginTop: '12px' }}>
        <p style={{ fontWeight: 700, color: '#1d4ed8', margin: '0 0 8px' }}>💡 해결 방법</p>
        <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.8', color: '#1e40af' }}>
          <li><strong>클래스명 규칙</strong>: BEM 방식 (<code>.header__title</code>, <code>.footer__title</code>)</li>
          <li><strong>CSS 모듈</strong>: <code>.module.css</code> 확장자 → 자동 고유 클래스명</li>
          <li><strong>styled-components</strong>: JS 안에 CSS 작성 → 충돌 원천 차단</li>
        </ul>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: className 올바른 사용
// ─────────────────────────────────────────────────────

/**
 * React에서 CSS 클래스를 적용할 때는
 * HTML의 class 대신 반드시 className을 사용합니다.
 */
export function ClassNameGuide() {
  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>className 사용 규칙</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* 잘못된 예 */}
        <div style={{ padding: '12px', background: '#fef2f2', borderRadius: '8px', borderLeft: '4px solid #dc2626' }}>
          <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#dc2626', fontSize: '0.88rem' }}>❌ 잘못된 방법 (HTML 방식)</p>
          <code style={{ fontSize: '0.82rem', color: '#991b1b' }}>
            {'<h1 class="title">Header</h1>'}
          </code>
          <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#b91c1c' }}>
            React에서 class는 JS 예약어라 사용할 수 없습니다
          </p>
        </div>

        {/* 올바른 예 */}
        <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px', borderLeft: '4px solid #16a34a' }}>
          <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#15803d', fontSize: '0.88rem' }}>✅ 올바른 방법 (React 방식)</p>
          <code style={{ fontSize: '0.82rem', color: '#166534' }}>
            {'<h1 className="title">Header</h1>'}
          </code>
          <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#15803d' }}>
            className을 사용합니다
          </p>
        </div>

        {/* 동적 className */}
        <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
          <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#1d4ed8', fontSize: '0.88rem' }}>💡 동적 className (상태에 따라 클래스 변경)</p>
          <code style={{ fontSize: '0.82rem', color: '#1e40af', display: 'block' }}>
            {'const isActive = true;'}
          </code>
          <code style={{ fontSize: '0.82rem', color: '#1e40af', display: 'block', marginTop: '2px' }}>
            {'<div className={`card ${isActive ? "active" : ""}`}>'}
          </code>
          <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#1d4ed8' }}>
            템플릿 리터럴로 조건부 클래스를 추가할 수 있습니다
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
import { VanillaHeader, VanillaFooter, CSSConflictDemo, ClassNameGuide } from './01_vanilla_css';

function App() {
  return (
    <div>
      <CSSConflictDemo />
      <ClassNameGuide />
      <VanillaHeader />
      <VanillaFooter />
    </div>
  );
}
*/
