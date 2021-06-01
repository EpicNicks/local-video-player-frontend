import './Series.css';

import React, {useEffect, useState} from 'react';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from '@material-ui/core/List';
import { connect } from "react-redux";

import {SERVER_PATH} from "../../global/globals";
import MoviePlayer from "../video-player/MoviePlayer";

const Series = (props) => {

    const updateVideo = (season, episode) => {
        setSeason(s => season);
        setEpisode(e => episode);
        setSrc(s => `http://${SERVER_PATH}/seriesVideoAPI?title=${encodeURIComponent(title)}&season=${season}&episode=${episode}`);
        setSelectedIndex(si => episode - 1);
        setSelectedSeasonIndex(ssi => season - 1);

        if (![null, undefined].includes(videoJS)){
            videoJS.current.pause();
            videoJS.current.src({src, type: 'video/mp4'});
            videoJS.current.play();
            setVideoJS(v => ({...v}));
        }
    }

    const getTitle = () => {
        const search = props.location.search;
        return new URLSearchParams(search).get("title");
    }

    const episodeCount = (season) =>
        seriesInfo !== null
            ? seriesInfo.seasons[season - 1].episodes.length
            : -1;

    const selectSeason = (index) =>{
        // no need to reload if season is the same
        if (season !== index + 1){
            setSelectedSeasonIndex(ssi => index);
            setSelectedIndex(0);
            setSeason(s => index + 1);
            updateVideo(index + 1, 1);
        }
    }

    const renderSeasonRow = (props, labelString, useNumber) => {
        const { index, style } = props;
        return(
            <ListItem
                button
                key={index}
                selected={selectedIndex === index}
                onClick={() => selectSeason(index)}
            >
                <ListItemText primary={`${labelString} ${useNumber ? index + 1 : ""}`}/>
            </ListItem>
        )
    }

    const selectEpisode = (index) => {
        updateVideo(season, index + 1);
    }

    const renderEpisodeRow = (props, labelString) => {
        const { index, style } = props;
        return(
            <ListItem
                button
                // style={style}
                key={index}
                selected={selectedIndex === index}
                onClick={() => selectEpisode(index)}
            >
                <ListItemText primary={`${labelString} ${getEpisode(season, index + 1).episode}`}/>
            </ListItem>
        )
    }

    const getSeriesInfo = async() => {
        const response = await fetch(`http://${SERVER_PATH}/videoInfoAPI/?title=${title}`)
        const text = await response.text()
        setSeriesInfo(JSON.parse(text))
    }

    const getEpisode = (season, episode) => seriesInfo.seasons[season - 1].episodes[episode - 1];
    const getCurrentEpisode = () => getEpisode(season, episode);

    const videoJsOptions = () => {
        return {
            controls: true,
            autoplay: true,
            playbackRates: [0.5, 1, 1.5, 2],
            sources: [{
                src: src,
                type: 'video/mp4'
            }],
            //my injection
             extraEvents: {
                ended: () =>{
                    console.log("episode ended");
                    console.log(`episode: ${episode}, episodeCount: ${seriesInfo}`)
                    if (episode < episodeCount(season)){
                        console.log("next episode starting")
                        updateVideo(season, episode + 1)
                    }
                },
                play: (vjs) => {
                    setVideoJS(vjs);
                    console.log("start:inner");
                }
            }
        }
    };


    const [title, setTitle] = useState(getTitle());
    const [season, setSeason] = useState(1);
    const [episode, setEpisode] = useState(1);
    const [src, setSrc] = useState(`http://${SERVER_PATH}/seriesVideoAPI?title=${encodeURIComponent(title)}&season=1&episode=1`);
    const [seriesInfo, setSeriesInfo] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);
    const [videoJS, setVideoJS] = useState(null);

    useEffect(() => {
        updateVideo(season, episode);
        getSeriesInfo();
        return () => {
            setVideoJS(null)
        }
    }, [])

    return (
        <div id="series-container">
            <div className={'invisible'}/>
            <div id="series">
                <MoviePlayer {...videoJsOptions()}/>
                <h1>{seriesInfo !== null ? getCurrentEpisode().title !== "" ? `${getCurrentEpisode().title}` : `Episode ${episode}` : null}</h1>
            </div>
            <div id={"series-menu-lists"}>
                <div id="series-season-list">
                    <h1>Season</h1>
                    <List id="series-season-list-list">
                        {seriesInfo !== null ? seriesInfo.seasons.map((season, index) =>
                            renderSeasonRow({index: index, style: null}, [null, undefined, ""].includes(season.title) ? "Season" : season.title, [null, undefined, ""].includes(season.title))
                        ) : null}
                    </List>
                </div>
                <div id="series-episode-list">
                    <h1>Episode</h1>
                    <List id="series-episode-list-list">
                        {seriesInfo !== null ? Array.from(Array(episodeCount(season)).keys()).map((value, index) =>
                            renderEpisodeRow({index: value, style: null}, "Episode")
                        ) : null}
                    </List>
                </div>
            </div>
        </div>
    );
}

export default connect(() => ({}))(Series);