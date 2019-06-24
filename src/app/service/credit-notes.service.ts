import {firebaseConfig} from "./firebase.config";
import {CreditNote} from "./people.service";
import {firebase} from "@firebase/app";
import '@firebase/database';
import {FirebaseDatabase} from "@firebase/database-types";

export default class CreditNotesService {

    private database: FirebaseDatabase;

    constructor() {
        const app = firebase.initializeApp(firebaseConfig);
        // @ts-ignore
        this.database = app.database();
    }

    public getAllNotes(): Promise<CreditNote[]> {
        return this.database.ref('notes').once('value')
            .then(snapshot => Object.values(snapshot.val()) as CreditNote[])
    }

    public saveNotes(notes: CreditNote[]): void {
        this.database.ref('notes').set(notes);
    }

}