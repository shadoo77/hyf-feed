import { observable, computed, action, runInAction, configure } from 'mobx';
import moment from 'moment';

configure({ enforceActions: "observed" })
class HousesStore {
    
    @observable houses = [];
    @observable cities = [];
    @observable limit = 10;
    @observable state = "loading";
    @observable headerHeigth = 0;
    @observable averages = {};

    @computed get numberOfCurrentData() {
        return this.houses.length;
    }

    @computed get getCityIndexZero() {
        if(this.cities.length < 1) return '';
        else return this.cities[0].location_city;
    }

    @computed get totalNumber() {
        let total = 0;
        this.cities.forEach(el => {
            total += el.Count
        });
        return total;
    }

    @action async retrieveData() {
        try {
        this.status = 'loading';
        const results = await this.loadData();
            runInAction(() => {
                this.state = 'downloaded';
                this.houses.replace(results);
            });
        
        }
        catch(err) {console.log(err);}
    }

    @action async retrieveCitiesName() {
        try {
        const results = await this.loadCitiesName();
            runInAction(() => {
                //this.cities = results;
                this.cities.replace(results);
            });
        }
        catch(err) {console.log(err);}
    }

    @action increatseLimit = (city) => {
        if(city === 'default') this.limit += 10;
        else {
            this.limit += 10;
            this.retrieveDataOfOneCity(city);
        }
    }

    @action resetLimit = () => {
        this.limit = 10;
    }

    @action setHeaderHeight = (heigthOfHeader) => {
        this.headerHeigth = heigthOfHeader;
    }

    @action async retrieveDataOfOneCity(city) {
        try {
        this.status = 'loading';
        const results = await this.loadDataOfCity(city, this.limit);
            runInAction(() => {
                this.state = 'downloaded';
                this.houses = results;
            });
        
        }
        catch(err) {console.log(err);}
    }

    // city status
    @action async retrieveStatusOfOneCity(city) {
        try {
        this.status = 'loading';
        const results = await this.loadCityStatus(city);
            runInAction(() => {
                this.state = 'downloaded';
                this.averages = this.averageGenerator(results);
            });
        
        }
        catch(err) {console.log(err);}
    }

// Average generator &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

averageGenerator = (sourceData) => {
    const avgObj = {
        city: sourceData[0].city,
        days: [],
        avgM2: [],
        avgHouse: []
    };
    const avgArr = [];
    const perM2 = sourceData.map(el => {
        const xx = new Date(el.market_date);
        const date = moment(xx).format('YYYY-MM-DD');
        let avg = el.total_price/el.total_m2;
        avg = avg.toFixed(2);
        avg = Number(avg);
        return {date, avg};
    });
    avgArr.push(perM2);
 
    const perHouse = sourceData.map(el => {
        const xx = new Date(el.market_date);
        const date = moment(xx).format('YYYY-MM-DD');
        let avg = el.total_price/el.total_count;
        avg = avg.toFixed(2);
        avg = Number(avg);
        return {date, avg};
    });
    avgArr.push(perHouse);

    const now = new Date();

    let dateFrom = moment(now).subtract(19,'d').format('YYYY-MM-DD');

    const days = [];
    while(moment(dateFrom).isBefore(now)) {
        days.push(dateFrom);
        dateFrom = moment(dateFrom).add(1, 'days').format('YYYY-MM-DD');
    }
    avgObj.days = days;
    const valuesAvgM2 = [];
    const valuesAvgHouse = [];
    avgArr.forEach((avgArray, index) => {
        let lastAvg = null;
        let currentIndex = 0;
    
        const min = days[0];
        const max = days[days.length - 1];
        for(let day = min; day <= max; day = moment(day).add(1, 'days').format('YYYY-MM-DD')) {
            if(day >= avgArray[currentIndex].date) {
                lastAvg = avgArray[currentIndex].avg;
                if(currentIndex < avgArray.length - 1) 
                currentIndex++;
            }
            index === 0 ? valuesAvgM2.push(lastAvg) : valuesAvgHouse.push(lastAvg);
        }
    });

    avgObj.avgM2 = valuesAvgM2;
    avgObj.avgHouse = valuesAvgHouse;
    return avgObj;
}

// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

    

    loadData() {
        return fetch('/api/list')
                .then(response => response.json())
                .catch(err => console.log(err));
    }

    loadCitiesName() {
        return fetch('/api/cities')
                .then(response => response.json())
                .catch(err => console.log(err));
    }

    loadDataOfCity(city, limit) {
        //const reqBody = {city: city, limit: limit};
        return fetch(`/api/list/searchData?city=${city}&limit=${limit}`)
                .then(res => res.json())
                .catch(error => console.error('Error:', error));
    }

    loadCityStatus(city) {
        //const reqBody = {city: city};
        return fetch(`/api/status?city=${city}`)
                .then(res => res.json())
                .catch(error => console.error('Error:', error));
    }
}
 
const store = new HousesStore();
export default store;