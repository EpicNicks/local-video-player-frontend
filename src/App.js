
import React, {Component} from 'react'
import './App.css';
import { Redirect, Route, Switch, HashRouter } from 'react-router-dom'
import { ThemeProvider, withStyles } from "@material-ui/core";

import MainMenu from './player-windows/main-menu/MainMenu.jsx'
import Movie from "./player-windows/movie/Movie";
import Series from './player-windows/series/Series';
import MetafileGenerator from "./player-windows/meta-gen/MetafileGenerator";

import {defaultTheme, darkTheme, getTheme, customTheme} from './styles/themes'

const useStyles = getTheme().main();

class App extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        const { classes } = this.props;

        return (
            <ThemeProvider theme={getTheme().mui}> {/*main themes*/}
                <div className={`App ${classes.root}`}>
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
            </ThemeProvider>

        );
    }
}

export default withStyles(useStyles, { withTheme: true })(App);