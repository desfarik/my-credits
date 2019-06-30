import * as React from 'react';
import './chart.styles.scss'
import PeopleService, {CreditNote} from "../../service/people.service";
import {formatWithOptions} from 'date-fns/fp';
import {Cell, Pie, PieChart} from "recharts";

interface IProps {
    notes: CreditNote[],
    updateTotalValues: (totalValues: Map<string, number>) => void,
    openDetailsDialog: (person: ChartData) => void,
    width: number

}

export interface ChartData {
    person: string,
    value: number
}

export default class ChartComponent extends React.PureComponent<IProps> {
    private data: ChartData[];

    private convertCreditNotesToChartData(): ChartData[] {
        const prevTotalValues: Map<string, number> = new Map<string, number>();

        this.props.notes.forEach(creditNote => {
                prevTotalValues.set(creditNote.person, (prevTotalValues.get(creditNote.person) || 0) + creditNote.value);
            }
        );
        this.props.updateTotalValues(prevTotalValues);
        return [...prevTotalValues.entries()].map(e => {
            return {name: e[0], value: e[1]} as ChartData
        });
    }


    RADIAN = Math.PI / 180;
    // @ts-ignore
    renderCustomizedLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent, index}) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * this.RADIAN);
        const y = cy + radius * Math.sin(-midAngle * this.RADIAN);

        return <React.Fragment>
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central"
                  onClick={this.onclick.bind(this, this.data[index])}>
                {this.data[index].name}
            </text>
            <text x={x} y={y + 16} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central"
                  onClick={this.onclick.bind(this, this.data[index])}>
                {this.data[index].value.toFixed(1)}
            </text>
        </React.Fragment>
    };

    onclick = (person: ChartData) => {
        this.props.openDetailsDialog(person);
    };

    render() {
        this.data = this.convertCreditNotesToChartData().sort(() => Math.random() - 0.5);
        return (
            <PieChart width={this.props.width} height={this.props.width}>
                <Pie
                    // @ts-ignore
                    dataKey="value"
                    data={this.data}
                    cx={this.props.width / 2}
                    cy={this.props.width / 2}
                    labelLine={false}
                    label={this.renderCustomizedLabel}
                    outerRadius={(this.props.width / 2) - 10}
                    fill="#8884d8"
                >
                    {
                        this.data.map((entry) =>
                            <Cell
                                key={entry.name}
                                fill={PeopleService.getPersonColor(entry.name)}
                                onClick={this.onclick.bind(this, entry)}/>)
                    }
                </Pie>
            </PieChart>
        );
    }
}


export interface ChartData {
    value: number,
    name: string,
}