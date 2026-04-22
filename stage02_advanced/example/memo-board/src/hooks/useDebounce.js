import { useState, useEffect } from 'react';

/**
 * useDebounce — 입력값 변화를 일정 시간 지연시키는 커스텀 훅
 *
 * [커스텀 훅 패턴 — ch04_hook_state/04_custom_hook.jsx 참고]
 *
 * 문제: 검색창에 "리액트"를 타이핑하면
 *   'ㄹ' → '리' → '리ㅇ' → '리아' → '리액' → '리액ㅅ' → '리액트'
 *   → 글자마다 검색/필터링이 실행되어 성능 낭비
 *
 * 해결: 마지막 입력 후 delay ms가 지나야 값을 업데이트
 *   → 타이핑을 멈춘 순간인 '리액트'에서만 1번 실행
 *
 * 비유: 엘리베이터 문 닫힘 버튼처럼,
 *       마지막으로 누른 후 일정 시간이 지나야 동작합니다.
 *
 * @param {*} value - 지연시킬 값
 * @param {number} delay - 지연 시간 (밀리초, 기본 300ms)
 * @returns {*} delay 후에 업데이트된 지연된 값
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // delay 후에 값을 업데이트하는 타이머 설정
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 클린업 함수: 새 입력이 들어오면 이전 타이머를 취소
    // value가 바뀔 때마다 이전 타이머를 지우고 새 타이머를 시작
    // → 타이핑 중에는 타이머가 계속 리셋되어 delay가 연장됨
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
