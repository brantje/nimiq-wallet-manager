export function lunaToCoins(input) {
    // if(isNaN(input)){
    //     return 0;
    // }
    // return (input / 1e5).toFixed(3);
    function _formatBalance(value) {
        value = value / 1e5;
        let valueStr = '';

        // If the value has no decimal places below 0.01, display 2 decimals
        if(parseFloat(value.toFixed(2)) === value) {
            valueStr = value.toFixed(2);
        }
        // Otherwise, all required decimals will be displayed automatically
        else valueStr = value.toString();

        let ints = _formatThousands(valueStr.split('.')[0]);
        let decs = valueStr.split('.')[1];

        return ints + '.' + decs.substr(0,2);
    }

    function _formatThousands(number, separator) {
        separator = separator || ' ';
        let reversed = number.split('').reverse();
        for(let i = 3; i < reversed.length; i += 4) {
            reversed.splice(i, 0, separator);
        }
        return reversed.reverse().join('');
    }
    if(input) {
        return _formatBalance(input)
    }
    return input;
}