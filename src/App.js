
import React, {Component} from 'react'
import './App.css';
import { Redirect, Route, Switch, HashRouter } from 'react-router-dom'

import MainMenu from './player-windows/main-menu/MainMenu.jsx'
import Movie from "./player-windows/movie/Movie";
import Series from './player-windows/series/Series';
import MetafileGenerator from "./player-windows/meta-gen/MetafileGenerator";

class App extends Component{
    render(){

        return (
                <div className={`App`}>
                    <HashRouter basename={""}>
                        <Switch>
                            <Route exact path="/main-menu" component={MainMenu}/>
                            <Route exact path="/meta-gen" component={MetafileGenerator}/>
                            <Route path="/movie" component={Movie}/>
                            <Route path="/series" component={Series}/>
                            <Redirect from={"/"} to={"/main-menu"}/>
                        </Switch>
                    </HashRouter>
                </div>
        );
    }
}

export default App;