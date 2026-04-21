/**
 * 01_component_reuse.jsx — 컴포넌트 재사용과 부모-자식 관계
 * ==========================================================
 * 컴포넌트를 export하여 재사용하고,
 * 부모 컴포넌트가 자식 컴포넌트에게 props로 데이터를 전달하는 패턴을 배웁니다.
 *
 * 이 파일은 학습용 예제입니다.
 * Vite + React 프로젝트의 App.jsx에서 import하여 확인하세요.
 */


// ─────────────────────────────────────────────────────
// 예제 1: 공통 UI 컴포넌트 재사용
// ─────────────────────────────────────────────────────

/**
 * 헤더, 푸터, 내비게이션처럼 여러 페이지에서 공통으로 쓰이는 컴포넌트입니다.
 * export로 내보내면 다른 파일에서 import하여 재사용할 수 있습니다.
 */

export function Header() {
  return (
    <header style={{
      background: '#7c3aed',
      color: '#fff',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <h1 style={{ margin: 0, fontSize: '1.2rem' }}>My Website</h1>
      <span style={{ fontSize: '0.85rem' }}>로그인</span>
    </header>
  );
}

export function Navigation() {
  const menuItems = ['Home', 'About', 'Contact'];

  return (
    <nav style={{
      background: '#f1f5f9',
      padding: '10px 24px',
      borderBottom: '1px solid #e2e8f0',
    }}>
      <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', margin: 0, padding: 0 }}>
        {menuItems.map(item => (
          <li key={item} style={{ cursor: 'pointer', color: '#7c3aed', fontWeight: 600 }}>
            {item}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer style={{
      background: '#1e293b',
      color: '#94a3b8',
      textAlign: 'center',
      padding: '20px',
      marginTop: '40px',
      fontSize: '0.85rem',
    }}>
      <p style={{ margin: 0 }}>© 2026 My Website. All rights reserved.</p>
    </footer>
  );
}

/**
 * 공통 컴포넌트를 조합해 페이지를 만드는 방법입니다.
 * Header, Navigation, Footer를 한 번만 만들어두고
 * Home, About, Contact 어느 페이지에서든 가져다 씁니다.
 */
export function HomePage() {
  return (
    <div>
      <Header />        {/* 어느 페이지에서나 공통으로 사용 */}
      <Navigation />    {/* 어느 페이지에서나 공통으로 사용 */}

      <main style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <h2>홈 페이지</h2>
        <p>공통 컴포넌트(Header, Navigation, Footer)를 조합해 만든 페이지입니다.</p>
        <p>같은 Header를 다른 페이지에서도 그대로 사용할 수 있습니다.</p>
      </main>

      <Footer />        {/* 어느 페이지에서나 공통으로 사용 */}
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: 부모-자식 컴포넌트 관계
// ─────────────────────────────────────────────────────

/**
 * 컴포넌트 트리 구조:
 *
 *   App (최상위 부모)
 *    └── VideoBox (App의 자식, Comments의 부모)
 *          └── Comments (VideoBox의 자식, Comment의 부모)
 *                ├── Comment (text="첫 번째 댓글입니다")
 *                └── Comment (text="두 번째 댓글입니다")
 *
 * 핵심 규칙:
 * - 부모는 자식에게 props로 데이터를 전달할 수 있습니다
 * - 자식은 props를 받아 읽기만 할 수 있습니다 (변경 불가)
 * - 데이터는 위에서 아래로(부모→자식)만 흐릅니다
 */

// 가장 하위 자식 — Comment
// props.text: 부모(Comments)에서 전달받은 댓글 텍스트
function Comment(props) {
  return (
    <div style={{
      padding: '8px 12px',
      background: '#f8fafc',
      borderRadius: '6px',
      marginBottom: '6px',
      fontSize: '0.88rem',
      borderLeft: '3px solid #7c3aed',
    }}>
      {props.text}
    </div>
  );
}

// 중간 컴포넌트 — Comments (VideoBox의 자식, Comment의 부모)
function Comments() {
  return (
    <div style={{ marginTop: '12px' }}>
      <h3 style={{ fontSize: '0.95rem', margin: '0 0 8px' }}>댓글</h3>
      {/* Comment에 text 데이터를 props로 전달합니다 */}
      <Comment text="첫 번째 댓글입니다" />
      <Comment text="두 번째 댓글입니다" />
      <Comment text="세 번째 댓글입니다" />
    </div>
  );
}

// VideoBox — Comments를 포함하는 부모
function VideoBox() {
  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '16px',
      maxWidth: '480px',
    }}>
      <h2 style={{ margin: '0 0 8px' }}>비디오 제목</h2>

      {/* 실제 비디오 대신 플레이스홀더 */}
      <div style={{
        width: '100%',
        height: '200px',
        background: '#1e293b',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
        fontSize: '2rem',
      }}>
        ▶
      </div>

      {/* Comments 컴포넌트를 포함 (자식으로 사용) */}
      <Comments />
    </div>
  );
}

export function YouTubeClonePage() {
  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '20px' }}>YourTube 페이지</h1>
      {/* VideoBox는 App의 자식 컴포넌트 */}
      <VideoBox />

      {/* 컴포넌트 트리 설명 */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '10px',
        fontSize: '0.85rem',
      }}>
        <p style={{ fontWeight: 700, margin: '0 0 8px' }}>📊 컴포넌트 트리</p>
        <pre style={{ margin: 0, color: '#475569', lineHeight: 1.8 }}>
{`App
 └── VideoBox
       └── Comments
             ├── Comment (첫 번째 댓글)
             ├── Comment (두 번째 댓글)
             └── Comment (세 번째 댓글)`}
        </pre>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: props로 데이터 전달 — 여러 개의 카드 만들기
// ─────────────────────────────────────────────────────

/**
 * 같은 컴포넌트에 다른 props를 전달하면 다른 내용을 표시합니다.
 * 컴포넌트를 "틀"로 생각하고, props를 "내용"으로 채우는 패턴입니다.
 */
function ProductCard({ name, price, category, emoji }) {
  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '16px',
      textAlign: 'center',
      width: '160px',
    }}>
      <p style={{ fontSize: '2.5rem', margin: '0 0 8px' }}>{emoji}</p>
      <h3 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{name}</h3>
      <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '0.8rem' }}>{category}</p>
      <p style={{ margin: 0, fontWeight: 700, color: '#7c3aed' }}>
        {price.toLocaleString('ko-KR')}원
      </p>
    </div>
  );
}

export function ProductListPage() {
  const products = [
    { id: 1, name: '사과',    price: 1500, category: '과일',  emoji: '🍎' },
    { id: 2, name: '바나나',  price: 800,  category: '과일',  emoji: '🍌' },
    { id: 3, name: '당근',    price: 1200, category: '채소',  emoji: '🥕' },
    { id: 4, name: '브로콜리', price: 2000, category: '채소', emoji: '🥦' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h2>상품 목록</h2>
      <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '16px' }}>
        같은 ProductCard 컴포넌트에 다른 props를 전달해 다른 내용을 표시합니다.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {products.map(product => (
          // key: 리스트 렌더링 시 각 항목을 구분하는 고유값
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            category={product.category}
            emoji={product.emoji}
          />
        ))}
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
import { HomePage, YouTubeClonePage, ProductListPage } from './01_component_reuse';

function App() {
  return (
    <div>
      <HomePage />
      <YouTubeClonePage />
      <ProductListPage />
    </div>
  );
}
*/
