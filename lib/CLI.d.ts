export default class CLI
{
    static log: (strMessage: string, strSlug?: string) => void;
    static info: (strMessage: string) => void;
    static connect: (strMessage: string) => void;
    static disconnect: (strMessage: string) => void;
    static warn: (strMessage: string) => void;
    static error: (strMessage: string) => void;
    private static startTime;
    private static checkInit;
    private static append;

    static init(): void;
}
