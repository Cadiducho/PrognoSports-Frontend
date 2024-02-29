import {Driver} from "@/types/Driver";

export function useStyles() {

    const invertColor = (hex: string): string => {
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        // convert 3-digit hex to 6-digits.
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
        const r = parseInt(hex.slice(0, 2), 16),
            g = parseInt(hex.slice(2, 4), 16),
            b = parseInt(hex.slice(4, 6), 16);

        // https://stackoverflow.com/a/3943023/112731
        const ret = (r * 0.299 + g * 0.587 + b * 0.114) > 140
            ? '#000000'
            : '#FFFFFF';
        return ret;
    }
    const styleDriverCard = (driver: Driver): any => {
        return {
            color: 'black',
            'border': '1px solid #' + driver.team.teamcolor,
            'border-left': '10px #' + driver.team.teamcolor + ' solid',
            'border-right-image-source': 'linear-gradient(to left, #'+ driver.team.teamcolor + ', #ffffff)',
            opacity: 0.9,
        }
    }
    const styleDorsal = (driver: Driver): any => {
        return {
            color: invertColor(driver.team.teamcolor),
            fontWeight: 'bold',
            backgroundColor: '#' + driver.team.teamcolor,
        }
    }
    const styleCodeInResults = (driver: Driver): any => {
        if (driver.code === '???') return {}
        return {
            color: 'black',
            'padding-left': '5px',
            'border-left': '4px #' + driver.team.teamcolor + ' solid',
            'border-right-image-source': 'linear-gradient(to left, #' + driver.team.teamcolor + ', #ffffff)',
            opacity: 0.9,
        }
    }

    return {invertColor, styleDriverCard, styleDorsal, styleCodeInResults};
}