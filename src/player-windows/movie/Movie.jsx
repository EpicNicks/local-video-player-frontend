
import './Movie.css';
import { SERVER_PATH } from '../../global/globals';

import React, { Component } from 'react';
import MoviePlayer from "../video-player/MoviePlayer";

class Movie extends Component{

    constructor(props) {
        super(props);
        const title = new URLSearchParams(this.props.location.search).get("title")
        this.state = {
            title: title,
            src: `http://${SERVER_PATH}/movieVideoAPI?title=${encodeURIComponent(title)}`
        }
    }

    videoJsOptions = () => {
        return {
            autoplay: true,
            playbackRates: [0.5, 1, 1.5, 2],
            controls: true,
            sources: [{
                src: this.state.src,
                type: 'video/mp4'
            }],
            //my injection
            extraEvents: {
                ended: () => {},
                play: () => {}
            }
        }
    };

    render() {
        return(
            <div id="movie">
                <MoviePlayer {...this.videoJsOptions()}/>
                <h1>{this.state.title}</h1>
            </div>
        );
    }
}

export default Movie;
