import './Series.css'

import React, { Component } from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import List from '@material-ui/core/List'

import {SERVER_PATH} from "../../global/globals"
import MoviePlayer from "../video-player/MoviePlayer"
import { getSeriesData } from "../../helpers";
import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@material-ui/core";

let videoJS = null

class Series extends Component{

    getLastPlayedEpisode = () => {
        if (typeof(Storage)){
            const lastPlayedData = localStorage.getItem(`${this.state.title}`)
            if (lastPlayedData){
                const lastPlayed = lastPlayedData.split(",")
                return {
                    season: Number.parseInt(lastPlayed[0]),
                    episode: Number.parseInt(lastPlayed[1])
                }
            }
        }
        return {
            season: 1,
            episode: 1
        }
    }

    setLastPlayedEpisode = (season, episode) => {
        if (typeof(Storage)){
            localStorage.setItem(`${this.state.title}`, `${season},${episode}`)
        }
    }

    updateVideo = (season, episode) => {
        const src = `http://${SERVER_PATH}/seriesVideoAPI?title=${encodeURIComponent(this.state.title)}&season=${season}&episode=${episode}`
        this.setState({
            season,
            episode,
            src: src,
            selectedIndex: episode - 1,
            selectedSeasonIndex: season - 1
        })
        if (videoJS !== null && videoJS !== undefined){
            console.log("setting src", src)
            videoJS?.pause()
            // todo: add support for other filetypes
            videoJS?.src({src, type: 'video/mp4'})
            videoJS?.play()
        }
        this.setLastPlayedEpisode(season, episode)
    }

    getTitle = () => {
        const search = this.props.location.search
        const title = new URLSearchParams(search).get("title")
        return title
    }

    episodeCount = (season) =>
        this.state.seriesInfo !== null
            ? this.state.seriesInfo.seasons[season - 1].episodes.length
            : 0

    selectSeason = (index) =>{
        // no need to reload if season is the same
        if (this.state.season !== index + 1){
            this.setState({selectedSeasonIndex: index, selectedIndex: 0, season: index + 1})
            this.updateVideo(index + 1, 1)
        }
    }

    renderSeasonRow = (props, labelString, useNumber) => {
        const { index, style } = props
        const selectedIndex = this.state.selectedSeasonIndex
        return(
            <ListItem
                button
                key={index}
                selected={selectedIndex === index}
                onClick={() => this.selectSeason(index)}
            >
                <ListItemText primary={`${labelString} ${useNumber ? index + 1 : ""}`}/>
            </ListItem>
        )
    }

    selectEpisode = (index) => {
        this.updateVideo(this.state.season, index + 1)
    }

    renderEpisodeRow = (props, labelString) => {
        const { index, style } = props
        const selectedIndex = this.state.selectedIndex
        return(
            <ListItem
                button
                // style={style}
                key={index}
                selected={selectedIndex === index}
                onClick={() => this.selectEpisode(index)}
            >
                <ListItemText primary={`${labelString} ${this.getEpisode(this.state.season, index + 1).episode}`}/>
            </ListItem>
        )
    }

    getSeriesInfo = () => {
        fetch(`http://${SERVER_PATH}/videoInfoAPI/?title=${this.state.title}`)
            .then(res => res.text())
            .then(res => {
                const response = JSON.parse(res)
                this.setState({ seriesInfo: response })
            })
            .catch(err => err)
    }

    getEpisode = (season, episode) => this.state.seriesInfo.seasons[season - 1].episodes[episode - 1]
    getCurrentEpisode = () => this.getEpisode(this.state.season, this.state.episode)

    constructor(props) {
        super(props)
        const title = this.getTitle()
        this.state = {
            title: title,
            season: 1,
            episode: 1,
            src: `http://${SERVER_PATH}/seriesVideoAPI?title=${encodeURIComponent(title)}&season=1&episode=1`,
            seriesInfo: null,
            selectedIndex: 0,
            selectedSeasonIndex: 0,
            seriesData: null
        }
    }

    componentDidMount() {
        const { season, episode } = this.getLastPlayedEpisode()
        this.updateVideo(season, episode)
        this.getSeriesInfo()
    }

    componentWillUnmount() {
        videoJS = null
    }

    videoJsOptions = () => {
        return {
            controls: true,
            autoplay: true,
            playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
            sources: [{
                src: this.state.src,
                type: 'video/mp4'
            }],
            //my injections
            extraEvents: {
                ended: () => {
                    if (this.state.episode < this.episodeCount(this.state.season)){
                        this.updateVideo(this.state.season, this.state.episode + 1)
                    }
                },
                play: () => {
                    console.log("start:inner")
                }
            },
            loadComplete: (moviePlayer) => {
                videoJS = moviePlayer.player
                console.log("load complete", videoJS)
                const { season, episode } = this.getLastPlayedEpisode()
                this.updateVideo(season, episode)
            },
        }
    }

    render() {
        if (this.state.seriesData === null){
            getSeriesData(this.state.title).then(res => this.setState({ seriesData: res.results[0] ?? "no data" }))
        }
        console.log(this.state.seriesData)
        return (
            <div>
                <div id="series-container">
                    <div className={'invisible'}/>
                    <div id="series">
                        {/*<h1>{`${this.state.title} - Season ${this.state.season}: Episode ${this.state.episode}`}</h1>*/}
                        {/*video size is overridden in CSS*/}
                        <MoviePlayer {...this.videoJsOptions()}/>
                        <h1>{this.state.seriesInfo !== null ? this.getCurrentEpisode().title !== "" ? `${this.getCurrentEpisode().title}` : `Episode ${this.state.episode}` : null}</h1>
                    </div>
                    <div id={"series-menu-lists"}>
                        <div id="series-season-list">
                            <h1>Season</h1>
                            <List id="series-season-list-list">
                                {this.state.seriesInfo !== null ? this.state.seriesInfo.seasons.map((season, index) =>
                                    this.renderSeasonRow({index: index, style: null}, [null, undefined, ""].includes(season.title) ? "Season" : season.title, [null, undefined, ""].includes(season.title))
                                ) : null}
                            </List>
                        </div>
                        <div id="series-episode-list">
                            <h1>Episode</h1>
                            <List id="series-episode-list-list">
                                {this.state.seriesInfo !== null ? Array.from(Array(this.episodeCount(this.state.season)).keys()).map((value, index) =>
                                    this.renderEpisodeRow({index: value, style: null}, "Episode")
                                ) : null}
                            </List>
                        </div>
                    </div>
                </div>
                <div id="series-description-container">
                    {this.state.seriesData && (() => {
                        const { overview, vote_average, vote_count, first_air_date } = this.state.seriesData
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
                                        <b>First Aired Date:</b> {first_air_date}<br/>
                                        <b>Rating:</b> {vote_average} from {vote_count} votes
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        )
                    })()}
                </div>
            </div>
        )
    }
}

export default Series