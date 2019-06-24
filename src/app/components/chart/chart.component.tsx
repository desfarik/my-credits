import * as React from 'react';
import {CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis,} from 'recharts';
import './chart.styles.scss'
import PeopleService, {CreditNote, Person} from "../../service/people.service";
import {formatWithOptions} from 'date-fns/fp';

interface IProps {
    notes: CreditNote[],
    updateTotalValues: (totalValues: Map<string, number>) => void,

}

export interface ChartData {
    person: string,
    value: number
}

export default class ChartComponent extends React.PureComponent<IProps> {
    private dateToString = formatWithOptions({}, 'dd.MM');

    private convertCreditNotesToChartData() {
        const dateMap: Map<number, ChartData[]> = new Map<number, ChartData[]>();
        const prevTotalValues: Map<string, number> = new Map<string, number>();

        this.props.notes.sort((a, b) => a.date - b.date).forEach(creditNote => {
                dateMap.set(creditNote.date, [...dateMap.get(creditNote.date) || [], {
                    person: creditNote.person,
                    value: (prevTotalValues.get(creditNote.person) || 0) + creditNote.value
                }]);
                prevTotalValues.set(creditNote.person, (prevTotalValues.get(creditNote.person) || 0) + creditNote.value);
            }
        );

        this.props.updateTotalValues(prevTotalValues);
        prevTotalValues.clear();
        const allPersons = Array.from(PeopleService.getAllPeople());

        Array.from(dateMap.entries()).forEach(entry => {
                allPersons.forEach((person: Person) => {
                    const chartData = entry[1].find((chartData) => person.name === chartData.person);
                    if (chartData) {
                        prevTotalValues.set(chartData.person, chartData.value);
                    } else {
                        entry[1].push({
                            person: person.name,
                            value: (prevTotalValues.get(person.name) || 0)
                        })
                    }
                })
        });

        return Array.from(dateMap.entries()).map(entry => {
            const result: any = {date: this.dateToString(entry[0]),};
            entry[1].forEach((chartData: ChartData) => {
                result[chartData.person] = chartData.value
            });
            return result;
        });
    }

    render() {
        const data = this.convertCreditNotesToChartData();
        console.log(data);
        const allPersons = Array.from(PeopleService.getAllPeople());
        return (
            <LineChart
                className={'chart-wrapper'}
                width={parseInt(getComputedStyle(document.body).width as string) - 32}
                height={300}
                data={data}
                margin={{
                    top: 5, right: 10, left: -30, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="date"/>
                <YAxis/>
                <Tooltip/>
                {allPersons.map((person: Person) =>
                    <Line key={person.name}
                          strokeWidth={5} type="monotone" dataKey={person.name}
                          stroke={person.color} activeDot={{r: 10}}/>
                )}
            </LineChart>
        );
    }
}
