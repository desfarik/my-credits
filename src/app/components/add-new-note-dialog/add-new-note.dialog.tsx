import * as React from 'react';
import {ReactNode} from 'react';
import {
    AppBar,
    Button,
    Checkbox,
    Chip,
    Dialog,
    Divider,
    FormControl,
    IconButton,
    Input,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Toolbar,
    Typography
} from "@material-ui/core";
import Close from "@material-ui/icons/Close";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import './add-new-note.styles.scss'
import PeopleService, {CreditNote} from "../../service/people.service";
import {Transition} from "../header/header.component";

interface IProps {
    onClose: (notes: CreditNote[]) => void
}

export class AddNewNoteDialog extends React.PureComponent<IProps> {

    public state = {
        date: this.getTodayTime(),
        value: '',
        persons: [],
        description: ''
    };

    public names = ['Я', ...Array.from(PeopleService.getAllPeople()).map((person) => person.name)];

    private closeDialog = () => this.props.onClose([]);

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
        this.props.onClose(notes);
    };

    private getTodayTime() {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate());
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
        return <Dialog fullScreen open={true} className={'add-new-note-dialog'}
                       TransitionComponent={Transition}>
            <AppBar position="static">
                <Toolbar className={'toolbar'}>
                    <div className={'toolbar-title'}>
                        <IconButton onClick={this.closeDialog} edge="start" color="inherit" aria-label="Close">
                            <Close></Close>
                        </IconButton>
                        <Typography variant="h6">
                            Add new note
                        </Typography>
                    </div>
                </Toolbar>
            </AppBar>
            <FormControl className={'mainContent'}>
                <TextField
                    required={true}
                    label="Amount"
                    value={this.state.value}
                    onChange={this.handleValueChange}
                    type="number"
                    margin="normal"
                />

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        value={this.state.date}
                        onChange={this.handleDateChange}
                        maxDate={new Date()}
                        format="dd/MM/yyyy"
                    />
                </MuiPickersUtilsProvider>
                <InputLabel className={'person-select'} htmlFor="person-select">Persons*</InputLabel>
                <Select
                    inputProps={{
                        name: 'person-select',
                        id: 'person-select',
                    }}
                    multiple
                    value={this.state.persons}
                    onChange={this.handlePersonsChange}
                    input={<Input/>}
                    renderValue={selected => <div className={'selected-persons'}>{(selected as string[]).map(value =>
                        <Chip className={'selected-person'}
                              key={value}
                              label={value}/>)}</div>}
                >
                    {<MenuItem className={'select-all'} key={'all'} value={'all'}>
                        <ListItemText primary={'All'}/>
                    </MenuItem>}
                    {<Divider/>}
                    {this.names.map((name: string) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={(this.state.persons as string[]).includes(name)}/>
                            <ListItemText primary={name}/>
                        </MenuItem>
                    ))}
                </Select>
                <TextField
                    required={true}
                    label="Party description"
                    multiline
                    rows="4"
                    value={this.state.description}
                    onChange={this.handleDescriptionChange}
                    margin="normal"
                />
                <div className={'dialog-confirm'}>
                    <Button disabled={buttonDisable} variant="contained" color="primary"
                            onClick={this.addNewNote}>Add</Button>
                </div>
            </FormControl>
        </Dialog>
    }
}



