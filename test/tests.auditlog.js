/**
 * @Author: abbeymart | Abi Akindele | @Created: 2019-01-17 | @Updated: 2020-04-08
 * @Company: mConnect.biz | @License: MIT
 * @Description: @mconnect/auditlog testing
 */

const {suite, test, before} = require('mocha');

const {dbConnect}   = require('./mgConnect');
const {mcMessages}  = require('../src/locales/getMessage');
const {newAuditLog} = require('../index');
const ok            = require('./assert');

let mcTranslog,
    auditColl = 'audits',
    options   = {
        auditColl,
        messages     : mcMessages,
        maxQueryLimit: 12000,
    };
before(() => {
    // instantiate the transLog package
    // mcTranslog = new AuditLog(dbConnect, options);
    mcTranslog = newAuditLog(dbConnect, options);
});

// after(() => {
//    process.exit(0);
// });

suite('@mconnect/translog package Testing, TransLog:', () => {
    suite('Positive testing:', () => {
        test('should connect and return an instance object', () => {
            // console.log('transLog: ', mcTranslog);
            ok(Object.keys(mcTranslog).length > 0, `response object should not be empty`);
        });
        test('should return an instance object, dbConnect as function', () => {
            // console.log('typeof: ', typeof Object.keys(mcTranslog['createLog']));
            ok(typeof mcTranslog['dbConnect'] === 'function', `response object should be a function`);
        });
        test('should store create-transaction log and return success', async () => {
            const coll       = 'tests';
            const collParams = {
                name: 'Test1',
                age : 20,
                city: 'Toronto'
            };
            const userId     = 'AAAAAAAAAAAAAAAAAAA999';
            const req        = await mcTranslog.createLog(coll, collParams, userId);
            // console.log('response: ', +req['code']);
            ok(req['code'] === 'success', `response-code should be: 'success'`);
        });
        test('generic-audit-log/create: should store transaction log and return success', async () => {
            const coll       = 'tests';
            const collParams = {
                name: 'Test2',
                age : 200,
                city: 'Toronto'
            };
            const userId     = 'AAAAAAAAAAAAAAAAAAA999';
            const req        = await mcTranslog.auditLog('Create', userId, {coll, collParams}) || {};
            // console.log('response: ', req['code']);
            ok(req['code'] === 'success', `response-code should be: 'success'`);
        });
        test('generic-audit-log/update: should store transaction log and return success', async () => {
            const coll          = 'tests';
            const collOldParams = {
                name: 'Test2',
                age : 200,
                city: 'Toronto'
            };
            const collNewParams = {
                name: 'Test2',
                age : 200,
                city: 'Toronto'
            };
            const userId        = 'AAAAAAAAAAAAAAAAAAA999';
            const req           = await mcTranslog.auditLog('Update', userId, {coll, collOldParams, collNewParams}) || {};
            // console.log('response: ', req);
            ok(req['code'] === 'success', `response-code should be: 'success'`);
        });
    });

    suite('Negative testing:', () => {
        test('should return paramsError for incomplete/undefined inputs', async () => {
            let coll         = '';
            const collParams = '';
            const userId     = 'test-user';
            const req        = await mcTranslog.createLog('Create', userId, {coll, collParams});
            // console.log('response: ', req);
            ok(req['code'] === 'paramsError', `response-code should be: 'paramErrors'`);
        });
    });
});
