/**
 * @Author: abbeymart | Abi Akindele | @Created: 2020-04-05 | @Updated: 2020-04-05
 * @Company: mConnect.biz | @License: MIT
 * @Description: @mconnect/auditlog, Transactions log (audit logs)
 */

// Import required module/function(s)
const {getResMessage}    = require('@mconnect/res-messages');
const {ValidateCrud}     = require('@mconnect/validate-crud');
const getParamsMessage   = require('./getParamsMessage');
const {mcMessages}       = require('./locales/getMessage');
const {validateAuditLog} = require('./validateAuditLog');

// Helper functions:
function checkDb(dbConnect) {
    if (!dbConnect || typeof dbConnect !== 'function') {
        return getResMessage('validateError', {
            message: 'valid database connection function/handler is required',
        });
    } else {
        return false;
    }
}

class AuditLog {
    constructor(auditDb, options = {}) {
        // options
        this.dbConnect     = auditDb || null;
        this.auditColl     = options && options.auditColl ? options.auditColl : 'audits';
        this.mcMessage     = options && options.messages && (typeof options.messages === 'object') ?
                             options.messages : mcMessages;
        this.maxQueryLimit = options && options.maxQueryLimit && (typeof options.maxQueryLimit === 'number') ?
                             options.maxQueryLimit : 10000;

        this.validate = ValidateCrud({
            messages     : this.mcMessage,
            maxQueryLimit: this.maxQueryLimit,
        });
    }

    async createLog(coll, collParams, userId) {
        const dbCheck = checkDb(this.dbConnect);
        if (dbCheck) {
            return dbCheck;
        }
        // Check/validate the attributes / parameters
        const paramItems = {
            coll,
            collParams,
            userId,
        };
        const errors     = this.validate.validateCreateLog(paramItems);
        if (Object.keys(errors).length > 0) {
            return getParamsMessage(errors);
        }
        const queryParams = {
            collName  : paramItems.coll,
            collValues: paramItems.collParams,
            actionType: 'create',
            actionBy  : paramItems.userId,
            actionDate: new Date(),
        };

        let db, col, result;
        try {
            // use / activate database
            db  = await this.dbConnect();
            col = db.collection(this.auditColl);

            result = await col.insertOne(queryParams);

            if (result) {
                return getResMessage('success', {
                    value: result,
                });
            } else {
                return getResMessage('insertError');
            }
        } catch (error) {
            // if( client ) client.close();
            console.log('Error saving create-audit record(s): ', error);
            return getResMessage('insertError', {
                value: error,
            });
        }
    }

    async updateLog(coll, collOldParams, collNewParams, userId) {
        checkDb(this.dbConnect);
        // Check/validate the attributes / parameters
        const paramItems = {
            coll,
            collOldParams, // object or array
            collNewParams, // object or array
            userId,
        };
        const errors     = this.validate.validateUpdateLog(paramItems);
        if (Object.keys(errors).length > 0) {
            return getParamsMessage(errors);
        }
        const queryParams = {
            collName     : coll,
            collOldValues: collOldParams,
            collNewValues: collNewParams,
            actionType   : 'update',
            actionBy     : userId,
            actionDate   : new Date(),
        };

        let db, col, result;

        try {
            // use / activate database
            db  = await this.dbConnect();
            col = db.collection(this.auditColl);

            result = await col.insertOne(queryParams);

            if (result) {
                return getResMessage('success', {
                    value: result,
                });
            } else {
                return getResMessage('insertError');
            }
        } catch (error) {
            // if( client ) client.close();
            console.log('Error saving update-audit record(s): ', error);
            return getResMessage('insertError', {
                value: error,
            });
        }
    }

    async readLog(coll, collParams, userId = '') {
        checkDb(this.dbConnect);
        // Check/validate the attributes / parameters
        const paramItems = {
            coll,
            collParams,
            userId,
        };
        const errors     = this.validate.validateReadLog(paramItems);
        if (Object.keys(errors).length > 0) {
            return getParamsMessage(errors);
        }
        const queryParams = {
            collName  : coll,
            collValues: collParams,
            actionType: 'read',
            actionBy  : userId,
            actionDate: new Date(),
        };

        let db, col, result;
        try {
            // use / activate database
            db  = await this.dbConnect();
            col = db.collection(this.auditColl);

            result = await col.insertOne(queryParams);

            if (result) {
                return getResMessage('success', {
                    value: result,
                });
            } else {
                return getResMessage('insertError');
            }
        } catch (error) {
            // if( client ) client.close();
            console.log('Error inserting read/search-audit record(s): ', error);
            return getResMessage('insertError', {
                value: error,
            });
        }
    }

    async deleteLog(coll, collParams, userId) {
        checkDb(this.dbConnect);
        // Check/validate the attributes / parameters
        const paramItems = {
            coll,
            collParams, // object or array
            userId,
        };
        const errors     = this.validate.validateDeleteLog(paramItems);
        if (Object.keys(errors).length > 0) {
            return getParamsMessage(errors);
        }
        const queryParams = {
            collName  : coll,
            collValues: collParams,
            actionType: 'remove',
            actionBy  : userId,
            actionDate: new Date(),
        };

        let db, col, result;
        try {
            // use / activate database
            db  = await this.dbConnect();
            col = db.collection(this.auditColl);

            result = await col.insertOne(queryParams);

            if (result) {
                return getResMessage('success', {
                    value: result,
                });
            } else {
                return getResMessage('insertError');
            }
        } catch (error) {
            // if( client ) client.close();
            console.log('Error saving delete-audit record(s): ', error);
            return getResMessage('insertError', {
                value: error,
            });
        }
    }

    async loginLog(loginParams, userId = '') {
        checkDb(this.dbConnect);
        // Check/validate the attributes / parameters, optional
        const paramItems = {
            loginParams,
            userId,
        };
        const errors     = this.validate.validateLoginLog(paramItems);
        if (Object.keys(errors).length > 0) {
            return getParamsMessage(errors);
        }
        const queryParams = {
            collValues: loginParams,
            actionType: 'login',
            actionBy  : userId,
            actionDate: new Date(),
        };

        let db, col, result;
        try {
            // use / activate database
            db  = await this.dbConnect();
            col = db.collection(this.auditColl);

            result = await col.insertOne(queryParams);

            if (result) {
                return getResMessage('success', {
                    value: result,
                });
            } else {
                return getResMessage('insertError');
            }
        } catch (error) {
            // if( client ) client.close();
            console.log('Error inserting login-audit record(s): ', error);
            return getResMessage('insertError', {
                value: error,
            });
        }
    }

    async logoutLog(logoutParams, userId = '') {
        checkDb(this.dbConnect);
        // Check/validate the attributes / parameters
        const paramItems = {
            logoutParams,
            userId,
        };
        const errors     = this.validate.validateLogoutLog(paramItems);
        if (Object.keys(errors).length > 0) {
            return getParamsMessage(errors);
        }
        const queryParams = {
            collValues: logoutParams,
            actionType: 'logout',
            actionBy  : userId,
            actionDate: new Date(),
        };

        let db, col, result;
        try {
            // use / activate database
            db  = await this.dbConnect();
            col = db.collection(this.auditColl);

            result = await col.insertOne(queryParams);

            if (result) {
                return getResMessage('success', {
                    value: result,
                });
            } else {
                return getResMessage('insertError');
            }
        } catch (error) {
            // if( client ) client.close();
            console.log('Error inserting logout-audit record(s): ', error);
            return getResMessage('insertError', {
                value: error,
            });
        }
    }

    async auditLog(logType, userId = '', options = {}) {
        checkDb(this.dbConnect);
        // Check/validate the attributes / parameters
        let paramItems  = {},
            errors      = {},
            queryParams = {};

        logType = logType.toLowerCase();

        switch (logType) {
            case 'create':
                paramItems = {
                    coll      : options && options.coll ? options.coll : '',
                    collParams: options && options.collParams ? options.collParams : null,
                    userId,
                };
                errors     = this.validate.validateCreateLog(paramItems);
                if (Object.keys(errors).length > 0) {
                    return getParamsMessage(errors);
                }
                queryParams = {
                    collName  : paramItems.coll,
                    collValues: paramItems.collParams,
                    actionType: logType,
                    actionBy  : paramItems.userId,
                    actionDate: new Date(),
                };
                break;
            case 'update':
                paramItems = {
                    coll         : options && options.coll ? options.coll : '',
                    collOldParams: options && options.collOldParams ? options.collOldParams : null,
                    collNewParams: options && options.collNewParams ? options.collNewParams : null, // object or array
                    userId,
                };
                errors     = this.validate.validateUpdateLog(paramItems);
                if (Object.keys(errors).length > 0) {
                    return getParamsMessage(errors);
                }
                queryParams = {
                    collName     : paramItems.coll,
                    collOldValues: paramItems.collOldParams,
                    collNewValues: paramItems.collNewParams,
                    actionType   : logType,
                    actionBy     : paramItems.userId,
                    actionDate   : new Date(),
                };
                break;
            case 'remove':
                paramItems = {
                    coll      : options && options.coll ? options.coll : '',
                    collParams: options && options.collParams ? options.collParams : null,
                    userId
                };
                errors     = this.validate.validateDeleteLog(paramItems);
                if (Object.keys(errors).length > 0) {
                    return getParamsMessage(errors);
                }
                queryParams = {
                    collName  : paramItems.coll,
                    collValues: paramItems.collParams,
                    actionType: logType,
                    actionBy  : paramItems.userId,
                    actionDate: new Date(),
                };
                break;
            case 'read':
                paramItems = {
                    coll      : options && options.coll ? options.coll : '',
                    collParams: options && options.collParams ? options.collParams : null,
                    userId,
                };
                errors     = this.validate.validateReadLog(paramItems);
                if (Object.keys(errors).length > 0) {
                    return getParamsMessage(errors);
                }
                queryParams = {
                    collName  : paramItems.coll,
                    collValues: paramItems.collParams,
                    actionType: logType,
                    actionBy  : paramItems.userId,
                    actionDate: new Date(),
                };
                break;
            case 'login':
                paramItems = {
                    loginParams: options && options.loginParams ? options.loginParams : null,
                    userId,
                };
                errors     = this.validate.validateLoginLog(paramItems);
                if (Object.keys(errors).length > 0) {
                    return getParamsMessage(errors);
                }
                queryParams = {
                    collValues: paramItems.loginParams,
                    actionType: logType,
                    actionBy  : paramItems.userId,
                    actionDate: new Date(),
                };
                break;
            case 'logout':
                paramItems = {
                    logoutParams: options && options.logoutParams ? options.logoutParams : null,
                    userId,
                };
                errors     = this.validate.validateLoginLog(paramItems);
                if (Object.keys(errors).length > 0) {
                    return getParamsMessage(errors);
                }
                queryParams = {
                    collValues: paramItems.logoutParams,
                    actionType: logType,
                    actionBy  : paramItems.userId,
                    actionDate: new Date(),
                };
                break;
            default:
                paramItems = {
                    userId,
                    coll         : options && options.coll ? options.coll : '',
                    collOldParams: options && options.collOldParams ? options.collOldParams : null,
                    collNewParams: options && options.collNewParams ? options.collNewParams : null, // object or array

                };
                errors     = validateAuditLog(paramItems);
                if (Object.keys(errors).length > 0) {
                    return getParamsMessage(errors);
                }
                queryParams = {
                    collName     : paramItems.coll,
                    collOldValues: paramItems.collOldParams,
                    collNewValues: paramItems.collNewParams,
                    actionType   : logType || 'Generic',
                    actionBy     : paramItems.userId,
                    actionDate   : new Date(),
                };
                break;
        }

        let db, col, result;

        try {
            // use / activate database
            db  = await this.dbConnect();
            col = db.collection(this.auditColl);

            result = await col.insertOne(queryParams);

            if (result) {
                return getResMessage('success', {
                    value: result,
                });
            } else {
                return getResMessage('insertError');
            }
        } catch (error) {
            // if( client ) client.close();
            console.log('Error saving audit-log record(s): ', error);
            return getResMessage('insertError', {
                value: error,
            });
        }
    }
}

function newAuditLog(options = {}) {
    return new AuditLog(options);
}

module.exports = {AuditLog, newAuditLog};
