import moment from 'moment'

export function formatDate(timestamp) {
    let dayAgo = new Date().getTime() - (60 * 60 * 24 * 1000);
    let time = new Date(timestamp * 1000);

    if (time.getTime() > dayAgo) {
        return moment(time).format('HH:mm');

    }
    return moment(time).format('DD MMM');
}