export function getPeerState(state, type) {
    let states = {
        address: {
            1: 'New',
            2: 'Established',
            3: 'Tried',
            4: 'Failed',
            5: 'Banned',
        },
        connection: {
            1: 'New',
            2: 'Connecting',
            3: 'Connected',
            4: 'Negotiating',
            5: 'Established',
            6: 'Closed'
        }
    }
    return states[type][state]
}