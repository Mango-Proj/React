/**
 * 03_css_module.jsx — CSS 모듈 스타일링 예제
 * =============================================
 * .module.css 파일을 import하면 클래스명이 자동으로 고유해집니다.
 * 바닐라 CSS의 클래스 충돌 문제를 완벽하게 해결합니다.
 *
 * 핵심 개념:
 *   import styles from './03_Box.module.css';
 *   <div className={styles.box}>           ← styles.클래스명 형태로 사용
 *
 * 이 파일은 학습용 예제입니다.
 * Vite + React 프로젝트에서 App.jsx에 import하여 확인하세요.
 *
 * 함께 필요한 파일:
 *   - 03_Box.module.css
 *   - 03_Button.module.css
 */

import boxStyles from './03_Box.module.css';
import buttonStyles from './03_Button.module.css';


// ─────────────────────────────────────────────────────
// 예제 1: CSS 모듈 기본 사용법
// ─────────────────────────────────────────────────────

/**
 * CSS 모듈 import 방법:
 *   import styles from './파일명.module.css'  (객체로 가져옴)
 *
 * className 적용 방법:
 *   <div className={styles.box}>  ← styles.클래스명
 *
 * 여러 클래스를 동시에 적용:
 *   <div className={`${styles.box} ${styles.color}`}>  ← 템플릿 리터럴
 */
export function CSSModuleBox() {
  return (
    <div>
      {/* 단일 클래스 적용 */}
      <div className={boxStyles.box}>
        box 클래스만 적용 (배경색 없음)
      </div>

      {/* 여러 클래스 동시 적용 */}
      <div className={`${boxStyles.box} ${boxStyles.color}`}>
        box + color 클래스 동시 적용 (하늘색 배경)
      </div>
    </div>
  );
}

export function CSSModuleButton() {
  return (
    <div>
      {/* Button 모듈의 .button 클래스 */}
      <button className={buttonStyles.button}>
        button 클래스만 적용
      </button>

      {/* Button 모듈의 .button + .color 클래스 */}
      <button className={`${buttonStyles.button} ${buttonStyles.color}`}>
        button + color 클래스 (분홍색 배경)
      </button>

      {/* 비활성 버튼 */}
      <button className={`${buttonStyles.button} ${buttonStyles.disabled}`} disabled>
        disabled 버튼
      </button>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: 클래스 충돌이 해결된 이유
// ─────────────────────────────────────────────────────

/**
 * Box.module.css의 .color → "Box_color__abc12" (skyblue)
 * Button.module.css의 .color → "Button_color__xyz99" (pink)
 *
 * 같은 이름이지만 빌드 후 완전히 다른 클래스명이 됩니다.
 * 따라서 한 페이지에 둘 다 렌더링해도 서로 영향을 주지 않습니다.
 */
export function CSSModuleConflictSolved() {
  return (
    <div style={{ padding: '20px', maxWidth: '640px' }}>
      <h2>CSS 모듈 — 충돌 해결 데모</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {/* 바닐라 CSS: 충돌 발생 */}
        <div style={{ padding: '14px', background: '#fef2f2', borderRadius: '10px' }}>
          <p style={{ fontWeight: 700, color: '#dc2626', margin: '0 0 10px', fontSize: '0.88rem' }}>
            ❌ 바닐라 CSS — 충돌 발생
          </p>
          <div style={{ padding: '8px', background: '#fee2e2', borderRadius: '6px', marginBottom: '6px', fontSize: '0.82rem', color: '#991b1b' }}>
            <code>.color</code> → Header.css: blue
          </div>
          <div style={{ padding: '8px', background: '#fee2e2', borderRadius: '6px', fontSize: '0.82rem', color: '#991b1b' }}>
            <code>.color</code> → Footer.css: green (덮어씀!)
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '0.78rem', color: '#b91c1c' }}>
            같은 클래스명 → 나중에 로드된 CSS가 이전 것을 덮어씁니다
          </p>
        </div>

        {/* CSS 모듈: 충돌 없음 */}
        <div style={{ padding: '14px', background: '#f0fdf4', borderRadius: '10px' }}>
          <p style={{ fontWeight: 700, color: '#15803d', margin: '0 0 10px', fontSize: '0.88rem' }}>
            ✅ CSS 모듈 — 충돌 없음
          </p>
          <div style={{ padding: '8px', background: '#dcfce7', borderRadius: '6px', marginBottom: '6px', fontSize: '0.82rem', color: '#166534' }}>
            <code>boxStyles.color</code> → <code>Box_color__abc12</code>
          </div>
          <div style={{ padding: '8px', background: '#dcfce7', borderRadius: '6px', fontSize: '0.82rem', color: '#166534' }}>
            <code>buttonStyles.color</code> → <code>Button_color__xyz99</code>
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '0.78rem', color: '#15803d' }}>
            클래스명 자동 변환 → 완전히 다른 이름이 되어 충돌 없음
          </p>
        </div>
      </div>

      {/* 실제 렌더링: 같은 .color 이름이지만 스타일이 독립적 */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontWeight: 700, margin: '0 0 10px' }}>
          실제 렌더링 — 같은 ".color" 이름, 다른 스타일
        </p>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className={`${boxStyles.box} ${boxStyles.color}`}>
            Box: skyblue
          </div>
          <button className={`${buttonStyles.button} ${buttonStyles.color}`}>
            Button: pink
          </button>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '8px' }}>
          두 컴포넌트를 동시에 렌더링해도 서로 스타일이 침범하지 않습니다.
        </p>
      </div>

      {/* 구현 비교 */}
      <div style={{ padding: '14px', background: '#eff6ff', borderRadius: '10px', fontSize: '0.85rem' }}>
        <p style={{ fontWeight: 700, color: '#1d4ed8', margin: '0 0 8px' }}>💡 CSS 모듈 사용 방법</p>
        <ol style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.9', color: '#1e40af' }}>
          <li>파일명에 <code>.module.css</code> 확장자 사용</li>
          <li><code>import styles from './파일명.module.css'</code> 로 import</li>
          <li><code>className={'{'}{`styles.클래스명`}{'}'}</code> 형태로 적용</li>
          <li>여러 클래스: <code>{`className={\`${'{'}styles.a{'}'} ${'{'}styles.b{'}'}\`}`}</code></li>
        </ol>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: 조건부 클래스 적용
// ─────────────────────────────────────────────────────

/**
 * 상태(state)에 따라 CSS 모듈 클래스를 조건부로 적용합니다.
 * 인라인 스타일처럼 동적으로 스타일을 바꿀 수 있습니다.
 */
import { useState } from 'react';

export function ConditionalClassModule() {
  const [isColored, setIsColored] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <div style={{ padding: '20px', maxWidth: '480px' }}>
      <h2>조건부 클래스 적용</h2>

      {/* Box: color 클래스 토글 */}
      <div
        className={`${boxStyles.box} ${isColored ? boxStyles.color : ''}`}
        onClick={() => setIsColored(!isColored)}
        style={{ marginBottom: '12px' }}
      >
        클릭하면 색상이 {isColored ? '사라집니다' : '생깁니다'}
      </div>

      {/* Button: disabled 클래스 토글 */}
      <div style={{ marginBottom: '12px' }}>
        <button
          className={`${buttonStyles.button} ${buttonStyles.color} ${isDisabled ? buttonStyles.disabled : ''}`}
          disabled={isDisabled}
        >
          {isDisabled ? '비활성 버튼' : '활성 버튼'}
        </button>
        <button
          onClick={() => setIsDisabled(!isDisabled)}
          style={{ marginLeft: '8px', padding: '6px 12px', cursor: 'pointer' }}
        >
          {isDisabled ? '활성화' : '비활성화'}
        </button>
      </div>

      <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.83rem', color: '#475569' }}>
        <p style={{ margin: 0, fontWeight: 600 }}>조건부 클래스 패턴</p>
        <code style={{ display: 'block', marginTop: '6px', color: '#334155' }}>
          {`className={\`${'{'}styles.box{'}'} ${'{'}isColored ? styles.color : ''\`}`}
        </code>
        <p style={{ margin: '6px 0 0' }}>
          조건이 false일 때 빈 문자열('')을 넣으면 클래스가 추가되지 않습니다.
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
  CSSModuleBox,
  CSSModuleButton,
  CSSModuleConflictSolved,
  ConditionalClassModule
} from './03_css_module';

function App() {
  return (
    <div>
      <CSSModuleConflictSolved />
      <CSSModuleBox />
      <CSSModuleButton />
      <ConditionalClassModule />
    </div>
  );
}
*/
