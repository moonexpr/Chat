export enum MessageType
{
    Network,	// These messages come from other daemon servers for a full system message.
    Host,		// These messages are specific to the daemon running the chat.
    UGC,		// User-Generated Content (UGC) are from users of the chat.
    Local, 		// We should theoretically never get these messages.
}
