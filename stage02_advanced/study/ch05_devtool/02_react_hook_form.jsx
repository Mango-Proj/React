/**
 * 02_react_hook_form.jsx — React Hook Form
 * ==========================================
 * ⚠️ 설치 필요: npm install react-hook-form
 *
 * 폼 관리를 위한 라이브러리입니다.
 * useState 방식과 비교해 어떤 점이 달라지는지 살펴봅니다.
 *
 * 1. useState 방식 vs RHF 방식 비교
 * 2. 유효성 검사 (register 옵션)
 * 3. 회원가입 폼 실전 예제
 * 4. 에러 메시지 & 실시간 검증
 */

/**
 * ─────────────────────────────────────────────
 * [사전 지식] React Hook Form이 왜 필요한가?
 * ─────────────────────────────────────────────
 *
 * useState 방식 문제점:
 *   - 입력 필드마다 useState가 필요 → 상태가 너무 많아짐
 *   - 글자를 타이핑할 때마다 리렌더링 발생 → 성능 저하
 *   - 유효성 검사 코드를 직접 작성해야 함 → 반복 코드 증가
 *
 * React Hook Form 장점:
 *   - "비제어 컴포넌트" 방식 → 타이핑해도 리렌더링 없음
 *   - register() 한 줄로 유효성 규칙 설정
 *   - errors 객체로 에러 메시지 자동 관리
 */

// ─────────────────────────────────────────────
// 비교 예제 1: useState 방식 (기존 방법)
// ─────────────────────────────────────────────

import { useState } from 'react';

/**
 * 전통적인 useState 방식의 로그인 폼.
 * 문자 하나를 입력할 때마다 컴포넌트가 리렌더링됩니다.
 * 필드가 늘어날수록 state, onChange 핸들러, 유효성 검사 코드가 폭발적으로 늘어납니다.
 */
export function LoginFormWithState() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [renderCount, setRenderCount] = useState(0);

  // ❌ 직접 유효성 검사 로직을 작성해야 합니다
  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = '이메일을 입력하세요';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = '올바른 이메일 형식이 아닙니다';
    if (!password) newErrors.password = '비밀번호를 입력하세요';
    else if (password.length < 6) newErrors.password = '비밀번호는 6자 이상이어야 합니다';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    alert(`로그인: ${email}`);
  };

  // 타이핑할 때마다 렌더링 카운트 증가
  const trackRender = () => {
    setRenderCount(c => c + 1);
    return null;
  };

  return (
    <div style={{ padding: '12px', border: '1px solid #fca5a5', borderRadius: '8px', background: '#fff5f5' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: '700', color: '#dc2626' }}>❌ useState 방식</p>
        <span style={{ fontSize: '0.75rem', color: '#dc2626', background: '#fee2e2', padding: '2px 8px', borderRadius: '999px' }}>
          리렌더링 {renderCount}회
        </span>
      </div>
      <form onSubmit={handleSubmit} onChange={() => setRenderCount(c => c + 1)}>
        <div style={{ marginBottom: '8px' }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            style={{ width: '100%', padding: '8px 10px', border: `1px solid ${errors.email ? '#ef4444' : '#d1d5db'}`, borderRadius: '6px', boxSizing: 'border-box' }}
          />
          {errors.email && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '3px' }}>{errors.email}</p>}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            style={{ width: '100%', padding: '8px 10px', border: `1px solid ${errors.password ? '#ef4444' : '#d1d5db'}`, borderRadius: '6px', boxSizing: 'border-box' }}
          />
          {errors.password && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '3px' }}>{errors.password}</p>}
        </div>
        <button
          type="submit"
          style={{ width: '100%', padding: '9px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}
        >
          로그인 (useState)
        </button>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────
// 비교 예제 2: React Hook Form 방식
// ─────────────────────────────────────────────

/**
 * RHF 방식의 동일한 로그인 폼.
 *
 * 핵심 개념:
 *   - register(name, rules): 입력 필드 등록 + 유효성 규칙 설정
 *   - handleSubmit(fn):      제출 시 유효성 검사 후 fn 호출
 *   - formState.errors:      각 필드의 에러 정보
 *
 * 비제어 방식이라 타이핑할 때 리렌더링이 거의 없습니다.
 * (에러가 생기거나 제출할 때만 리렌더링)
 */

// ────────────────────────────────────────────
// 아래는 실제 RHF 사용 코드입니다 (npm install react-hook-form 필요)
// 현재 파일에서는 설치 없이 동작하는 시뮬레이터로 대체했습니다.
// ────────────────────────────────────────────

/*
import { useForm } from 'react-hook-form';

export function LoginFormWithRHF() {
  const {
    register,          // 입력 필드 등록
    handleSubmit,      // 제출 핸들러
    formState: { errors, isSubmitting },  // 에러 & 제출 중 상태
  } = useForm();

  const onSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 1000)); // 서버 요청 시뮬레이션
    alert(`로그인: ${data.email}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email', {
          required: '이메일을 입력하세요',
          pattern: { value: /\S+@\S+\.\S+/, message: '올바른 이메일 형식이 아닙니다' },
        })}
        placeholder="이메일"
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        type="password"
        {...register('password', {
          required: '비밀번호를 입력하세요',
          minLength: { value: 6, message: '6자 이상 입력하세요' },
        })}
        placeholder="비밀번호"
      />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
}
*/

// RHF 동작 시뮬레이터 (설치 없이 RHF의 작동 방식을 이해하기 위한 예제)
export function LoginFormRHFSimulator() {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // RHF 내부적으로 ref를 사용해 DOM 값에 직접 접근합니다 (비제어)
  // 이 시뮬레이터에서는 ref를 직접 사용해 같은 방식으로 구현합니다
  const emailRef = { current: null };
  const passwordRef = { current: null };

  const validate = (email, password) => {
    const errs = {};
    if (!email) errs.email = '이메일을 입력하세요';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = '올바른 이메일 형식이 아닙니다';
    if (!password) errs.password = '비밀번호를 입력하세요';
    else if (password.length < 6) errs.password = '비밀번호는 6자 이상이어야 합니다';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const validationErrors = validate(email, password);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ padding: '16px', background: '#dcfce7', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ color: '#16a34a', fontWeight: '700' }}>✅ 로그인 성공!</p>
        <button onClick={() => { setSubmitted(false); setErrors({}); }} style={{ marginTop: '8px', padding: '5px 14px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem' }}>
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '12px', border: '1px solid #86efac', borderRadius: '8px', background: '#f0fdf4' }}>
      <p style={{ fontSize: '0.8rem', fontWeight: '700', color: '#16a34a', marginBottom: '10px' }}>
        ✅ React Hook Form 방식 (시뮬레이터) — 타이핑해도 리렌더링 없음
      </p>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: '8px' }}>
          <input
            name="email"
            type="email"
            placeholder="이메일"
            onChange={() => errors.email && setErrors(e => ({ ...e, email: undefined }))}
            style={{ width: '100%', padding: '8px 10px', border: `1px solid ${errors.email ? '#ef4444' : '#d1d5db'}`, borderRadius: '6px', boxSizing: 'border-box' }}
          />
          {errors.email && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '3px' }}>{errors.email}</p>}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            name="password"
            type="password"
            placeholder="비밀번호 (6자 이상)"
            onChange={() => errors.password && setErrors(e => ({ ...e, password: undefined }))}
            style={{ width: '100%', padding: '8px 10px', border: `1px solid ${errors.password ? '#ef4444' : '#d1d5db'}`, borderRadius: '6px', boxSizing: 'border-box' }}
          />
          {errors.password && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '3px' }}>{errors.password}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{ width: '100%', padding: '9px', background: isSubmitting ? '#86efac' : '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: '700' }}
        >
          {isSubmitting ? '로그인 중...' : '로그인 (RHF 방식)'}
        </button>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────
// 예제 3: RHF 유효성 검사 규칙 가이드
// ─────────────────────────────────────────────

/** RHF register 옵션의 주요 유효성 검사 규칙을 시각화합니다 */
export function ValidationRulesGuide() {
  const rules = [
    { rule: 'required', description: '필수 입력', example: `required: '이메일을 입력하세요'` },
    { rule: 'minLength', description: '최소 글자 수', example: `minLength: { value: 8, message: '8자 이상 입력' }` },
    { rule: 'maxLength', description: '최대 글자 수', example: `maxLength: { value: 20, message: '20자 이하로 입력' }` },
    { rule: 'pattern', description: '정규식 패턴', example: `pattern: { value: /^[A-Z]/, message: '대문자로 시작' }` },
    { rule: 'min / max', description: '숫자 범위', example: `min: { value: 18, message: '18세 이상' }` },
    { rule: 'validate', description: '커스텀 검사', example: `validate: v => v !== 'admin' || '사용 불가'` },
  ];

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '10px' }}>
        register(name, rules)의 rules 객체에 사용할 수 있는 유효성 검사 옵션들입니다.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {rules.map(({ rule, description, example }) => (
          <div
            key={rule}
            style={{ padding: '8px 12px', background: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <code style={{ fontSize: '0.82rem', fontWeight: '700', color: '#6366f1' }}>{rule}</code>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{description}</span>
            </div>
            <code style={{ fontSize: '0.75rem', color: '#374151', background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px', display: 'block', overflow: 'auto', whiteSpace: 'nowrap' }}>
              {example}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 예제 4: 실전 회원가입 폼
// ─────────────────────────────────────────────

/** 실제 RHF 코드 스니펫을 보여주는 가이드 */
export function SignupFormGuide() {
  const [activeTab, setActiveTab] = useState('code');

  const codeSnippet = `import { useForm } from 'react-hook-form';

function SignupForm() {
  const {
    register,
    handleSubmit,
    watch,           // 특정 필드 값을 실시간으로 관찰
    formState: { errors, isValid, isDirty },
  } = useForm({ mode: 'onChange' }); // 입력할 때마다 검사

  const password = watch('password'); // 비밀번호 확인에 사용

  const onSubmit = (data) => {
    console.log('회원가입 데이터:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 이름 */}
      <input
        {...register('name', {
          required: '이름을 입력하세요',
          minLength: { value: 2, message: '2자 이상 입력하세요' },
        })}
        placeholder="이름"
      />
      {errors.name && <p>{errors.name.message}</p>}

      {/* 이메일 */}
      <input
        {...register('email', {
          required: '이메일을 입력하세요',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
            message: '올바른 이메일 형식이 아닙니다',
          },
        })}
        placeholder="이메일"
      />
      {errors.email && <p>{errors.email.message}</p>}

      {/* 비밀번호 */}
      <input
        type="password"
        {...register('password', {
          required: '비밀번호를 입력하세요',
          minLength: { value: 8, message: '8자 이상 입력하세요' },
        })}
        placeholder="비밀번호"
      />

      {/* 비밀번호 확인 — watch로 password 값과 비교 */}
      <input
        type="password"
        {...register('confirmPassword', {
          validate: (value) =>
            value === password || '비밀번호가 일치하지 않습니다',
        })}
        placeholder="비밀번호 확인"
      />
      {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

      <button type="submit" disabled={!isValid}>
        가입하기
      </button>
    </form>
  );
}`;

  const conceptsTab = [
    { term: 'register(name, rules)', desc: '입력 필드를 RHF에 등록하고 유효성 규칙을 설정' },
    { term: 'handleSubmit(fn)', desc: '폼 제출 시 유효성 검사 후 fn(data)를 호출' },
    { term: 'watch(name)', desc: '특정 필드 값을 실시간으로 관찰 (비밀번호 확인 등)' },
    { term: 'errors', desc: '각 필드의 에러 정보 { message, type }' },
    { term: 'isValid', desc: '모든 필드가 유효한지 여부 (mode: onChange 필요)' },
    { term: 'isDirty', desc: '초기값에서 변경이 있는지 여부' },
    { term: 'isSubmitting', desc: '제출 처리 중인지 여부 (비동기 onSubmit 시 유용)' },
    { term: 'reset()', desc: '폼을 초기 상태로 되돌림' },
  ];

  return (
    <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        {['code', 'concepts'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ padding: '5px 14px', background: activeTab === tab ? '#6366f1' : '#f3f4f6', color: activeTab === tab ? 'white' : '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            {tab === 'code' ? '코드 예시' : '주요 개념'}
          </button>
        ))}
      </div>

      {activeTab === 'code' ? (
        <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '14px', borderRadius: '8px', fontSize: '0.75rem', overflow: 'auto', maxHeight: '300px', lineHeight: '1.6' }}>
          {codeSnippet}
        </pre>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {conceptsTab.map(({ term, desc }) => (
            <div key={term} style={{ padding: '8px 12px', background: '#f9fafb', borderRadius: '6px' }}>
              <code style={{ fontSize: '0.82rem', color: '#6366f1', fontWeight: '700' }}>{term}</code>
              <p style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '2px' }}>{desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 전체 데모
// ─────────────────────────────────────────────
export default function ReactHookFormDemo() {
  const sectionStyle = {
    marginBottom: '24px',
    padding: '16px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>React Hook Form</h1>
      <div style={{ padding: '8px 12px', background: '#fef9c3', borderRadius: '6px', marginBottom: '20px', fontSize: '0.82rem', color: '#92400e' }}>
        ⚠️ 실제 RHF 사용 시: <code>npm install react-hook-form</code>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>① useState 방식 vs RHF 방식 비교</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <LoginFormWithState />
          <LoginFormRHFSimulator />
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>② 유효성 검사 규칙 (register 옵션)</h2>
        <ValidationRulesGuide />
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>③ 실전 회원가입 폼 코드</h2>
        <SignupFormGuide />
      </div>
    </div>
  );
}
