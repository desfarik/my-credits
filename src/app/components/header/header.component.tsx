import * as React from "react";
import {ReactNode} from "react";
import './header.styles.scss';
import {AppBar, Button, Dialog, FormControl, IconButton, TextField, Toolbar, Typography} from "@material-ui/core";
import {AddNewNoteDialog} from "../add-new-note-dialog/add-new-note.dialog";
import {CreditNote} from "../../service/people.service";
import Close from "@material-ui/icons/Close";

interface IProps {
    createNewNotes: (value: any) => void;
    checkPassword: (password: string) => Promise<boolean>;
    adminMode: boolean
}

export default class HeaderComponent extends React.PureComponent<IProps> {
    private clickCounter: number = 0;
    public state = {
        openAddNewNoteDialog: false,
        openVerifyPassword: false,
        password: ''
    };

    private onHeaderClick = () => {
        this.clickCounter++;
        if (this.clickCounter > 4) {
            this.setState({openVerifyPassword: true});
        }
    };

    private addNewNote = () => {
        this.setState({openAddNewNoteDialog: true});
    };

    private onCloseDialog = (newNote: CreditNote[]) => {
        if (newNote.length > 0) {
            this.props.createNewNotes(newNote);
        }
        this.setState({openAddNewNoteDialog: false});
    };

    private handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({password: event.target.value});

    private verifyPassword = async () => {
        const result = await this.props.checkPassword(this.state.password);
        if (result) {
            localStorage.setItem('last_password', this.state.password);
            this.setState({openVerifyPassword: false});
        }
    };

    render(): ReactNode {
        return <AppBar position="static">
            <Toolbar className={'toolbar'}>
                <div className={'toolbar-title'}>
                    <IconButton edge="start" color="inherit" aria-label="Menu"
                                onClick={this.onHeaderClick}>
                        <img className={'toolbar-icon'} src={require('../../../assets/cash.png')}/>
                    </IconButton>
                    <Typography variant="h6">
                        Credit notes
                    </Typography>
                </div>
                {this.props.adminMode &&
                <Button color="inherit" onClick={this.addNewNote}>Add new
                    note</Button>}
            </Toolbar>
            {this.state.openAddNewNoteDialog && <AddNewNoteDialog onClose={this.onCloseDialog}/>}
            {this.state.openVerifyPassword && this.getVerifyPasswordDialog()}
        </AppBar>
    }

    getVerifyPasswordDialog = () => {
        return <Dialog fullScreen open={true} className={'verify-password-dialog'}>
            <AppBar position="static">
                <Toolbar className={'toolbar'}>
                    <div className={'toolbar-title'}>
                        <IconButton onClick={() => this.setState({openVerifyPassword: false})} edge="start"
                                    color="inherit"
                                    aria-label="Close">
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
                    label="Password"
                    value={this.state.password}
                    onChange={this.handlePasswordChange}
                    type="number"
                    margin="normal"
                />
                <div className={'dialog-confirm'}>
                    <Button variant="contained" color="primary"
                            onClick={this.verifyPassword}>Verify</Button>
                </div>
            </FormControl>
        </Dialog>
    }
}

