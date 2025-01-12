export function isJson(message: string): boolean {
    return message.startsWith("{") || message?.startsWith("[");
}

export function isSml(message: string): boolean {
    return message.startsWith("<");
}