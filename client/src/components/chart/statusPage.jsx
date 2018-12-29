import React, { Component } from 'react';
import ChartSelect from './chart-select';
import Chart from './chart';

import {inject, observer} from 'mobx-react';

@inject('HousesStore')
@observer

class StatusPage extends Component {
    render() { 
        return ( 
            <div>
                <ChartSelect />
                <Chart />
            </div>
         );
    }
}
 
export default StatusPage;