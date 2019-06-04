export default class CLI
{

    private static startTime: number;

    public static init()
    {
        this.startTime = Date.now();
    }

    public static log = (strMessage: string, strSlug?: string) => CLI.append(strMessage, strSlug);

    public static info = (strMessage: string) => CLI.append(strMessage, '?');

    public static connect = (strMessage: string) => CLI.append(strMessage, '->');

    public static disconnect = (strMessage: string) => CLI.append(strMessage, '<-');

    public static warn = (strMessage: string) => CLI.append(strMessage, '/!\\');

    private static checkInit(): void
    {
        if (this.startTime == undefined)
        {
            this.init();
        }
    }

    private static append(strMessage: string, strSlug?: string): void
    {
        this.checkInit();

        let diffTime = Date.now() - this.startTime;
        if (strSlug == undefined)
        {
            console.log(`${diffTime}:\t${strMessage}`);
        } else
        {
            console.log(`${diffTime}:\t${strSlug}\t${strMessage}`);
        }
    }
}
