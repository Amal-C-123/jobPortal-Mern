module.exports.errbody =  (res,err) => {
     res.status(500).json({
        success: false,
        err
    })
}

module.exports.respbody = (res,returnedValue) => {
     res.status(200).json({
        success: true,
        returnedValue
    })
}