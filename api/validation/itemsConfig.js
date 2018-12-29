const uuidv4 = require('uuid/v4');

function housesArrayProduce(houses) {
    let qurArr = [];
    houses.forEach((house, i) => {
        const {link, market_date, location, size, price, images, description, title, sold} = house;
        const strImg = images.join();
        const myDate = new Date(market_date);
        qurArr[i] = [link, myDate, location.country, location.city, location.address, location.coordinates.lat,
            location.coordinates.lng, size.gross_m2, size.rooms, price.value, price.currency, description, title, strImg, sold];
    });
    return qurArr;
}

function extractCities(houses) {
    const citiesArr = houses.map(el => el.location.city);
    const cities = citiesArr.filter(function (item, pos) {
        return citiesArr.indexOf(item) == pos;
    });
    return cities;
}

function getOneCityStatus(city, houses) {
    let status = {
        id: '',
        city: '',
        marketDate: '',
        totalPrice: 0,
        totalCount: 0,
        totalM2: 0
    };
    const cities = extractCities(houses);
      cities.forEach(place => {
        if (city) {
          if (city === place) {
            status.id = uuidv4();
            status.city = city;
            status.marketDate = new Date();
            let price = 0;
            let area = 0;
            houses.forEach(house => {
              if (house.location.city === city) {
                //status.marketDate = new Date (house.market_date);
                status.totalCount += 1;
                price += house.price.value;
                price = price.toFixed(2);
                price = Number(price);
                status.totalPrice = price;
                area += house.size.gross_m2;
                area = area.toFixed(2);
                area = Number(area);
                status.totalM2 = area;
              }
            });
          }
        }
      });
      return status;
}

function getAllCitiesStatus(houses) {
    let citiesStatus = [];
    const cities = extractCities(houses);
    cities.forEach(place => {
      citiesStatus.push(getOneCityStatus(place, houses));
    })
    return citiesStatus;
  }

  function statusArray(data) {
    let qurArray = [];
    const citiesStatus = getAllCitiesStatus(data);
    citiesStatus.forEach((place, i) => {
      const { id, city, marketDate, totalPrice, totalCount, totalM2 } = place;
      qurArray[i] = [id, city, marketDate, totalPrice, totalCount, totalM2];
    });
    return qurArray;
  }

  module.exports = {housesArrayProduce, statusArray};