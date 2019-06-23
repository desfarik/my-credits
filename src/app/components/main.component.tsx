import * as React from 'react';
import 'react-circular-progressbar/dist/styles.css';
import ChartComponent from "./chart/chart.component";
import HeaderComponent from "./header/header.component";
import {CreditDetailsItemComponent} from "./credit-details/credit-details-item.component";
import './main.styles.scss';
import {PersonCredits} from "../service/people.service";
import CreditNotesService from "../service/credit-notes.service";

export class MainComponent extends React.PureComponent {
    public state = {
        adminMode: false,
        data: [{name: "Алена", value: 18}, {name: "Жека", value: 8}, {name: "Щука", value: 26}, {
            name: "Влад",
            value: 26
        }]
    };
    private creditNotesService: CreditNotesService;


    public componentDidMount() {
        if (!this.creditNotesService) {
            this.creditNotesService = new CreditNotesService()
        }
    }

    public createNewNote = (newNote: any) => {
    };

    public setAdminMode = () => {
        this.setState({adminMode: true});
    };

    render() {
        const data: PersonCredits[] = [
            {
                name: "Влад", credits: [{
                    date: 123,
                    value: 23,
                    total: 23,
                    description: "bla",
                },
                    {
                        date: 135,
                        value: 5,
                        total: 0,
                        description: "bl2a",
                    },
                    {
                        date: 158,
                        value: 5,
                        total: 128,
                        description: "bl2a",
                    }]
            },
            {
                name: "Никита", credits: [{
                    date: 123,
                    value: 10,
                    total: 10,
                    description: "bla",
                },
                    {
                        date: 135,
                        value: 5,
                        total: 22,
                        description: "bl2a",
                    },
                    {
                        date: 158,
                        value: 5,
                        total: 128,
                        description: "bl2a",
                    }]
            },
        ];
        return <React.Fragment>
            <HeaderComponent createNewNote={this.createNewNote} setAdminMode={this.setAdminMode}/>
            <div className={'mainContent'}>
                <p><b>Всего: 123</b></p>
                <ChartComponent data={data}/>
                <div className={'credit-item-list'}>
                    {this.state.data.sort((a, b) => b.value - a.value)
                        .map((entry => <CreditDetailsItemComponent key={entry.name}
                                                                   value={entry.value}
                                                                   name={entry.name}
                                                                   maxValue={30}/>))}
                </div>
            </div>
        </React.Fragment>

    }
}