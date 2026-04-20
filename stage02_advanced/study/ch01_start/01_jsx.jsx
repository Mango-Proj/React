/**
 * 01_jsx.jsx — JSX 문법 예제
 * ============================
 * JSX는 자바스크립트 안에서 HTML처럼 생긴 코드를 작성할 수 있게 해주는 문법입니다.
 * 실제로는 빌드 시 React.createElement() 호출로 변환됩니다.
 *
 * 이 파일은 학습용 예제입니다.
 * Vite + React 프로젝트에서 각 컴포넌트를 App.jsx에 import하여 확인하세요.
 */

import React from 'react';


// ─────────────────────────────────────────────────────
// 예제 1: JSX 기본 규칙
// ─────────────────────────────────────────────────────

/**
 * ✅ JSX 규칙 정리
 *
 * 1. 반환값은 반드시 하나의 루트 요소
 * 2. class 대신 className
 * 3. 닫는 태그 필수 (<br /> <img /> <input />)
 * 4. JS 표현식은 {} 안에
 * 5. 인라인 스타일은 객체로 (style={{ color: 'red' }})
 */
export function JsxRulesExample() {
  const title = 'JSX 기본 규칙';
  const isVisible = true;
  const backgroundColor = '#f0f4f8';

  return (
    // 규칙 1: 하나의 루트 요소 — <div> 또는 <> (Fragment)로 감쌉니다
    <div>

      {/* 규칙 2: class 대신 className */}
      <h1 className="main-title">{title}</h1>

      {/* 규칙 3: 닫는 태그 필수 */}
      <br />
      <input type="text" placeholder="입력하세요" />
      <hr />

      {/* 규칙 4: JS 표현식은 {} 안에 — 변수, 연산, 함수 호출 모두 가능 */}
      <p>1 + 1 = {1 + 1}</p>
      <p>대문자: {'hello'.toUpperCase()}</p>
      <p>삼항 연산자: {isVisible ? '보임' : '숨김'}</p>

      {/* 규칙 5: 인라인 스타일은 {{ 속성명: '값' }} — camelCase 사용 */}
      <p style={{ color: 'royalblue', backgroundColor, fontWeight: 'bold' }}>
        스타일 적용 텍스트
      </p>

    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: Fragment — 불필요한 <div> 없이 여러 요소 묶기
// ─────────────────────────────────────────────────────

/**
 * <></> (단축 문법) 또는 <React.Fragment>를 사용합니다.
 * 실제 DOM에는 아무 요소도 추가되지 않습니다.
 *
 * 언제 사용하나?
 * - table > tr > td 구조처럼 중간에 div를 넣으면 HTML이 깨지는 경우
 * - 불필요한 wrapper div 없이 여러 요소를 반환하고 싶을 때
 */
export function FragmentExample() {
  return (
    // <div>로 감싸면 DOM에 불필요한 div가 생기지만
    // <>로 감싸면 DOM에 아무것도 추가되지 않습니다
    <>
      <h2>Fragment 예제</h2>
      <p>첫 번째 단락</p>
      <p>두 번째 단락</p>
    </>
  );
}

// 테이블 구조에서 Fragment가 필수인 예
export function TableRowExample() {
  const items = ['사과', '바나나', '오렌지'];

  return (
    <table>
      <tbody>
        {items.map((item, idx) => (
          // <tr>과 <td>를 같이 반환해야 할 때 div로 감싸면 테이블이 깨집니다
          // Fragment를 사용하면 올바른 테이블 구조가 유지됩니다
          <React.Fragment key={idx}>
            <tr>
              <td>{idx + 1}</td>
              <td>{item}</td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: JSX 안에서 JS 표현식 활용
// ─────────────────────────────────────────────────────

/**
 * {} 안에는 값을 반환하는 "표현식"만 쓸 수 있습니다.
 * if문, for문처럼 값을 반환하지 않는 "문장"은 직접 쓸 수 없습니다.
 */
export function ExpressionExample() {
  const score = 85;
  const fruits = ['사과', '바나나', '딸기'];
  const now = new Date();

  return (
    <div>
      {/* 변수 */}
      <p>점수: {score}</p>

      {/* 산술 연산 */}
      <p>100점 만점에서 {100 - score}점 부족합니다</p>

      {/* 삼항 연산자 (if 대신 사용) */}
      <p>등급: {score >= 90 ? 'A' : score >= 80 ? 'B' : 'C'}</p>

      {/* 메서드 호출 */}
      <p>과일 수: {fruits.length}개</p>
      <p>현재 시각: {now.toLocaleTimeString('ko-KR')}</p>

      {/* 배열 → 엘리먼트 변환 */}
      <ul>
        {fruits.map((fruit, idx) => (
          <li key={idx}>{fruit}</li>
        ))}
      </ul>

      {/*
        ❌ if문은 직접 쓸 수 없습니다 (아래는 오류)
        {if (score > 90) { return <p>우수</p>; }}

        ✅ 삼항 연산자나 && 연산자를 사용합니다
      */}
      {score >= 90 && <p>🏆 우수한 성적입니다!</p>}
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 4: JSX와 createElement 비교
// ─────────────────────────────────────────────────────

/**
 * JSX는 결국 React.createElement() 호출로 변환됩니다.
 * 아래 두 함수는 완전히 동일한 결과를 만듭니다.
 * JSX를 쓰면 훨씬 읽기 쉬운 이유를 직접 비교해보세요.
 */

// JSX 방식 (읽기 쉬움)
export function WithJsx() {
  return (
    <div className="card">
      <h2>JSX 방식</h2>
      <p>훨씬 직관적입니다</p>
    </div>
  );
}

// createElement 방식 (JSX가 실제로 변환되는 형태)
export function WithCreateElement() {
  return React.createElement(
    'div',
    { className: 'card' },
    React.createElement('h2', null, 'createElement 방식'),
    React.createElement('p', null, '중첩될수록 읽기 어렵습니다')
  );
}


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
import { JsxRulesExample, FragmentExample, ExpressionExample } from './01_jsx';

function App() {
  return (
    <div>
      <JsxRulesExample />
      <FragmentExample />
      <ExpressionExample />
    </div>
  );
}
*/
