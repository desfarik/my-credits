export default class PeopleService {
    private static people: Map<string, Person> = new Map<string, Person>([
        ['Алена', {name: "Алена", color: "#9C27B0"}],
        ['Жека', {name: "Жека", color: "#2196F3"}],
        ['Никита', {name: "Никита", color: "#4CAF50"}],
        ['Влад', {name: "Влад", color: "#FFC107"}],
        ['Щука', {name: "Щука", color: "#795548"}]]);

    public static getAllPeople(): IterableIterator<Person> {
        return this.people.values();
    }

    public static getPersonColor(personName: string): string {
        // @ts-ignore
        return this.people.get(personName).color;
    }
}

export interface Person {
    name: string,
    color: string
}

export interface PersonCredits {
    name: string,
    credits: CreditNote[]
}

export interface CreditNote {
    date: number,
    value: number,
    person: string,
    description: string,
}