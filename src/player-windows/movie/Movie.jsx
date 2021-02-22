
import './Movie.css';
import { SERVER_PATH } from '../../global/globals';

import React, { Component } from 'react';

class Movie extends Component{

    getTitle(){
        const search = this.props.location.search;
        const title = new URLSearchParams(search).get("title");
        return title;
    }

    loadMovie(){
        console.log(this.state.title.replace(/\s/g, "%20"));
        this.setState({src: `http://${SERVER_PATH}/movieVideoAPI?title=${encodeURIComponent(this.state.title)}`});
    }

    constructor(props) {
        super(props);
        this.state = {
            title: this.getTitle(),
            src: ""
        }
    }

    componentDidMount() {
        this.loadMovie();
    }

    render() {
        return(
            <div id="movie">
                <h1>{this.state.title}</h1>
                <video autoPlay width="80%" controls >
                    <source src={`${this.state.src}`} type="video/mp4"/>
                    <source src={`${this.state.src}`} type="video/ogg"/>
                </video>
            </div>
        );
    }
}

export default Movie;
