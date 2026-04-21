/**
 * 02_key_index_vs_id.jsx — 인덱스 key vs 고유 ID key 비교
 * ==========================================================
 * 인덱스(index)를 key로 사용했을 때 발생하는 버그를 직접 확인합니다.
 *
 * 핵심 버그 시나리오:
 * 입력 필드가 있는 리스트에서 앞에 항목을 삽입하면
 * index key를 사용할 경우 입력 내용이 엉뚱한 항목에 달라붙는 버그가 발생합니다.
 *
 * 이 파일은 학습용 예제입니다.
 * Vite + React 프로젝트에서 App.jsx에 import하여 확인하세요.
 */

import { useState } from 'react';


// ─────────────────────────────────────────────────────
// 예제 1: 인덱스 key 문제 시각화 (숫자 비교)
// ─────────────────────────────────────────────────────

/**
 * 앞에 항목을 추가할 때 인덱스가 어떻게 바뀌는지 시각적으로 보여줍니다.
 * 인덱스가 key가 되면 React는 기존 항목을 전부 다시 그립니다.
 */
export function IndexShiftVisual() {
  const [items, setItems] = useState(['바나나', '딸기', '포도']);
  const [justAdded, setJustAdded] = useState(null);

  const addToFront = () => {
    const newItem = '🆕 사과';
    setItems([newItem, ...items]);
    setJustAdded(0); // 새로 추가된 index = 0
    setTimeout(() => setJustAdded(null), 1500);
  };

  const reset = () => setItems(['바나나', '딸기', '포도']);

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>인덱스 이동 시각화</h2>
      <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '12px' }}>
        "맨 앞에 추가" 버튼을 누르면 기존 항목의 인덱스가 전부 바뀝니다
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={addToFront}
          style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          맨 앞에 '사과' 추가
        </button>
        <button
          onClick={reset}
          style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', background: '#6b7280', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          초기화
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* 인덱스 key 사용 */}
        <div>
          <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#dc2626', fontSize: '0.88rem' }}>
            ❌ index를 key로 사용
          </p>
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                padding: '8px 10px',
                marginBottom: '4px',
                borderRadius: '6px',
                background: justAdded === index ? '#fef2f2' : '#f8fafc',
                border: `1px solid ${justAdded === index ? '#fca5a5' : '#e2e8f0'}`,
                transition: 'background 0.3s',
              }}
            >
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'monospace', minWidth: '55px' }}>
                key={index}
              </span>
              <span style={{ fontSize: '0.9rem' }}>{item}</span>
              {justAdded !== null && (
                <span style={{ fontSize: '0.7rem', color: '#dc2626' }}>
                  {index === 0 ? '← 새것' : '← 이동!'}
                </span>
              )}
            </div>
          ))}
          {justAdded !== null && (
            <p style={{ fontSize: '0.75rem', color: '#dc2626', margin: '6px 0 0' }}>
              React: "key=0이 바나나→사과로 바뀌었네? 전부 다시 그려야겠다!"
            </p>
          )}
        </div>

        {/* 고유 ID key 사용 */}
        <div>
          <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#16a34a', fontSize: '0.88rem' }}>
            ✅ 고유 ID를 key로 사용
          </p>
          {[
            { id: 'new', label: '🆕 사과', isNew: true },
            { id: 'id-001', label: '바나나', isNew: false },
            { id: 'id-002', label: '딸기', isNew: false },
            { id: 'id-003', label: '포도', isNew: false },
          ].slice(justAdded !== null ? 0 : 1).map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                padding: '8px 10px',
                marginBottom: '4px',
                borderRadius: '6px',
                background: item.isNew && justAdded !== null ? '#f0fdf4' : '#f8fafc',
                border: `1px solid ${item.isNew && justAdded !== null ? '#86efac' : '#e2e8f0'}`,
              }}
            >
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'monospace', minWidth: '55px' }}>
                key={item.id.slice(0, 6)}
              </span>
              <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
              {item.isNew && justAdded !== null && (
                <span style={{ fontSize: '0.7rem', color: '#16a34a' }}>← 새것만!</span>
              )}
            </div>
          ))}
          {justAdded !== null && (
            <p style={{ fontSize: '0.75rem', color: '#16a34a', margin: '6px 0 0' }}>
              React: "id-001~003은 그대로! 'new'만 새로 추가됐네."
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 2: 입력 필드 버그 (인덱스 key의 실제 문제)
// ─────────────────────────────────────────────────────

/**
 * 이것이 인덱스를 key로 사용했을 때 발생하는 가장 심각한 버그입니다.
 *
 * 재현 방법:
 * 1. 왼쪽 패널에서 첫 번째 입력란에 "안녕하세요" 입력
 * 2. "맨 앞에 추가" 클릭
 * 3. 결과: 새로 추가된 항목이 아닌 엉뚱한 항목에 "안녕하세요"가 표시됨!
 *
 * 오른쪽 패널(고유 ID)에서는 이 버그가 발생하지 않습니다.
 */

// 인덱스 key 사용 — 버그 있는 버전
function IndexKeyList() {
  const [items, setItems] = useState([
    { name: '첫 번째 항목' },
    { name: '두 번째 항목' },
    { name: '세 번째 항목' },
  ]);

  const addToFront = () => {
    setItems([{ name: '새로 추가된 항목' }, ...items]);
  };

  return (
    <div style={{ padding: '14px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fca5a5' }}>
      <p style={{ margin: '0 0 10px', fontWeight: 700, color: '#dc2626', fontSize: '0.88rem' }}>
        ❌ index를 key로 사용 (버그 있음)
      </p>

      <button
        onClick={addToFront}
        style={{ padding: '7px 14px', borderRadius: '6px', border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer', fontSize: '0.82rem', marginBottom: '10px' }}
      >
        맨 앞에 항목 추가
      </button>

      <ol style={{ margin: 0, padding: '0 0 0 18px' }}>
        {items.map((item, index) => (
          // ❌ index를 key로 사용
          <li key={index} style={{ marginBottom: '6px' }}>
            <div style={{ fontSize: '0.82rem', color: '#dc2626', fontFamily: 'monospace', marginBottom: '2px' }}>
              key={index} — {item.name}
            </div>
            <input
              placeholder="여기에 입력 후 앞에 추가 버튼 클릭!"
              style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #fca5a5', fontSize: '0.82rem', boxSizing: 'border-box' }}
            />
          </li>
        ))}
      </ol>

      <div style={{ marginTop: '10px', padding: '8px', background: '#fee2e2', borderRadius: '6px', fontSize: '0.78rem', color: '#991b1b' }}>
        ⚠️ 첫 번째 입력란에 텍스트 입력 후 "맨 앞에 항목 추가"를 클릭하면<br />
        입력 내용이 새 항목이 아닌 기존 항목에 붙어버립니다!
      </div>
    </div>
  );
}

// 고유 ID key 사용 — 정상 버전
function UniqueIdKeyList() {
  const [items, setItems] = useState([
    { id: crypto.randomUUID(), name: '첫 번째 항목' },
    { id: crypto.randomUUID(), name: '두 번째 항목' },
    { id: crypto.randomUUID(), name: '세 번째 항목' },
  ]);

  const addToFront = () => {
    setItems([{ id: crypto.randomUUID(), name: '새로 추가된 항목' }, ...items]);
  };

  return (
    <div style={{ padding: '14px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #86efac' }}>
      <p style={{ margin: '0 0 10px', fontWeight: 700, color: '#16a34a', fontSize: '0.88rem' }}>
        ✅ 고유 ID를 key로 사용 (정상)
      </p>

      <button
        onClick={addToFront}
        style={{ padding: '7px 14px', borderRadius: '6px', border: 'none', background: '#16a34a', color: 'white', cursor: 'pointer', fontSize: '0.82rem', marginBottom: '10px' }}
      >
        맨 앞에 항목 추가
      </button>

      <ol style={{ margin: 0, padding: '0 0 0 18px' }}>
        {items.map((item) => (
          // ✅ 고유 ID를 key로 사용
          <li key={item.id} style={{ marginBottom: '6px' }}>
            <div style={{ fontSize: '0.82rem', color: '#16a34a', fontFamily: 'monospace', marginBottom: '2px' }}>
              key={item.id.slice(0, 8)}... — {item.name}
            </div>
            <input
              placeholder="입력 후 앞에 추가해도 내용 유지됩니다"
              style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #86efac', fontSize: '0.82rem', boxSizing: 'border-box' }}
            />
          </li>
        ))}
      </ol>

      <div style={{ marginTop: '10px', padding: '8px', background: '#dcfce7', borderRadius: '6px', fontSize: '0.78rem', color: '#166534' }}>
        ✅ 첫 번째 입력란에 텍스트 입력 후 "맨 앞에 항목 추가"를 클릭해도<br />
        입력 내용이 올바른 항목에 그대로 유지됩니다.
      </div>
    </div>
  );
}

export function InputBugDemo() {
  return (
    <div style={{ padding: '20px', maxWidth: '700px' }}>
      <h2>입력 필드 버그 — 인덱스 key의 진짜 문제</h2>
      <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '16px' }}>
        <strong>재현 방법</strong>: 왼쪽에서 첫 번째 입력란에 텍스트를 입력하고,
        "맨 앞에 항목 추가" 버튼을 클릭하세요.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <IndexKeyList />
        <UniqueIdKeyList />
      </div>

      <div style={{ marginTop: '16px', padding: '14px', background: '#fffbeb', borderRadius: '10px', fontSize: '0.85rem', color: '#713f12' }}>
        <p style={{ margin: '0 0 6px', fontWeight: 700 }}>🔍 왜 이런 일이 발생할까?</p>
        <p style={{ margin: '0 0 6px' }}>
          React는 key를 보고 DOM 요소를 재사용합니다. index를 key로 쓰면 앞에 항목을 추가할 때:
        </p>
        <ul style={{ margin: 0, paddingLeft: '16px', lineHeight: 1.8 }}>
          <li>기존 key=0(첫 번째 항목)의 DOM 요소를 새 항목의 텍스트로 바꿉니다</li>
          <li>하지만 그 DOM 요소 안의 <code>&lt;input&gt;</code>은 "같은 key=0이니 재사용"합니다</li>
          <li>결과: 새 항목 자리에 이전 입력값이 달라붙는 버그!</li>
        </ul>
        <p style={{ margin: '8px 0 0' }}>
          고유 ID를 key로 쓰면 React가 새 항목의 DOM을 새로 만들고, 기존 항목의 DOM은 그대로 유지합니다.
        </p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 3: index key가 허용되는 예외적 상황
// ─────────────────────────────────────────────────────

/**
 * 모든 상황에서 index가 나쁜 건 아닙니다.
 * 아래 조건을 모두 만족할 때는 index 사용이 허용됩니다.
 */
export function IndexKeyAllowedCase() {
  // 이 조건들을 모두 만족할 때 index 사용 가능:
  // 1. 리스트가 정렬/필터링되지 않음
  // 2. 항목이 추가/삭제/재정렬되지 않음
  // 3. 각 항목에 입력 필드나 지역 state가 없음
  const staticMenus = ['메뉴판', '공지사항', '자주 묻는 질문', '이용약관'];

  return (
    <div style={{ padding: '20px', maxWidth: '460px' }}>
      <h2>index key — 허용되는 예외 케이스</h2>
      <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '12px' }}>
        아래 3가지 조건을 모두 만족하면 예외적으로 index 사용 가능
      </p>

      <div style={{ padding: '12px', background: '#fffbeb', borderRadius: '8px', marginBottom: '14px', fontSize: '0.82rem', color: '#713f12' }}>
        <p style={{ margin: '0 0 6px', fontWeight: 700 }}>✅ index 사용이 허용되는 조건</p>
        <ol style={{ margin: 0, paddingLeft: '16px', lineHeight: 1.8 }}>
          <li>목록이 <strong>변하지 않는</strong> 완전히 정적인 데이터</li>
          <li>항목이 <strong>추가·삭제·재정렬되지 않음</strong></li>
          <li>각 항목에 <strong>입력 필드가 없음</strong> (지역 state 없음)</li>
        </ol>
      </div>

      {/* index key가 허용되는 경우 */}
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {staticMenus.map((menu, index) => (
          // 위 3가지 조건 모두 만족 → index 사용 허용
          <li
            key={index}
            style={{
              padding: '10px 14px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.9rem',
            }}
          >
            <span>{menu}</span>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'monospace' }}>
              key={index}
            </span>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '12px', padding: '12px', background: '#f0fdf4', borderRadius: '8px', fontSize: '0.82rem', color: '#166534' }}>
        <p style={{ margin: 0 }}>
          이 목록은 변경되지 않으므로 index key를 사용해도 안전합니다.
          하지만 <strong>의심스러울 때는 고유 ID를 사용하는 것이 항상 더 안전합니다.</strong>
        </p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 예제 4: 고유 ID 생성 방법 비교
// ─────────────────────────────────────────────────────

/**
 * 실제 프로젝트에서 고유 ID를 생성하는 3가지 방법을 비교합니다.
 */
export function UniqueIdMethods() {
  const [generatedIds, setGeneratedIds] = useState([]);

  const generateCryptoId = () => {
    const id = crypto.randomUUID();
    setGeneratedIds(prev => [{ method: 'crypto.randomUUID()', id, color: '#7c3aed' }, ...prev].slice(0, 6));
  };

  const generateDateId = () => {
    const id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    setGeneratedIds(prev => [{ method: 'Date.now() + random', id, color: '#2563eb' }, ...prev].slice(0, 6));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>고유 ID 생성 방법</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button
          onClick={generateCryptoId}
          style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', background: '#7c3aed', color: 'white', cursor: 'pointer', fontSize: '0.82rem' }}
        >
          crypto.randomUUID()
        </button>
        <button
          onClick={generateDateId}
          style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontSize: '0.82rem' }}
        >
          Date.now() + random
        </button>
      </div>

      {generatedIds.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          {generatedIds.map((item, i) => (
            <div key={i} style={{ padding: '8px 10px', background: '#f8fafc', borderRadius: '6px', marginBottom: '4px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: item.color, fontWeight: 700 }}>{item.method}</span>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', fontFamily: 'monospace', color: '#374151', wordBreak: 'break-all' }}>
                {item.id}
              </p>
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.82rem', color: '#475569' }}>
        <p style={{ margin: '0 0 8px', fontWeight: 700 }}>방법 비교</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
          <thead>
            <tr style={{ background: '#e2e8f0' }}>
              <th style={{ padding: '6px 8px', textAlign: 'left', borderRadius: '4px 0 0 0' }}>방법</th>
              <th style={{ padding: '6px 8px', textAlign: 'left' }}>장점</th>
              <th style={{ padding: '6px 8px', textAlign: 'left', borderRadius: '0 4px 0 0' }}>단점</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '6px 8px', fontWeight: 600, color: '#7c3aed' }}>crypto.randomUUID()</td>
              <td style={{ padding: '6px 8px' }}>표준, 설치 불필요</td>
              <td style={{ padding: '6px 8px' }}>구형 브라우저 미지원</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '6px 8px', fontWeight: 600, color: '#2563eb' }}>uuid 라이브러리</td>
              <td style={{ padding: '6px 8px' }}>모든 환경 지원</td>
              <td style={{ padding: '6px 8px' }}>npm install 필요</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 8px', fontWeight: 600, color: '#6b7280' }}>서버 ID</td>
              <td style={{ padding: '6px 8px' }}>가장 안전, 추천</td>
              <td style={{ padding: '6px 8px' }}>서버 데이터 필요</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// 사용 예시 (App.jsx에서 아래처럼 import하여 사용합니다)
// ─────────────────────────────────────────────────────

/*
import {
  IndexShiftVisual,
  InputBugDemo,
  IndexKeyAllowedCase,
  UniqueIdMethods
} from './02_key_index_vs_id';

function App() {
  return (
    <div>
      <IndexShiftVisual />
      <InputBugDemo />
      <IndexKeyAllowedCase />
      <UniqueIdMethods />
    </div>
  );
}
*/
