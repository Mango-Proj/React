import { useState, useEffect } from 'react';

/**
 * useLocalStorage — localStorage와 동기화되는 상태 커스텀 훅
 *
 * [커스텀 훅 패턴 — ch04_hook_state/04_custom_hook.jsx 참고]
 * - useState + useEffect를 조합해서 만든 커스텀 훅
 * - 사용법은 useState와 완전히 동일: const [값, 세터] = useLocalStorage(키, 초기값)
 * - 값이 바뀔 때마다 localStorage에 자동 저장됨
 * - 페이지를 새로고침해도 데이터가 유지됨
 *
 * 비유: 일반 useState가 "휘발성 메모장"이라면,
 *       useLocalStorage는 "저장되는 메모장"입니다.
 *
 * @param {string} key - localStorage에 저장할 키 이름
 * @param {*} initialValue - 저장된 값이 없을 때 사용할 초기값
 * @returns {[*, Function]} [저장된 값, 값 업데이트 함수]
 */
export function useLocalStorage(key, initialValue) {
  // useState의 lazy initialization 패턴:
  // 초기화 함수를 넘기면 컴포넌트 마운트 시 딱 한 번만 실행됨
  // → 매 렌더마다 localStorage를 읽는 낭비를 방지
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // 저장된 값이 있으면 JSON 파싱해서 반환, 없으면 initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // localStorage 접근 실패(시크릿 모드 등)시 초기값 사용
      console.warn(`useLocalStorage: "${key}" 읽기 실패`, error);
      return initialValue;
    }
  });

  // storedValue가 바뀔 때마다 localStorage에 저장
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`useLocalStorage: "${key}" 저장 실패`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
