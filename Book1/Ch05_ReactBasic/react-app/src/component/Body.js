//import "./Body.css";
// Body Compoment 별도 파일에 제작 및 내보내기 설정 
/*
function Body(props){
    // const number = 1;

    // const numA = 1;
    // const numB = 2;

    // const strA = "Hello";
    // const strB = "React";

    // const boolA = true;
    // const boolB = false;

    //const num = 10; 


    //const num = 200;
    
    if(num%2==0){
        return <div>{num}은(는) 짝수입니다.</div>
    }
    else{
        return <div>{num}은(는) 홀수입니다.</div>
    }
    

    return(
        <div>
            <h1 className="body">{props.name}</h1>
            <h1 className="body">body</h1>
            <h2>{number}</h2>
            <h2>{numA + numB}</h2>
            <h2>{strA + strB}</h2>
            <h2>{String(boolA || boolB)}</h2>
            <h2>
                {num}은(는) {num%2==0?"짝수":"홀수"}입니다.
            </h2>
        </div>
    );

}
*/

//Props 예시 
//defaultProps 대신 컴포넌트 파라미터에서 default 값을 초기화하는 것으로 대체 
/*
function Body({name, location, favorList = []}){
    console.log(name, location, favorList);
    return (
        <div className="body">
            {name}은 {location}에 거주합니다.
            <br/>
            {favorList.length}개의 음식을 좋아합니다.
        </div>
    );
}
*/
/*
//defaultProps를 더이상 지원하지 않는 것으로 보임
Body.defaultProps = {
    favorList: [],
};
*/

function Body({children}){
    return <div className="body">{children}</div>;
}

export default Body;