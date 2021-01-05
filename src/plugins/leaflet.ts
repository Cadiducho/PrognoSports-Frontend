import L from 'leaflet'

export function loadLeaflet() {
    // eslint-disable-next-line
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl
    // eslint-disable-next-line
    L.Icon.Default.imagePath = '.';
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png')
    })
}
