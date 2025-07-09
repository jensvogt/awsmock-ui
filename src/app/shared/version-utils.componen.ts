export function getVersion(filename: string) {
    const matches = filename.match(/.*-(\d+\.\d+\.\d+)-.*/);
    if (matches && matches.length > 1) {
        return matches[1];
    }
    return 'latest'
}