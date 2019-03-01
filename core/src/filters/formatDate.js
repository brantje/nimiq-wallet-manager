import moment from 'moment'

export function formatDate(timestamp, format) {
    let dayAgo = new Date().getTime() - (60 * 60 * 24 * 1000)
    let time = new Date(timestamp * 1000)

    if(format === 'long') {
        let locale = window.navigator.userLanguage || window.navigator.language
        moment.locale(locale)
        return moment(time).format('LLL')
    }

    if (time.getTime() > dayAgo) {
        return moment(time).format('HH:mm')

    }
    return moment(time).format('DD MMM')
}