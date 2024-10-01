import Sortable from 'sortablejs';
import { useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Example from './example'
import axios from 'axios'
import createOrder from '../gamelogic/createOrder';
import laskeEtaisyys from '../gamelogic/etaisyys';
import { laskeReitinPituus, lyhinReitti } from '../gamelogic/lyhinreitti';

const Peli = () => {

    const [kaikkikaupungit, setKaikkikaupungit] = useState([])
    const [kaupungit, setKaupungit] = useState([]); 
    const [reitinPituus, setReitinPituus] = useState(10000);
    const [lyhin, setLyhin] = useState(0);
    const [time, setTime] = useState(100)

    const BACKENDURL=import.meta.env.VITE_BACKEND_URL

    useEffect(() => {
        console.log('effect')
        axios
        .get(BACKENDURL)
        .then(response => {
            console.log('promise fulfilled')
            console.log(response.data)
            setKaikkikaupungit(response.data)            
            const order = createOrder(response.data)
            setKaupungit(order)
            setLyhin(lyhinReitti(order, response.data))
            setTime(100)
            })
        }, [])

    useEffect(()=>{
      const interval = setInterval(function() {
        if(time!==0 && reitinPituus>lyhin){
          setTime(time-1);      
        }
      }, 1000);
      return () => clearInterval(interval); 
    }, [time])

    const padZero = (number) => {
        return (number < 10) ? '0' + number : number;
    }

    const suunta = (city1, city2) => {

        const x = city1.pituuspiiri-city2.pituuspiiri
        const y =(city2.leveyspiiri-city1.leveyspiiri)*2
        const e = laskeEtaisyys(
                city1.leveyspiiri, city1.pituuspiiri, 
                city2.leveyspiiri, city2.pituuspiiri) 
                < 200 ? 0 : 1

        if(Math.abs(x/y)<2.414213562 && Math.abs(x/y)>0.4142135624){
            if(y>0){
                if(x>0){
                    return [<>&#x2198;</>, <>&#x21D8;</>][e]
                }else{
                    return [<>&#x2199;</>, <>&#x21D9;</>][e]
                }
            }else{
                if(x>0){
                    return [<>&#x2197;</>, <>&#x21D7;</>][e]
                }else{
                    return [<>&#x2196;</>, <>&#x21D6;</>][e]
                }
            }
        }

        //console.log(x,Math.abs(y));
        if(-x>Math.abs(y)){
            return [<>&larr;</>, <>&lArr;</>][e]
        }
        if(x>Math.abs(y)){
            return [<>&rarr;</>, <>&rArr;</>][e]
        }
        if(y<0){
            return [<>&uarr;</>, <>&uArr;</>][e]
        }else{
            return [<>&darr;</>, <>&dArr;</>][e]
        }
    }

    const dragEnded = () => {

        console.log("calculateRouteLength");

        if(time>0){

            const listItems = document.querySelectorAll("#game-container li span");

            const valittuReitti = [];           
            let entCity = kaikkikaupungit[0]
            let kaupungitCopy = [...kaupungit];

            for (let i = 0; i < listItems.length; i++) {
                const cityName = listItems[i].textContent;
                
                const city = kaupungit.find(city => city.nimi === cityName);
                kaupungitCopy[i].suunta=suunta(city, entCity)

                if (city) {
                    valittuReitti.push(city);
                }
                entCity=city
            }

            const kaikkiKaupungit = [kaikkikaupungit[0]].concat(valittuReitti).concat([kaikkikaupungit[0]])   

            //setReitinPituus(laskeReitinPituus(kaikkiKaupungit));
            setKaupungit(kaupungitCopy);
        }
    }

    const cityMoved = (newOrder) => {
        console.log("cityMoved");
        if(time>0){
            const jarjestys = newOrder.map(card => kaupungit[card.id])
            const kaikkiKaupungit = [kaikkikaupungit[0]].concat(jarjestys).concat([kaikkikaupungit[0]])  
            setReitinPituus(laskeReitinPituus(kaikkiKaupungit));
        }
    }

    const listChanged = (newOrder) => {
        
        console.log("listChanged");

        let entkaupunki=kaikkikaupungit[0]
        newOrder.forEach(element => {
            kaupungit[element.id].suunta = suunta(kaupungit[element.id], entkaupunki)
            entkaupunki=kaupungit[element.id]
        });
        return kaupungit.map(city => <>{city.suunta} {city.nimi}</>)
    }

    const style = {
        border: '1px solid gray',
        padding: '0rem 0rem',
        marginBottom: '0rem',
        backgroundColor: 'white',
        font: 'white',
        width: 330,
        color:'gray',
      }

    return (kaupungit.length<1
        ? <div>loading...</div> 
        : <div id="game-container" onDragEnd={dragEnded}>
            <div style={{...style}}>Nurmes</div>
            <div className="App">
				<DndProvider backend={HTML5Backend}>
					<Example initCards={kaupungit.map(city => <>&rarr; {city.nimi}</>)} onMove={cityMoved} onChange={listChanged}/>
				</DndProvider>
			</div>
            <div style={{...style}}>Nurmes</div>

            <div id="distance">{Math.floor(reitinPituus)} / {Math.floor(lyhin)} km</div>
            {<div id="clock">{Math.floor(time / 60)}:{padZero(time % 60)}</div> }
        </div>
    )
}

export default Peli