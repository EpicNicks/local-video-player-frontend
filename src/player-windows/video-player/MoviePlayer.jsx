
import React, {useEffect, useState, useRef, useCallback } from 'react';
import videoJS from 'video.js';
import 'video.js/dist/video-js.css'

import 'videojs-mobile-ui';
import 'videojs-mobile-ui/dist/videojs-mobile-ui.css'

import './MoviePlayer.css'

const apply = (x, f) => {
    f(x);
    return x;
};

const MoviePlayer = (props) => {

    const videoNode = useRef();
    const player = useRef()

    useEffect(() => { //componentDidMount
        player.current = videoJS(videoNode.current, props, function OnPlayerReady(){
            console.log('OnPlayerReady', this);
        });
        player.current.mobileUi = {
            fullscreen:
                { enterOnRotate:true, exitOnRotate:true, lockOnRotate:false },
            touchControls:
                { seekSeconds: 5, tapTimeout: 300, disableOnEnd: false }
        };

        if (videoNode.current){
            videoNode.current.addEventListener('keydown', e => {
                if (e.key === "ArrowRight")
                    videoNode.current.currentTime = videoNode.current.currentTime + 5;
                if (e.key === "ArrowLeft")
                    videoNode.current.currentTime = videoNode.current.currentTime - 5;
                if (e.key === "f")
                    document.querySelector(".vjs-fullscreen-control").click();
                if (e.key === " ")
                    if (videoNode.current.paused){
                        videoNode.current.play();
                    }
                    else{
                        videoNode.current.pause();
                    }
            });
            // instant focus on autoplay -> never lose focus
            videoNode.current.addEventListener('play', () => videoNode.current?.focus());
            videoNode.current.addEventListener('focusout', () => videoNode.current?.focus());
        }

        for (const key in props.extraEvents){
            player.current.on(key.toString().toLowerCase(), () => props.extraEvents[key](player));
        }
        return () => { //componentWillUnmount
            if (player.current)
                player.current.dispose();
        };
    }, [props.key]);

    return(
        <div>
            <div data-vjs-player key={props.key}>
                <video
                    ref={ videoNode }
                    className="video-js vjs-default-skin vjs-16-9"
                >
                </video>
            </div>
        </div>
    )
}

export default MoviePlayer;
