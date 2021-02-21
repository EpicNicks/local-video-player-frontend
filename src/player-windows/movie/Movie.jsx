
import './Movie.css'

import React, { Component } from 'react';

class Movie extends Component{

    render() {
        return(
            <div id="movie">
                <h1>Video</h1>
                <video width={960} height={540} controls />
            </div>
        );
    }
}

export default Movie;
