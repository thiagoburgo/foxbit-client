// tslint:disable:no-unused-expression
import 'mocha';

import { expect } from 'chai';
import { concatMap, finalize } from 'rxjs/operators';

import { FoxBitClient } from '../src/foxbit-client';

describe('#Client FoxBit', () => {
  const client = new FoxBitClient();
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
      .pipe(finalize(() => {
        done();
      }))
      .subscribe((connected) => {
        expect(connected, 'Client must be connected').to.be.true;
      }, (err) => {
        done(err);
      });
  });

  after(() => {
    client.logOut().subscribe(() => {
      console.log('Logout complete!');
    });
    client.disconnect();
  });

  it('authenticate must return session data', (done) => {
    client.logIn(login, password).pipe(
      finalize(() => {
        done();
      })).subscribe((authResponse) => {
        console.log('AuthResponse: ', authResponse);
        expect(authResponse.Authenticated, 'Authenticated must be true').to.be.true;
        expect(authResponse.SessionToken, 'SessionToken must be filled').to.not.be.null;

        expect(authResponse.UserId, 'UserId must be filled').to.not.be.null;
        expect(authResponse.UserId).above(0, 'Id cannot be ZERO.');

      }, (err) => done(err));
  });

  it('get userinfo must return data', (done) => {
    client.getUserInfo().pipe(
      finalize(() => {
        done();
      })).subscribe((userInfoResponse) => {
        console.log('User Info: ', userInfoResponse);
        expect(userInfoResponse.AccountId, 'AccountId must be filled').above(0);
        expect(userInfoResponse.OMSId, 'OMSId must be filled').above(0);
        accountId = userInfoResponse.AccountId;
        omsId = userInfoResponse.OMSId;
      }, (err) => done(err));
  });

  it('account fees must return data', (done) => {
    client.getAccountFees(accountId, omsId).pipe(
      finalize(() => {
        done();
      })).subscribe((accountFees) => {
        console.log('Account Fees: ', accountFees);
        expect(accountFees, 'Account fees cannot be empty').to.not.be.empty;
      }, (err) => done(err));
  });

});
