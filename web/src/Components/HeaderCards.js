import React, {useEffect, useState} from "react";
import {Grid, Paper, makeStyles, Typography} from "@material-ui/core";
import {Events} from "../Services/Events";
import withStore from "../Contexts/GlobalStore/withStore";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(theme => ({
    margin: {
        margin: theme.spacing(1)
    },
    padding: {
        padding: theme.spacing(2)
    }
}));
const HeaderCards = props => {
    const {query = {}} = props;
    const classes = useStyles();
    const {store, setStore} = props.context;
    const [data, setData] = useState({});
    const {t, i18n} = useTranslation();

    useEffect(() => {
        fetchData();
        const eventId = Events.on('refresh', () => {
            fetchData();
        });
        return () => {
            Events.remove(eventId);
        }
    }, []);

    const fetchData = async () => {
      const {data, ok} = await props.api.details(query);
      if(ok) {
          setData(data);
          setStore({type: 'lastUpdated', payload: data.lastUpdated})
      }
    };

    return (
        <Grid container spacing={2}>
            <Grid item lg={3} md={6} sm={12} xs={12}>
                <Paper elevation={3} className={classes.padding} style={{backgroundColor: '#008ffb', color: 'white'}}>
                    <Typography variant="h6">{t('affected')}: {data.confirmed}</Typography>
                </Paper>
            </Grid>

            <Grid item lg={3} md={6} sm={12} xs={12}>
                <Paper elevation={3} className={classes.padding} style={{backgroundColor: '#feb019', color: 'white'}}>
                    <Typography variant="h6">{t('activeCase')}: {data.active}</Typography>
                </Paper>
            </Grid>

            <Grid item lg={3} md={6} sm={12} xs={12}>
                <Paper elevation={3} className={classes.padding} style={{backgroundColor: '#00e396', color: 'white'}}>
                    <Typography variant="h6">{t('recovered')}: {data.cured}</Typography>
                </Paper>
            </Grid>

            <Grid item lg={3} md={6} sm={12} xs={12}>
                <Paper elevation={3} className={classes.padding} style={{backgroundColor: '#ff4560', color: 'white'}}>
                    <Typography variant="h6">{t('death')}: {data.death}</Typography>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default withStore(HeaderCards);
