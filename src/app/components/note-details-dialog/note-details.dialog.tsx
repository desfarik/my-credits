import * as React from 'react';
import {ReactNode} from 'react';
import {AppBar, Dialog, IconButton, TextField, Toolbar, Typography} from "@material-ui/core";
import ArrowBack from "@material-ui/icons/ArrowBack";
import './note-details.styles.scss'
import {CreditNote} from "../../service/people.service";
import Button from "@material-ui/core/Button/Button";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import ExpandMore from "@material-ui/icons/ExpandMore";
import {formatWithOptions} from "date-fns/fp";
import {ChartData} from "../chart/chart.component";

interface IProps {
    adminMode: boolean,
    onCloseNotes: (amount: number) => void,
    onClose: () => void,
    person: ChartData,
    notes: CreditNote[],
    updateNotes: (notes: CreditNote[]) => void,
}

export class NoteDetailsDialog extends React.PureComponent<IProps> {
    private dateToString = formatWithOptions({}, 'dd.MM');
    state = {
        valueToReduce: ''
    }
    private closeDialog = () => this.props.onClose();
    private handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({valueToReduce: event.target.value});

    private reduceAmount = () => {
        const notes = this.props.notes.filter((note) => note.person === this.props.person.name).sort((a, b) => a.date - b.date);
        let amount = Number(this.state.valueToReduce);
        const newNotes: CreditNote = notes.map((note) => {
            if (amount < 0) {
                return note;
            }
            amount -= note.value;
            if (amount >= 0) {
                return null;
            } else {
                note.value = Number(Math.abs(amount).toFixed(2));
                return note;
            }
        }).filter(note => !!note);
        this.props.updateNotes([...newNotes, ...this.props.notes.filter((note) => note.person !== this.props.person.name)]);

    };

    public render(): ReactNode {
        if (!this.state.valueToReduce) {
            this.setState({valueToReduce: this.props.person.value.toFixed(2)});
        }
        // @ts-ignore
        const notes = this.props.notes.filter((note) => note.person === this.props.person.name).sort((a, b) => a.date - b.date);
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
                        required={true}
                        label="Amount"
                        value={this.state.valueToReduce}
                        onChange={this.handleValueChange}
                        type="number"
                        margin="normal"
                    />
                    <Button className={'reduce-button'} variant="contained" color="primary"
                            onClick={this.reduceAmount}>Reduce</Button>
                </div>}

                <Typography variant={'subtitle1'}>{this.props.person.name}:</Typography>
                <div className={'header'}>
                    <div className={'date-container'}>
                        <span>Date</span>
                        <span>Amount</span>
                    </div>
                </div>
                {notes.map(note =>
                    <ExpansionPanel key={note.date} className={'expansion-panel'}>
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



