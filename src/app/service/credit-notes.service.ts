import * as firebase from "firebase";
import {firebaseConfig} from "./firebase.config";
import {CreditNote} from "./people.service";

export default class CreditNotesService {

    private database: firebase.database.Database;

    constructor() {
        firebase.initializeApp(firebaseConfig);
        this.database = firebase.database();
    }

    public getAllNotes(): Promise<CreditNote[]> {
        return this.database.ref('notes').once('value')
            .then(snapshot => Object.values(snapshot.val()) as CreditNote[])
    }

    public saveNotes(notes: CreditNote[]): void {
        this.database.ref('notes').set(notes);
    }

}