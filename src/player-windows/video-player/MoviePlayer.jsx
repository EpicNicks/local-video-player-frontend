
import React, { Component, forwardRef } from 'react';
import videoJS from 'video.js';
import 'video.js/dist/video-js.css'

class MoviePlayer extends Component{
    componentDidMount() {
        this.player = videoJS(this.videoNode, this.props, function OnPlayerReady(){
            console.log('OnPlayerReady', this);
        });

        this.videoNode.addEventListener('keydown', e => {
            if (e.key === "ArrowRight")
                this.videoNode.currentTime = this.videoNode.currentTime + 5;
            if (e.key === "ArrowLeft")
                this.videoNode.currentTime = this.videoNode.currentTime - 5;
            if (e.key === "f")
                this.videoNode.requestFullscreen();
        });
        //instant focus on autoplay -> never lose focus
        this.videoNode.addEventListener('play', () => this.videoNode?.focus());
        this.videoNode.addEventListener('focusout', () => this.videoNode?.focus());

        for (const key in this.props.extraEvents){
            this.player.on(key.toString().toLowerCase(), () => this.props.extraEvents[key](this.player));
        }
    }

    componentWillUnmount() {
        if (this.player)
            this.player.dispose();
    }

    render() {
        return(
            <div>
                <div data-vjs-player>
                    <video
                        ref={ node => this.videoNode = node }
                        className="video-js vjs-default-skin vjs-16-9"
                    >
                    </video>
                </div>
            </div>
        )
    }
}

export default MoviePlayer;
