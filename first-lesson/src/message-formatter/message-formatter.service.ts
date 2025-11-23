export class MessageFormatterService {
    format(message:string):string{
        const currentTimestamp = new Date().toISOString();
        return `[${currentTimestamp}] ${message}`;
    }
}
