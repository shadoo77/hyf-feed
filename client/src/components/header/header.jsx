import React, { Component } from 'react';
import NavMenu from './navMenu';
import {inject, observer} from 'mobx-react';

@inject('HousesStore')
@observer
class Header extends Component {
    constructor(props) {
        super(props);
        this.myHeader = React.createRef();
        this.state = {
            logoSize: 420
        };
    }

    componentDidMount() {
        console.log(this.myHeader.current.offsetHeight)
        this.setState({
            logoSize: this.myHeader.current.offsetHeight < 190
            ? 420 : 300
        });
        this.props.HousesStore.setHeaderHeight(this.myHeader.current.offsetHeight);
        window.addEventListener('resize', () => {
            this.props.HousesStore.setHeaderHeight(this.myHeader.current.offsetHeight);
        }, false);

        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                if(this.myHeader.current.offsetHeight < 190) this.setState({logoSize: 340});
                else this.setState({logoSize: 270});
            }else {
                if(this.myHeader.current.offsetHeight < 190) this.setState({logoSize: 420});
                else this.setState({logoSize: 300});
            }
        }, false);
    }

    render() { 
        ///Users/shadiomar/final-project/client/public/LogoMakr_89d5gV.png
        return ( 
            <div className="header" ref={this.myHeader}>
                <div className="header-content">
                    <div id="logo">
                        <section className="logo-text">
                        <img src="./LogoMakr_89d5gV.png"
                         alt="logoImg"
                         style={{width: this.state.logoSize}} />
                        </section>
                    </div>
                    <div className="nav-wrap"><NavMenu /></div>
                </div>
            </div>
         );
    }
}
 
export default Header;