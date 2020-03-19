import React, {useEffect, useState} from "react";
import MaterialTable from "material-table";
import {Events} from "../Services/Events";
import withStore from "../Contexts/GlobalStore/withStore";
import {useHistory} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {Link} from "@material-ui/core";
import {Link as RouterLink} from "react-router-dom";

const CountryList = props => {
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
        const {data, ok} = await props.api.details({type: 'country'});
        if(ok) {
            setData(data);
        }
    };

    const columns = [
        {
            title: t('countryList.country'), field: 'country',
            render: (val) => (<Link component={RouterLink} to={`/country/${val.country}`}>{val.country}</Link>)
        },
        {title: t('countryList.countryCode'), field: 'code'},
        {title: t('countryList.region'), field: 'region'},
        {
            title: t('affected'), field: 'confirmed',
            cellStyle: {
                backgroundColor: '#e2edfa',
            }
        },
        {
            title: t('activeCase'), field: 'active',
            defaultSort: 'desc',
            cellStyle: {
                backgroundColor: '#FBE4BB',
            }
        },
        {
            title: t('recovered'), field: 'cured',
            cellStyle: {
                backgroundColor: '#e4f4cd',
            }
        },
        {
            title: t('death'), field: 'death',
            cellStyle: {
                backgroundColor: '#ffcac4',
            }
        },
    ];

    return (
        <div style={{marginBottom: '64px'}}>
            <MaterialTable options={{pageSize: 20}} columns={columns} data={data} title={t('countryList.title')} onRowClick={(event, row) => {
                history.push(`/country/${row.country}`)
            }}/>
        </div>
    )
};

export default withStore(CountryList);
