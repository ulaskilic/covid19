import {Card, CardContent, CardHeader, Container, Fab, Grid, Icon, Paper, Typography} from "@material-ui/core";
import React, {useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import withStore from "../../Contexts/GlobalStore/withStore";

import CountryList from "../../Components/CountryList";
import HeaderCards from "../../Components/HeaderCards";
import {Events} from "../../Services/Events";
import PieChart from "../../Components/PieChart";
import LineChart from "../../Components/LineChart";
import {useParams} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {Helmet} from 'react-helmet';
import Moment from "react-moment";
const useStyles = makeStyles(theme => ({
    shuffleButton: {
        position: 'fixed',
        zIndex: 9999,
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    padding: {
        padding: theme.spacing(1)
    }
}));
const Country = props => {
    const classes = useStyles();
    const {store, setStore} = props.context;
    const {countryName} = useParams();
    const {t, i18n} = useTranslation();

    useEffect(() => {
        setStore({type: 'appBar', payload: `${countryName} Stats`})
    }, []);

    const refreshData = () => {
        Events.emit('refresh');
    };

    return (
        <Container style={{marginTop: '24px'}}>
            <p align="center" style={{marginTop: '-24px', padding: '6px'}}>
                {t('lastUpdated')} {store.lastUpdated && <Moment fromNow locale={i18n.language}>{store.lastUpdated}</Moment>}
            </p>
            <Helmet>
                <meta
                    name="description"
                    content={`Corona (Covid19) virus latest stats for ${countryName}`}
                />
                <title>{countryName} Corona (Covid19) Stats</title>
            </Helmet>
            <Grid container spacing={2}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Paper elevation={3} className={classes.padding}>
                        <Typography variant="h6" component="h1" align="center">{countryName}</Typography>
                    </Paper>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <HeaderCards query={{type: 'country', search: countryName}}/>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                    <Card>
                        <CardHeader title={`${countryName} ${t('overall')}`}/>
                        <CardContent>
                            {/*<OverallPieChart/>*/}
                            <PieChart
                              labels={[t('activeCase'), t('death'), t('recovered')]}
                                colors={['#feb019', '#3c3c3c', '#00e396']}
                                dataFields={['active', 'death', 'cured']}
                                query={{type: 'country', search: countryName}}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item lg={8} md={8} sm={12} xs={12}>
                    {/*<OverallLineChart/>*/}
                    <LineChart
                        query={{type: 'country', search: countryName}}
                        xAxisLabelField='day'
                        series={[
                            {key: t('affected'), value: 'confirmed'},
                            {key: t('activeCase'), value: 'active'},
                            {key: t('recovered'), value: 'cured'},
                            {key: t('death'), value: 'death'}
                        ]}
                        colors={['#008ffb', '#feb019', '#00e396', '#3c3c3c']}
                    />
                </Grid>
            </Grid>

            <Fab color="primary" aria-label="add" className={classes.shuffleButton} onClick={refreshData}>
                <Icon>refresh</Icon>
            </Fab>
        </Container>
    )
};

export default withStore(Country);
