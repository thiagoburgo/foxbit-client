// tslint:disable:no-unused-expression
import 'mocha';

import { expect } from 'chai';
import { mergeMap } from 'rxjs/operators';

import { FoxBitClient } from '../src/foxbit-client';
import { AuthenticateResponse } from '../src/message-result';

describe('# Client FoxBit - Private Api', function () {
  this.timeout('30s');
  const client = new FoxBitClient();
  let authSession: AuthenticateResponse | null = null;

  const login = process.env.FOXBIT_LOGIN;
  const password = process.env.FOXBIT_PASSWORD;

  let accountId: number;
  let omsId: number;

  expect(login, '\"Login\" cannot be empty. Configure FOXBIT_LOGIN env variable')
    .to.not.be.undefined;
  expect(password, '\"Password\" cannot be empty. Configure FOXBIT_PASSWORD env variable')
    .to.not.be.undefined;

  before((done) => {
    client.connect()
      .pipe(
        mergeMap((connected) => {
          expect(connected, 'Client must be connected').to.be.true;
          return client.webAuthenticateUser(login, password);
        })
      ).subscribe((auth) => {
        authSession = auth;
        done();
      }, (err) => {
        done(err);
      });
  });

  it('after authenticate must have session data', () => {
    expect(authSession, 'authResponse must be not null').to.not.be.null;
    expect(authSession.Authenticated, 'Authenticated must be true').to.be.true;
    expect(authSession.SessionToken, 'SessionToken must be filled').to.not.be.null;

    expect(authSession.UserId, 'UserId must be filled').to.not.be.null;
    expect(authSession.UserId).above(0, 'Id cannot be ZERO.');
  });

  it('GetUserinfo must return data', (done) => {
    client.getUserInfo().subscribe((userInfoResponse) => {
      expect(userInfoResponse.AccountId, 'AccountId must be filled').above(0);
      expect(userInfoResponse.OMSId, 'OMSId must be filled').above(0);
      accountId = userInfoResponse.AccountId;
      omsId = userInfoResponse.OMSId;
      done();
    }, (err) => done(err));
  });

  it('GetAccountFees must return data', (done) => {
    client.getAccountFees(accountId, omsId).subscribe((accountFees) => {
      expect(accountFees, 'Account fees cannot be empty').to.not.be.empty;
      done();
    }, (err) => done(err));
  });

  it('GetUserConfig must return data', (done) => {
    client.getUserConfig().subscribe((userConfig) => {

      expect(userConfig, 'UserConfig cannot be empty').to.not.be.empty;
      for (const config of userConfig) {
        expect(config.Value, `${config.Key} cannot be empty`).to.not.be.null;
      }
      expect(userConfig, 'UserConfig cannot be empty').to.not.be.empty;

      done();
    }, (err) => done(err));
  });

  // API returns 'Endpoint not found'
  // it('GetAvailablePermissionList must return data', (done) => {
  //   client.getAvailablePermissionList().subscribe((permissions) => {
  //     expect(permissions, 'Permissions cannot be empty').to.not.be.empty;
  //     done();
  //   }, (err) => done(err));
  // });

  it('GetUserPermissions must return data', (done) => {
    client.getUserPermissions(authSession.UserId).subscribe((permissions) => {
      expect(permissions, 'User permissions cannot be empty').to.not.be.empty;
      done();
    }, (err) => done(err));
  });

  // it('SetUserConfig must be confirmed by server', (done) => {
  //   client.setUserConfig(authSession.UserId, login, [{
  //     Key: 'NewConfig',
  //     Value: 'Blah'
  //   }]).subscribe((resp) => {
  //     expect(resp.result, 'When SetUserConfig, serve must respond "result=true"').to.be.true;
  //     done();
  //   }, (err) => done(err));
  // });

  // it('RemoveUserConfig must be confirmed by server', (done) => {
  //   client.removeUserConfig(authSession.UserId, login, 'NewConfig').subscribe((resp) => {
  //     expect(resp.result, 'When RemoveUserConfig, serve must respond "result=true"').to.be.true;
  //     done();
  //   }, (err) => done(err));
  // });

  after(() => {
    client.logOut().subscribe(() => {
      client.disconnect();
      expect(client.isConnected, 'isConnected must be false, after disconnect').to.be.false;
    });
  });

  //   // Privado
  // [API PROBLEM] GetAvailablePermissionList,
  // [OK] GetUserConfig,
  // [OK] GetUserInfo,
  // [OK] GetUserPermissions,
  // [API PROBLEM] RemoveUserConfig,
  // [API PROBLEM????] SetUserConfig,
  // SetUserInfo,
  // CancelAllOrders,
  // CancelOrder,
  // CancelQuote,
  // CancelReplaceOrder,
  // GetAccountInfo,
  // GetAccountPositions,
  // GetAccountTrades,
  // GetAccountTransactions,
  // GetOpenOrders,
  // SendOrder,
  // GetOrderFee,
  // GetOrderHistory,
  // GetAllDepositTickets,
  // GetAllWithdrawTickets,
  // GetDepositTicket,
  // GetWithdrawTicket,


});
