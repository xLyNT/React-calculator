import Wrapper from "./components/Wrapper";
import Screen from "./components/Screen";
import ButtonBox from "./components/ButtonBox";
import Button from "./components/Button";
import React, {useState} from 'react';

const btnValues = [
  ["C", "+-", "%", "/"],
  [7, 8, 9, "*"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="],
];

const toLocaleString = (num) =>
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const removeSpaces = (num) => num.toString().replace(/\s/g, "");

function App() {

  let [calc, setCalc] = useState({
    sign:"",
    num:0,
    res:0
  })

  const numClickHandler = (e) => {
    e.preventDefault();

    const value = e.key || e.target.innerHTML;

    if(removeSpaces(calc.num).length < 16){
      setCalc({
        ...calc,
        num:
          calc.num === 0 && value === '0'
          ? '0' : removeSpaces(calc.num) % 1 === 0 
          ? toLocaleString(Number(removeSpaces(calc.num + value))) : toLocaleString(calc.num + value),
          res : !calc.sign ? 0 : calc.res,

      })
    }
  };
  
  const commaClickHandler = (e) => {
    e.preventDefault();
    const value = e.key || e.target.innerHTML;

    setCalc({
      ...calc,
      num: !calc.num.toString().includes('.') ? calc.num + value : calc.num
    })
  }

  const signClickHandler = (e) => {
    e.preventDefault();
    const value = e.key || e.target.innerHTML;

    setCalc({
      ...calc,
      sign:value,
      res: !calc.res && calc.num ? calc.num : calc.res,
      num:0,
    })
  }

  const equalsClickHandler = () => {

    if(calc.num && calc.sign){
      const math = (a, b, sign) =>  
        sign === '+'
        ? a + b
        : sign === '-'
        ? a - b
        : sign === '*'
        ? a * b : a / b;


        setCalc({
          ...calc,
          res:
          calc.num === '0' && calc.sign === '/'
          ? "Can't divide with 0" 
          : math(Number(removeSpaces(calc.res)), Number(removeSpaces(calc.num)), calc.sign),
          sign: "",
          num: 0,
        })

      
    }
  }

  const invertClickHandler = () => {
    setCalc({
      ...calc,
      num: calc.num ? toLocaleString(removeSpaces(calc.num * -1)) : 0,
      res: calc.res ? toLocaleString(removeSpaces(calc.res * -1)) : 0,
      sign: '0',
    })
  }

  const percentClickHandler = () => {
    let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
    let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;

    setCalc({
      ...calc,
      num: (num /= Math.pow(100,1)),
      res: (res /= Math.pow(100,1)),
      sign: "",
    })
  }

  const resetClickHandler = () => {
    setCalc({
      ...calc,
      num:0,
      res:0,
      sign:'',
    })
  }

  const keyboardHandler = (e) => {
    const signs = '+-*/'
    e.preventDefault()
    if(!isNaN(e.key)){
      return numClickHandler(e);
    }else if(signs.includes(e.key)){
      return signClickHandler(e);
    }else if(e.key === '=' || e.key === 'Enter'){
      return equalsClickHandler();
    }else if (e.key === '%'){
      return percentClickHandler();
    }
    else if(e.key === '.'){
      return commaClickHandler(e);
    }
    else if(e.key === 'Backspace'){
      return resetClickHandler();
    }

  }

  window.onkeydown = keyboardHandler;

  return (
   <Wrapper>
     <Screen value = {calc.num ? calc.num : calc.res} />
     <ButtonBox >
        {
          btnValues.flat().map((btn,i) => {
            return (
              <Button 
              key = {i} 
              className = {btn === "=" ? "equals" : ""}
              value = {btn}
              onClick = {
                btn === "C"
                  ? resetClickHandler
                  : btn === "+-"
                  ? invertClickHandler
                  : btn === "%"
                  ? percentClickHandler
                  : btn === "="
                  ? equalsClickHandler
                  : btn === "/" || btn === "X" || btn === "-" || btn === "+"
                  ? signClickHandler
                  : btn === "."
                  ? commaClickHandler
                  : numClickHandler
              }
              ></Button>
            )
          })
        }
     </ButtonBox>
   </Wrapper>
  );
}

export default App;
