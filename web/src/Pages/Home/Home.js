import {Card, CardContent, CardHeader, Container, Fab, Grid, Icon} from "@material-ui/core";
import React, {useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import withStore from "../../Contexts/GlobalStore/withStore";
import CountryList from "./CountryList";
import HeaderCards from "../../Components/HeaderCards";
import {Events} from "../../Services/Events";
import PieChart from "../../Components/PieChart";
import LineChart from "../../Components/LineChart";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(theme => ({
    shuffleButton: {
        position: 'fixed',
        zIndex: 9999,
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    }
}));
const Home = props => {
    const classes = useStyles();
    const {store, setStore} = props.context;
    const {t, i18n} = useTranslation();
    useEffect(() => {

    }, []);

    const refreshData = () => {
        Events.emit('refresh');
    };

    return (
        <Container style={{marginTop: '24px'}}>
            <Grid container spacing={2}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <HeaderCards/>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                    <Card>
                        <CardHeader title={t('overall')}/>
                        <CardContent>
                            {/*<OverallPieChart/>*/}
                            <PieChart
                                labels={[t('activeCase'), t('death'), t('recovered')]}
                                colors={['#feb019', '#3c3c3c', '#00e396']}
                                dataFields={['active', 'death', 'cured']}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item lg={8} md={8} sm={12} xs={12}>
                    {/*<OverallLineChart/>*/}
                    <LineChart
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
                <Grid item lg={4} md={4} sm={12} xs={12}>
                    <Card>
                        <CardHeader title={t('regionalActiveCases')}/>
                        <CardContent>
                            {/*<RegionalPieChart/>*/}
                            <PieChart
                                labelField='region'
                                dataFields={['active']}
                                query={{type: 'region'}}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item lg={8} md={8} sm={12} xs={12}>
                    {/*<RegionalLineChart/>*/}
                    <LineChart
                        xAxisLabelField='day'
                        seriesField={{key: 'region', value: 'active'}}
                        query={{type: 'region'}}
                    />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <CountryList/>
                </Grid>
            </Grid>

            <Fab color="primary" aria-label="add" className={classes.shuffleButton} onClick={refreshData}>
                <Icon>refresh</Icon>
            </Fab>
        </Container>
    )
};

export default withStore(Home);
