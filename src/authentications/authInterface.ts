export interface signTokenInterface {
    token : string;
    payload: {
        id: string;
        number: string;
        role: string;
    }
}
export interface decodeTokenInterface {
    id: string;
    number: string;
    role: string;
}