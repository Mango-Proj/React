import './App.css';
import Header from "./component/Header";
import Body from "./component/Body";
import Footer from "./component/Footer";
//Header (함수형) 컴포넌트 App 컴포넌트 외부에 개발 
//주의: 컴포넌트 작성 시 이름 첫 글자는 꼭 대문자로 입력. -> 그렇지 않으면 컴포넌트로 인식하지 않음
/* 
// 일반형 함수로 만든 예시 
function Header(){
  //HTML 반환
  return(
    <header>
      <h1>header</h1>
    </header>
  );
}
*/

/*
// 화살표 함수로 만든 예시 
const Header = () => {
  //HTML 반환
  return(
    <header>
      <h1>header</h1>
    </header>
  );
}
*/

//App 컴포넌트 내부에 Header 컴포넌트를 감싸서 작성 
function App() {
  return (<div className="App">
    <Header/>
    <Body/>
    <Footer/>
  </div>);
}

export default App;
