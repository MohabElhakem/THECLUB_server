export interface signTokenInterface {
    token : string;
    payload: {
        userId: number;
        email: string;
        role: string;
    }
}
export interface decodeTokenInterface {
    userId: number;
    email: string;
    role: string;
}