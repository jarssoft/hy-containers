import Sortable from 'sortablejs';
import { useEffect, useState } from 'react'
//import suuretkaupungit from './kaupungit'
import suuretkaupungit from './maaseutu'
import { Point, solve } from 'salesman.js'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Example from './example'

const Peli = () => {

    // Funktio, joka arpoo satunnaisen kaupungin, poissulkee Helsingin
    const arvoSatunnainenKaupunki = () => {
        var mahdollisetKaupungit = suuretkaupungit.filter(function (kaupunki) {
            return kaupunki.nimi !== 'Nurmes' && kaupunki.nimi !== 'Eurajoki';
        });

        var satunnainenIndeksi = Math.floor(Math.random() * mahdollisetKaupungit.length);
        var satunnainenKaupunki = mahdollisetKaupungit[satunnainenIndeksi];
        mahdollisetKaupungit.splice(satunnainenIndeksi, 1); // Poistetaan valittu kaupunki mahdollisista kaupungeista

        return satunnainenKaupunki;
    }

    const getRandomCities = (num) => {
        // Arvotaan 10 eri kaupunkia
        var valitutKaupungit = [];

        while (valitutKaupungit.length < num - 1) {
            var satunnainenKaupunki = arvoSatunnainenKaupunki();
            if (!valitutKaupungit.some(function (kaupunki) {
                return kaupunki.nimi === satunnainenKaupunki.nimi;
            })) {
                valitutKaupungit.push(satunnainenKaupunki);
            }
        }
        valitutKaupungit.splice(4, 0, suuretkaupungit[1])
        return valitutKaupungit;
    }

    const createCityOrder = () => {
        // Arvo 10 satunnaista kaupunkia
        var randomCities = getRandomCities(10);
        var selectedCities = [];
        var remainingCities = [];

        // Lisää valitut satunnaiset kaupungit kaupunkilistaan
        for (var i = 0; i < randomCities.length; i++) {
            selectedCities.push(randomCities[i]);
        }

        // Luo lista jäljellä olevista kaupungeista
        for (var j = 1; j < suuretkaupungit.length; j++) {
            if (!selectedCities.includes(suuretkaupungit[j])) {
                remainingCities.push(suuretkaupungit[j]);
            }
        }

        return selectedCities
    }

    const [kaupungit, setKaupungit] = useState(createCityOrder());
    const [reitinPituus, setReitinPituus] = useState(10000);
    const [lyhin, setLyhin] = useState(0);
    const [time, setTime] = useState(100)

    useEffect(()=>{
      const interval = setInterval(function() {
        if(time!==0 && reitinPituus>lyhin){
          setTime(time-1);      
        }
      }, 1000);
      return () => clearInterval(interval); 
    }, [time])

    const lyhinReitti = () => {

        const kaikkiKaupungit = [suuretkaupungit[0]].concat(kaupungit)

        //(63,54−60,22) (29,07−21,48) = 0,437
        var points = kaikkiKaupungit.map((city) => new Point(city.leveyspiiri*2, city.pituuspiiri));

        var solution = solve(points);
        var reitti = solution.map(i => kaikkiKaupungit[i]).concat([suuretkaupungit[0]]);

        //console.log(reitti);
        return laskeReitinPituus(reitti)

    }

    useEffect(() => {
        //createCityOrder()
        setLyhin(lyhinReitti())
        setTime(100)
    }, [])

    // Apufunktio asteen muuttamiseksi radiaaneiksi
    const toRadians = (degrees) => {
        return (degrees * Math.PI) / 180;
    }

    // Funktio reitin pituuden laskemiseksi Haversine-kaavalla
    const laskeEtaisyys = (lat1, lon1, lat2, lon2) => {
        // Maapallon säde kilometreissä
        const radius = 6371.0;

        // Muunna latitudet ja longitudet radiaaneiksi
        const lat1Rad = toRadians(lat1);
        const lon1Rad = toRadians(lon1);
        const lat2Rad = toRadians(lat2);
        const lon2Rad = toRadians(lon2);

        // Haversine-kaavan mukainen etäisyys lasketaan
        const dlon = lon2Rad - lon1Rad;
        const dlat = lat2Rad - lat1Rad;
        const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dlon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = radius * c;

        return distance;
    }

    const laskeReitinPituus = (reitti) => {
        //console.log(reitti);
        let totalDistance = 0
        for (let i = 0; i < reitti.length - 1; i++) {
            const city1 = reitti[i];
            const city2 = reitti[i + 1];

            const distance = laskeEtaisyys(city1.leveyspiiri, city1.pituuspiiri, city2.leveyspiiri, city2.pituuspiiri);
            totalDistance += distance;
        }
        return totalDistance
    }

    const padZero = (number) =>{
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

    const calculateRouteLength = () => {

        if(time>0){

            const listItems = document.querySelectorAll("#game-container li span");

            const valittuReitti = [];           
            let entCity = suuretkaupungit[0]
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

            const kaikkiKaupungit = [suuretkaupungit[0]].concat(valittuReitti).concat([suuretkaupungit[0]])   

            //setReitinPituus(laskeReitinPituus(kaikkiKaupungit));
            setKaupungit(kaupungitCopy);
        }
    }

    const listChanged = (newOrder) => {
        let entkaupunki=suuretkaupungit[0]
        newOrder.forEach(element => {
            kaupungit[element.id].suunta = suunta(kaupungit[element.id], entkaupunki)
            entkaupunki=kaupungit[element.id]
        });
        return kaupungit.map(city => <>{city.suunta} {city.nimi}</>)
    }

    const cityMoved = (newOrder) => {
        if(time>0){
            const jarjestys = newOrder.map(card => kaupungit[card.id])
            const kaikkiKaupungit = [suuretkaupungit[0]].concat(jarjestys).concat([suuretkaupungit[0]])  
            setReitinPituus(laskeReitinPituus(kaikkiKaupungit));
        }
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

    return (
        <div id="game-container" onDragEnd={calculateRouteLength}>
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