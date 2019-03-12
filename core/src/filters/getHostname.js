export function getHostname(input) {
    const regex = /:\/\/(.*):/gm
    const m = regex.exec(input)
    if (m && m[1]) {
        return m[1]
    }
    return input
}