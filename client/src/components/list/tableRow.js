import React, { Component } from 'react';
import {inject, observer} from 'mobx-react';
import { Link } from 'react-router-dom';

@inject('HousesStore')
@observer
class TableRow extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    formatDate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const defaultDate = new Date(date);
        return defaultDate.toLocaleDateString("en-US", options);
    }

    render() { 
        const {link, country, city, marketDate, address, parcelArea,
            grossArea, netArea, rooms, price, currency,
            title, description, images} = this.props;
        const house = {
            link, country, city, marketDate, address, parcelArea,
            grossArea, netArea, rooms, price, currency,
            title, description, images
        };
        
        //const {HousesStore} = this.props;
        return ( 
                <tr>
                    <td>{country}</td>
                    <td>{city}</td>
                    <td>{this.formatDate(marketDate)}</td>
                    <td>{address}</td>
                    <td>{parcelArea === null ? "---" : parcelArea}</td>
                    <td>{grossArea === null ? "---" : grossArea}</td>
                    <td>{netArea === null ? "---" : netArea}</td>
                    <td>{rooms}</td>
                    <td>{price}</td>
                    <td>{currency}</td>
                    <td>{title}</td>
                    <td><Link to={{ pathname: '/house', state: house }}>click here</Link></td>
                </tr>
         );
    }
}
 
export default TableRow;