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

    export default laskeEtaisyys