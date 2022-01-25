
// export const jsonToCssString = (style) =>
//     Object.keys(style).reduce((acc, key) => (
//         acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + style[key] + ';'
//     ), '')

export const jsonToCssString = style => {
    return Object.keys(style).map(k => {
        return `${k}: { ${Object.keys(style[k]).reduce((acc, key) => acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + style[k][key] + ';')} }`
    })
}

export const setStyles = (cssString) => {
    const style = document.createElement('style')
    style.textContent = cssString
    document.head.appendChild(style)
}

export const darkMode = {
    h1: {
        color: "#0FF",
    },
    body: {
        height: "100vh",
        backgroundColor: "#181818"
    }
}

export const lightMode = {
    h1: {
        color: "#000"
    },
    body: {
        height: "100vh",
        backgroundColor: "#EEE"
    }
}
