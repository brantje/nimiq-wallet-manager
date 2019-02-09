const router = require('express').Router();
const auth = require('./auth');
const Nimiq = require('@nimiq/core');
const Identicon = require('../../lib/Identicon');
const { convertFile }=  require('convert-svg-to-png');
const fs = require('fs');

router.get('/:address', auth.optional, async (req, res, next) => {
    let address, size, format, svg;
    [address, size, format] = req.params.address.split('.');
    let validAddress;
    if (isNaN(size)) {
        format = size;
        size = 128
    }
    if (!format) {
        format = 'svg';
    }
    try {
        validAddress = Nimiq.Address.fromUserFriendlyAddress(address);
    } catch (e) {

    }

    if (!validAddress) {
        return res.status(422).json({
            errors: {
                address: 'is not valid',
            },
        });
    }

    const filenameSvg = validAddress.toHex() + '.svg';
    const filename = validAddress.toHex() + '.'+ size +'.' + format;
    const savePath = './cache/' + filenameSvg;
    if (fs.existsSync('./cache/' + filenameSvg)) {
        svg = fs.readFileSync(savePath, 'utf8');
    } else {
        svg = await Identicon.svg(address, true, true);
        fs.writeFile(savePath, svg, function (err) {
            if (err) {
                return console.log(err);
            }
        });
    }


    if (format === 'svg') {
        res.writeHead(200, {
            "Content-Type": "image/svg+xml",
            "Last-Modified":  new Date().toUTCString(),
            "Content-Length": svg.length,
            "Cache-Control": 'public, max-age=18144000',
            "Expires": new Date(Date.now() + 18144000)
        });
        res.write(svg);
        res.end();
        return;
    }

    if (format === 'png') {
        if (fs.existsSync('./cache/' + filename)) {
            let stats = fs.statSync('./cache/'+ filename);
            res.writeHead(200, {
                "Content-Type": "image/jpg",
                "Last-Modified":  stats.mtime.toUTCString(),
                "Content-Length": stats.size,
                "Cache-Control": 'public, max-age=18144000',
                "Expires": new Date(Date.now() + 18144000)
            });
            res.write(fs.readFileSync('./cache/'+ filename));
            res.end();
        } else {
            let outputFilePath = await convertFile(savePath,{
                width: size,
                height: size
            });
            if (!fs.existsSync('./cache/' + filename)) {
                fs.rename(outputFilePath, './cache/' + filename, function () {
                    let stats = fs.statSync('./cache/' + filename);
                    res.writeHead(200, {
                        "Content-Type": "image/jpg",
                        "Last-Modified": stats.mtime.toUTCString(),
                        "Content-Length": stats.size,
                        "Cache-Control": 'private',
                    });
                    res.write(fs.readFileSync('./cache/' + filename));
                    res.end();
                    // res.sendFile(filename, { root: './cache' });
                });
            } else {
                return res.status(422);
            }
        }
    }

});
module.exports = router;