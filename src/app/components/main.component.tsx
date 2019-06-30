import * as React from 'react';
import {RefObject} from 'react';
import 'react-circular-progressbar/dist/styles.css';
import ChartComponent, {ChartData} from "./chart/chart.component";
import HeaderComponent from "./header/header.component";
import './main.styles.scss';
import {CreditNote} from "../service/people.service";
import FirebaseService from "../service/firebase.service";
import {NoteDetailsDialog} from "./note-details-dialog/note-details.dialog";
import {Typography} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

export class MainComponent extends React.PureComponent {
    public state = {
        selectedPerson: null,
        total: null,
        progressTotal: true,
        totalValues: new Map<string, number>(),
        adminMode: false,
        creditNotes: Array<CreditNote>(),
    };
    private creditNotesService: FirebaseService;
    private mainContent: RefObject<HTMLDivElement>;


    constructor(props: any, context: any) {
        super(props, context);
        this.mainContent = React.createRef();
    }

    public async componentDidMount() {
        if (!this.creditNotesService) {
            this.creditNotesService = new FirebaseService();
            this.setState({creditNotes: await this.creditNotesService.getAllNotes()});
            this.setState({adminMode: await this.creditNotesService.checkPassword(localStorage.getItem('last_password') || '')});
            setTimeout(() => {
                this.setState({progressTotal: false})
            }, 1700);
        }
    }

    public createNewNote = (newNotes: CreditNote[]) => {
        const allNotes = [...this.state.creditNotes, ...newNotes];
        this.setState({creditNotes: allNotes});
        this.creditNotesService.saveNotes(allNotes);
    };

    public checkPassword = (password: string): Promise<boolean> => {
        return this.creditNotesService.checkPassword(password).then(result => {
            this.setState({adminMode: result});
            return result;
        })
    };


    public setTotal = (totalValues: Map<string, number>) => {
        const total = Array.from(totalValues.values()).reduce((accumulator: number, value: number) => accumulator + value, 0);
        this.setState({total: total, totalValues: totalValues});
    };

    public onCloseDialog = () => {
        this.setState({selectedPerson: null});
    };

    public closeNotes = (amount: number) => {
        console.log(amount);
    };

    render() {
        return <React.Fragment>
            <HeaderComponent adminMode={this.state.adminMode}
                             createNewNotes={this.createNewNote}
                             checkPassword={this.checkPassword}/>
            <div className={'mainContent'} ref={this.mainContent}>
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
                                                             updateNotes={this.updateCreditNotes}
                                                             adminMode={this.state.adminMode}
                                                             notes={this.state.creditNotes}
                                                             person={this.state.selectedPerson}/>}
        </React.Fragment>
    }
}
