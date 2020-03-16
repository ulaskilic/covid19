import React, {useEffect, useState} from "react";
import {api} from "../../Services/Api";
import MaterialTable from "material-table";
import {Events} from "../../Services/Events";

const CountryList = props => {
    const [data, setData] = useState([]);
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
        const {data, ok} = await api.countryList();
        if(ok) {
            setData(data.map(i => {
                i.activeCases = i.confirmed - (i.death + i.cured);
                return i;
            }));
        }
    };

    const columns = [
        {title: 'Country', field: 'name'},
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
        <div style={{marginBottom: '24px'}}>
            <MaterialTable columns={columns} data={data} title="Country list"/>
        </div>
    )
};

export default CountryList;
