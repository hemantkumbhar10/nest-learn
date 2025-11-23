export class WrongTaskStatusTransitionException extends Error {
    constructor(){
        super('Invalid task status transition');
        this.name = 'WrongTaskStatusTransitionException';
    }
}