
import React, { Component } from 'react';
import videoJS from 'video.js';
import 'video.js/dist/video-js.css'
import vjsMobile from 'videojs-mobile-ui';
import 'videojs-mobile-ui/dist/videojs-mobile-ui.css'

class MoviePlayer extends Component{

    componentDidMount() {
        videoJS.registerPlugin('vjsMobile', vjsMobile);
        this.player = videoJS(this.videoNode, this.props, function OnPlayerReady(){
            console.log('OnPlayerReady', this);
        });
        this.player.mobileUi(
            {
                fullscreen:
                    { enterOnRotate:true, exitOnRotate:true, lockOnRotate:true },
                touchControls:
                    { seekSeconds: 5, tapTimeout: 300, disableOnEnd: false }
            });

        this.videoNode.addEventListener('keydown', e => {
            if (e.key === "ArrowRight")
                this.videoNode.currentTime = this.videoNode.currentTime + 5;
            if (e.key === "ArrowLeft")
                this.videoNode.currentTime = this.videoNode.currentTime - 5;
            if (e.key === "f")
                this.videoNode.requestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        });
        window.addEventListener('orientationchange', () => {
            const orientation = window.screen.orientation;
            console.log(`orientation changed to ${orientation.type}`)
            if (orientation.type === "landscape-primary" || orientation.type === "landscape-secondary"){
                this.videoNode?.requestFullscreen()
                    .then(() => {})
                    .catch(err => {});
            }
            else{
                document.exitFullscreen()
                    .then(() => {})
                    .catch(err => {});
            }
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
