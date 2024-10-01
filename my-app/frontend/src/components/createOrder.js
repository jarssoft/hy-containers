const createOrder = (suuretkaupungit) => {

    const getRandomCities = (num) => {

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

export default createOrder