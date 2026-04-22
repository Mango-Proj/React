/**
 * 04_ui_libraries.jsx — Material-UI & Chakra UI
 * ================================================
 * ⚠️ 설치 필요:
 *   MUI:    npm install @mui/material @emotion/react @emotion/styled
 *   Chakra: npm install @chakra-ui/react
 *
 * UI 라이브러리를 사용하면 디자인 시스템이 적용된 컴포넌트를
 * 코드 몇 줄로 바로 사용할 수 있습니다.
 *
 * 이 파일은 각 라이브러리의 코드 패턴을 소개하고,
 * 설치 없이도 바로 실행되는 순수 CSS 구현을 함께 제공합니다.
 *
 * 1. Material-UI 코드 패턴 소개
 * 2. Chakra UI 코드 패턴 소개
 * 3. 순수 CSS로 동일한 UI 구현 (설치 불필요)
 * 4. 라이브러리 선택 가이드
 */

import { useState } from 'react';

// ─────────────────────────────────────────────
// 예제 1: Material-UI 코드 패턴
// ─────────────────────────────────────────────

/**
 * 아래는 실제 MUI 코드입니다 (npm install @mui/material 필요).
 * 현재 파일에서는 주석으로 처리하고, 동일한 UI를 순수 CSS로 구현했습니다.
 */

/*
// MUI 실제 코드 예시
import {
  Button, TextField, Card, CardContent,
  Chip, Avatar, Typography, Box,
  ThemeProvider, createTheme
} from '@mui/material';

// 테마 설정 — 앱 전체에 통일된 스타일 적용
const theme = createTheme({
  palette: {
    primary: { main: '#6366f1' },
    secondary: { main: '#f59e0b' },
  },
  typography: {
    fontFamily: '"Pretendard", sans-serif',
  },
});

function MUIProductCard({ product }) {
  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ maxWidth: 345, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>{product.name}</Typography>
          <Typography variant="body2" color="text.secondary">{product.desc}</Typography>
          <Box display="flex" gap={1} mt={2}>
            <Chip label={product.category} color="primary" size="small" />
            <Chip label={`${product.price.toLocaleString()}원`} variant="outlined" size="small" />
          </Box>
          <Button variant="contained" fullWidth sx={{ mt: 2 }}>
            장바구니 담기
          </Button>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}

function MUILoginForm() {
  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
      <TextField label="이메일" type="email" variant="outlined" fullWidth required />
      <TextField label="비밀번호" type="password" variant="outlined" fullWidth required />
      <Button type="submit" variant="contained" size="large" fullWidth>
        로그인
      </Button>
      <Button variant="text" color="secondary">비밀번호 찾기</Button>
    </Box>
  );
}
*/

// MUI 스타일을 순수 CSS로 재현
export function MUIStyleDemo() {
  const [activeTab, setActiveTab] = useState('card');

  const cardCode = `// MUI 카드 컴포넌트
import { Card, CardContent, Chip, Button, Typography } from '@mui/material';

function ProductCard({ product }) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
        <Box display="flex" gap={1} mt={2}>
          <Chip label={product.category} color="primary" size="small" />
        </Box>
        <Button variant="contained" fullWidth sx={{ mt: 2 }}>
          장바구니 담기
        </Button>
      </CardContent>
    </Card>
  );
}`;

  const formCode = `// MUI 입력 폼
import { TextField, Button, Box } from '@mui/material';

function LoginForm() {
  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="이메일"
        type="email"
        variant="outlined"
        fullWidth
        required
      />
      <TextField
        label="비밀번호"
        type="password"
        variant="outlined"
        fullWidth
        required
      />
      <Button type="submit" variant="contained" size="large" fullWidth>
        로그인
      </Button>
    </Box>
  );
}`;

  const themeCode = `// MUI 테마 커스터마이징
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#6366f1' },   // 주 색상
    secondary: { main: '#f59e0b' }, // 보조 색상
  },
  typography: {
    fontFamily: '"Pretendard", sans-serif',
    h6: { fontWeight: 700 },
  },
  shape: {
    borderRadius: 12, // 전체 컴포넌트 모서리 둥글기
  },
});

// App 최상단에서 감싸면 모든 MUI 컴포넌트에 적용됩니다
const App = () => (
  <ThemeProvider theme={theme}>
    <MyApp />
  </ThemeProvider>
);`;

  const tabs = [
    { id: 'card', label: '카드', code: cardCode },
    { id: 'form', label: '폼', code: formCode },
    { id: 'theme', label: '테마', code: themeCode },
  ];

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{ padding: '5px 12px', background: activeTab === t.id ? '#1976d2' : '#f3f4f6', color: activeTab === t.id ? 'white' : '#374151', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.82rem' }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '12px', borderRadius: '8px', fontSize: '0.74rem', overflow: 'auto', maxHeight: '220px', lineHeight: '1.6' }}>
        {tabs.find(t => t.id === activeTab)?.code}
      </pre>
      <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '8px' }}>
        💡 <code>sx</code> prop: MUI의 인라인 스타일 시스템 (CSS-in-JS)
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// 예제 2: Chakra UI 코드 패턴
// ─────────────────────────────────────────────

/*
// Chakra UI 실제 코드 예시
import { ChakraProvider, Box, Button, Input, Badge, Stack, Text, Flex } from '@chakra-ui/react';

function ChakraSearchBar() {
  return (
    <ChakraProvider>  // 앱 최상단에서 한 번만 감싸면 됩니다
      <Flex gap={2} p={4} bg="purple.50" borderRadius="xl">
        <Input
          placeholder="검색..."
          borderColor="purple.300"
          _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px purple' }}
        />
        <Button colorScheme="purple">검색</Button>
      </Flex>
    </ChakraProvider>
  );
}

function ChakraUserCard({ user }) {
  return (
    <Box p={4} borderWidth={1} borderRadius="xl" _hover={{ shadow: 'md' }}>
      <Flex align="center" gap={3} mb={3}>
        <Avatar name={user.name} size="sm" />
        <Box>
          <Text fontWeight="bold">{user.name}</Text>
          <Text fontSize="sm" color="gray.500">{user.email}</Text>
        </Box>
      </Flex>
      <Stack direction="row" spacing={2}>
        <Badge colorScheme="purple">팔로워 {user.followers}</Badge>
        <Badge colorScheme="green" variant="outline">팔로잉 {user.following}</Badge>
      </Stack>
    </Box>
  );
}
*/

export function ChakraStyleDemo() {
  const [activeTab, setActiveTab] = useState('basic');

  const basicCode = `// Chakra UI 기본 스타일 props
import { Box, Flex, Text, Button } from '@chakra-ui/react';

// CSS 속성을 축약형 props로 바로 사용
// p={4}   → padding: 1rem
// mt={2}  → margin-top: 0.5rem
// bg=     → background-color
// color=  → color

function Hero() {
  return (
    <Box
      p={8}           // padding
      bg="purple.50"  // background
      borderRadius="2xl"
      textAlign="center"
    >
      <Text fontSize="2xl" fontWeight="bold" color="purple.800">
        환영합니다 👋
      </Text>
      <Text mt={2} color="gray.600">
        Chakra UI로 만든 히어로 섹션입니다
      </Text>
      <Flex justify="center" gap={3} mt={6}>
        <Button colorScheme="purple" size="lg">시작하기</Button>
        <Button variant="outline" colorScheme="purple" size="lg">더 알아보기</Button>
      </Flex>
    </Box>
  );
}`;

  const accessibilityCode = `// Chakra UI 접근성 (ARIA) 자동 처리
import { Modal, ModalOverlay, ModalContent, ModalHeader,
         ModalBody, ModalCloseButton, Button, useDisclosure } from '@chakra-ui/react';

function AccessibleModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>모달 열기</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>모달 제목</ModalHeader>
          {/* ModalCloseButton: aria-label, 키보드 지원 자동 처리 */}
          <ModalCloseButton />
          <ModalBody>
            접근성이 자동으로 처리됩니다.
            ESC 키, 포커스 트랩, aria 속성이 모두 내장되어 있습니다.
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}`;

  const responsiveCode = `// Chakra UI 반응형 디자인
import { Box, SimpleGrid, Text } from '@chakra-ui/react';

// 배열로 브레이크포인트별 값을 지정합니다
// [모바일, 태블릿, 데스크톱]
function ResponsiveGrid() {
  return (
    <SimpleGrid
      columns={[1, 2, 3]}  // 모바일:1열 / 태블릿:2열 / PC:3열
      spacing={[4, 6, 8]}  // 간격도 반응형
    >
      <Box p={[3, 4, 5]} bg="purple.100" borderRadius="lg">
        <Text fontSize={["sm", "md", "lg"]}>카드 1</Text>
      </Box>
      {/* ... */}
    </SimpleGrid>
  );
}`;

  const tabs = [
    { id: 'basic', label: 'style props', code: basicCode },
    { id: 'accessibility', label: '접근성', code: accessibilityCode },
    { id: 'responsive', label: '반응형', code: responsiveCode },
  ];

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{ padding: '5px 12px', background: activeTab === t.id ? '#7c3aed' : '#f3f4f6', color: activeTab === t.id ? 'white' : '#374151', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.82rem' }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '12px', borderRadius: '8px', fontSize: '0.74rem', overflow: 'auto', maxHeight: '220px', lineHeight: '1.6' }}>
        {tabs.find(t => t.id === activeTab)?.code}
      </pre>
      <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '8px' }}>
        💡 style props: CSS를 JSX 속성으로 직접 작성합니다. <code>p=&#123;4&#125;</code> = padding: 1rem
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// 예제 3: 순수 CSS로 구현한 동일한 UI (설치 불필요)
// ─────────────────────────────────────────────

export function PureCSSDemoCard() {
  const [liked, setLiked] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const products = [
    { id: 1, name: '무선 이어폰', price: 89_000, category: '음향', rating: 4.5, reviews: 128 },
    { id: 2, name: '스마트 워치', price: 249_000, category: '웨어러블', rating: 4.2, reviews: 89 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {products.map(p => (
        <div
          key={p.id}
          style={{
            padding: '16px',
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          {/* 상단 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <span style={{ fontSize: '0.7rem', background: '#eef2ff', color: '#4f46e5', padding: '2px 8px', borderRadius: '999px', fontWeight: '600' }}>
                {p.category}
              </span>
            </div>
            <button
              onClick={() => setLiked(l => !l)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
            >
              {liked ? '❤️' : '🤍'}
            </button>
          </div>
          <p style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>{p.name}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <span style={{ color: '#f59e0b', fontSize: '0.85rem' }}>{'★'.repeat(Math.floor(p.rating))}</span>
            <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>{p.rating} ({p.reviews}개 리뷰)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#6366f1' }}>{p.price.toLocaleString()}원</span>
            <button
              onClick={() => setCartCount(c => c + 1)}
              style={{ padding: '7px 16px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
            >
              담기 {cartCount > 0 && `(${cartCount})`}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// 예제 4: 라이브러리 선택 가이드
// ─────────────────────────────────────────────

export function LibrarySelectionGuide() {
  const scenarios = [
    {
      scenario: '기업용 대시보드/관리자 페이지',
      recommended: 'Material-UI',
      reason: 'Google Material Design을 따르는 풍부한 데이터 테이블, 차트, 폼 컴포넌트',
      color: '#1976d2',
    },
    {
      scenario: '접근성이 중요한 서비스 (공공기관, 장애인 지원)',
      recommended: 'Chakra UI',
      reason: 'ARIA 자동 처리, 키보드 내비게이션, 포커스 관리가 기본 내장',
      color: '#7c3aed',
    },
    {
      scenario: '빠른 프로토타이핑 / 스타트업',
      recommended: 'Chakra UI 또는 MUI',
      reason: '완성된 컴포넌트로 빠른 개발. Chakra는 코드가 더 직관적',
      color: '#059669',
    },
    {
      scenario: '완전한 커스텀 디자인이 필요한 경우',
      recommended: 'Tailwind CSS 또는 순수 CSS',
      reason: 'UI 라이브러리는 기본 스타일 덮어쓰기가 번거로울 수 있음',
      color: '#dc2626',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {scenarios.map((s, i) => (
        <div
          key={i}
          style={{ padding: '12px 14px', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', borderLeft: `4px solid ${s.color}` }}
        >
          <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '4px' }}>📌 {s.scenario}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
            <span style={{ fontWeight: '700', color: s.color, fontSize: '0.9rem' }}>→ {s.recommended}</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{s.reason}</p>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// 전체 데모
// ─────────────────────────────────────────────
export default function UILibrariesDemo() {
  const sectionStyle = {
    marginBottom: '24px',
    padding: '16px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  };

  return (
    <div style={{ maxWidth: '620px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>UI 라이브러리</h1>
      <div style={{ padding: '8px 12px', background: '#fef9c3', borderRadius: '6px', marginBottom: '20px', fontSize: '0.82rem', color: '#92400e' }}>
        ⚠️ 코드 예시는 주석 형태입니다. 실제 사용 시 위 설치 명령어를 먼저 실행하세요.
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>① Material-UI 코드 패턴</h2>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
          Google Material Design 기반. sx prop으로 스타일을 인라인으로 지정합니다.
        </p>
        <MUIStyleDemo />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>② Chakra UI 코드 패턴</h2>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
          style props로 직관적인 스타일링. 접근성이 자동으로 처리됩니다.
        </p>
        <ChakraStyleDemo />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>③ 순수 CSS 구현 (설치 불필요)</h2>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '10px' }}>
          동일한 UI를 라이브러리 없이 구현한 예제입니다.
        </p>
        <PureCSSDemoCard />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '10px' }}>④ 상황별 라이브러리 선택 가이드</h2>
        <LibrarySelectionGuide />
      </div>
    </div>
  );
}
