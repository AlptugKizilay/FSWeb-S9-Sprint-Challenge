import axios from 'axios'
import React, { useEffect, useState } from 'react'

// önerilen başlangıç stateleri
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.
  
  const initial = {
    email: initialEmail,
    step: initialSteps,
    index: initialIndex,
    
    
  }
  const grid = [
    [1,1],
    [2,1],
    [3,1],
    [1,2],
    [2,2],
    [3,2],
    [1,3],
    [2,3],
    [3,3],
  ]
  const [massage,setMassage] = useState();
  const [result, setResult] = useState(initial);

  function getXY() {
    return grid[result.index][0] + ","+ grid[result.index][1];
  }

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    
    return massage;
  }

  function reset() {
    setResult(initial);
  }

  function ilerle(evt) {

    if(evt.target.id === "left" && !(result.index % 3 == 0)){
      setResult({...result, index: (result.index - 1), step:(result.step + 1 )})
      
    }
    if(evt.target.id === "right" && !((result.index +1) % 3 == 0)){
      setResult({...result, index: (result.index + 1), step:(result.step + 1 )})
      
    }
    if(evt.target.id === "up" && !(result.index < 3)){
      setResult({...result, index: (result.index - 3), step:(result.step + 1 )})
      
    }
    if(evt.target.id === "down" && !(result.index > 5)){
      setResult({...result, index: (result.index + 3), step:(result.step + 1 )})
      
    }
    
    console.log(evt.target.id);
    getXYMesaj();
  }

  function onChange(evt) {
    setResult({...result, [evt.target.id]: evt.target.value})
    
  }

  function onSubmit(evt) {

    evt.preventDefault();
    const data = {
      "x": grid[result.index][0],
      "y": grid[result.index][1],
      "steps": result.step,
      "email": result.email,
    }
    console.log(data);
    axios
      .post("http://localhost:9000/api/result", data)
      .then((res)=>{
        console.log(res.data)
        setMassage(res.data.message);
      })
  }
  useEffect(()=>{
    console.log("result", result); 
  },[result])
  useEffect(()=>{
    getXYMesaj();
  },[massage])

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Koordinatlar ({getXY()})</h3>
        <h3 id="steps">{result.step} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === result.index ? ' active' : ''}`}>
              {idx === result.index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message"> {getXYMesaj()} </h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={ilerle}>SOL</button>
        <button id="up"onClick={ilerle}>YUKARI</button>
        <button id="right"onClick={ilerle}>SAĞ</button>
        <button id="down"onClick={ilerle}>AŞAĞI</button>
        <button id="reset"onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="email girin" onChange={onChange}></input>
        <input id="submit" type="submit"/* onClick={onSubmit} */></input>
      </form>
    </div>
  )
}
