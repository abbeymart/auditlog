/**
 * @Author: abbeymart | Abi Akindele | @Created: 2019-01-13 | @Updated: 2019-01-13
 * @Company: mConnect.biz | @License: MIT
 * @Description: @mconnect/mongo-crud, paramsMessage shared function
 */

const { getResMessage } = require('@mconnect/res-messages');

function getParamsMessage( msgObject ) {
    let messages = '';
    Object.entries(msgObject).forEach(( [ key, msg ] ) => {
        messages = messages ? `${messages} | ${key} : ${msg}` : `${key} : ${msg}`;
    });
    return getResMessage('validateError', {
        message: messages,
    });
}

module.exports = getParamsMessage;
