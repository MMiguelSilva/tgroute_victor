const crypto  = require('crypto')

function encrypt(text){
  var cipher = crypto.createCipheriv('aes-256-cbc',
    new Buffer('tg@120573***********************'), new Buffer('vectorvector1234'))
  var crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

function decrypt(text){
  var decipher = crypto.createDecipheriv('aes-256-cbc',
    new Buffer('tg@120573***********************'), new Buffer('vectorvector1234'))
  var dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}

module.exports = {
  encrypt, decrypt
}

