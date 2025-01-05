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
//Props을 전달하려는 컴포넌트 동일한 이름의 props 할당
/*
//하나 이상의 Props 전달
function App() {
  const name = "이정환";
  return (<div className="App">
    <Header/>
    <Body name={name} location={"부천시"}/> 
    <Footer/>
  </div>);
}
*/
/*
// Spread 연산자 사용
function App(){
  const BodyProps = {
    name: "이정환",
    location: "부천시",
    //favorList: ["파스타", "빵", "떡볶이"],
  };

  return (
    <div className="App">
      <Header/>
      <Body {...BodyProps}/>
      <Footer/>
    </div>
  );
}
*/
function ChildComp(){
  return <div>child component</div>;
}
function App(){
  return (
    <div className="App">
      <Header/>
      <Body>
        <ChildComp/>
      </Body>
      <Footer/>
    </div>
  );
}
export default App;
