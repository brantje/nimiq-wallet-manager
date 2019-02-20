export function lunaToCoins(input) {
    // if(isNaN(input)){
    //     return 0;
    // }
    // return (input / 1e5).toFixed(3);
    function _formatBalance(input) {
        let decimals = 5;
        const roundingFactor = Math.pow(10, decimals);
        const value = Math.floor((input / 1e5) * roundingFactor) / roundingFactor;
        const result = value.toFixed(decimals);
        if (Math.abs(value) < 10000) return result;
        // add thin spaces (U+202F) every 3 digits. Stop at the decimal separator if there is one
        const regexp = decimals > 0 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(\d{3})+$)/g;
        return result.replace(regexp, '$1\u2009');
    }

    if(input) {
        return _formatBalance(input)
    }
    return input;
}