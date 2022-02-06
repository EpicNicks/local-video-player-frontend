import {TMDB_KEY} from "./global/apiKeys";

export const getMovieData = async title => {
    if ([null, undefined].includes(title)){
        return null
    }
    return await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(title)}`)
        .then(res => res.text())
        .then(res => {
            return JSON.parse(res)
        })
        .catch(err => console.log(err))
}

export const getSeriesData = async title => {
    if ([null, undefined].includes(title)){
        return null
    }
    return await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${TMDB_KEY}&query=${encodeURIComponent(title)}`)
        .then(res => res.text())
        .then(res => {
            return JSON.parse(res)
        })
        .catch(err => console.log(err))
}
