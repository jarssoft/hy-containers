import { Point, solve } from 'salesman.js'
import laskeEtaisyys from './etaisyys'

export const laskeReitinPituus = (reitti) => {
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

export const lyhinReitti = (kaupungit, suuretkaupungit) => {

    const kaikkiKaupungit = [suuretkaupungit[0]].concat(kaupungit)

    //(63,54−60,22) (29,07−21,48) = 0,437
    var points = kaikkiKaupungit.map((city) => new Point(city.leveyspiiri*2, city.pituuspiiri));

    var solution = solve(points);
    var reitti = solution.map(i => kaikkiKaupungit[i]).concat([suuretkaupungit[0]]);

    //console.log(reitti);
    return laskeReitinPituus(reitti)
}
