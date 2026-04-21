/**
 * 04_styled_components.jsx — styled-components 스타일링 예제
 * ===========================================================
 * CSS를 JavaScript 안에 직접 작성하는 CSS-in-JS 방식입니다.
 * 컴포넌트와 스타일이 한 파일에 함께 있어 관리가 편리합니다.
 *
 * ⚠️ 사전 설치 필요:
 *   npm install styled-components
 *
 * 핵심 문법:
 *   const 컴포넌트명 = styled.태그명`
 *     css 속성: 값;
 *   `;
 *
 * 이 파일은 학습용 예제입니다.
 * Vite + React 프로젝트에서 App.jsx에 import하여 확인하세요.
 */

import styled from 'styled-components';
import { useState } from 'react';


// ─────────────────────────────────────────────────────
// 예제 1: styled-components 기본 사용법
// ─────────────────────────────────────────────────────

/**
 * styled.태그명`CSS` 형태로 스타일이 입혀진 컴포넌트를 만듭니다.
 * 백틱(`) 안에 일반 CSS를 그대로 작성하면 됩니다.
 */

// styled.div: <div>에 스타일을 입힌 컴포넌트
const Card = styled.div`
  padding: 20px 24px;
  border-radius: 12px;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  margin: 8px;
  max-width: 320px;
`;

// styled.h2: <h2>에 스타일을 입힌 컴포넌트
const CardTitle = styled.h2`
  font-size: 1.1rem;
  color: #1d4ed8;
  margin: 0 0 8px;
`;

// styled.p: <p>에 스타일을 입힌 컴포넌트
const CardText = styled.p`
  font-size: 0.9rem;
  color: #374151;
  margin: 0;
  line-height: 1.6;
`;

export function StyledComponentsBasic() {
  return (
    <div>
      <h2>styled-components 기본 사용</h2>

      {/* 일반 HTML처럼 사용하지만 스타일이 이미 입혀진 컴포넌트 */}
      <Card>
        <CardTitle>styled-components란?</CardTitle>
        <CardText>
          CSS를 JavaScript 안에 작성합니다.
          컴포넌트를 만들면 스타일도 함께 캡슐화됩니다.
        </CardText>
      </Card>

      <Card>
        <CardTitle>장점</CardTitle>
        <CardText>
          클래스 이름 충돌 걱정 없음.
          props로 동적 스타일 적용 가능.
          컴포넌트와 스타일을 한 파일에서 관리.
        </CardText>
      </Card>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: props를 이용한 동적 스타일
// ─────────────────────────────────────────────────────

/**
 * styled-components의 가장 강력한 기능입니다.
 * props 값에 따라 CSS가 자동으로 바뀝니다.
 *
 * 문법: ${props => props.조건 ? '값1' : '값2'}
 */

// 유튜브 스타일 버튼 — subscribe prop에 따라 색상이 달라집니다
const YoutubeButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  margin: 6px;
  transition: opacity 0.2s;

  /* subscribe prop이 있으면 검은색, 없으면 주황색 */
  background-color: ${props => props.subscribe ? '#0f0f0f' : '#ff6600'};
  color: ${props => props.subscribe ? 'white' : 'white'};

  &:hover {
    opacity: 0.85;
  }
`;

export function YoutubeButtons() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>props 기반 동적 스타일</h2>

      {/* subscribe prop 없음 → 주황색 */}
      <YoutubeButton>구독</YoutubeButton>

      {/* subscribe prop 있음 → 검은색 */}
      <YoutubeButton subscribe>구독중</YoutubeButton>

      <div style={{ marginTop: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.83rem', color: '#475569' }}>
        <p style={{ margin: '0 0 6px', fontWeight: 600 }}>동적 스타일 패턴</p>
        <code style={{ display: 'block', color: '#334155', lineHeight: 1.8 }}>
          {'background-color: ${props => props.subscribe ? \'#0f0f0f\' : \'#ff6600\'};'}
        </code>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: &:hover 가상 선택자 — 인라인 스타일과의 차이
// ─────────────────────────────────────────────────────

/**
 * styled-components에서는 &:hover 같은 가상 선택자를 바로 쓸 수 있습니다.
 * 인라인 스타일에서는 :hover가 불가능했지만, CSS 모듈과 styled-components에서는 가능합니다.
 * &는 "현재 이 컴포넌트"를 의미합니다.
 */

const HoverCard = styled.div`
  padding: 16px 20px;
  border-radius: 10px;
  background-color: #f1f5f9;
  border: 2px solid #e2e8f0;
  margin: 8px;
  max-width: 300px;
  cursor: pointer;
  transition: all 0.25s ease;

  /* &:hover — 마우스를 올렸을 때 */
  &:hover {
    background-color: #6366f1;
    color: white;
    border-color: #6366f1;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
  }

  /* &:active — 클릭했을 때 */
  &:active {
    transform: translateY(0);
  }
`;

const HoverTitle = styled.p`
  font-weight: 700;
  margin: 0 0 4px;
`;

const HoverDesc = styled.p`
  font-size: 0.85rem;
  margin: 0;
  opacity: 0.75;
`;

export function HoverExample() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>가상 선택자 (&:hover)</h2>
      <p style={{ fontSize: '0.88rem', color: '#6b7280' }}>
        카드 위에 마우스를 올려보세요
      </p>

      <HoverCard>
        <HoverTitle>hover 효과 있는 카드</HoverTitle>
        <HoverDesc>styled-components에서는 &:hover를 바로 사용할 수 있습니다.</HoverDesc>
      </HoverCard>

      <div style={{ marginTop: '16px', padding: '12px', background: '#fefce8', borderRadius: '8px', fontSize: '0.83rem', color: '#713f12' }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700 }}>💡 인라인 스타일과의 차이</p>
        <ul style={{ margin: 0, paddingLeft: '16px', lineHeight: 1.8 }}>
          <li>인라인 스타일: <code>:hover</code> 불가능 → onMouseEnter/Leave로 우회해야 함</li>
          <li>CSS 모듈: <code>.box:hover {'{}' }</code> 가능</li>
          <li>styled-components: <code>{'&:hover {}'}</code> 가능 + 컴포넌트와 한 파일에!</li>
        </ul>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 4: 컴포넌트 확장 (styled 상속)
// ─────────────────────────────────────────────────────

/**
 * 기존 styled 컴포넌트를 기반으로 새 스타일을 추가할 수 있습니다.
 * styled(기존컴포넌트)`추가CSS`
 *
 * 실무에서 자주 사용: 기본 버튼에서 위험/성공 버튼 등 변형 생성
 */

// 기본 버튼
const BaseButton = styled.button`
  padding: 10px 22px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  margin: 6px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;

// BaseButton을 확장한 성공 버튼 (초록)
const SuccessButton = styled(BaseButton)`
  background-color: #16a34a;
  color: white;
`;

// BaseButton을 확장한 위험 버튼 (빨강)
const DangerButton = styled(BaseButton)`
  background-color: #dc2626;
  color: white;
`;

// BaseButton을 확장한 외곽선 버튼
const OutlineButton = styled(BaseButton)`
  background-color: transparent;
  color: #6366f1;
  border: 2px solid #6366f1;

  &:hover {
    background-color: #6366f1;
    color: white;
    opacity: 1;
  }
`;

export function ExtendedButtons() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>컴포넌트 확장 (styled 상속)</h2>
      <p style={{ fontSize: '0.88rem', color: '#6b7280', margin: '0 0 12px' }}>
        BaseButton의 공통 스타일을 공유하고, 색상만 다르게 확장합니다
      </p>

      <div>
        <SuccessButton>저장</SuccessButton>
        <DangerButton>삭제</DangerButton>
        <OutlineButton>취소</OutlineButton>
      </div>

      <div style={{ marginTop: '14px', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.83rem', color: '#475569' }}>
        <p style={{ margin: '0 0 6px', fontWeight: 600 }}>확장 패턴</p>
        <code style={{ display: 'block', color: '#334155', lineHeight: 1.8 }}>
          {'const SuccessButton = styled(BaseButton)`'}
          <br />
          {'  background-color: #16a34a;'}
          <br />
          {'`;'}
        </code>
        <p style={{ margin: '8px 0 0', color: '#64748b' }}>
          BaseButton의 모든 스타일을 그대로 가져오고, 배경색만 변경합니다.
        </p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 5: 상태(state)에 따른 동적 스타일
// ─────────────────────────────────────────────────────

/**
 * useState와 styled-components를 함께 사용하면
 * 상태 변화에 따라 CSS가 자동으로 업데이트됩니다.
 */

const ThemeWrapper = styled.div`
  padding: 24px;
  border-radius: 14px;
  max-width: 360px;
  transition: all 0.3s ease;

  background-color: ${props => props.dark ? '#1e293b' : '#f8fafc'};
  color: ${props => props.dark ? '#f1f5f9' : '#1e293b'};
  border: 1px solid ${props => props.dark ? '#334155' : '#e2e8f0'};
`;

const ThemeToggleButton = styled.button`
  padding: 8px 18px;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 14px;
  transition: all 0.3s;

  background-color: ${props => props.dark ? '#f1f5f9' : '#1e293b'};
  color: ${props => props.dark ? '#1e293b' : '#f1f5f9'};
`;

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h2>상태 기반 동적 스타일</h2>

      <ThemeWrapper dark={isDark}>
        <p style={{ margin: '0 0 8px', fontWeight: 700 }}>
          {isDark ? '🌙 다크 모드' : '☀️ 라이트 모드'}
        </p>
        <p style={{ margin: 0, fontSize: '0.88rem', opacity: 0.8 }}>
          props로 상태를 전달하면 CSS가 자동으로 바뀝니다.
        </p>
        <ThemeToggleButton
          dark={isDark}
          onClick={() => setIsDark(!isDark)}
        >
          {isDark ? '라이트 모드로' : '다크 모드로'}
        </ThemeToggleButton>
      </ThemeWrapper>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
import {
  StyledComponentsBasic,
  YoutubeButtons,
  HoverExample,
  ExtendedButtons,
  ThemeToggle
} from './04_styled_components';

// ⚠️ 먼저 설치: npm install styled-components

function App() {
  return (
    <div>
      <StyledComponentsBasic />
      <YoutubeButtons />
      <HoverExample />
      <ExtendedButtons />
      <ThemeToggle />
    </div>
  );
}
*/
