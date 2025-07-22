export function durationConversion(duration: number | undefined, decimals = 2): string {

    if (duration === 0 || duration === undefined) return '0 ms';

    const thousand = 1000;
    const decimal = decimals < 0 ? 0 : decimals;
    const sizes = ['ms', 's'];

    const i: number = Math.floor(Math.log(duration) / Math.log(thousand));

    return `${parseFloat((duration / 1000 ** i).toFixed(decimal))} ${sizes[i]}`
}