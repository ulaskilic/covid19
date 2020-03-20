import {AppBar, Toolbar, Typography, IconButton, Icon, Button} from '@material-ui/core';
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
                <Button edge="start" color="inherit" aria-label="menu"
                            component={RouterLink} to="/map" endIcon={<Icon>map</Icon>}>
                    {t('map')}
                </Button>
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
