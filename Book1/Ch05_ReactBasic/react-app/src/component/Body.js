import "./Body.css";
// Body Compoment 별도 파일에 제작 및 내보내기 설정 
function Body(){
    // const number = 1;

    // const numA = 1;
    // const numB = 2;

    // const strA = "Hello";
    // const strB = "React";

    // const boolA = true;
    // const boolB = false;

    //const num = 10; 


    //const num = 200;
    /*
    if(num%2==0){
        return <div>{num}은(는) 짝수입니다.</div>
    }
    else{
        return <div>{num}은(는) 홀수입니다.</div>
    }
    */

    return(
        <div>
            <h1 className="body">body</h1>
            {/* <h2>{number}</h2> */}
            {/* <h2>{numA + numB}</h2> */}
            {/* <h2>{strA + strB}</h2> */}
            {/* <h2>{String(boolA || boolB)}</h2> */}
            {/* <h2>
                {num}은(는) {num%2==0?"짝수":"홀수"}입니다.
            </h2> */}
        </div>
    );

}

export default Body;