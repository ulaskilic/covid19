import React, {useEffect, useState} from "react";
import MaterialTable from "material-table";
import {Events} from "../Services/Events";
import withStore from "../Contexts/GlobalStore/withStore";
import {useHistory} from 'react-router-dom';
import {useTranslation} from "react-i18next";

const HistoryList = props => {
    const {countryName} = props;
    const [data, setData] = useState([]);
    const history = useHistory();
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
        const {data, ok} = await props.api.detailsTimeSeries({type: 'country', search: countryName});
        if(ok) {
            setData(data);
        }
    };

    const calculatePercent = (total, val) => {
        if(total) {
            return `${(val * 100 / total).toFixed(2)}%`
        }
        return "0.00%"
    };

    const columns = [
        {
            title: t('countryList.country'), field: 'country',
        },
        {
            title: t('countryList.day'), field: 'day',
            defaultSort: 'desc',
        },
        {
            title: t('affected'), field: 'confirmed',
            cellStyle: {
                backgroundColor: '#e2edfa',
            },
        },
        {
            title: t('activeCase'), field: 'active',
            cellStyle: {
                backgroundColor: '#FBE4BB',
            },
            render: val => (<span>{val.active} <span style={{fontSize: '0.8em'}}>({calculatePercent(val.confirmed, val.active)})</span></span>)
        },
        {
            title: t('recovered'), field: 'cured',
            cellStyle: {
                backgroundColor: '#e4f4cd',
            },
            render: val => (<span>{val.cured} <span style={{fontSize: '0.8em'}}>({calculatePercent(val.confirmed, val.cured)})</span></span>)
        },
        {
            title: t('death'), field: 'death',
            cellStyle: {
                backgroundColor: '#ffcac4',
            },
            render: val => (<span>{val.death} <span style={{fontSize: '0.8em'}}>({calculatePercent(val.confirmed, val.death)})</span></span>)
        },
    ];

    return (
        <div style={{marginBottom: '64px'}}>
            <MaterialTable options={{pageSize: 20}} columns={columns} data={data} title={t('countryList.history')}/>
        </div>
    )
};

export default withStore(HistoryList);
