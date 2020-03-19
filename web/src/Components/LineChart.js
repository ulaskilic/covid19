import React, {useEffect, useState} from "react";
import Chart from "react-apexcharts";
import {Events} from "../Services/Events";
import withStore from "../Contexts/GlobalStore/withStore";
import * as _ from 'lodash';
import moment from "moment";
import {useTranslation} from "react-i18next";

const LineChart = props => {
    const {t, i18n} = useTranslation();
    const {
        api,
        xAxisLabels = [],
        xAxisLabelField,
        series = [],
        seriesField,
        colors = [],
        query = {}} = props;
    const [chartData, setChartData] = useState([]);
    const [options, setOptions] = useState({});
    const [load, setLoad] = useState(true);

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
        const {data, ok} = await api.detailsTimeSeries(query);
        if(ok) {
            let options = {
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    type: 'datetime',
                    categories: [],
                    labels: {
                        formatter: (val, time, index) => {
                            return moment(new Date(time)).locale(i18n.language).format('MMM DD')
                        }
                    }
                },
                stroke: {
                    width: 3,
                    curve: 'smooth'
                },
            };

            options.xaxis.categories = xAxisLabelField ? _.uniq(_.map(data, xAxisLabelField)) : xAxisLabels;
            if(colors.length) options.colors = colors;

            setOptions(options);
            if(seriesField) {
                setChartData(_.map(_.groupBy(data, seriesField.key),
                    (v, k) => ({name: k, data: _.map(v, seriesField.value)})))
            } else {
                setChartData(_.map(series, d => ({name: d.key, data:_.map(data, d.value)})))
            }
            setLoad(false);
        }

    };

    return (
        <div>
            {!load && <Chart options={options} series={chartData} type='line' height={350}/>}
        </div>
    )
}

export default withStore(LineChart);
