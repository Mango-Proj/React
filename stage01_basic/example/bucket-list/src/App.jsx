/**
 * App.jsx — 앱의 핵심 컴포넌트 (루트 컴포넌트)
 * ================================================
 * 이 컴포넌트가 버킷리스트 앱의 두뇌 역할을 합니다.
 *
 * 담당하는 일:
 *   1. 버킷리스트 항목들(items)과 필터(filter) 상태를 관리합니다
 *   2. 항목 추가 / 완료 토글 / 삭제 함수를 정의합니다
 *   3. 자식 컴포넌트들에게 데이터와 함수를 props로 전달합니다
 *   4. localStorage로 데이터를 유지합니다 (새로고침해도 사라지지 않음)
 *
 * [ch02] 컴포넌트, props, useState, 이벤트, 조건부/리스트 렌더링
 * [ch03] CSS 모듈
 * [ch04] useEffect, 배열 state 불변 업데이트
 */

import { useState, useEffect } from 'react';

import Header       from './components/Header';
import BucketInput  from './components/BucketInput';
import FilterBar    from './components/FilterBar';
import BucketItem   from './components/BucketItem';

import styles from './App.module.css';

// ─── localStorage 키 상수 ───────────────────────────────
// 문자열을 직접 쓰면 오타 위험 → 상수로 관리
const STORAGE_KEY = 'bucket-list-items';


function App() {
  // ─── State 정의 ─────────────────────────────────────
  /**
   * items: 버킷리스트 항목 배열
   * 각 항목의 구조:
   *   {
   *     id:        string   → crypto.randomUUID()로 생성한 고유 ID
   *     text:      string   → 항목 내용 (예: "제주도 여행")
   *     completed: boolean  → 완료 여부
   *   }
   *
   * 초기값: localStorage에 저장된 데이터가 있으면 그것을 사용,
   *         없으면 예시 데이터 3개로 시작
   */
  const [items, setItems] = useState(() => {
    // useState의 초기값으로 함수를 전달하면 최초 렌더링 시 1번만 실행됩니다
    // (lazy initialization 패턴 — 비싼 초기화 연산에 유용)
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // 저장된 값이 있으면 파싱해서 사용, 없으면 예시 데이터
      return saved ? JSON.parse(saved) : getDefaultItems();
    } catch {
      // JSON.parse 실패 시 예시 데이터로 폴백
      return getDefaultItems();
    }
  });

  /**
   * filter: 현재 선택된 필터 탭
   * 'all'       → 전체 항목
   * 'active'    → 미완료 항목만
   * 'completed' → 완료 항목만
   */
  const [filter, setFilter] = useState('all');


  // ─── useEffect: 데이터 영구 저장 ────────────────────
  /**
   * items가 바뀔 때마다 localStorage에 자동으로 저장합니다.
   * 의존성 배열에 [items]를 넣었으므로 items가 변경될 때만 실행됩니다.
   *
   * [ch04] useEffect + 의존성 배열 패턴
   */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);


  // ─── 핸들러 함수 정의 ────────────────────────────────
  /**
   * 새 항목 추가
   * @param {string} text - 입력된 항목 내용
   *
   * [ch04] 배열 state 불변 업데이트 — [...items, newItem]
   */
  const handleAdd = (text) => {
    const newItem = {
      id: crypto.randomUUID(), // 브라우저 내장 UUID 생성기
      text,
      completed: false,
    };
    // 기존 배열을 직접 수정하지 않고 새 배열을 만들어 setState 호출
    setItems([...items, newItem]);
  };

  /**
   * 항목 완료 상태 토글 (완료 ↔ 미완료)
   * @param {string} id - 토글할 항목의 ID
   *
   * [ch04] map()으로 특정 항목만 변경한 새 배열 생성
   */
  const handleToggle = (id) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed } // 해당 항목만 completed 반전
          : item                                      // 나머지는 그대로
      )
    );
  };

  /**
   * 항목 삭제
   * @param {string} id - 삭제할 항목의 ID
   *
   * [ch04] filter()로 해당 항목만 제외한 새 배열 생성
   */
  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  /**
   * 완료된 항목 전체 삭제
   */
  const handleClearCompleted = () => {
    setItems(items.filter((item) => !item.completed));
  };


  // ─── 파생 데이터 계산 (별도 state 불필요) ───────────
  /**
   * [ch04 원칙 2] 불필요한 state 피하기
   * 완료 개수는 items에서 계산할 수 있으므로 별도 state로 만들지 않습니다.
   */
  const totalCount     = items.length;
  const completedCount = items.filter((item) => item.completed).length;
  const activeCount    = totalCount - completedCount;

  // 완료율 (프로그레스 바용) — 0~100
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  /**
   * 현재 필터에 따라 표시할 항목 목록
   * [ch02] 조건부 렌더링 활용
   */
  const filteredItems = items.filter((item) => {
    if (filter === 'active')    return !item.completed;
    if (filter === 'completed') return item.completed;
    return true; // 'all'이면 전부 표시
  });


  // ─── JSX 렌더링 ─────────────────────────────────────
  return (
    <div className={styles.app}>
      {/*
        Header: 앱 제목 + 진행률 표시
        progressPercent, completedCount, totalCount를 props로 전달
      */}
      <Header
        progressPercent={progressPercent}
        completedCount={completedCount}
        totalCount={totalCount}
      />

      <main className={styles.main}>
        {/*
          BucketInput: 새 항목 입력창
          onAdd: 입력 완료 시 호출될 함수를 props로 전달
        */}
        <BucketInput onAdd={handleAdd} />

        {/*
          FilterBar: 전체/미완료/완료 필터 탭
          filter: 현재 선택된 필터
          counts: 각 탭의 숫자 배지용
          onFilterChange: 필터 변경 시 호출될 함수
        */}
        <FilterBar
          filter={filter}
          counts={{ all: totalCount, active: activeCount, completed: completedCount }}
          onFilterChange={setFilter}
        />

        {/* 항목 목록 */}
        <ul className={styles.list}>
          {/*
            [ch02] 리스트 렌더링 — filteredItems 배열을 map()으로 순회
            각 항목마다 BucketItem 컴포넌트를 렌더링합니다
          */}
          {filteredItems.map((item) => (
            <BucketItem
              key={item.id}           // 각 항목의 고유 key (필수!)
              item={item}             // 항목 데이터 전달
              onToggle={handleToggle} // 완료 토글 함수 전달
              onDelete={handleDelete} // 삭제 함수 전달
            />
          ))}
        </ul>

        {/*
          [ch02] 조건부 렌더링 — 빈 상태일 때만 안내 메시지 표시
        */}
        {filteredItems.length === 0 && (
          <div className={styles.empty}>
            {filter === 'completed'
              ? '아직 완료한 항목이 없어요 🌱'
              : filter === 'active'
              ? '모든 항목을 완료했어요! 🎉'
              : '버킷리스트를 추가해보세요 ✨'}
          </div>
        )}

        {/*
          완료된 항목이 있을 때만 "완료 항목 삭제" 버튼 표시
          [ch02] && 단축 평가 조건부 렌더링
        */}
        {completedCount > 0 && (
          <button
            className={styles.clearBtn}
            onClick={handleClearCompleted}
          >
            완료 항목 삭제 ({completedCount}개)
          </button>
        )}
      </main>
    </div>
  );
}


// ─── 예시 데이터 ─────────────────────────────────────
/**
 * 처음 실행 시 보여줄 기본 버킷리스트 항목들
 * 컴포넌트 바깥에 정의 — 렌더링과 무관한 상수이므로
 */
function getDefaultItems() {
  return [
    { id: crypto.randomUUID(), text: '제주도 여행하기 ✈️', completed: false },
    { id: crypto.randomUUID(), text: '번지점프 도전하기 🪂', completed: false },
    { id: crypto.randomUUID(), text: '책 1년에 12권 읽기 📚', completed: true },
  ];
}


export default App;
