
import './Movie.css';
import { SERVER_PATH } from '../../global/globals';

import React, { Component } from 'react';
import {Accordion, AccordionSummary, AccordionDetails, Typography} from "@material-ui/core";

import MoviePlayer from "../video-player/MoviePlayer";
import {addRecentlyWatched, getMovieData} from "../../helpers";

class Movie extends Component{

    playbackTimeWriteTimeoutS = 10
    lastWrite = 0

    constructor(props) {
        super(props);
        const title = new URLSearchParams(this.props.location.search).get("title")
        this.state = {
            title: title,
            src: `http://${SERVER_PATH}/movieVideoAPI?title=${encodeURIComponent(title)}`,
            movieData: null
        }
    }

    playbackTimeKey = () => `${this.state.title}-playbackTime`

    writeMoviePlaybackTime = (vjs) => {
        if (typeof(Storage)){
            if (Math.abs(vjs.currentTime() - this.lastWrite) > this.playbackTimeWriteTimeoutS){
                this.lastWrite = vjs.currentTime()
                localStorage.setItem(this.playbackTimeKey(), `${vjs.currentTime().toString()}`)
            }
        }
    }

    loadMovieFromPriorPlayback = (moviePlayer) => {
        if (typeof(Storage)){
            if (moviePlayer.videoNode){
                moviePlayer.videoNode.currentTime = localStorage.getItem(this.playbackTimeKey()) | 0
                console.log("movie started, playback time set to: " + moviePlayer.videoNode.currentTime)
            }
            else{
                console.log("vjs was null")
            }
        }
    }

    videoJsOptions = () => {
        return {
            autoplay: true,
            playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
            controls: true,
            sources: [{
                src: this.state.src,
                type: 'video/mp4'
            }],
            //my injection
            extraEvents: {
                ended: () => {},
                play: () => {}
            },
            loadComplete: (moviePlayer) => {
                this.loadMovieFromPriorPlayback(moviePlayer)
                addRecentlyWatched(this.state.title, false)
            },
            onInterval: (vjs) => {
                this.writeMoviePlaybackTime(vjs)
            }
        }
    };

    render() {
        if (this.state.movieData === null){
            getMovieData(this.state.title).then(res => this.setState({ movieData: res.results[0] ?? "no data" }))
        }
        console.log(this.state.movieData)
        return(
            <div id="movie">
                <MoviePlayer {...this.videoJsOptions()}/>
                <h1>{this.state.title}</h1>
                {this.state.movieData && (() => {
                    const { overview, vote_average, vote_count, release_date } = this.state.movieData
                    return (
                        <Accordion>
                            <AccordionSummary
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>
                                    More Info
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography
                                    align="left"
                                >
                                    <b>Summary:</b> {overview}<br/>
                                    <b>Release Date:</b> {release_date}<br/>
                                    <b>Rating:</b> {vote_average} from {vote_count} votes
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    )
                })()}
            </div>
        );
    }
}

export default Movie;
