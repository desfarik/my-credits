import * as React from 'react';
import 'react-circular-progressbar/dist/styles.css';
import ChartComponent from "./chart/chart.component";
import HeaderComponent from "./header/header.component";
import {CreditDetailsItemComponent} from "./credit-details/credit-details-item.component";
import './main.styles.scss';
import {CreditNote} from "../service/people.service";
import CreditNotesService from "../service/credit-notes.service";
import {Button} from "@material-ui/core";
import {NoteDetailsDialog} from "./note-details-dialog/note-details.dialog";

export class MainComponent extends React.PureComponent {
    public state = {
        selectedPerson: [],
        total: 0,
        totalValues: new Map<string, number>(),
        adminMode: false,
        creditNotes: Array<CreditNote>(),
    };
    private creditNotesService: CreditNotesService;


    public async componentDidMount() {
        if (!this.creditNotesService) {
            this.creditNotesService = new CreditNotesService()
            this.setState({creditNotes: await this.creditNotesService.getAllNotes()})
        }
    }

    public createNewNote = (newNotes: CreditNote[]) => {
        const allNotes = [...this.state.creditNotes, ...newNotes];
        this.setState({creditNotes: allNotes});
        this.creditNotesService.saveNotes(allNotes);
    };

    public setAdminMode = () => {
        this.setState({adminMode: true});
    };

    public setTotal = (totalValues: Map<string, number>) => {
        const total = Array.from(totalValues.values()).reduce((accumulator: number, value: number) => accumulator + value, 0);
        this.setState({total: total, totalValues: totalValues});
    };

    public onCloseDialog = () => {
        this.setState({selectedPerson: []});
    };

    public closeNotes = (amount: number) => {
        console.log(amount);
    };

    render() {
        return <React.Fragment>
            <HeaderComponent createNewNotes={this.createNewNote} setAdminMode={this.setAdminMode}/>
            <div className={'mainContent'}>
                <p><b>Всего: {this.state.total}</b></p>
                <ChartComponent notes={this.state.creditNotes} updateTotalValues={this.setTotal}/>
                <div className={'credit-item-list'}>
                    {Array.from(this.state.totalValues.entries()).sort((a, b) => b[1] - a[1])
                        .map((entry =>
                                <CreditDetailsItemComponent key={entry[0]}
                                                            value={entry[1]}
                                                            name={entry[0]}
                                                            maxValue={50}>
                                    <div className={'details-container'}>
                                        <Button color="inherit"
                                                onClick={() => this.setState({selectedPerson: entry})}> </Button>
                                    </div>
                                </CreditDetailsItemComponent>

                        ))}
                </div>
            </div>
            {this.state.selectedPerson.length > 0 && <NoteDetailsDialog onClose={this.onCloseDialog}
                                                             onCloseNotes={this.closeNotes}
                                                             adminMode={this.state.adminMode}
                                                             notes={this.state.creditNotes}
                                                             person={this.state.selectedPerson}/>}
        </React.Fragment>
    }
}
