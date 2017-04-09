function isRealString(str) {
  return str!=null && str!=undefined && typeof str==='string' && str.trim().length>0;
}

module.exports = {
  isRealString
};