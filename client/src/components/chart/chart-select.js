import React, { Component } from 'react';
import {inject, observer} from 'mobx-react';

@inject('HousesStore')
@observer
class ChartSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectStatus: '',
        };
        
    }

    handleChange = e => {
        this.setState({[e.target.name]: e.target.value});
        this.props.HousesStore.retrieveStatusOfOneCity(e.target.value);
    }

    extractOptions() {
        const {HousesStore} = this.props;
        
        return HousesStore.cities.map((el, index) =>
                            <option key={'status' + index} value={el.location_city}>
                                {el.location_city}
                            </option>
                        );
    }

    async componentDidMount() {
        await this.props.HousesStore.retrieveCitiesName();
        this.setState({
            selectStatus: this.props.HousesStore.getCityIndexZero
        });
    }

    render() { 
        return ( 
            <select name="selectStatus" 
                value={this.state.selectStatus}
                onChange={this.handleChange}
            >
                {this.extractOptions()}
            </select>
         );
    }
}
 
export default ChartSelect;