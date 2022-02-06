
import React, { Component } from 'react';

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Switch as FlipSwitch } from "@material-ui/core";

import { SERVER_PATH } from '../../global/globals';
import './MainMenu.css';

import { darkMode, lightMode, setStyles, jsonToCssString } from "../../styles/StylesManagement";
import {light} from "@material-ui/core/styles/createPalette";

class MainMenu extends Component{

    async loadTitles(){
        const titles = [];
        let response;
        await fetch(`http://${SERVER_PATH}/videoTitles`)
            .then(res => res.text())
            .then(res => {
                response = res;
            })
            .catch(err => err);
        response = JSON.parse(response);
        for (const obj of response){
            titles.push(obj);
        }
        return titles;
    }

    requestVideo(metadata){
        if (metadata.type === "movie"){
            this.props.history.push(`./Movie?title=${metadata.title}`)
        }
        else if(metadata.type === "series"){
            this.props.history.push(`./Series?title=${metadata.title}`);
        }
        else{
            console.error("json.type was " + metadata.type + ", and not 'movie' or 'series' as expected");
        }
    }

    constructor(props) {
        super(props)
        this.state = { apiResponse: "not overwritten", titles: [], theme: lightMode };
    }

    componentDidMount() {
        this.loadTitles()
            .then(res => {
                this.setState({ titles: res})
            });
    }

    render(){
        return(
            <div id="main-menu">
                <Grid container direction="column" alignItems="center" justify="center">
                    <h1>Local Video Player Main Menu</h1>
                    <Autocomplete
                        autoHighlight
                        renderInput={(params) => <TextField {...params} label="Search" variant="outlined"/>}
                        options={this.state.titles}
                        getOptionLabel={option => option.title}
                        style={{ width: "60%" }}
                        onChange={(event, newValue) => {this.requestVideo(newValue)}}
                    />
                    <Button
                        id="meta-gen-btn"
                        variant="contained"
                        onClick={() => {this.props.history.push("/meta-gen")}}
                    >Generate Meta Files</Button>
                    {/* TODO: recently watched?*/}
                    {/*<FlipSwitch*/}
                    {/*    onChange={() =>*/}
                    {/*    {*/}
                    {/*        // setTheme("DARK");*/}
                    {/*        // console.log(getTheme().main)*/}
                    {/*        // this.forceUpdate();*/}
                    {/*        const theme = this.state.theme === lightMode ? darkMode : lightMode*/}
                    {/*        const style = jsonToCssString(theme)*/}
                    {/*        console.log(style)*/}
                    {/*        setStyles(style)*/}
                    {/*        this.setState({ theme })*/}
                    {/*    }}*/}
                    {/*/>*/}
                </Grid>
            </div>
        )
    }
}

export default MainMenu;
