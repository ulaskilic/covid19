import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Moment from "react-moment";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Link as RouterLink} from 'react-router-dom';
import withStore from "../Contexts/GlobalStore/withStore";
import {useTranslation} from "react-i18next";

const Header = props => {
    const classes = useStyles();
    const {store, setStore} = props.context;
    const {t, i18n} = useTranslation();

    return (
        <AppBar position="sticky" className={classes.root}>
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
                            component={RouterLink} to="/">
                    <Icon>home</Icon>
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    {store.appBar}
                </Typography>
                <IconButton edge="start" color="inherit" aria-label="menu"
                            component={RouterLink} to="/map">
                    <Icon>map</Icon>
                </IconButton>
            </Toolbar>
        </AppBar>
    )
};

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));


export default withStore(Header);
