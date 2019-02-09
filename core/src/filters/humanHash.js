
export function humanHash (bytes) {
    if(isNaN(bytes)){
        return '0.00 kh/s';
    }
    var thresh = 1000;
    if(Math.abs(bytes) < thresh) {
        return bytes.toFixed(2) + ' H/S';
    }
    var units = ['kH/S','MH/S','GH/S','TH/S','PH/S','EH/S','ZH/S','YH/S'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}
