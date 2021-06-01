
import React, {Component, useState} from 'react';
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";

import './MetaFileGenerator.css';
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import { TMDB_KEY } from "../../global/apiKeys";

const apply = (val, f) => {
    f(val);
    return val;
};

const MetaGen = (props) => {

    const [type, setType] = useState("movie");
    const [seasons, setSeasons] = useState([]);
    const [path, setPath] = useState("");
    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState([]);
    const [season, setSeason] = useState(1);
    const [episode, setEpisode] = useState(1);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [fileUploadHidden, setFileUploadHidden] = useState(true);

    const loadEpisodes = async() => {
        if (!["", null, undefined].includes(title)) {
            const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${TMDB_KEY}&query=${encodeURIComponent(title)}`);
            const text = await response.text();
            console.log(text);
            const results = JSON.parse(text).results[0];
            const id = results.id;
            if (id !== null){
                const request = `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${TMDB_KEY}`;
                console.log(request);
                const response = await fetch(request);
                const text = await response.text();
                const obj = JSON.parse(text);
                console.log("parsed obj:", obj);
                if ([null, undefined].includes(seasons[season - 1]))
                    setSeasons(ssn => apply(ssn, s => s[season - 1] = { title: "", episodes: [] }));
                setSeasons(ssn => apply(ssn, s => s[season - 1].episodes.length = obj.episodes.length));
                for (let i = 0; i < obj.episodes.length; i++){
                    if ([null, undefined].includes(seasons[season - 1].episodes[i]))
                        setSeasons(ssn => apply(ssn, s => s[season - 1].episodes[i] = {title: "", path: "", episode: 0}));
                    setSeasons(ssn => apply(ssn, s => s[season - 1].episodes[i] = {...s[season - 1].episodes[i], title: obj.episodes[i].name, episode: obj.episodes[i].episode_number}));
                }
                // this is the only line that requires an actual new object since at least some season manipulation will have happened
                setSeasons(s => [...s]);
            }
        }
    };

    const loadPaths = paths => {
        if ([null, undefined].includes(seasons[season - 1])){
            setSeasons(ssn => apply(ssn, s => s[season - 1] = { title: "", episodes: []}))
        }
        if (seasons[season - 1].episodes.length < paths.length)
            setSeasons(ssn => apply(ssn, s => s[season - 1].episodes.length = paths.length));
        console.log(seasons[season - 1].episodes);
        console.log(paths);
        for (let i = 0; i < paths.length; i++) {
            if ([null, undefined].includes(seasons[season - 1].episodes[i]))
                setSeasons(ssn => apply(ssn, s => s[season - 1].episodes[i] = {path: "", episode: 0, title: ""}))
            setSeasons(ssn => apply(ssn, s => s[season - 1].episodes[i].path = paths[i]));
        }
        // this is the only line that requires an actual new object since at least some season manipulation will have happened
        setSeasons(s => [...s]);
    };

    const generateJSON = () => {
        let json;
        if (type === "movie"){
            json = JSON.stringify({
                title: title,
                genre: genre,
                path: path,
                type: type
            }, null, 2);
        }
        else {
            json = JSON.stringify({
                title: title,
                genre: genre,
                type: type,
                seasons: seasons
            }, null, 2);
        }
        const data = new Blob([json], {type: 'text/plain;charset=utf-8'});
        const element = document.createElement('a');
        element.style.display = "none";
        element.setAttribute('href', URL.createObjectURL(data));
        element.setAttribute('download', `${title}.${type}n`);
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    const generateSeasonRows = () => {
        const res = []
        console.log("slen:", seasons.length);
        for (let i = 0; i < seasons.length; i++){
            res.push(
                <ListItem
                    button
                    key={i}
                    selected={selectedIndex === i}
                    onClick={() => {
                        setSelectedIndex(index => i);
                        setSeason(s => i + 1);
                        if ([null, undefined].includes(seasons[i]))
                            setSeasons(ssn => apply(ssn, s => s[i] = {title: "", episodes: []}))
                    }}
                >
                    <ListItemText primary={`Season ${i + 1}`}/>
                </ListItem>
            );
        }
        return res;
    }

    const episodeFieldGen = () => {
        const res = [];
        for (let i = 0; i < seasons[season - 1].episodes.length; i++){
            res.push(
                <div>
                    <h3>{`Episode ${seasons[season - 1]?.episodes[i]?.episode ?? i + 1}`}</h3>
                    <TextField
                        type="text"
                        label="title"
                        key={`s${season}ep${i+1}title`}
                        InputLabelProps={{shrink: true}}
                        value={seasons[season - 1]?.episodes[i]?.title}
                        onChange={e => {
                            if ([null, undefined].includes(seasons[season - 1].episodes[i]))
                                setSeasons(ssn => apply(ssn, s => s[season - 1].episodes[i] = {title: e.target.value, path: "", episode: 0}))
                            else
                                setSeasons(ssn => apply(ssn, s => s[season - 1].episodes[i].title = e.target.value))
                        }}
                    />
                    <br/>
                    <TextField
                        label="path"
                        key={`s${season}ep${i+1}path`}
                        InputLabelProps={{shrink: true}}
                        value={seasons[season - 1]?.episodes[i]?.path}
                        onChange={e => {
                            if ([null, undefined].includes(seasons[season - 1].episodes[i]))
                                setSeasons(ssn => apply(ssn, s => s[season - 1].episodes[i] = {title: "", path: e.target.value.replace(/"/g, ""), episode: 0}))
                            else
                                setSeasons(ssn => apply(ssn, s => s[season - 1].episodes[i].path = e.target.value.replace(/"/g, "")))
                        }}
                    />
                    <br/>
                    <TextField
                        label="episode"
                        key={`s${season}ep${i+1}episode`}
                        type="number"
                        step="any"
                        InputLabelProps={{shrink: true}}
                        value={seasons[season - 1]?.episodes[i]?.episode}
                        onChange={e =>{
                            if ([null, undefined].includes(seasons[season - 1].episodes[i]))
                                setSeasons(ssn => apply(s => s[season - 1].episodes[i] = {title: "", path: "", episode: parseFloat(e.target.value)}))
                            else
                                setSeasons(ssn => apply(ssn, s => s[season - 1].episodes[i].episode = parseFloat(e.target.value)))
                        }}
                    />
                </div>
            )
        }
        return res;
    }

    const getForm = () => {
        if (type === "movie")
            return (
                <div>
                    <h1>.movien generation</h1>
                    <div className="meta-textfields">
                        <TextField
                            id="standard-basic"
                            label="path"
                            key="movie-path"
                            onChange={e => setPath(p => e.target.value.replace(/"/g, ""))}
                            value={path}
                        />
                        <br/>
                        <TextField
                            id="standard-basic"
                            label="title"
                            key="movie-title"
                            onChange={e => setTitle(t => e.target.value)}
                            value={title}
                        />
                        <br/>
                        <TextField
                            id="standard-basic"
                            label="genre"
                            key="movie-genre"
                            onChange={e => setGenre(g => e.target.value.split(',').map(v => v.trim()))}
                            value={genre.join(", ")}
                        />
                    </div>
                </div>
            )
        else
            return (
                <div id="meta-gen-series-container">
                    <div id="meta-gen-series-loader">
                        <button
                            onClick={() => {
                                loadEpisodes();
                            }}
                        >
                            Load Episodes
                        </button>
                        <h3>Load Paths</h3>
                        <input
                            type="file"
                            onChange={e => {
                                const file = e.target.files[0];
                                const u = URL.createObjectURL(file);
                                const x = new XMLHttpRequest();
                                x.open('GET', u, false);
                                x.send();
                                URL.revokeObjectURL(u);
                                const blob = new Blob([x.responseText], {type: 'text/plain'});
                                blob.text().then(t => {
                                    loadPaths(t.trim().split("\n").map(v => v.replace(/"/g, "").replace(/\r?\n|\r/g, "")));
                                });
                            }}
                        >
                        </input>
                    </div>
                    <div id="meta-gen-series-top">
                        <div id="meta-gen-series-middle">
                            <h1>.seriesn generation</h1>
                            <div className="meta-textfields">
                                <TextField
                                    id="standard-basic"
                                    label="title"
                                    key="series-title"
                                    onChange={e => setTitle(t => e.target.value)}
                                    value={title}
                                />
                                <br/>
                                <TextField
                                    id="standard-basic"
                                    label="genre"
                                    key="series-genre"
                                    onChange={e => setGenre(g => e.target.value.split(',').map(v => v.trim()))}
                                    value={genre.join(", ")}
                                />
                                <br/>
                                <TextField
                                    id="standard-basic"
                                    label="seasons (number)"
                                    type="number"
                                    onChange={e => {
                                        if (parseInt(e.target.value) < 0 || isNaN(parseInt(e.target.value)))
                                            e.target.value = "0";
                                        setSeasons(s => {
                                            const newSeasons = Array(parseInt(e.target.value));
                                            seasons.forEach((v, i) => newSeasons[i] = v);
                                            return newSeasons;
                                        });
                                    }}
                                    value={seasons.length}
                                />
                                <br/>
                                <div id="meta-gen-episode-entry">
                                    {seasons.length > 0 ?
                                        <List>
                                            {generateSeasonRows()}
                                        </List>
                                        : null }
                                    {selectedIndex < seasons.length
                                        ?   <div>
                                            <TextField
                                                id="standard-basic"
                                                value={seasons[season - 1]?.title}
                                                label={`Season ${season} title`}
                                                InputLabelProps={{shrink: true}}
                                                onChange={e => setSeasons(ssn => apply(ssn, s => s[season - 1].title = e.target.value))}
                                            />
                                            <br/>
                                            <TextField
                                                type="number"
                                                id="standard-basic"
                                                value={seasons[season - 1]?.episodes?.length}
                                                label={`Season ${season} Episode Count`}
                                                InputLabelProps={{shrink: true}}
                                                onChange={ e => {
                                                    if (parseInt(e.target.value) < 0)
                                                        e.target.value = "0";
                                                    if ([null, undefined].includes(seasons[season - 1])){
                                                        setSeasons(ssn => apply(ssn, s => {
                                                            s[season - 1] = {title: "", episodes: []};
                                                            s[season - 1].episodes = Array(parseInt(e.target.value));
                                                        }));
                                                    }
                                                    console.log(seasons[season - 1].episodes);
                                                    setSeasons(ssn => apply(ssn, s => s[season - 1].episodes = Array(parseInt(e.target.value))));
                                                }}
                                            />
                                        </div>: null
                                    }
                                    {seasons[season - 1]?.episodes?.length > 0
                                        ?
                                        <div id="meta-gen-episode-fields">
                                            {episodeFieldGen()}
                                        </div>
                                        : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="invisible">
                        <input
                            type="file"
                        >
                        </input>
                    </div>
                </div>
            )
    }

    return (
        <div id="meta-gen">
            {getForm()}
            <div id="meta-gen-submit-btn" className="meta-gen-btn">
                <Button
                    variant="contained"
                    onClick={() => generateJSON()}
                >
                    Generate
                </Button>
                <br/>
            </div>
            <div id="meta-gen-swap-btn" className="meta-gen-btn">
                <Button
                    variant="contained"
                    onClick={() => setType(type === "movie" ? "series" : "movie")}
                >
                    {`Swap to ${type === "movie" ? "series" : "movie"}`}
                </Button>
            </div>
            <div id="meta-gen-load-btn" className="meta-gen-btn">
                <Button
                    variant="contained"
                    onClick={() => setFileUploadHidden(!fileUploadHidden)}
                >
                    Load from file
                </Button>
                <br/>
                {!fileUploadHidden ?
                    <input
                        type="file"
                        onChange={e => {
                            const file = e.target.files[0];
                            const u = URL.createObjectURL(file);
                            const x = new XMLHttpRequest();
                            x.open('GET', u, false);
                            x.send();
                            URL.revokeObjectURL(u);
                            const blob = new Blob([x.responseText], {type: 'text/plain'});
                            (async() =>{
                                const obj = JSON.parse(await blob.text());
                                if (obj.type === "movie"){
                                    console.log("movie uploaded");
                                    setTitle(obj.title);
                                    setGenre(obj.genre);
                                    setType(obj.type);
                                    setPath(obj.path);
                                }
                                else if (obj.type === "series"){
                                    console.log("series uploaded");
                                    console.log(seasons);
                                    setTitle(obj.title);
                                    setGenre(obj.genre);
                                    setType(obj.type);
                                    setPath(obj.path);
                                    setSeasons(obj.seasons);
                                }
                            })();
                        }}
                    >
                    </input>
                    : null
                }
            </div>
        </div>
    );
}

export default connect(state => ({ theme: state.theme }))(MetaGen);
