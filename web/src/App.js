import React from 'react';
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {CssBaseline} from "@material-ui/core";
import Header from "./Components/Header";
import {BrowserRouter} from "react-router-dom";
import Routes from "./Routes";
import {SnackbarProvider} from "notistack";
import Initiator from "./Components/Initiator";

const defaultTheme = createMuiTheme({
    // palette: {
    //     type: "dark",
    //     primary: {
    //         main: '#1b1b1b',
    //         contrastText: '#ff7f00'
    //     },
    //     secondary: {
    //         main: '#ff7f00'
    //     },
    //     background: {
    //         default: '#121212',
    //         paper: '#1b1b1b'
    //     },
    //     text: {
    //         primary: '#ff7f00',
    //         secondary: '#797878'
    //     }
    // }
    palette: {
        primary: {
            main: '#01579b'
        },
        secondary: {
            main: '#ef6c00'
        },
    }
});

const App = () => {
    return (
        <BrowserRouter>
            <ThemeProvider theme={defaultTheme}>
                <CssBaseline/>
                <Initiator/>
                <SnackbarProvider maxSnack={5}>
                    <Header/>
                    <Routes/>
                </SnackbarProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
};

export default App;
