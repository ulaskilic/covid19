import React, {useEffect, useState} from "react";
import MaterialTable from "material-table";
import {Events} from "../../Services/Events";
import withStore from "../../Contexts/GlobalStore/withStore";
import {useHistory} from 'react-router-dom';

const CountryList = props => {
    const [data, setData] = useState([]);
    const history = useHistory();
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
            setData(data.map(i => {
                i.activeCases = i.confirmed - (i.death + i.cured);
                return i;
            }));
        }
    };

    const columns = [
        {title: 'Country', field: 'country'},
        {title: 'Country Code', field: 'code'},
        {title: 'Region', field: 'region'},
        {
            title: 'Affected', field: 'confirmed',
            cellStyle: {
                backgroundColor: '#e2edfa',
            }
        },
        {
            title: 'Active Cases', field: 'activeCases',
            defaultSort: 'desc',
            cellStyle: {
                backgroundColor: '#FBE4BB',
            }
        },
        {
            title: 'Recovered', field: 'cured',
            cellStyle: {
                backgroundColor: '#e4f4cd',
            }
        },
        {
            title: 'Death', field: 'death',
            cellStyle: {
                backgroundColor: '#ffcac4',
            }
        },
    ];

    return (
        <div style={{marginBottom: '64px'}}>
            <MaterialTable options={{pageSize: 20}} columns={columns} data={data} title="Country list" onRowClick={(event, row) => {
                history.push(`/country/${row.country}`)
            }}/>
        </div>
    )
};

export default withStore(CountryList);
