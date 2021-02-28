
import React, { Component } from 'react';
import TextField from "@material-ui/core/TextField";

import './MetaFileGenerator.css';
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const apply = (val, f) => {
    f(val);
    return val;
};

export default class MetaGen extends Component{

    emptyMovie = () => ({ title: "title", genre: [], path: "", type: "movie" });
    emptySeries = () => {
        return {
            title: "",
            genre: [],
            type: "series",
            seasons: [
                {
                    title: "",
                    episodes: [
                        {
                            path: "",
                            title: "",
                            episode: 1
                        }
                    ]
                }
            ]
        }
    }

    constructor(props) {
        super(props);

        this.seasons = [];

        this.state = {
            type: "movie",
            title: "",
            path: "",
            genre: [],

            season: 1,
            episode: 1,
            selectedIndex: 0,
            fileUploadHidden: true
        }
    }

    generateJSON = () => {
        let json;
        if (this.state.type === "movie"){
            json = JSON.stringify({
                title: this.state.title,
                genre: this.state.genre,
                path: this.state.path,
                type: this.state.type
            }, null, 2);
        }
        else {
            json = JSON.stringify({
                title: this.state.title,
                genre: this.state.genre,
                type: this.state.type,
                seasons: this.seasons
            }, null, 2);
        }
        const data = new Blob([json], {type: 'text/plain;charset=utf-8'});
        const element = document.createElement('a');
        element.style.display = "none";
        element.setAttribute('href', URL.createObjectURL(data));
        element.setAttribute('download', `${this.state.title}.${this.state.type}n`);
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    generateSeasonRows = () => {
        const selectedIndex = this.state.selectedIndex;
        const res = []
        for (let i = 0; i < this.seasons.length; i++){
            res.push(
                <ListItem
                    button
                    key={i}
                    selected={selectedIndex === i}
                    onClick={() => {
                        this.setState({selectedIndex: i, season: i + 1});
                        if (this.seasons[i] === undefined || this.seasons[i] === null){
                            this.seasons[i] = {title: "", episodes: []};
                        }
                        else{
                            //this.episodeCountInput.props.value = this.state.seasons[i].episodes.length;
                            //console.log(this.episodeCountInput);
                        }
                        this.forceUpdate();
                    }}
                >
                    <ListItemText primary={`Season ${i + 1}`}/>
                </ListItem>
            );
        }
        return res;
    }

    episodeFieldGen = () => {
        const res = [];
        for (let i = 0; i < this.seasons[this.state.season - 1].episodes.length; i++){
            res.push(
                <div>
                    <h3>{`Episode ${i + 1}`}</h3>
                    <TextField
                        type="text"
                        label="title"
                        key={`s${this.state.season}ep${i+1}title`}
                        InputLabelProps={{shrink: true}}
                        value={this.seasons[this.state.season - 1]?.episodes[i]?.title}
                        onChange={e => {
                            if ([null, undefined].includes(this.seasons[this.state.season - 1].episodes[i])){
                                this.seasons[this.state.season - 1].episodes[i] = {title: e.target.value, path: "", episode: 0}
                            }
                            else{
                                this.seasons[this.state.season - 1].episodes[i].title = e.target.value;
                            }
                            this.forceUpdate();
                        }}
                    />
                    <br/>
                    <TextField
                        label="path"
                        key={`s${this.state.season}ep${i+1}path`}
                        InputLabelProps={{shrink: true}}
                        value={this.seasons[this.state.season - 1]?.episodes[i]?.path}
                        onChange={e => {
                            if ([null, undefined].includes(this.seasons[this.state.season - 1].episodes[i])){
                                this.seasons[this.state.season - 1].episodes[i] = {title: "", path: e.target.value.replace(/"/g, ""), episode: 0}
                            }
                            else{
                                this.seasons[this.state.season - 1].episodes[i].path = e.target.value.replace(/"/g, "");
                            }
                            this.forceUpdate();
                        }}
                    />
                    <br/>
                    <TextField
                        label="episode"
                        key={`s${this.state.season}ep${i+1}episode`}
                        type="number"
                        InputLabelProps={{shrink: true}}
                        value={this.seasons[this.state.season - 1]?.episodes[i]?.episode}
                        onChange={e =>{
                            if ([null, undefined].includes(this.seasons[this.state.season - 1].episodes[i])){
                                this.seasons[this.state.season - 1].episodes[i] = {title: "", path: "", episode: parseInt(e.target.value)}
                            }
                            else{
                                this.seasons[this.state.season - 1].episodes[i].episode = parseInt(e.target.value);
                            }
                            this.forceUpdate();
                        }}
                    />
                </div>
            )
        }
        return res;
    }

    getForm = () => {
        if (this.state.type === "movie")
            return (
                <div>
                    <h1>.movien generation</h1>
                    <div className="meta-textfields">
                        <TextField
                            id="standard-basic"
                            label="path"
                            key="movie-path"
                            onChange={e => this.setState({ path: e.target.value.replace(/"/g, "") })}
                            value={this.state.path}
                        />
                        <br/>
                        <TextField
                            id="standard-basic"
                            label="title"
                            key="movie-title"
                            onChange={e => this.setState({ title: e.target.value })}
                            value={this.state.title}
                        />
                        <br/>
                        <TextField
                            id="standard-basic"
                            label="genre"
                            key="movie-genre"
                            onChange={e => this.setState({ genre: e.target.value.split(',').map(v => v.trim()) })}
                            value={this.state.genre.join(", ")}
                        />
                    </div>
                </div>
            )
        else
            return (
                <div>
                    <h1>.seriesn generation</h1>
                    <div className="meta-textfields">
                        <TextField
                            id="standard-basic"
                            label="title"
                            key="series-title"
                            onChange={e => this.setState({ title: e.target.value })}
                            value={this.state.title}
                        />
                        <br/>
                        <TextField
                            id="standard-basic"
                            label="genre"
                            key="series-genre"
                            onChange={e => this.setState({ genre: e.target.value.split(',').map(v => v.trim()) })}
                            value={this.state.genre}
                        />
                        <br/>
                        <TextField
                            id="standard-basic"
                            label="seasons (number)"
                            type="number"
                            onChange={e => {
                                if (parseInt(e.target.value) < 0){
                                    e.target.value = "0";
                                }
                                this.seasons.length = parseInt(e.target.value);
                                this.forceUpdate();
                            }}
                            value={this.seasons.length}
                        />
                        <br/>
                        <div id="meta-gen-episode-entry">
                            {this.seasons.length > 0 ?
                                <List>
                                    {this.generateSeasonRows()}
                                </List>
                            : null }
                            {this.state.selectedIndex < this.seasons.length
                            ?   <div>
                                    <TextField
                                        type="number"
                                        id="standard-basic"
                                        value={this.seasons[this.state.season - 1]?.episodes?.length}
                                        label={`Season ${this.state.season} Episode Count`}
                                        InputLabelProps={{shrink: true}}
                                        onChange={ e => {
                                            if (parseInt(e.target.value) < 0)
                                                e.target.value = "0";
                                            if ([null, undefined].includes(this.seasons[this.state.season - 1])){
                                                this.seasons[this.state.season - 1] = {title: "", episodes: []}
                                                this.seasons[this.state.season - 1].episodes = Array(parseInt(e.target.value));
                                            }
                                            console.log(this.seasons[this.state.season - 1].episodes);
                                            this.seasons[this.state.season - 1].episodes = Array(parseInt(e.target.value));
                                            this.forceUpdate();
                                        }}
                                    />
                                </div>: null
                            }
                            {this.seasons[this.state.season - 1]?.episodes?.length > 0
                                ?
                                <div id="meta-gen-episode-fields">
                                    {this.episodeFieldGen()}
                                </div>
                                : null
                            }
                        </div>
                    </div>
                </div>
            )
    }

    render() {
        return (
            <div id="meta-gen">
                {this.getForm()}
                <div id="meta-gen-submit-btn" className="meta-gen-btn">
                    <Button
                        variant="contained"
                        onClick={() => this.generateJSON()}
                    >
                        Generate
                    </Button>
                    <br/>
                </div>
                <div id="meta-gen-swap-btn" className="meta-gen-btn">
                    <Button
                        variant="contained"
                        onClick={() => this.setState({type: (this.state.type === "movie" ? "series" : "movie")})}
                    >
                        {`Swap to ${this.state.type === "movie" ? "series" : "movie"}`}
                    </Button>
                </div>
                <div id="meta-gen-load-btn" className="meta-gen-btn">
                    <Button
                        variant="contained"
                        onClick={() => this.setState({fileUploadHidden: !this.state.fileUploadHidden})}
                    >
                        Load from file
                    </Button>
                    <br/>
                    {!this.state.fileUploadHidden ?
                        <input
                            type="file"
                            onChange={e => {
                                const file = e.target.files[0];
                                console.log(file);
                                const u = URL.createObjectURL(file);
                                const x = new XMLHttpRequest();
                                x.open('GET', u, false);
                                x.send();
                                URL.revokeObjectURL(u);
                                const blob = new Blob([x.responseText], {type: 'text/plain'});
                                blob.text().then(t => {
                                    const obj = JSON.parse(t);
                                    if (obj.type === "movie"){
                                        console.log("movie uploaded");
                                        this.setState({title: obj.title, type: obj.type, path: obj.path, genre: obj.genre});
                                    }
                                    else if (obj.type === "series"){
                                        console.log("series uploaded");
                                        this.seasons = obj.seasons;
                                        this.setState({title: obj.title, type: obj.type, genre: obj.genre, seasons: obj.seasons});
                                    }
                                });
                            }}
                        >
                        </input>
                        : null
                    }
                </div>
            </div>
        )
    }
}
