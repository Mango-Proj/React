# ch05. 개발 도구 & 생태계 라이브러리

> **이 챕터에서 배우는 것**
> React 개발을 더 편리하게 만들어주는 개발 도구와,
> 실무에서 자주 쓰이는 주요 라이브러리들을 살펴봅니다.

---

## 목차

1. [React Developer Tools — 앱 내부를 들여다보는 현미경](#1-react-developer-tools)
2. [React Hook Form — 폼 관리의 정석](#2-react-hook-form)
3. [SWR — 스마트한 데이터 페칭](#3-swr)
4. [UI 라이브러리 — Material-UI & Chakra UI](#4-ui-라이브러리)
5. [Motion — 손쉬운 애니메이션](#5-motion)
6. [Storybook — 컴포넌트 카탈로그](#6-storybook)
7. [Vitest — 빠른 테스트 실행기](#7-vitest)

---

## 1. React Developer Tools

### 비유 — 병원의 MRI 기계 🏥

일반 병원 검사(브라우저 기본 개발자 도구)로는 뼈대(HTML)만 보입니다. **MRI(React DevTools)** 를 찍으면 React 컴포넌트 구조, 상태(state), props가 어떻게 흐르는지 속속들이 볼 수 있습니다.

### 설치

Chrome 웹스토어에서 **"React Developer Tools"** 를 검색해 설치합니다.
(Edge, Firefox, Safari도 동일한 방식으로 지원합니다.)

설치 후 React 앱에서 F12 → **Components / Profiler** 탭이 새로 생깁니다.

### Components 탭

| 기능 | 설명 |
|------|------|
| **컴포넌트 트리** | 화면 왼쪽에 앱의 컴포넌트 계층 구조가 나타납니다 |
| **Props / State / Hooks 확인** | 컴포넌트 클릭 시 오른쪽에 현재 값이 표시됩니다 |
| **실시간 추적** | 버튼을 클릭하거나 입력하면 변화가 바로 반영됩니다 |
| **요소 선택** | 선택 아이콘 클릭 후 화면의 요소를 클릭하면 해당 컴포넌트로 바로 이동합니다 |
| **소스 코드 이동** | `</>` 아이콘으로 해당 컴포넌트의 소스 파일로 이동합니다 |

### Profiler 탭

| 기능 | 설명 |
|------|------|
| **Start Profiling** | 렌더링 동작 기록 시작 |
| **Stop Profiling** | 기록 종료 후 결과를 그래프로 확인 |
| **렌더링 시간 확인** | 어떤 컴포넌트가 얼마나 오래 걸렸는지 색상으로 표시 |
| **불필요한 리렌더링 탐지** | 변경이 없는데 렌더링된 컴포넌트를 찾아냄 |

---

## 2. React Hook Form

### 비유 — 자동 서류 처리 시스템 📋

일반 React 폼은 매 입력마다 `useState`를 업데이트해서 화면을 다시 그립니다. 글자를 10개 입력하면 10번 리렌더링됩니다.

**React Hook Form**은 입력값을 "비제어 방식"으로 관리해서 **제출할 때만** 유효성 검사를 하고, 불필요한 리렌더링을 없앱니다.

### 설치

```bash
npm install react-hook-form
```

### 기본 사용법

```jsx
import { useForm } from 'react-hook-form';

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email', {
          required: '이메일을 입력하세요',
          pattern: { value: /\S+@\S+\.\S+/, message: '올바른 이메일 형식이 아닙니다' }
        })}
      />
      {errors.email && <p>{errors.email.message}</p>}
      <button type="submit">가입</button>
    </form>
  );
}
```

### useState 폼 vs React Hook Form 비교

| 구분 | useState 방식 | React Hook Form |
|------|--------------|-----------------|
| 리렌더링 | 입력마다 발생 | 최소화됨 |
| 유효성 검사 코드 | 직접 작성 | register 옵션으로 간단하게 |
| 에러 메시지 | 별도 state 관리 | formState.errors 자동 제공 |
| 코드 길이 | 길어짐 | 짧아짐 |

---

## 3. SWR

### 비유 — 스마트 냉장고 알림 🥛

우유가 없어지면 자동으로 주문해주는 냉장고처럼, **SWR**은 데이터가 필요한 순간에 자동으로 가져오고, 오래된 데이터가 있으면 자동으로 갱신합니다. 탭을 전환했다 돌아오면? 자동으로 최신 데이터로 업데이트합니다.

SWR = **stale-while-revalidate** (오래된 데이터를 보여주면서 뒤에서 갱신)

### 설치

```bash
npm install swr
```

### useEffect vs useSWR 비교

```jsx
// ❌ useEffect 방식 — 매번 직접 구현
function PostList() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  // ...
}

// ✅ SWR 방식 — 한 줄로 해결
function PostList() {
  const { data, error, isLoading } = useSWR('/api/posts', fetcher);
  // ...
}
```

### 주요 기능

| 기능 | 설명 |
|------|------|
| **자동 캐싱** | 같은 키는 한 번만 요청, 이후 캐시 반환 |
| **포커스 재검증** | 탭을 다시 활성화하면 자동으로 최신 데이터 확인 |
| **polling** | `refreshInterval` 옵션으로 주기적 갱신 |
| **에러 재시도** | 실패 시 자동으로 재시도 |
| **낙관적 업데이트** | `mutate`로 서버 응답 전에 UI를 미리 업데이트 |

---

## 4. UI 라이브러리

### Material-UI (MUI)

### 비유 — 이케아 가구 🪑

설계 도면 없이 이케아 카탈로그에서 고르면 됩니다. Google의 Material Design 기준을 따르는 완성된 컴포넌트들이 준비되어 있습니다.

```bash
npm install @mui/material @emotion/react @emotion/styled
```

```jsx
import { Button, TextField, Card } from '@mui/material';

function LoginForm() {
  return (
    <Card sx={{ p: 3 }}>
      <TextField label="이메일" variant="outlined" fullWidth />
      <Button variant="contained" color="primary" fullWidth>
        로그인
      </Button>
    </Card>
  );
}
```

**적합한 상황**: 기업용 대시보드, 관리자 페이지, 빠른 프로토타이핑

---

### Chakra UI

### 비유 — 레고 블록 🧱

기본 블록(컴포넌트)을 조립하되, `color`, `p`, `mt` 같은 **style props**로 즉석에서 커스터마이징합니다. 접근성(ARIA)도 자동으로 챙겨줍니다.

```bash
npm install @chakra-ui/react
```

```jsx
import { Box, Button, Input } from '@chakra-ui/react';

function SearchBar() {
  return (
    <Box display="flex" gap={2} p={4} bg="gray.50" borderRadius="md">
      <Input placeholder="검색..." borderColor="purple.300" />
      <Button colorScheme="purple">검색</Button>
    </Box>
  );
}
```

**적합한 상황**: 접근성이 중요한 서비스, 빠른 UI 개발

### MUI vs Chakra UI 비교

| 구분 | Material-UI | Chakra UI |
|------|-------------|-----------|
| 디자인 시스템 | Google Material Design | 자유로운 커스텀 |
| 스타일링 방식 | sx prop / styled | style props |
| 접근성 | 보통 | 매우 강조 |
| 학습 난이도 | 보통 | 낮음 |
| 적합한 용도 | 기업용 앱 | 빠른 개발 |

---

## 5. Motion

### 비유 — 파워포인트 애니메이션 효과 ✨

파워포인트에서 "슬라이드 인" 효과를 주듯, `motion.div`로 감싸면 `initial → animate → exit` 세 상태만 설정해도 부드러운 애니메이션이 완성됩니다.

### 설치

```bash
npm install motion
```

### 기본 사용법

```jsx
import { motion } from 'motion/react';

// animate: 최종 상태
// initial: 시작 상태
// exit: 사라질 때
// transition: 애니메이션 설정

function FadeInCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}  // 시작: 투명하고 아래에 있음
      animate={{ opacity: 1, y: 0 }}   // 끝: 보이고 제자리
      transition={{ duration: 0.3 }}
    >
      카드 내용
    </motion.div>
  );
}
```

### 주요 기능

| 기능 | 설명 |
|------|------|
| `initial/animate` | 컴포넌트 등장 애니메이션 |
| `whileHover/whileTap` | 마우스 오버/클릭 효과 |
| `exit` + `AnimatePresence` | 컴포넌트 사라질 때 애니메이션 |
| `variants` | 애니메이션 세트를 미리 정의해 재사용 |

---

## 6. Storybook

### 비유 — 자동차 부품 전시관 🚗

자동차 전체(앱)를 만들기 전에, **부품(컴포넌트) 하나하나를 전시관**에 진열해서 따로 테스트합니다. 디자이너와 개발자가 같은 카탈로그를 보며 소통할 수 있습니다.

### 설치 및 실행

```bash
npx storybook@latest init  # 프로젝트에 Storybook 초기화
npm run storybook           # 별도 브라우저 탭에서 컴포넌트 카탈로그 실행
```

### Story 파일 작성법

```jsx
// Button.stories.jsx
import Button from './Button';

// 메타 정보
export default {
  title: 'Components/Button',
  component: Button,
};

// 각 Story = 컴포넌트의 한 가지 상태
export const Primary = {
  args: { label: '확인', variant: 'primary' },
};

export const Disabled = {
  args: { label: '비활성', disabled: true },
};
```

### 장점과 단점

| 장점 | 단점 |
|------|------|
| 컴포넌트 독립 개발/테스트 | 초기 설정 시간 필요 |
| 디자이너 협업 용이 | 유지보수 비용 발생 |
| 자동 문서화 | 소규모 프로젝트엔 과할 수 있음 |

---

## 7. Vitest

### 비유 — 품질 검수 자동화 ✅

공장에서 제품이 나올 때마다 사람이 직접 검수하면 느리고 실수가 납니다. **Vitest**는 코드를 저장할 때마다 자동으로 "이 함수가 제대로 동작하는가?"를 검사해줍니다.

### 설치

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

`vite.config.js` 설정:
```js
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
});
```

### 테스트 작성법

```jsx
// Button.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

test('버튼 클릭 시 onClick이 호출된다', async () => {
  const handleClick = vi.fn(); // 가짜 함수
  render(<Button onClick={handleClick}>클릭</Button>);

  await userEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### 자주 쓰는 함수

| 함수 | 역할 |
|------|------|
| `render(<컴포넌트 />)` | 가상 DOM에 컴포넌트 렌더링 |
| `screen.getByText('텍스트')` | 텍스트로 요소 찾기 |
| `screen.getByRole('button')` | 역할(role)로 요소 찾기 |
| `userEvent.click(요소)` | 클릭 이벤트 시뮬레이션 |
| `expect(값).toBe(기댓값)` | 값이 맞는지 단언 |
| `vi.fn()` | 가짜 함수 (호출 여부 추적) |

---

## 키워드 정리

| 키워드 | 한 줄 요약 |
|--------|-----------|
| React DevTools | React 앱의 컴포넌트 트리와 상태를 브라우저에서 시각화 |
| Components 탭 | 컴포넌트 구조, props, state, hooks를 실시간 확인 |
| Profiler 탭 | 렌더링 성능 분석, 불필요한 리렌더링 탐지 |
| React Hook Form | 비제어 방식으로 폼을 관리해 리렌더링 최소화 |
| `register` | 입력 필드를 RHF에 등록하고 유효성 규칙을 지정하는 함수 |
| `handleSubmit` | 폼 제출 시 유효성 검사 후 콜백을 실행하는 함수 |
| SWR | 캐시 + 자동 갱신이 되는 데이터 페칭 훅 라이브러리 |
| Material-UI | Google Material Design 기반 UI 컴포넌트 라이브러리 |
| Chakra UI | 접근성 강조 + style props 기반 UI 라이브러리 |
| Motion | 선언형으로 애니메이션을 정의하는 라이브러리 |
| `motion.div` | HTML 요소에 애니메이션 기능을 추가한 Motion 컴포넌트 |
| Storybook | 컴포넌트를 독립적으로 개발/시각화하는 도구 |
| Story | Storybook에서 컴포넌트의 한 가지 상태를 표현하는 단위 |
| Vitest | Vite 기반 빠른 테스트 러너 |
| `render` | Testing Library에서 컴포넌트를 가상 DOM에 렌더링 |
| `screen` | 렌더링된 DOM에서 요소를 찾는 Testing Library 객체 |

---

## 예제 파일 목록

| 파일 | 다루는 내용 |
|------|------------|
| `01_devtools_guide.jsx` | DevTools 탐색용 예제 앱 (Components/Profiler 실습) |
| `02_react_hook_form.jsx` | useState 폼 vs RHF 비교, 유효성 검사, 중첩 필드 |
| `03_swr.jsx` | useEffect vs SWR 비교, 캐싱/재검증 시뮬레이션 |
| `04_ui_libraries.jsx` | MUI/Chakra UI 코드 패턴 소개 + 순수 CSS 구현 비교 |
| `05_motion.jsx` | 등장/퇴장 애니메이션, 제스처, 리스트 스태거 |
| `06_storybook_vitest.jsx` | Story 패턴, Vitest 테스트 작성 방법 가이드 |
