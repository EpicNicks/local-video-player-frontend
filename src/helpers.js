import {TMDB_KEY} from "./global/apiKeys";

const recentlyWatchedKey = "recentlyWatched"

export const addRecentlyWatched = (title, isSeries) => {
    if (typeof (Storage)){
        let recentlyWatched = JSON.parse(localStorage.getItem(recentlyWatchedKey) ?? "[]")
        recentlyWatched = recentlyWatched.filter(item => item.title !== title)
        recentlyWatched.unshift({title: title, isSeries: isSeries})
        localStorage.setItem(recentlyWatchedKey, JSON.stringify(recentlyWatched))
    }
}

export const loadAllRecentlyWatched = () => {
    if (typeof(Storage)){
        return JSON.parse(localStorage.getItem(recentlyWatchedKey) ?? "[]")
    }
}

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
