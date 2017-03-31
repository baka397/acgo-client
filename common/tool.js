/**
 * 获取标准浮点数
 * @param  {Number} number   原数字
 * @param  {Number} plusNum  倍数
 * @param  {Number} digit    浮点位数
 * @return {Number}          标准浮点数
 */
exports.getFloatNum=function(number,plusNum,digit){
    if(isNaN(number)) return 0;
    let fixedNum = (Math.round(parseFloat(number)*Math.pow(10,plusNum))/Math.pow(10,(plusNum-digit)));
    let fixedPow = Math.pow(10,digit);
    fixedNum = Math.round(fixedNum*fixedPow)/fixedPow;
    return fixedNum;
};