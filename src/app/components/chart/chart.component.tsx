import * as React from 'react';
import {Brush, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis,} from 'recharts';
import './chart.styles.scss'
import PeopleService, {PersonCredits} from "../../service/people.service";

interface IProps {
    data: PersonCredits[]
}

interface ChartData {
    name: string,
    value: number
}

export default class ChartComponent extends React.PureComponent<IProps> {
    state = {
        chartData: {}
    };

    data = [
        {
            name: 'Page A', uv: 4000, pv: 2400
        },
        {
            name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
        },
        {
            name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
        },
        {
            name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
        },
        {
            name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
        },
        {
            name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
        },
        {
            name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
        },
    ];


    componentDidMount(): void {
    }

    private convertCreditNotesToChartData() {
        const dateMap: Map<number, ChartData[]> = new Map<number, ChartData[]>();

        this.props.data.forEach(personCreditNotes => {
                personCreditNotes.credits.forEach(creditNote => {
                    dateMap.set(creditNote.date, [{
                        name: personCreditNotes.name,
                        value: creditNote.total
                    }, ...(dateMap.get(creditNote.date) || [])])
                });
            }
        );
        return Array.from(dateMap.entries()).map(entry => {
            const result: any = {name: entry[0],};
            entry[1].forEach((chartData: ChartData) => {
                result[chartData.name] = chartData.value
            });
            return result;
        });
    }

    render() {
        this.data = this.convertCreditNotesToChartData();
        // this.setState({chartData: this.data});
        return (
            <LineChart
                className={'chart-wrapper'}
                width={parseInt(getComputedStyle(document.body).width as string) - 32}
                height={300}
                data={this.data}
                margin={{
                    top: 5, right: 10, left: -30, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                {this.props.data.map(personCredits =>
                    <Line key={personCredits.name}
                          strokeWidth={5} type="monotone" dataKey={personCredits.name}
                          stroke={PeopleService.getPersonColor(personCredits.name)} activeDot={{r: 10}}/>
                )}
            </LineChart>
        );
    }
}
