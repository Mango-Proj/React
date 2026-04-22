# ch06. 스타일링 심화 — Tailwind CSS & 컴포넌트 라이브러리

> **이 챕터에서 배우는 것**
> 현대 React 프로젝트에서 가장 많이 쓰이는 스타일링 방식인 Tailwind CSS와,
> 그 위에서 동작하는 컴포넌트 라이브러리(Radix UI, shadcn/ui)를 배웁니다.

---

## 목차

1. [Tailwind CSS — 클래스 하나로 스타일 끝내기](#1-tailwind-css)
2. [Radix UI — 기능만 있는 Headless 컴포넌트](#2-radix-ui)
3. [shadcn/ui — 내 코드로 가져오는 컴포넌트](#3-shadcnui)
4. [세 가지 접근법 비교](#4-세-가지-접근법-비교)

---

## 1. Tailwind CSS

### 비유 — 옷 입기 방식의 차이 👔

**기존 CSS 방식** (맞춤 양복):
> 옷가게(CSS 파일)에서 치수를 재고, 주문서(className)를 쓰고, 완성된 옷을 픽업합니다.
> 새 스타일이 필요할 때마다 주문서를 새로 써야 합니다.

**Tailwind 방식** (유니클로 조합):
> 미리 만들어진 기본 아이템들(유틸리티 클래스)을 그자리에서 골라 입힙니다.
> `bg-blue-500 text-white px-4 py-2` — 파란 배경, 흰 글자, 좌우 패딩 4, 상하 패딩 2.

### 일반 CSS와 비교

**기존 방식** — JSX 파일과 CSS 파일을 따로 작성

```jsx
// Button.jsx
const Button = ({ text }) => (
  <div className="primary-button">{text}</div>
);
```
```css
/* Button.css */
.primary-button {
  width: 100%;
  background-color: #0ea5e9;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}
.primary-button:hover {
  background-color: #0369a1;
}
```

**Tailwind 방식** — JSX 파일 하나로 끝

```jsx
// Button.jsx
const Button = () => (
  <button className="w-full bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-700">
    Click Me
  </button>
);
```

### 설치 방법

```bash
# 1. Vite 프로젝트 생성
npm create vite@latest my-app -- --template react

# 2. Tailwind 설치
npm install tailwindcss @tailwindcss/vite
```

**`vite.config.js`** 에 플러그인 추가:
```js
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

**`src/index.css`** 에 지시문 추가:
```css
@import 'tailwindcss';
```

### 자주 쓰는 클래스 패턴

| 종류 | 클래스 예시 | CSS 의미 |
|------|------------|---------|
| **배경색** | `bg-blue-500` | background-color: #3b82f6 |
| **글자색** | `text-white` | color: white |
| **패딩** | `px-4 py-2` | padding: 0.5rem 1rem |
| **마진** | `mt-4 mb-2` | margin-top/bottom |
| **너비** | `w-full w-1/2` | width: 100%, 50% |
| **높이** | `h-48 h-screen` | height: 12rem, 100vh |
| **모서리 둥글기** | `rounded rounded-lg` | border-radius |
| **그림자** | `shadow shadow-md shadow-xl` | box-shadow |
| **Flexbox** | `flex items-center justify-between` | flex 레이아웃 |
| **Grid** | `grid grid-cols-3 gap-4` | 3열 그리드 |
| **호버** | `hover:bg-blue-700` | :hover 상태 |
| **반응형** | `md:text-xl lg:text-2xl` | 미디어 쿼리 |
| **포커스** | `focus:outline-none focus:ring-2` | :focus 상태 |
| **다크 모드** | `dark:bg-gray-800` | prefers-color-scheme |

### 색상 강도

```
blue-50  blue-100  blue-200  blue-300  blue-400
  연한 ←─────────────────────────────────→ 진한
blue-500  blue-600  blue-700  blue-800  blue-900
```

숫자가 클수록 진한 색입니다. 50은 거의 흰색, 950은 거의 검정입니다.

### 추천 VS Code 확장

**Tailwind CSS IntelliSense** — 클래스명 자동완성, 색상 미리보기, hover 시 실제 CSS 값 표시

---

## 2. Radix UI

### 비유 — 레고 기본 블록 🧱

레고의 기본 조각(기둥, 판, 연결 부품)은 모양은 있지만 색이 없습니다. **Radix UI**는 이런 기본 조각 같은 **Headless UI 라이브러리**입니다.

- **Headless = 기능(동작)만 있고, 디자인(스타일)은 없는 상태**
- Dialog(모달)의 "열기/닫기/포커스 트랩/ESC 키" 동작은 제공하지만, 생김새는 직접 결정합니다

### Headless가 왜 좋은가?

```
일반 UI 라이브러리:       기능 + 고정된 스타일
                         → 스타일 변경이 어려움

Radix UI (Headless):     기능만
                         → 스타일은 Tailwind, CSS Modules 등 원하는 방식으로
```

### 설치

```bash
npm install radix-ui@latest
npm install @radix-ui/themes  # 기본 테마가 필요한 경우
```

### themes 컴포넌트 사용 (기본 스타일 포함)

```jsx
// main.jsx
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

<Theme>
  <App />
</Theme>
```

```jsx
// 사용 예시
import { Button } from '@radix-ui/themes';

<Button color="blue" size="3" radius="small">클릭</Button>
```

### primitive 컴포넌트 사용 (스타일 없음 → Tailwind로 직접 스타일링)

```jsx
import * as Dialog from '@radix-ui/react-dialog';

<Dialog.Root>
  <Dialog.Trigger asChild>
    <button className="bg-blue-500 text-white px-4 py-2 rounded">
      모달 열기
    </button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl w-96">
      <Dialog.Title className="text-xl font-bold mb-2">제목</Dialog.Title>
      <Dialog.Description>설명 내용</Dialog.Description>
      <Dialog.Close asChild>
        <button className="mt-4 px-4 py-2 bg-gray-100 rounded">닫기</button>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

### themes vs primitive 비교

| 구분 | `@radix-ui/themes` | primitive (`@radix-ui/react-*`) |
|------|-------------------|--------------------------------|
| 스타일 | 기본 제공 | 없음 (직접 스타일링) |
| 사용 난이도 | 쉬움 | 보통 |
| 커스터마이징 | 제한적 | 완전히 자유로움 |
| 추천 상황 | 빠른 프로토타이핑 | 디자인 시스템 구축 |

---

## 3. shadcn/ui

### 비유 — 레시피 카드 📋

Material-UI나 Chakra UI는 완성된 요리를 배달해줍니다. **shadcn/ui**는 레시피 카드를 줍니다.

- 코드가 **내 프로젝트 폴더 안에 생성**됩니다 (`src/components/ui/button.jsx`)
- 생성된 코드를 **마음대로 수정**할 수 있습니다
- Radix UI(기능) + Tailwind CSS(스타일)의 조합으로 만들어졌습니다

### 설치 과정

```bash
# 1. Tailwind CSS 먼저 설치
npm install tailwindcss @tailwindcss/vite

# 2. jsconfig.json에 경로 별칭 설정
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}

# 3. vite.config.js에 별칭 추가
import path from 'path';
// resolve: { alias: { '@': path.resolve(__dirname, './src') } }

# 4. shadcn/ui 초기화
npx shadcn@latest init

# 5. 필요한 컴포넌트만 골라서 추가
npx shadcn@latest add button
npx shadcn@latest add accordion
npx shadcn@latest add dialog
```

### 컴포넌트 사용 예시

```jsx
// npx shadcn@latest add accordion 후 자동 생성된 코드를 사용
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

export function FAQSection() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="q1">
        <AccordionTrigger>배송은 얼마나 걸리나요?</AccordionTrigger>
        <AccordionContent>주문 후 2~3 영업일 내 배송됩니다.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="q2">
        <AccordionTrigger>교환/반품은 가능한가요?</AccordionTrigger>
        <AccordionContent>구매 후 7일 이내 가능합니다.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

---

## 4. 세 가지 접근법 비교

### 스타일링 방식 스택

```
shadcn/ui
    └─ Radix UI (기능/접근성)
        + Tailwind CSS (스타일)

Radix UI themes
    └─ Radix UI (기능) + 자체 스타일

Tailwind CSS 단독
    └─ 유틸리티 클래스로 직접 구현
```

### 상황별 선택 가이드

| 상황 | 추천 | 이유 |
|------|------|------|
| 빠른 프로토타입 | Radix themes 또는 shadcn/ui | 완성된 컴포넌트를 즉시 사용 |
| 완전한 커스텀 디자인 | Tailwind CSS + Radix primitive | 디자인 자유도 최대 |
| 팀 협업 / 디자인 시스템 | shadcn/ui | 코드가 프로젝트 안에 있어 수정 용이 |
| 접근성이 중요한 서비스 | Radix UI (모든 방식) | WAI-ARIA 자동 처리 |

---

## 키워드 정리

| 키워드 | 한 줄 요약 |
|--------|-----------|
| Tailwind CSS | 미리 정의된 유틸리티 클래스로 JSX 안에서 바로 스타일링 |
| 유틸리티 클래스 | `bg-blue-500`, `text-white` 처럼 한 가지 CSS 속성에 대응하는 클래스 |
| 반응형 접두사 | `md:`, `lg:` 접두사로 화면 크기별 다른 스타일 적용 |
| 상태 접두사 | `hover:`, `focus:`, `dark:` 등 상태별 스타일 접두사 |
| Headless UI | 기능(동작, 접근성)만 제공하고 스타일은 없는 컴포넌트 |
| Radix UI | Vercel이 만든 Headless UI 라이브러리 |
| primitive | Radix UI의 스타일 없는 기능 전용 컴포넌트 |
| themes | Radix UI의 기본 스타일이 포함된 컴포넌트 |
| shadcn/ui | Radix + Tailwind 조합으로 만든, 코드를 프로젝트에 복사하는 라이브러리 |
| `npx shadcn add` | 컴포넌트 코드를 프로젝트에 직접 생성하는 명령어 |
| 경로 별칭 (`@/`) | `src/` 폴더를 `@/`로 줄여 쓰는 설정 |

---

## 예제 파일 목록

| 파일 | 다루는 내용 |
|------|------------|
| `01_tailwind.jsx` | Tailwind 클래스 패턴 가이드, CSS 방식과 비교, 반응형/다크모드/상태 클래스 |
| `02_radix_ui.jsx` | Headless 개념 설명, Radix 코드 패턴, 순수 구현으로 직접 체험 |
| `03_shadcn_ui.jsx` | shadcn/ui 설치 흐름, 컴포넌트 패턴, 설치 없이 동일 UI 구현 |
