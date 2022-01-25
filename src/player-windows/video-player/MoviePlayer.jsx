
import React, { Component } from 'react'
import videoJS from 'video.js'
import 'video.js/dist/video-js.css'

import 'videojs-mobile-ui'
import 'videojs-mobile-ui/dist/videojs-mobile-ui.css'

import './MoviePlayer.css'

class MoviePlayer extends Component{

    componentDidMount() {
        this.player = videoJS(this.videoNode, this.props, function OnPlayerReady(){
            console.log('OnPlayerReady', this)
        })
        this.player.mobileUi(
            {
                fullscreen:
                    { enterOnRotate:true, exitOnRotate:true, lockOnRotate:false },
                touchControls:
                    { seekSeconds: 5, tapTimeout: 300, disableOnEnd: false }
            })

        this.videoNode.addEventListener('keydown', e => {
            if (e.key === "ArrowRight")
                this.videoNode.currentTime = this.videoNode.currentTime + 5
            if (e.key === "ArrowLeft")
                this.videoNode.currentTime = this.videoNode.currentTime - 5
            if (e.key === "f")
                document.querySelector(".vjs-fullscreen-control").click()
            if (e.key === " " && !this.videoNode.webkitDisplayingFullscreen)
                if (this.videoNode.paused){
                    this.videoNode.play()
                    console.log("paused after play: ", this.videoNode.paused)
                }
                else{
                    this.videoNode.pause()
                }
        })
        window.addEventListener('orientationchange', () => {
            const orientation = window.screen.orientation
            console.log(`orientation changed to ${orientation.type}`)
            if (orientation.type === "landscape-primary" || orientation.type === "landscape-secondary"){
                //nothing seems to work to enter fullscreen
            }
            else{
                if (document.fullscreenElement !== null){
                    document.exitFullscreen()
                }
            }
        })
        //instant focus on autoplay -> never lose focus
        this.videoNode.addEventListener('play', () => this.videoNode?.focus())
        this.videoNode.addEventListener('focusout', () => this.videoNode?.focus())

        for (const key in this.props.extraEvents){
            this.player.on(key.toString().toLowerCase(), () => this.props.extraEvents[key](this.player))
        }
        if (this.props.loadComplete){
            this.props.loadComplete(this.player)
        }
    }

    componentWillUnmount() {
        if (this.player)
            this.player.dispose()
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

export default MoviePlayer
