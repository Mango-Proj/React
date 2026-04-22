1️⃣ Tailwind CSS
기존 CSS 방식은 className 충돌과 명명 규칙에 대해 고민해야 합니다.
CSS 파일과 JSX 파일을 오가며 스타일링해야 하는 불편함이 있습니다.
Tailwind CSS를 사용하면 간결하고 직관적인 클래스명으로 스타일을 적용할 수 있습니다.


2️⃣ 일반 CSS와의 차이 알아보기
기존 방식은 JSX와 CSS 파일을 각각 작성해야 했습니다.
const Button = ({ text }) => {
  return <div className="primary-button">{text}</div>;
};
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
Tailwind CSS를 사용하면 JSX 파일 안에서 바로 스타일을 작성할 수 있습니다.
const Button = () => {
  return (
    <button className="w-full bg-sky-500 text-white px-4 py-2 rounded-sm hover:bg-sky-700">
      Click Me
    </button>
  );
};


3️⃣ Tailwind CSS 설치하기
Vite 프로젝트를 생성합니다.
npm create vite@latest [폴더이름] -- --template react


프로젝트 루트에서 Tailwind CSS를 설치합니다.
npm install tailwindcss @tailwindcss/vite


vite.config.js 파일에서 플러그인을 추가합니다.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});


src/index.css 파일에 Tailwind 지시문을 추가합니다.
@import 'tailwindcss';


4️⃣ 기본 클래스 속성 알아보기
const Card = () => {
  return (
    <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden m-4">
      <img className="w-full h-48 object-cover" src="https://picsum.photos/200/300?random=1" alt="Random" />
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Card Title</h2>
        <p className="text-gray-600 text-sm mb-4">This is a simple card component built with Tailwind CSS.</p>
        <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Learn More
        </button>
      </div>
    </div>
  );
};
‘max-w-sm’은 최대 너비를 small로 제한합니다.
‘shadow-md’는 적당한 그림자를 추가합니다.
‘overflow-hidden’은 컨테이너 외부 요소가 잘리도록 설정합니다.
‘m-4’는 바깥 여백을 적용합니다.
‘w-full’와 ‘h-48’는 너비와 높이를 각각 100%, 12rem으로 설정합니다.
‘object-cover’는 이미지가 컨테이너를 채우도록 크기를 조정합니다.
➕ 단계별 옵션

색상 강도는 50부터 950까지 단계별로 지정할 수 있습니다.
크기 옵션은 sm, md, lg, xl 등의 크기 옵션이 있습니다.


5️⃣ Tailwind CSS IntelliSense
클래스명 자동완성과 색상 미리보기를 지원받을 수 있습니다.



1️⃣ Radix UI
Vercel에서 만든 Headless UI 라이브러리입니다. 
Headless란 기본 기능만 제공하고 스타일은 제공하지 않는 구조입니다.
  

2️⃣ Radix UI 사용하기
프로젝트를 생성하고 Radix UI와 themes 패키지를 설치합니다.
npm install radix-ui@latest
npm install @radix-ui/themes
[코드] Radix UI와 themes 설치하기
main.jsx에서 테마와 스타일을 적용합니다.
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

<Theme>
  <App />
</Theme>
[코드] Theme 적용하기
Button 컴포넌트를 사용하는 예시입니다.
import { Button } from '@radix-ui/themes';

function App() {
  return (
    <Button color="blue" size="3" radius="small">
      Click Me
    </Button>
  );
}

export default App;
[코드] Button 컴포넌트 사용하기
themes 컴포넌트는 기본 스타일이 포함된 컴포넌트를 제공합니다.
primitive 컴포넌트는 스타일이 제거된 상태로, 기능만 제공합니다.
  

3️⃣ shadcn/ui
Radix UI를 기반으로 만들어졌습니다.
Tailwind CSS로 스타일링이 적용된 컴포넌트 라이브러리입니다.
컴포넌트 코드를 직접 프로젝트에 생성하기 때문에 수정과 커스터마이징이 용이합니다.
➕ Radix UI와 비교하기
Radix UI는 커스터마이징이 자유롭지만 스타일은 직접 구현해야 합니다.
shadcn/ui는 Tailwind CSS 스타일이 입혀져 있어 바로 사용이 가능합니다.
shadcn/ui는 프로젝트 내부에 컴포넌트 코드를 생성하므로 수정과 확장이 쉽습니다.
  

3️⃣ shadcn/ui 설치하기
tailwindcss와 @tailwindcss/vite를 먼저 설치합니다.
npm install tailwindcss @tailwindcss/vite
[코드] tailwind 설치
  

3️⃣ shadcn/ui 설정하기
프로젝트 루트에 jsconfig.json 파일을 생성하여 별칭(alias)을 설정합니다.
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
[코드] jsconfig.json 생성 후 별칭 설정
vite.config.js에서 경로 별칭을 추가합니다.
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
[코드] vite.config.js에서 별칭 추가
shadcn/ui를 초기화하고 옵션을 선택하여 설치를 완료합니다.
npx shadcn@latest init
[코드] shadcn/ui 설치
  

5️⃣ shadcn/ui 사용하기
add 명령어로 컴포넌트를 추가하여 기본 스타일과 함께 바로 사용할 수 있습니다.
npx shadcn@latest add accordion
[코드] shadcn/ui의 Accordion 컴포넌트 추가하기
기본적으로 스타일이 적용되어 있습니다. 
Tailwind CSS 클래스를 사용하여 커스터마이징이 가능합니다.
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
[코드] Accordion 컴포넌트 사용하기