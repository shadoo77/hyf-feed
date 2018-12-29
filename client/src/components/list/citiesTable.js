import React, { Component } from 'react';
import Row from './tableRow';
import Select from './select';
import { Button } from 'reactstrap';
import {inject, observer} from 'mobx-react';

@inject('HousesStore')
@observer
class Citiestable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            city: 'default'
        }
    }

    handleCity = (city) => {
        this.setState({city});
    }

    limitIncrease = () => {
        this.props.HousesStore.increatseLimit(this.state.city);
    }

    render() { 
        const stl = {top: this.props.HousesStore.headerHeigth};
        return ( 
            <React.Fragment>
                <table id="houses-table">
                    <tbody>
                    <tr>
                        <th style={stl}>Country</th>
                        <th style={stl}><Select name="selectCity" initValue="All Cities" catchCity={this.handleCity} /></th>
                        <th style={stl}>Market date</th>
                        <th style={stl}>Address</th>
                        <th style={stl}>Parcel Area</th>
                        <th style={stl}>Gross Area</th>
                        <th style={stl}>Net Area</th>
                        <th style={stl}>Rooms</th>
                        <th style={stl}>Price</th>
                        <th style={stl}>Currency</th>
                        <th style={stl}>Title</th>
                        <th style={stl}>Details</th>
                    </tr>
                    </tbody>
                    <tbody>
                        {this.extractElements()}
                    </tbody>
                </table>
                <Button color="success " className={this.limitSetting()} onClick={this.limitIncrease}>more results ..</Button>
            </React.Fragment>
         );
    }

    limitSetting() {
        const totalNumber = this.props.HousesStore.totalNumber;
        const limit = this.props.HousesStore.limit;
        if(this.state.city === 'default') {
            return limit >= totalNumber ? 'd-none' : 'd-block';
        }else {
            const houseCount = this.props.HousesStore.cities
            .filter(el => el.location_city === this.state.city);
            return limit >= houseCount[0].Count ? 'd-none' : 'd-block';
        }
    }

    displayHouses() {
        const {HousesStore} = this.props;
        return HousesStore.houses.map((el, index) =>
            index >= HousesStore.limit ? null :
                    <Row 
                        key={'row' + index}
                        link={el.link}
                        country={el.location_country}
                        city={el.location_city}
                        marketDate={el.market_date}
                        address={el.location_address}
                        parcelArea={el.size_parcelm2}
                        grossArea={el.size_grossm2}
                        netArea={el.size_netm2}
                        rooms={el.size_rooms}
                        price={el.price_value}
                        currency={el.price_currency}
                        title={el.title}
                        description={el.description} 
                        images={el.images}
                    />
            );
    }

    extractElements() {
        const noElement =  <div className="alert alert-danger" role="alert">No items...!</div>;
        const loading = <div className="alert alert-warning" role="alert">loading ..</div>;
        const {HousesStore} = this.props;
        if(HousesStore.numberOfCurrentData < 1 && HousesStore.state === 'loading'){
            return <tr><td  colSpan="12">{loading}</td></tr>;
        }else if(HousesStore.numberOfCurrentData < 1 && HousesStore.state === 'downloaded'){
            return <tr><td  colSpan="12">{noElement}</td></tr>;
        } else return this.displayHouses();
    }
}
 
export default Citiestable;