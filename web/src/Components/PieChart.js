import React, {useEffect, useState} from "react";
import Chart from "react-apexcharts";
import {Events} from "../Services/Events";
import withStore from "../Contexts/GlobalStore/withStore";
import * as _ from 'lodash';

const PieChart = props => {
    const {
        api,
        labels = [],
        labelField,
        colors = [],
        dataFields = [],
        query = {}} = props;
    const [chartData, setChartData] = useState([]);
    const [options, setOptions] = useState({});

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
        const {data, ok} = await api.details(query);
        if(ok) {
            let options = {
                responsive: [
                    {
                        breakpoint: 412,
                        options: {
                            legend: {
                                position: 'top'
                            }
                        }
                    }
                ],
                stroke: {
                    show: false
                },
                plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                show: true,
                                total: {
                                    show: true
                                }
                            }
                        }
                    }
                }
            };
            options.labels = labelField ? _.map(data, labelField) : labels;
            if(colors.length) options.colors = colors;
            setOptions(options);
            if(_.isArray(data)) {
                setChartData(_.map(data, dataFields[0]))
            } else {
                setChartData([...dataFields.map(f => data[f])])
            }

        }
    };

    return (
        <div>
            <Chart options={options} series={chartData} type='donut'/>
        </div>
    )
}

export default withStore(PieChart);
