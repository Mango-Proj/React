/**
 * main.jsx — React 앱의 진입점
 * ==============================
 * HTML의 <div id="root">에 React 앱 전체를 마운트(연결)합니다.
 * 이 파일은 보통 건드리지 않습니다.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 전체 리셋 및 기본 폰트 설정
import './index.css';

// document.getElementById('root') → index.html의 <div id="root">
// createRoot().render() → 해당 요소 안에 React 앱을 렌더링
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode: 개발 중에만 동작하는 검사 도구 (잠재적 문제를 콘솔에 경고)
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
