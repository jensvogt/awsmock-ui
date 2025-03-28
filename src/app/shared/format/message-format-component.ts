export function isJson(message: string): boolean {
    if (!message) {
        return false;
    }
    return message.startsWith("{") || message.startsWith("[");
}

export function isXml(message: string): boolean {
    return message.startsWith("<");
}