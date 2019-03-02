async function encrypt (plainText, password) {
    let ctBase64, ivHex
    try {
        let pwUtf8 = new TextEncoder().encode(password)                                 // encode password as UTF-8
        let pwHash = await crypto.subtle.digest('SHA-256', pwUtf8)                      // hash the password
        let iv = crypto.getRandomValues(new Uint8Array(12))                             // get 96-bit random iv
        let alg = {name: 'AES-GCM', iv: iv}                                           // specify algorithm to use
        let key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['encrypt']) // generate key from pw
        let ptUint8 = new TextEncoder().encode(plainText)                               // encode plaintext as UTF-8
        let ctBuffer = await crypto.subtle.encrypt(alg, key, ptUint8)                   // encrypt plaintext using key
        let ctArray = Array.from(new Uint8Array(ctBuffer))                              // ciphertext as byte array
        let ctStr = ctArray.map(byte => String.fromCharCode(byte)).join('')             // ciphertext as string
        ctBase64 = btoa(ctStr)                                                      // encode ciphertext as base64
        ivHex = Array.from(iv).map(b => ('00' + b.toString(16)).slice(-2)).join('') // iv as hex string
    } catch (e) {
        console.error(e)
    }

    return ivHex + ctBase64
}

async function decrypt (ciphertext, password) {
    const pwUtf8 = new TextEncoder().encode(password)                                  // encode password as UTF-8
    const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8)                       // hash the password

    const iv = ciphertext.slice(0, 24).match(/.{2}/g).map(byte => parseInt(byte, 16))   // get iv from ciphertext

    const alg = {name: 'AES-GCM', iv: new Uint8Array(iv)}                            // specify algorithm to use

    const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['decrypt'])  // use pw to generate key

    const ctStr = atob(ciphertext.slice(24))                                           // decode base64 ciphertext
    const ctUint8 = new Uint8Array(ctStr.match(/[\s\S]/g).map(ch => ch.charCodeAt(0))) // ciphertext as Uint8Array
    // note: why doesn't ctUint8 = new TextEncoder().encode(ctStr) work?

    const plainBuffer = await crypto.subtle.decrypt(alg, key, ctUint8)                 // decrypt ciphertext using key
    const plaintext = new TextDecoder().decode(plainBuffer)                            // decode password from UTF-8

    return plaintext                                                                   // return the plaintext
}

export {encrypt, decrypt}