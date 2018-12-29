import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';

import {inject, observer} from 'mobx-react';

const testData = {
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
                        label: 'Amsterdam',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)'
                        ],
                        borderWidth: 1
                    }
                ]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Average Price'
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Date'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Price'
                }
            }]
        }
    }
    /*options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:false
                }
            }]
        }
    }*/
};

@inject('HousesStore')
@observer

class Chart extends Component {
    state ={
        combare: 'unit'
    };

    formatDate(date) {
        //const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const defaultDate = new Date(date);
        return defaultDate.toLocaleDateString("en-US");
    }


    fillChartOfData = () => {
        const chartData = this.props.HousesStore.averages;
        const city = chartData.city;
        const lables = chartData.days;
        const averagesM2 = chartData.avgM2;
        const averagesUnit = chartData.avgHouse;
        const data = {
                        labels: lables,
                        datasets: [
                            {
                                label: this.state.combare === 'unit'
                                         ? 'The average price per one house in ' + city
                                         : 'The average price per one m2 in ' + city,
                                data: this.state.combare === 'unit' ? averagesUnit : averagesM2,
                                backgroundColor: 'rgba(0, 0, 0, 0)',
                                borderColor: this.state.combare === 'unit' ? 'rgb(84, 15, 247)': 'rgb(209, 160, 0)',
                                borderWidth: 2
                            }
                                ]
                    };
        return data;
    }

    handleChange = e => {
        this.setState({[e.target.name]: e.target.value});
    }

    async componentDidMount() {
        await this.props.HousesStore.retrieveCitiesName();
        await this.props.HousesStore.retrieveStatusOfOneCity(this.props.HousesStore.getCityIndexZero);
    }

    render() { 
        return ( 
            <div>
                <form>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" 
                            type="radio" name="combare" value="unit"
                            checked={this.state.combare === 'unit' ? true : false}
                            onChange={this.handleChange} />
                        <label className="form-check-label" htmlFor="combare">
                            Choose chart per one house price
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" 
                            type="radio" name="combare" value="meter"
                            checked={this.state.combare === 'meter' ? true : false}
                            onChange={this.handleChange} />
                        <label className="form-check-label" htmlFor="combare">
                            Choose price per one m2
                        </label>
                    </div>
                </form>
                <Line
                data={this.fillChartOfData()}
                options={testData.options} 
                />
            </div>
         );
    }
}
 
export default Chart;