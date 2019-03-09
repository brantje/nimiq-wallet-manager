import store from 'store'
import {AddressBook} from 'utils/AddressBook'
export function getAddressLabel(address) {
    let nimiqAddressBook = AddressBook.getLabel(address)
    if(nimiqAddressBook){
        return nimiqAddressBook
    }
    let book = [...store.state.contact.contacts, ...store.state.wallet.wallets]
    for (let i of book) {
        if (i.address === address) {
            return i.label
        }
    }
    return address

}