import {Driver} from "@/types/Driver";

export function useStyles() {

    const invertColor = (hex?: string): string => {
        if (!hex) return '#000000';
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        // convert 3-digit hex to 6-digits.
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) {
            // fallback to black on invalid input
            return '#000000';
        }
        const r = parseInt(hex.slice(0, 2), 16),
            g = parseInt(hex.slice(2, 4), 16),
            b = parseInt(hex.slice(4, 6), 16);

        // https://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 140 ? '#000000' : '#FFFFFF';
    }
    const styleDriverCard = (driver?: Driver): any => {
        const teamcolor = driver && driver.team && driver.team.teamcolor ? driver.team.teamcolor : undefined;
        const border = teamcolor ? '1px solid #' + teamcolor : '1px solid rgba(0,0,0,0.08)';
        const borderLeft = teamcolor ? '10px #' + teamcolor + ' solid' : undefined;
        return {
            color: 'black',
            border,
            ...(borderLeft ? { 'border-left': borderLeft } : {}),
            opacity: 0.9,
        }
    }
    const styleDorsal = (driver?: Driver): any => {
        const teamcolor = driver && driver.team && driver.team.teamcolor ? driver.team.teamcolor : undefined;
        return {
            color: invertColor(teamcolor),
            fontWeight: 'bold',
            ...(teamcolor ? { backgroundColor: '#' + teamcolor } : {}),
        }
    }
    const styleCodeInResults = (driver?: Driver): any => {
        if (!driver || driver.code === '???') return {}
        const teamcolor = driver.team && driver.team.teamcolor ? driver.team.teamcolor : undefined;
        return {
            'padding-left': '5px',
            ...(teamcolor ? { 'border-left': '4px #' + teamcolor + ' solid' } : {}),
            opacity: 0.9,
        }
    }

    return {invertColor, styleDriverCard, styleDorsal, styleCodeInResults};
}
