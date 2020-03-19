import React, {useEffect, useState} from "react";
import {CircleMarker, Map, TileLayer, Tooltip} from "react-leaflet";
import withStore from "../../Contexts/GlobalStore/withStore";
import {Events} from "../../Services/Events";
import * as _ from 'lodash';
import {makeStyles} from "@material-ui/core/styles";
import {SpeedDial, SpeedDialAction} from '@material-ui/lab'
import {Icon, Backdrop, Container} from "@material-ui/core";
import {Helmet} from 'react-helmet';
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(theme => ({
    mapContainer: {
        position: "absolute",
        top: theme.spacing(7),
        bottom: 0,
        right: 0,
        left: 0
    },
    speedDial: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    tooltipLabel: {
        width: '128px',
        textAlign: 'right'
    }
}));

const MapView = props => {
    const classes = useStyles();
    const {t, i18n} = useTranslation();
    const [open, setOpen] = useState(false);
    const {store, setStore} = props.context;
    const [layer, setLayer] = useState({});
    const [data, setData] = useState({
        totalconfirmed: 0,
        totalcured: 0,
        totalactive: 0,
        totaldeath: 0,
        data: []
    });

    const layers = {
        confirmed: {
            key: 'confirmed', color: '#0074d1', title: t('affected')
        },
        active: {
            key: 'active', color: '#e58000', title: t('activeCase')
        },
        cured: {
            key: 'cured', color: '#00a921', title: t('recovered')
        },
        death: {
            key: 'death', color: '#3c3c3c', title: t('death')
        },
    }
    useEffect(() => {
        selectLayer('confirmed');
        fetchData();
        const eventId = Events.on('refresh', () => {
            fetchData();
        });
        return () => {
            Events.remove(eventId);
        }
    }, []);

    const fetchData = async () => {
        const {data, ok} = await props.api.details({type: 'country'});
        if (ok) {
            setData({
                totalconfirmed: _.sumBy(data, 'confirmed'),
                totalcured: _.sumBy(data, 'cured'),
                totalactive: _.sumBy(data, 'active'),
                totaldeath: _.sumBy(data, 'death'),
                data: data
            });
        }
    };

    const calculateRadius = (d) => {
        const percent = (d[layer.key] * 100) / data[`total${layer.key}`];
        return percent < 5 ? percent * 5 + 5 : percent * 2;
    };

    const selectLayer = val => {
        setLayer(layers[val]);
        setStore({type: 'appBar', payload: layers[val].title});
        setOpen(false);
    };

    return (
        <div>
            <Backdrop style={{zIndex: 999}} open={open}/>
            <Helmet>
                <meta
                    name="description"
                    content={`Corona (Covid19) virus map view for worldwide`}
                />
                <title>Corona (Covid19) Map view</title>
            </Helmet>
            <Map center={[41.026479, 28.996380]} zoom={3} className={classes.mapContainer}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {data.data.map(d => {
                    return (
                        <CircleMarker key={d.code} center={d.location.coordinates} color={layer.color} weight={1}
                                      radius={calculateRadius(d)}>
                            <Tooltip>
                                <h3>{d.country}</h3>
                                Total Affected: {d.confirmed} <br/>
                                Active Cases: {d.active} <br/>
                                Recovered: {d.cured} <br/>
                                Death: {d.death}
                            </Tooltip>
                        </CircleMarker>
                    )
                })}
            </Map>
            <SpeedDial ariaLabel="Layers" open={open}
                       icon={<Icon>layers</Icon>}
                       className={classes.speedDial}
                       onClose={() => setOpen(false)}
                       onOpen={() => setOpen(true)}
            >
                <SpeedDialAction tooltipOpen onClick={() => selectLayer('confirmed')} classes={{staticTooltipLabel: classes.tooltipLabel}}
                                 tooltipTitle={t('affected')} icon={<Icon>keyboard_arrow_left</Icon>}/>
                <SpeedDialAction tooltipOpen onClick={() => selectLayer('active')} classes={{staticTooltipLabel: classes.tooltipLabel}}
                                 tooltipTitle={t('activeCase')} icon={<Icon>keyboard_arrow_left</Icon>}/>
                <SpeedDialAction tooltipOpen onClick={() => selectLayer('cured')} classes={{staticTooltipLabel: classes.tooltipLabel}}
                                 tooltipTitle={t('recovered')} icon={<Icon>keyboard_arrow_left</Icon>}/>
                <SpeedDialAction tooltipOpen onClick={() => selectLayer('death')} classes={{staticTooltipLabel: classes.tooltipLabel}}
                                 tooltipTitle={t('death')} icon={<Icon>keyboard_arrow_left</Icon>}/>
            </SpeedDial>
        </div>
    )
}

export default withStore(MapView);
