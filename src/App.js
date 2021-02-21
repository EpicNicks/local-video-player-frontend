
import React from 'react'
import './App.css';
import { Redirect, Route, Switch, HashRouter } from 'react-router-dom'

import MainMenu from './player-windows/main-menu/MainMenu.jsx'
import Movie from "./player-windows/movie/Movie";
import Series from './player-windows/series/Series';


function App() {
  return (
      <div className="App">
        <HashRouter basename={""}>
          <Switch>
            <Route exact path="/main-menu" component={MainMenu}/>
            <Route path="/movie" component={Movie}/>
            <Route path="/series" component={Series}/>
            <Redirect from={"/"} to={"/main-menu"}/>
          </Switch>
        </HashRouter>
      </div>
  );
}

export default App;