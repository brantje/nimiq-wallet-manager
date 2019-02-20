import store from 'store'

export function getAddressLabel(address) {
    let book = [...store.state.contact.contacts, ...store.state.wallet.wallets]
    for (let i of book) {
        if (i.address === address) {
            return i.label
        }
    }
    return address

}