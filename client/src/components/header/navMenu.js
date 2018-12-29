import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';

class NavMenu extends Component {
    state = { 
        menuItem1: false,
        menuItem2: false,
        menuItem3: false
     };

     handleClick = e => {
        this.setState({
            menuItem1: e.target.name === 'menuItem1' ? true : false,
            menuItem2: e.target.name === 'menuItem2' ? true : false,
            menuItem3: e.target.name === 'menuItem3' ? true : false
        });
     }

     componentDidMount() {
        const cuurentPath = this.props.location.pathname;
        this.setState({
            menuItem1: cuurentPath === '/'|| cuurentPath === '/list' ? true : false,
            menuItem2: cuurentPath === '/status' ? true : false,
            menuItem3: cuurentPath === '/add-json' ? true : false
        });
     }

    render() { 
        return ( 
            <ul className="navmenu">
                <li>
                    <Link className={this.state.menuItem1 ? "link active" : "link"}
                     to="/list" name="menuItem1" onClick={this.handleClick}>
                     Home</Link>
                </li>
                <li>
                    <Link className={this.state.menuItem2 ? "link active" : "link"}
                     to="/status" name="menuItem2" onClick={this.handleClick}>
                     City Status</Link>
                </li>
                <li>
                    <Link className={this.state.menuItem3 ? "link active" : "link"}
                     to="/add-json" name="menuItem3" onClick={this.handleClick}>
                     Add to database</Link>
                </li>
            </ul>
         );
    }
}
 
export default withRouter(NavMenu);