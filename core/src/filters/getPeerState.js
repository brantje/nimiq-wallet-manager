

export function getPeerState(state) {
    let states = {
        1: 'New',
        2: 'Connecting',
        3: 'Connected',
        4: 'Negotiating',
        5: 'Established',
        6: 'Closed'
    }
    return states[state]
}