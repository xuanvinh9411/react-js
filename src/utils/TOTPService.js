/**
 * Created by mac on 11/2/15.
 */

let jsSHA = require("jssha");
let TOTPService = {
   dec2hex : function(s) {
    return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
  },

 hex2dec : function(s) {
  return parseInt(s, 16);
},

 leftpad : function(s, l, p) {
  if(l + 1 >= s.length) {
    s = Array(l + 1 - s.length).join(p) + s;
  }
  return s;
},

 base32tohex : function(base32) {
  let base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  let hex = "";
  for(let i = 0; i < base32.length; i++) {
    let val = base32chars.indexOf(base32.charAt(i).toUpperCase());
    bits += this.leftpad(val.toString(2), 5, '0');
  }
  for(let j = 0; j + 4 <= bits.length; j+=4) {
    let chunk = bits.substr(j, 4);
    hex = hex + parseInt(chunk, 2).toString(16) ;
  }
  return hex;
},
getOTP : function(secret,delTime) {
    try {
      let epoch = Math.round(new Date().getTime() / 1000.0);
      //console.log('time get otp=='+epoch);
      epoch -= delTime;
      let time = this.leftpad(this.dec2hex(Math.floor(epoch / 30)), 16, "0");
      let shaObj = new jsSHA("SHA-1", "HEX");
      shaObj.setHMACKey(this.base32tohex(secret), "HEX");
      shaObj.update(time);
      let hmac = shaObj.getHMAC("HEX");

      let offset = this.hex2dec(hmac.substring(hmac.length - 1));
      let otp = ((this.hex2dec(hmac.substr(offset * 2, 8)) & this.hex2dec("7fffffff")) + "");
      otp = (otp).substr(otp.length - 6, 6);
      var d = new Date();
      //console.log('epoch: ' + epoch+", otp: "+otp+", time: "+d.getDate()+"/"+d.getMonth()+"/"+d.getYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getMilliseconds());
      return otp;
    } catch (error) {
      console.log(error);
    }

  }

};


module.exports = TOTPService;
