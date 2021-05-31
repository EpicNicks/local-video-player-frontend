
import React, {Component, useEffect, useState} from 'react';

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Switch as FlipSwitch, ThemeProvider } from "@material-ui/core";
import { connect } from "react-redux";

import { SERVER_PATH } from '../../global/globals';
import './MainMenu.css';
import {darkTheme, darkThemeInline, defaultTheme} from "../../styles/themes";

const MainMenu = (props) => {
    const [titles, setTitles] = useState([]);

    const loadTitles = async() => {
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

    useEffect(() => loadTitles().then(res => setTitles(res)), []);

    const requestVideo = (metadata) => {
        if (metadata.type === "movie"){
            props.history.push(`./Movie?title=${metadata.title}`)
        }
        else if(metadata.type === "series"){
            props.history.push(`./Series?title=${metadata.title}`);
        }
        else{
            console.error("json.type was " + metadata.type + ", and not 'movie' or 'series' as expected");
        }
    }

    return(
        <ThemeProvider theme={props.theme.mui}>
            <div id="main-menu">
                <Grid container direction="column" alignItems="center" justify="center">
                    <h1>Local Video Player Main Menu</h1>
                    <Autocomplete
                        autoHighlight
                        renderInput={(params) => <TextField {...params} label="Search" variant="outlined"/>}
                        options={titles}
                        getOptionLabel={option => option.title}
                        style={{ width: "60%" }}
                        onChange={(event, newValue) => {requestVideo(newValue)}}
                    />
                    <Button
                        id="meta-gen-btn"
                        variant="contained"
                        onClick={() => {props.history.push("/meta-gen")}}
                    >Generate Meta Files</Button>
                    <FlipSwitch
                        onChange={() =>
                        {
                            if (props.theme === defaultTheme ) {
                                props.dispatch({type: "SET_THEME_DARK"})
                                console.log("changing theme to dark");
                            }
                            else{
                                props.dispatch({ type: "SET_THEME_DEFAULT" })
                                console.log("changing theme to default");
                            }
                        }}
                    />
                </Grid>
            </div>
        </ThemeProvider>
    )
}

export default connect(state => ({ theme: state.theme }))(MainMenu);
