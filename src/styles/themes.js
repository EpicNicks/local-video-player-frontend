import {createMuiTheme, makeStyles} from "@material-ui/core";

export const defaultTheme = {
    main: theme => makeStyles({ root: {}}),
    mui: createMuiTheme({})
}

// this will be used to pull color schemes from the video itself (ie. red and black theme for DxD)
export const customTheme = {
    main: theme => ({

    }),
    mui: createMuiTheme({

    })
}

export const defaultThemeInline = {

}

export const darkThemeInline = {
    mainMenu: {
        backgroundColor: "#000",
        color: "#0FF",
        height: "100vh",
    }
}

export const darkTheme = {
    main: theme => makeStyles({
        root: {
            backgroundColor: "#000",
            color: "#0FF",
            height: "100vh",

            "& .MuiListItem-root": {
                backgroundColor: '#141414',
                '&:hover': {
                    color: "black",
                    backgroundColor: "#0FF"
                }
            },
            '& h1': {
                color: "#0FF",
            },
            '& label.Mui-focused': {
                color: '#0FF',
            },
            '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: '#0FF',
                },
                '&:hover fieldset': {
                    borderColor: '#F0F',
                },
                '&.Mui-focused fieldset': {
                    borderColor: '#0FF',
                }
            },
        }
    }),
    mui: createMuiTheme({
        palette: {
            primary: {
                main: "#0FF"
            },
            secondary: {
                main: "#FFF"
            },
            text: {
                primary: "#0FF",
                secondary: "#FFF",
                disabled: "#AAA"
            },
            background: {
                default: "#333",
                paper: "#181818",
            }
        },
        "& .MuiListItem-root": {
            backgroundColor: '#141414',
            '&:hover': {
                color: "black",
                backgroundColor: "#0FF"
            }
        },
        '& h1': {
            color: "#0FF",
        },
        '& label.Mui-focused': {
            color: '#0FF',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#0FF',
            },
            '&:hover fieldset': {
                borderColor: '#F0F',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#0FF',
            }
        },
    })
};

export const getTheme = () => theme;

export const setTheme = themeStr => {
    switch (themeStr){
        case "DARK": theme = darkTheme; break;
        case "DEFAULT": theme = defaultTheme; break;
        default: theme = darkTheme;
    }
}

let theme = defaultTheme;
