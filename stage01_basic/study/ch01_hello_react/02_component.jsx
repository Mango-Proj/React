/**
 * 02_component.jsx — 컴포넌트와 Props 예제
 * ==========================================
 * 컴포넌트는 UI를 독립적인 부품으로 나눈 것입니다.
 * Props는 부모가 자식에게 "이 데이터로 만들어줘"라고 전달하는 명세서입니다.
 *
 * 이 파일은 학습용 예제입니다.
 * Vite + React 프로젝트에서 각 컴포넌트를 App.jsx에 import하여 확인하세요.
 */


// ─────────────────────────────────────────────────────
// 예제 1: 기본 함수형 컴포넌트
// ─────────────────────────────────────────────────────

/**
 * 컴포넌트는 JSX를 반환하는 함수입니다.
 * 이름은 반드시 대문자로 시작해야 합니다.
 *   - <button> → HTML 태그 (소문자)
 *   - <Button> → React 컴포넌트 (대문자)
 */

// 함수 선언식 (function declaration)
export function Header() {
  return (
    <header style={{ background: '#7c3aed', color: '#fff', padding: '16px 24px' }}>
      <h1>나의 앱</h1>
    </header>
  );
}

// 화살표 함수 (arrow function) — 같은 결과, 취향 차이
export const Footer = () => {
  return (
    <footer style={{ background: '#f1f5f9', textAlign: 'center', padding: '16px' }}>
      <p>© 2026 My App</p>
    </footer>
  );
};

// 컴포넌트 조합 — 부품들을 조립합니다
export function PageLayout() {
  return (
    <div>
      <Header />
      <main style={{ padding: '24px' }}>
        <p>메인 콘텐츠 영역</p>
      </main>
      <Footer />
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: Props — 데이터 전달
// ─────────────────────────────────────────────────────

/**
 * Props는 컴포넌트 함수의 첫 번째 매개변수로 전달됩니다.
 * 구조 분해 할당으로 필요한 값만 꺼내 쓰는 것이 일반적입니다.
 */

// Props를 받는 컴포넌트
function UserCard({ name, role, email }) {
  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      maxWidth: '320px',
    }}>
      <h3 style={{ margin: '0 0 4px' }}>{name}</h3>
      <p style={{ color: '#7c3aed', fontSize: '0.85rem', margin: '0 0 4px' }}>{role}</p>
      <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>{email}</p>
    </div>
  );
}

// 부모 컴포넌트 — 같은 컴포넌트에 다른 props를 줘서 다른 내용을 표시합니다
export function UserList() {
  return (
    <div>
      <h2>팀원 소개</h2>

      {/* 같은 UserCard 컴포넌트지만 props가 달라 다른 내용을 보여줍니다 */}
      <UserCard name="홍길동"  role="프론트엔드 개발자" email="hong@example.com" />
      <UserCard name="김철수"  role="백엔드 개발자"     email="kim@example.com" />
      <UserCard name="이영희"  role="UI/UX 디자이너"    email="lee@example.com" />
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: Props 기본값 (default parameter)
// ─────────────────────────────────────────────────────

/**
 * 구조 분해 할당에서 = 로 기본값을 설정합니다.
 * 부모가 해당 prop을 넘기지 않으면 기본값이 사용됩니다.
 */
export function Button({
  label = '확인',           // label을 안 넘기면 '확인'
  variant = 'primary',     // variant를 안 넘기면 'primary'
  disabled = false,        // disabled를 안 넘기면 false
  onClick,
}) {
  const styles = {
    primary:   { background: '#7c3aed', color: '#fff' },
    secondary: { background: '#e2e8f0', color: '#1e293b' },
    danger:    { background: '#dc2626', color: '#fff' },
  };

  return (
    <button
      style={{
        ...styles[variant],
        padding: '8px 18px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.88rem',
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

// Button 사용 예
export function ButtonDemo() {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {/* 아무것도 안 넘기면 기본값(확인, primary) 사용 */}
      <Button onClick={() => alert('확인!')} />

      {/* 원하는 값만 재정의 */}
      <Button label="취소"  variant="secondary" onClick={() => alert('취소')} />
      <Button label="삭제"  variant="danger"    onClick={() => alert('삭제')} />
      <Button label="비활성" disabled />
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 4: children — 컴포넌트 태그 사이 내용 받기
// ─────────────────────────────────────────────────────

/**
 * children은 특별한 prop입니다.
 * <Card>...</Card> 태그 사이에 들어오는 모든 내용이 children으로 전달됩니다.
 *
 * 비유: 택배 상자 안에 무엇을 넣을지는 부모가 결정합니다.
 * 상자(Card) 자체의 스타일은 Card 컴포넌트가 담당합니다.
 */
export function Card({ children, title }) {
  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px 24px',
      marginBottom: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      {/* title prop이 있을 때만 제목 표시 */}
      {title && <h3 style={{ marginTop: 0, color: '#7c3aed' }}>{title}</h3>}

      {/* children: 부모가 태그 사이에 넣어준 내용 */}
      {children}
    </div>
  );
}

// Card에 다양한 내용 넣기
export function CardDemo() {
  return (
    <div>
      {/* 텍스트 넣기 */}
      <Card title="공지사항">
        <p>오늘 오후 2시에 서버 점검이 있습니다.</p>
        <p>이용에 불편을 드려 죄송합니다.</p>
      </Card>

      {/* 다른 컴포넌트 넣기 */}
      <Card title="버튼 모음">
        <ButtonDemo />
      </Card>

      {/* title 없이 사용 */}
      <Card>
        <p>제목 없는 카드입니다.</p>
      </Card>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 5: Props는 읽기 전용 — 직접 수정 금지
// ─────────────────────────────────────────────────────

/**
 * Props는 부모가 내려준 것이므로 자식이 수정해선 안 됩니다.
 * 값을 변경해야 한다면 부모의 state를 바꿔 새 props를 내려줘야 합니다.
 */

// ❌ 잘못된 예 — props를 직접 수정 (React에서 경고 또는 오류 발생)
// function BadExample({ count }) {
//   count = count + 1; // ❌ props 직접 수정 금지!
//   return <p>{count}</p>;
// }

// ✅ 올바른 예 — props를 그대로 읽고, 변환은 새 변수에
export function GoodExample({ price }) {
  // props는 읽기만 하고, 변환된 값은 새 변수에 저장합니다
  const formattedPrice = price.toLocaleString('ko-KR');

  return (
    <div>
      <p>원래 가격: {price}원</p>
      <p>표시 가격: {formattedPrice}원</p>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
import { PageLayout, UserList, ButtonDemo, CardDemo, GoodExample } from './02_component';

function App() {
  return (
    <div>
      <PageLayout />
      <UserList />
      <ButtonDemo />
      <CardDemo />
      <GoodExample price={12000} />
    </div>
  );
}
*/
