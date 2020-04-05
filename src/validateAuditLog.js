/**
 * @Author: abbeymart | Abi Akindele | @Created: 2019-06-03 | @Updated: 2019-06-03
 * @Company: mConnect.biz | @License: MIT
 * @Description: validate-audit-log params
 */

function validateAuditLog(paramItems) {
    // Initialise error object and patterns matching:
    let errors = {};

    try {
        if (paramItems.coll) {
            // Check input formats/patterns
            const testItem = utils.isStringAlpha(paramItems.coll);
            if (!testItem) {
                errors.coll = mcMessage.isStringAlpha || 'format-error, should be string/alphanumeric';
            }
        } else {
            errors.coll = mcMessage.infoRequired || 'required-error, info is required';
        }
        if (paramItems.collOldParams) {
            // Check input formats/patterns
            const testItem = utils.isObjectType(paramItems.collOldParams) || utils.isArrayType(paramItems.collOldParams);
            if (!testItem) {
                errors.collOldParams = (mcMessage.isObject + ' OR ' + mcMessage.isArray) || 'format-error, should be an object{} or array[]';
            }
        }
        if (paramItems.collNewParams) {
            // Check input formats/patterns
            const testItem = utils.isObjectType(paramItems.collNewParams) || utils.isArrayType(paramItems.collNewParams);
            if (!testItem) {
                errors.collNewParams = mcMessage.isObject + ' OR ' + mcMessage.isArray || 'format-error, should be an array[]';
            }
        }
        if (paramItems.userId) {
            // Check input formats/patterns
            const testItem = utils.isStringAlpha(paramItems.userInfo);
            if (!testItem) {
                errors.userId = mcMessage.isStringAlpha || 'format-error, should be a string/alphanumeric';
            }
        }
    } catch (e) {
        console.error('Error validating audit-log inputs');
        errors.validationError = 'Error validating audit-log inputs';
    }


    return errors;
}

module.exports = {validateAuditLog};
