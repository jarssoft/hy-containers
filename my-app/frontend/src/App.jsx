import { useState } from 'react'
import Ohjeet from './components/ohjeet'
import Peli from './components/peli'
import './style.css'
import cors from 'cors'

const App = () => {

  const [count, setCount] = useState(0)
  //this.use(cors())

  const startGame = ()=>{
    setCount(2)
  }

  console.log("update");

  return (
  <div id="container">
  {count==0 ?
  <>
      <button id="instructions" className="button" onClick={()=>setCount(1)}>Ohjeet</button>
      <button id="start-game" className="button" onClick={startGame}>Aloita peli</button>
  </>
  :
  (count==1 ?
  <div>
      <Ohjeet />
      <button className="button" onClick={()=>setCount(0)}>Takaisin</button>
  </div> :
  <>
      <Peli />
      <div id="ohjelmanReitti"></div>
      <div id="button-container">
        <button id="lopetaNappi" onClick={()=>setCount(0)}>Lopeta pelaaminen</button> 
      </div>
  </>
  )
  }</div>)
}

export default App