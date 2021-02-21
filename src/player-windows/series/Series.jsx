import './Series.css';

import React, { Component } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from '@material-ui/core/List';

import {SERVER_PATH} from "../../global/globals";

class Series extends Component{

    updateVideo = (season, episode) => {
        this.setState({
            season,
            episode,
            src: `http://${SERVER_PATH}/seriesVideoAPI?title=${encodeURIComponent(this.state.title)}&season=${season}&episode=${episode}`,
            selectedIndex: episode - 1,
            selectedSeasonIndex: season - 1
        });
    }

    getTitle = () => {
        const search = this.props.location.search;
        const title = new URLSearchParams(search).get("title");
        return title;
    }

    episodeCount = (season) =>
        this.state.seriesInfo !== null
            ? this.state.seriesInfo.seasons[season - 1].episodes.length
            : 0;

    selectSeason = (index) =>{
        // no need to reload if season is the same
        if (this.state.season !== index + 1){
            this.setState({selectedSeasonIndex: index, selectedIndex: 0, season: index + 1});
            this.updateVideo(index + 1, 1);
        }
    }

    renderSeasonRow = (props, labelString) => {
        const { index, style } = props;
        const selectedIndex = this.state.selectedSeasonIndex;
        return(
            <ListItem
                button
                key={index}
                selected={selectedIndex === index}
                onClick={() => this.selectSeason(index)}
            >
                <ListItemText primary={`${labelString} ${index + 1}`}/>
            </ListItem>
        )
    }

    selectEpisode = (index) => {
        this.setState({selectedIndex: index, episode: index + 1})
        this.updateVideo(this.state.season, index + 1);
    }

    renderEpisodeRow = (props, labelString) => {
        const { index, style } = props;
        const selectedIndex = this.state.selectedIndex;
        return(
            <ListItem
                button
                // style={style}
                key={index}
                selected={selectedIndex === index}
                onClick={() => this.selectEpisode(index)}
            >
                <ListItemText primary={`${labelString} ${index + 1}`}/>
            </ListItem>
        )
    }

    getSeriesInfo = () => {
        fetch(`http://${SERVER_PATH}/videoInfoAPI/?title=${this.state.title}`)
            .then(res => res.text())
            .then(res => {
                const response = JSON.parse(res);
                this.setState({ seriesInfo: response });
            })
            .catch(err => err);
    }

    getCurrentEpisode = () => this.state.seriesInfo.seasons[this.state.season-1].episodes[this.state.episode-1];

    constructor(props) {
        super(props);
        this.state = {
            title: this.getTitle(),
            season: 1,
            episode: 1,
            src: "",
            seriesInfo: null,
            selectedIndex: 0,
            selectedSeasonIndex: 0
        };
    }

    componentDidMount() {
        this.updateVideo(this.state.season, this.state.episode);
        this.getSeriesInfo();
    }

    render() {
        console.log(this.state.src);
        return (
            <div>
                <div id="series">
                    {/*<h1>{`${this.state.title} - Season ${this.state.season}: Episode ${this.state.episode}`}</h1>*/}
                    <h1>{this.state.seriesInfo !== null ? this.getCurrentEpisode().title !== "" ? `${this.getCurrentEpisode().title}` : `Episode ${this.state.episode}` : null}</h1>
                    {/*video size is overridden in CSS*/}
                    <video
                        autoPlay
                        width={960}
                        height={540}
                        controls
                        src={`${this.state.src}`}
                        onEnded={() => {
                            if (this.state.episode < this.episodeCount(this.state.season)){
                                this.updateVideo(this.state.season, this.state.episode + 1);
                            }
                        }}
                    />
                </div>
                <div id="series-episode-list">
                    <h1>Episode</h1>
                    <div id="series-episode-list-list">
                        <List>
                            {this.state.seriesInfo !== null ? Array.from(Array(this.episodeCount(this.state.season)).keys()).map((value, index) =>
                                this.renderEpisodeRow({index: value, style: null}, "Episode")
                            ) : null}
                        </List>
                    </div>
                </div>
                <div id="series-season-list">
                    <h1>Season</h1>
                    <div id="series-season-list-list">
                        <List>
                            {this.state.seriesInfo !== null ? this.state.seriesInfo.seasons.map((season, index) =>
                                this.renderSeasonRow({index: index, style: null}, "Season")
                            ) : null}
                        </List>
                    </div>
                </div>
            </div>
        );
    }
}

export default Series;