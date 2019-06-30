import {firebaseConfig} from "./firebase.config";
import {CreditNote} from "./people.service";
import {firebase} from "@firebase/app";
import '@firebase/database';
import {FirebaseDatabase} from "@firebase/database-types";

export default class FirebaseService {

    private database: FirebaseDatabase;

    constructor() {
        const app = firebase.initializeApp(firebaseConfig);
        // @ts-ignore
        this.database = app.database();
    }

    public checkPassword(password: string): Promise<boolean> {
        return this.database.ref('password').once('value')
            .then(snapshot => snapshot.val() === password);
    }

    public getAllNotes(): Promise<CreditNote[]> {
        return this.database.ref('notes').once('value')
            .then(snapshot => snapshot && snapshot.val() && Object.values(snapshot.val()) as CreditNote[] || [])
    }

    public saveNotes(notes: CreditNote[]): void {
        this.database.ref('notes').set(notes);
    }

}