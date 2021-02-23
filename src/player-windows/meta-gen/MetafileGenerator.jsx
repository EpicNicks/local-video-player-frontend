
import React, { Component } from 'react';
import TextField from "@material-ui/core/TextField";

import './MetaFileGenerator.css';
import Button from "@material-ui/core/Button";

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

        this.state = {
            type: "movie",
            data: this.emptyMovie()
        }
    }

    generateJSON = () => {
        let json;
        if (this.state.type === "movie"){
            json = JSON.stringify({
                title: this.state.data.title,
                genre: this.state.data.genre,
                path: this.state.data.path,
                type: this.state.type
            });
        }
        else {

        }
        const data = new Blob([json], {type: 'text/plain;charset=utf-8'});
        const element = document.createElement('a');
        element.style.display = "none";
        element.setAttribute('href', URL.createObjectURL(data));
        element.setAttribute('download', `${this.state.data.title}.${this.state.type}n`);
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
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
                            onChange={e => this.setState({ data: apply({...this.state.data}, data => data.path = e.target.value) })}
                        />
                        <br/>
                        <TextField
                            id="standard-basic"
                            label="title"
                            onChange={e => this.setState({ data: apply({...this.state.data}, data => data.title = e.target.value) })}
                        />
                        <br/>
                        <TextField
                            id="standard-basic"
                            label="genre"
                            onChange={e => this.setState({ data: apply({...this.state.data}, data => data.genre = e.target.value.split(',').map(v => v.trim())) })}
                        />
                    </div>
                </div>
            )
        else
            return (
                <div>
                    bar
                </div>
            )
    }

    render() {
        return (
            <div id="meta-gen">
                {this.getForm()}
                <div id="meta-gen-submit-btn">
                    <Button
                        variant="contained"
                        onClick={() => this.generateJSON()}
                    >
                        Generate
                    </Button>
                    <br/>
                </div>
                <div id="meta-gen-swap-btn">
                    <Button
                        variant="contained"
                        onClick={() => this.setState({type: (this.state.type === "movie" ? "series" : "movie")})}
                    >
                        {`Swap to ${this.state.type === "movie" ? "series" : "movie"}`}
                    </Button>
                </div>
            </div>
        )
    }
}
