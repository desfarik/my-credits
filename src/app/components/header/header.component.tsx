import * as React from "react";
import './header.styles.scss';
import {ReactNode} from "react";
import {AppBar, Button, IconButton, Toolbar, Typography} from "@material-ui/core";
import {AddNewNoteDialog} from "../add-new-note-dialog/add-new-note.dialog";
import {CreditNote} from "../../service/people.service";

interface IProps {
    createNewNotes: (value: any) => void;
    setAdminMode: () => void;
}

export default class HeaderComponent extends React.PureComponent<IProps> {
    private clickCounter: number = 0;
    public state = {
        adminMode: true,
        openAddNewNoteDialog: false,
    };

    private onHeaderClick = () => {
        this.clickCounter++;
        if (this.clickCounter > 4) {
            this.setState({adminMode: true});
            this.props.setAdminMode();
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
                {this.state.adminMode &&
                <Button color="inherit" onClick={this.addNewNote}>Add new
                    note</Button>}
            </Toolbar>
            {this.state.openAddNewNoteDialog && <AddNewNoteDialog onClose={this.onCloseDialog}/>}
        </AppBar>
    }
}

