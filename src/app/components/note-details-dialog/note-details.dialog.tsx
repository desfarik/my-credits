import * as React from 'react';
import {ReactNode} from 'react';
import {AppBar, Dialog, IconButton, TextField, Toolbar, Typography} from "@material-ui/core";
import ArrowBack from "@material-ui/icons/ArrowBack";
import './note-details.styles.scss'
import PeopleService, {CreditNote} from "../../service/people.service";
import Button from "@material-ui/core/Button/Button";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import ExpandMore from "@material-ui/icons/ExpandMore";
import {formatWithOptions} from "date-fns/fp";
import {RefObject} from "react";

interface IProps {
    adminMode: boolean,
    onCloseNotes: (amount: number) => void,
    onClose: () => void,
    person: Array<number>,
    notes: CreditNote[]
}

export class NoteDetailsDialog extends React.PureComponent<IProps> {
    private amountInputRef: RefObject<HTMLInputElement>;
    private dateToString = formatWithOptions({}, 'dd.MM');

    constructor(props: IProps) {
        super(props);
        this.amountInputRef = React.createRef();
    }

    private closeDialog = () => this.props.onClose();

    public componentDidMount() {

    }


    public render(): ReactNode {
        const [personName, totalDebt] = this.props.person;
        // @ts-ignore
        const notes = this.props.notes.filter((note) => note.person === personName).sort((a, b) => a.date - b.date);
        return <Dialog fullScreen open={true} className={'note-details-dialog'}>
            <AppBar position="static">
                <Toolbar className={'toolbar'}>
                    <div className={'toolbar-title'}>
                        <IconButton onClick={this.closeDialog} edge="start" color="inherit" aria-label="Close">
                            <ArrowBack></ArrowBack>
                        </IconButton>
                        <Typography variant="h6">
                            Details
                        </Typography>
                    </div>
                </Toolbar>
            </AppBar>
            <div className={'mainContent'}>
                {this.props.adminMode && <div className={'admin-tools'}>
                    <TextField
                        ref={this.amountInputRef}
                        required={true}
                        label="Amount"
                        value={totalDebt}
                        type="number"
                        margin="normal"
                    />
                    <Button className={'reduce-button'} variant="contained" color="primary">Reduce</Button>
                </div>}

                <Typography variant={'subtitle1'}>{personName}:</Typography>
                <div className={'header'}>
                    <div className={'date-container'}>
                        <span>Date</span>
                        <span>Amount</span>
                    </div>
                </div>
                {notes.map(note =>
                    <ExpansionPanel className={'expansion-panel'}>
                        <ExpansionPanelSummary className={'expansion-panel-title'}
                                               expandIcon={<ExpandMore/>}
                                               aria-controls="panel1a-content">
                            <div className={'date-container'}>
                                <span className={'date'}>{this.dateToString(note.date)}</span>
                                <span>{note.value}</span>
                            </div>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography variant={'body2'}>
                                {note.description || 'Нет описания'}
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                )}

            </div>
        </Dialog>
    }
}



