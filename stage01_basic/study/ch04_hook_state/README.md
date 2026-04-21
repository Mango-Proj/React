1️⃣  컴포넌트의 생명 주기
컴포넌트는 생성(마운트), 업데이트, 제거(언마운트)의 과정을 거칩니다. 
이 과정을 컴포넌트의 '생명 주기(life cycle)'라고 부릅니다. 


마운트

컴포넌트가 화면에 처음 삽입될 때 발생합니다.
외부 시스템과의 연결이나 데이터 요청과 같은 초기 설정이 주로 이루어집니다.


업데이트

컴포넌트의 상태나 속성의 변화로 인해 리렌더링이 발생합니다.
업데이트된 데이터로 화면을 갱신하는 작업이 이루어집니다.


⚠️ 여기서 잠깐!
컴포넌트의 업데이트가 발생하는 조건은 다음과 같습니다.

컴포넌트의 state가 변경됐을 때
전달받은 props가 변경됐을 때
부모 컴포넌트가 업데이트되어 영향을 받았을 때


언마운트

컴포넌트가 화면에서 제거될 때 발생합니다.
외부 시스템과의 연결 해제와 같은 정리 작업이 이루어집니다.


2️⃣ useEffect
컴포넌트와 외부 시스템을 동기화하기 위한 React 훅입니다.
컴포넌트의 생명 주기에 따른 부수 효과를 처리할 수 있습니다.
부수 효과란 컴포넌트 외부와의 상호작용(외부 시스템 연결, 데이터 가져오기 등)을 의미합니다.


3️⃣ useEffect의 구조
useEffect에는 2개의 인자로 setup 함수, 의존성 배열을 전달할 수 있습니다.
반환값은 undefined입니다.
// useEffect의 기본 구조
useEffect(setup, dependencies);

// useEffect에 setup 함수와 의존성 배열 전달
useEffect(() => {
  // * 설정 코드 *
}, []);

// useEffect의 setup 함수 내에서 정리 함수 반환
useEffect(() => {
  // * 설정 코드 *
  return () => {
    // * 정리 코드 *
  };
}, []);


setup 함수

useEffect의 첫 번째 인자입니다. 
컴포넌트의 생명 주기에 따라 수행할 설정 코드의 로직이 포함된 함수입니다.
setup 함수 내에서 선택적으로 정리 함수(cleanup function)를 반환할 수 있습니다.
정리 코드는 컴포넌트가 언마운트 되거나 업데이트가 감지되면 이전 값을 기반으로 실행됩니다.
설정 코드는 컴포넌트가 마운트 되거나 업데이트가 감지되면 새로운 값을 기반으로 실행됩니다.


의존성 배열(dependencies array)

useEffect의 두 번째 인자입니다.
setup 함수가 언제 실행될지 결정하는 배열입니다.
배열에 포함된 값이 변경될 때 setup 함수의 로직이 다시 실행됩니다. 
빈 배열이 오거나 배열을 생략할 수 있습니다.
빈 배열의 경우 컴포넌트가 마운트 될 때만 효과가 실행되고, 배열을 생략하면 렌더링마다 setup 함수 로직이 실행됩니다.


➕ 컴포넌트 생명 주기에 따른 useEffect 동작 방식
 마운트 시 

설정 코드가 동작합니다.


업데이트 시

의존성이 변경된 컴포넌트가 리렌더링 될 때마다 아래 동작을 수행합니다.
먼저 정리 코드가 오래된 props, state와 함께 실행됩니다.
이후 설정 코드가 새로운 props, state와 함께 실행됩니다.


언마운트 시

정리 코드가 동작합니다.


4️⃣ useState와 useEffect의 조합
// DataLoader.js

import React, { useEffect, useState } from 'react';

function DataLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log('데이터를 로드하기 시작합니다...');
    setTimeout(() => {
      setData({ message: '데이터 로드가 완료되었습니다!' });
      setIsLoading(false);
      console.log('데이터 로드가 완료되었습니다!');
    }, 2000);
  }, []);
  return <div>{isLoading ? '로딩 중' : data.message}</div>;
}

export default DataLoader;

[결과]

[결과]
useState로 로딩 상태와 데이터를 관리합니다.
useEffect로 컴포넌트 마운트 후 2초 뒤 데이터를 로드합니다.
로딩 중에는 로딩 메시지, 로딩 후에는 데이터 메시지를 표시합니다.
useEffect의 빈 의존성 배열은 컴포넌트가 처음 나타날 때만 작업을 수행합니다.
애플리케이션 실행 시 로딩 시작 메시지가 표시되고, 2초 후 데이터 로딩 완료 메시지가 출력됩니다.



1️⃣ useEffect로 데이터 가져오기
의존성 배열에 빈 배열을 전달하면, 컴포넌트 마운트 시 데이터 로드가 한 번만 실행됩니다.
// UserInfo.js
import React, { useState, useEffect } from 'react';

function UserInfo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 외부 API를 통한 비동기 호출 가정
    // setTimeout 활용해 1초 후 사용자 정보 설정
    setTimeout(() => {
      setUser({
        username: 'JohnDoe',
        watchedVideos: [
          { id: 101, title: 'Video 1' },
          { id: 102, title: 'Video 2' },
        ],
      });
    }, 1000);
  }, []);

  if (!user) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1>{user.username}님 환영합니다!</h1>
      <h2>시청한 비디오:</h2>
      <ul>
        {user.watchedVideos.map(video => (
          <li key={video.id}>{video.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserInfo;



[결과] 마운트 된 후 1초

[결과] 1초 뒤 업데이트
컴포넌트가 마운트 된 후 1초 동안 로딩 메시지가 표시됩니다.
데이터가 로드되면 사용자 정보가 화면에 표시됩니다. 


2️⃣ useEffect로 조건부 데이터 가져오기
의존성 배열에 조건을 나타내는 상태 변수를 추가합니다.
조건의 변화에 따라 필요한 데이터를 가져옵니다.
// UserInfo.js
import React, { useState, useEffect } from 'react';

function UserInfo({ isLoggedIn }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      // 로그인 상태일 때 사용자 정보 로딩
      setTimeout(() => {
        setUser({
          username: 'JohnDoe',
          watchedVideos: [
            { id: 101, title: 'Video 1' },
            { id: 102, title: 'Video 2' },
          ],
        });
      }, 1000);
    } else {
      // 로그아웃 상태일 때 사용자 정보 초기화
      setUser(null);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <div>로그인해 주세요.</div>;
  }

  if (!user) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1>{user.username}님 환영합니다!</h1>
      <h2>시청한 비디오:</h2>
      <ul>
        {user.watchedVideos.map(video => (
          <li key={video.id}>{video.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserInfo;
useEffect의 의존성 배열에 isLoggedIn을 추가합니다.
isLoggedIn 값이 변경될 때마다 useEffect 내의 부수 효과가 실행됩니다. 


isLoggedIn이 true 일 때

컴포넌트가 마운트 되거나 업데이트될 때 1초 동안 로딩 메시지를 표시합니다.
1초 뒤 사용자 정보를 화면에 표시합니다.


isLoggedIn이 false 일 때

컴포넌트가 마운트 되거나 업데이트될 때 user 값을 null로 설정합니다.
‘로그인해 주세요.’ 메시지를 화면에 표시합니다.


// App.js 
import React, { useState } from 'react';
import UserInfo from './UserInfo';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? 'Logout' : 'Login'}
      </button>
      <UserInfo isLoggedIn={isLoggedIn} />
    </div>
  );
}

export default App;



[결과]

[결과]

[결과]
App 컴포넌트에서는 로그인 상태를 관리하며, UserInfo 컴포넌트로 로그인 상태를 전달합니다.
버튼을 클릭할 경우 isLoggedIn의 불리언 값이 반전됩니다.
UserInfo 컴포넌트의 useEffect의 의존성 배열에는 isLoggedIn이 있어, 부수 효과 로직이 실행됩니다.


3️⃣ useEffect로 마우스 포인터 만들기
의존성 배열을 빈 배열로 설정해 컴포넌트 마운트 시 마우스 포인터에 대한 이벤트 리스너를 등록합니다.
정리 함수를 사용해 컴포넌트 언마운트 시 마우스 포인터에 대한 이벤트 리스너를 해제합니다.


// App.js
import { useState, useEffect } from 'react';

function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'blue',
      borderRadius: '50%',
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}

export default App;

[결과]
마우스 포인터의 x, y 좌표를 객체 형태의 상태로 관리합니다.
handleMove()는 마우스 포인터의 위치를 추적하고, <div> 요소의 스타일을 업데이트합니다.
이벤트 핸들러는 pointermove 이벤트를 감지해 사용자의 움직임에 따라 상태를 업데이트합니다.
마우스 좌표를 <div> 요소의 style 객체 속성에 반영해 포인터를 움직입니다.
정리 함수를 사용해 컴포넌트가 언마운트 될 때 handleMove()를 pointermove 이벤트에서 해제합니다.