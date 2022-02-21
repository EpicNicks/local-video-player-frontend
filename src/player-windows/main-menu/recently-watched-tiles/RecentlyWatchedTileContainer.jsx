
import React, { Component } from 'react'

import './RecentlyWatchedTileContainer.css'
import { loadAllRecentlyWatched } from "../../../helpers";

import RecentlyWatchedTile from "./recently-watched-tile/RecentlyWatchedTile";
import {SERVER_PATH} from "../../../global/globals";

class RecentlyWatchedTileContainer extends Component{

    constructor(props) {
        super(props);
        this.recentlyWatchedTitles = loadAllRecentlyWatched()
    }

    onOrientationChange = () => {
        this.forceUpdate()
    }

    componentDidMount() {
        window.screen.orientation.addEventListener("change", this.onOrientationChange)
    }

    componentWillUnmount() {
        window.screen.orientation.removeEventListener("change", this.onOrientationChange)
    }

    render(){
        const [tileWidth, tileHeight] = (!window.matchMedia("screen and (max-width: 900px) and (orientation: portrait)").matches)
            ? [this.props.tileWidth ?? "250px", this.props.tileHeight ?? "auto"]
            : ["120px", "auto"]

        const recentlyWatched = this.recentlyWatchedTitles.map(v => <RecentlyWatchedTile width={tileWidth} height={tileHeight} title={v} />)

        return(
            <div id="recently-watched-tiles-container">
                <div id="rw-container-title">
                    Recently Watched
                </div>
                <div id="recently-watched-tiles">
                    {recentlyWatched}
                </div>
            </div>
        )
    }
}

export default RecentlyWatchedTileContainer