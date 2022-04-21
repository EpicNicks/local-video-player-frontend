
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import './RecentlyWatchedTile.css'
import {SERVER_PATH} from "../../../../global/globals";
import {getMovieData, getSeriesData} from "../../../../helpers";

// props:
// movie data or series data

// displays title + season number + episode number, ${title} [S${s}:E${e}] over the poster image
class RecentlyWatchedTile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            posterPath: ""
        }
    }

    componentDidMount() {
        fetch(`http://${SERVER_PATH}/videoInfoAPI/?title=${this.props.title.title}`)
            .then(res => res.text())
            .then(res => JSON.parse(res))
            .then(title => {
                const f = title.type === "series" ? getSeriesData : getMovieData
                f(title.title).then(res => {
                    if (res.results.length > 0){
                        this.setState({posterPath: this.posterURL(res.results[0].poster_path)})
                    }
                    else{
                        this.setState({posterPath: process.env.PUBLIC_URL + '/error_poster.png'})
                    }
                })
            })
    }

    componentWillUnmount() {
    }

    posterURL = (posterPath) => `https://image.tmdb.org/t/p/original${posterPath}`

    render(){
        const [season, episode] = (this.props.title.isSeries && typeof Storage) ? localStorage[this.props.title.title].split(',') : [1, 1]

        return (
            <div id="recently-watched-tile" onClick={() => this.props.history.push(`./${(this.props.title.isSeries ? "Series" : "Movie")}?title=${this.props.title.title}`)}>
                <div id={"rw-poster"}>
                    <img
                        src={this.state.posterPath}
                        alt={'no poster'}
                        width={this.props.width}
                        height={this.props.height}
                    />
                </div>
                <div id="rw-title">
                    {this.props.title.title}
                </div>
                {
                    this.props.title.isSeries
                        ? <div id="rw-se">{`S${season}:E${episode}`}</div>
                        : <></>
                }
            </div>
        )
    }
}

export default withRouter(RecentlyWatchedTile)