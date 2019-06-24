import * as React from 'react';
import {ReactNode} from 'react';
import {AppBar, Dialog, IconButton, TextField, Toolbar, Typography} from "@material-ui/core";
import ArrowBack from "@material-ui/icons/ArrowBack";
import './note-details.styles.scss'
import PeopleService, {CreditNote} from "../../service/people.service";

interface IProps {
    adminMode: boolean,
    onCloseNotes: (amount: number) => void,
    onClose: () => void,
    person: Array<number>,
    notes: CreditNote[]
}

export class NoteDetailsDialog extends React.PureComponent<IProps> {

    public state = {
        date: this.getTodayTime(),
        value: '',
        persons: [],
        description: ''
    };

    public names = ['Я', ...Array.from(PeopleService.getAllPeople()).map((person) => person.name)];

    private closeDialog = () => this.props.onClose();

    private addNewNote = () => {
        const amountForPerson = Number((parseInt(this.state.value) / this.state.persons.length).toFixed(1));
        const notes = this.state.persons.filter(p => p !== 'Я').map(person => {
            return {
                date: this.state.date.getTime(),
                value: amountForPerson,
                description: this.state.description,
                person: person

            } as CreditNote
        });
        this.props.onClose();
    };

    private getTodayTime() {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDay());
    }

    private handleDateChange = (newDate: Date) => this.setState({date: newDate});

    private handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({value: event.target.value});

    private handlePersonsChange = (event: React.ChangeEvent<{ value: any }>) => {
        const selected = event.target.value as string[];
        if (selected.includes('all')) {
            this.setState({persons: this.names});
        } else {
            this.setState({persons: selected});
        }
    };
    private handleDescriptionChange = (event: React.ChangeEvent<{ value: any }>) => this.setState({description: event.target.value as string});


    public render(): ReactNode {
        const buttonDisable = !this.state.value || this.state.persons.filter(v => v !== 'Я').length < 1;
        return <Dialog fullScreen open={true} className={'add-new-note-dialog'}>
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
                <TextField
                    required={true}
                    label="Amount"
                    value={this.props.person[1]}
                    onChange={this.handleValueChange}
                    type="number"
                    margin="normal"
                />
                {this.props.person[0]}
            </div>
        </Dialog>
    }
}



