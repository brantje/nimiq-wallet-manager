const router = require('express').Router()
const auth = require('./auth')
const Nimiq = require('@nimiq/core')
const Iqons = require('@nimiq/iqons').default
const { convertFile }=  require('convert-svg-to-png')
const fs = require('fs')

router.get('/:address', auth.optional, async (req, res, next) => {
    let address, size, format, svg;
    [address, size, format] = req.params.address.split('.')
    let validAddress
    if (isNaN(size)) {
        format = size
        size = 128
    }
    if (!format) {
        format = 'svg'
    }
    try {
        validAddress = Nimiq.Address.fromUserFriendlyAddress(address)
    } catch (e) {

    }

    if (!validAddress) {
        res.type('svg')
        return res.status(200).send('<svg viewBox="0 0 160 160" width="256" height="256" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" ><defs><clipPath id="hexagon-clip-3803192263" transform="scale(0.5) translate(0, 16)"></clipPath></defs><path fill="white" stroke="#3b3b3b" transform="translate(0, 8) scale(0.5)" d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/></svg>')
    }

    const filenameSvg = validAddress.toHex() + '.svg'
    const filename = validAddress.toHex() + '.'+ size +'.' + format
    const savePath = './cache/' + filenameSvg
    if (fs.existsSync('./cache/' + filenameSvg)) {
        svg = fs.readFileSync(savePath, 'utf8')
    } else {
        svg = await Iqons.svg(address)
        fs.writeFile(savePath, svg, function (err) {
            if (err) {
                return console.log(err)
            }
        })
    }


    if (format === 'svg') {
        res.writeHead(200, {
            "Content-Type": "image/svg+xml",
            "Last-Modified":  new Date().toUTCString(),
            "Content-Length": svg.length,
            "Cache-Control": 'public, max-age=18144000',
            "Expires": new Date(Date.now() + 18144000)
        })
        res.write(svg)
        res.end()
        return
    }

    if (format === 'png') {
        if (fs.existsSync('./cache/' + filename)) {
            let stats = fs.statSync('./cache/'+ filename)
            res.writeHead(200, {
                "Content-Type": "image/jpg",
                "Last-Modified":  stats.mtime.toUTCString(),
                "Content-Length": stats.size,
                "Cache-Control": 'public, max-age=18144000',
                "Expires": new Date(Date.now() + 18144000)
            })
            res.write(fs.readFileSync('./cache/'+ filename))
            res.end()
        } else {
            let outputFilePath = await convertFile(savePath,{
                width: size,
                height: size
            })
            if (!fs.existsSync('./cache/' + filename)) {
                fs.rename(outputFilePath, './cache/' + filename, function () {
                    let stats = fs.statSync('./cache/' + filename)
                    res.writeHead(200, {
                        "Content-Type": "image/jpg",
                        "Last-Modified": stats.mtime.toUTCString(),
                        "Content-Length": stats.size,
                        "Cache-Control": 'private',
                    })
                    res.write(fs.readFileSync('./cache/' + filename))
                    res.end()
                    // res.sendFile(filename, { root: './cache' });
                })
            } else {
                return res.status(422)
            }
        }
    }

})
module.exports = router
