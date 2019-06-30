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
        total: 0,
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

    public openDetailsDialog = (person: ChartData) => {
        this.setState({selectedPerson: person});
    };

    public updateCreditNotes = (notes: CreditNote[]) => {
        this.creditNotesService.saveNotes(notes);
        this.setState({creditNotes: notes});
    };


    render() {
        return <React.Fragment>
            <HeaderComponent adminMode={this.state.adminMode}
                             createNewNotes={this.createNewNote}
                             checkPassword={this.checkPassword}/>
            <div className={'mainContent'} ref={this.mainContent}>
                <Typography className={'total-title'} variant={'h6'}>
                    Всего: {this.state.progressTotal ?
                    <CircularProgress className={'progress-circle'} size={35}/> :
                    this.state.total.toFixed(2)
                }
                </Typography>
                {this.mainContent.current && this.getMainContent()
                }
            </div>
            {this.state.selectedPerson && <NoteDetailsDialog onClose={this.onCloseDialog}
                                                             updateNotes={this.updateCreditNotes}
                                                             adminMode={this.state.adminMode}
                                                             notes={this.state.creditNotes}
                                                             person={this.state.selectedPerson as ChartData}/>}
        </React.Fragment>
    }

    getMainContent = () => {
        if (this.state.creditNotes && this.state.creditNotes.length > 0) {
            return <ChartComponent width={parseInt(getComputedStyle(this.mainContent.current).width || '')}
                                   notes={this.state.creditNotes}
                                   updateTotalValues={this.setTotal}
                                   openDetailsDialog={this.openDetailsDialog}/>

        } else {
            return <div className={'good-people'}>
                <Typography variant={'h4'}>Все рассчитались с долгами, все красавцы!!</Typography>
                <img className={'good-icon'} src={require('../../assets/salut.gif')}/>
            </div>

        }
    }
}
