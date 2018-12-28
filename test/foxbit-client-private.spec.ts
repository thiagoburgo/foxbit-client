// tslint:disable:no-unused-expression
import { expect } from 'chai';
import 'mocha';
import { mergeMap, concatMap } from 'rxjs/operators';
import { FoxBitClient } from '../src/foxbit-client';
import { OrderType, PegPriceType, Side, TimeInForce, MakerTaker, OrderTypeResponse } from '../src/message-enums';
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

  it('GetOrderFee must return data', (done) => {
    client.getOrderFee({
      AccountId: accountId, 
      OMSId: omsId,
      InstrumentId: 1, //BTCBRL
      MakerTaker: MakerTaker.Maker,
      Amount: 1,
      OrderType: OrderType.Limit,
      Price: 10000,
      ProductId: 1
    }).subscribe((orderFee) => {
      orderFee.OrderFee
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

  // it('GetAccountInfo must return data', (done) => {
  //   client.getAccountInfo(omsId, authSession.UserId, '1').subscribe((accountInfo) => {
  //     expect(accountInfo.AccountHandle === '1', 'AccountHandle must be equals to sent').to.not.be.empty;
  //     expect(accountInfo, 'GetAccountInfo cannot be null').to.not.be.null;
  //     done();
  //   }, (err) => done(err));
  // });

  it('GetAccountPositions must return data', (done) => {
    client.getAccountPositions(accountId, omsId).subscribe((positions) => {
      expect(positions, 'Positions cannot be empty').to.not.be.empty;
      done();
    }, (err) => done(err));
  });

  it('GetAccountTrades must return data', (done) => {
    client.getAccountTrades(accountId, omsId, 0, 10).subscribe((trades) => {
      expect(trades, 'Trades cannot be empty').to.not.be.empty;
      done();
    }, (err) => done(err));
  });

  it('GetAccountTransactions must return data', (done) => {
    client.getAccountTransactions(accountId, omsId, 100).subscribe((accTransactions) => {
      expect(accTransactions, 'Account transactions cannot be empty').to.not.be.empty;
      done();
    }, (err) => done(err));
  });

  let lastOrderId = 0;

  it('SendOrder must be confirmed by server', (done) => {
    client.sendOrder({
      AccountId: accountId,
      Side: Side.Sell,
      ClientOrderId: Date.now(),
      DisplayQuantity: 0,
      UseDisplayQuantity: false,
      InstrumentId: 1, // BTCBRL
      OMSId: omsId,
      Quantity: 0.0001,
      OrderType: OrderType.Limit,
      TimeInForce: TimeInForce.GTC,
      PegPriceType: PegPriceType.Last,
      TrailingAmount: 1.0,
      LimitOffset: 2.0,
      OrderIdOCO: 0,
      LimitPrice: 50000,
      StopPrice: 0
    }).subscribe((orderResult) => {
      lastOrderId = orderResult.OrderId;
      expect(lastOrderId, 'OrderId cannot be null').not.to.be.null;
      expect(lastOrderId, 'OrderId cannot be "0" (ZERO)').not.to.be.eq(0);
      expect(orderResult.errormsg, 'ErrorMsg must be empty').to.be.empty;

      done();
    }, (err) => done(err));
  });

  it('GetOpenOrders must return data and contains latest sent order', function run(done) {
    if (!lastOrderId) {
      this.skip();
    }

    client.getOpenOrders(accountId, omsId).subscribe((orders) => {
      expect(orders, 'OpenOrders cannot be empty').to.not.be.empty;
      expect(orders.some((o) => o.OrderId === lastOrderId), 'One of open order must be sent order').to.be.true;
      done();
    }, (err) => done(err));
  });

  it('CancelOrder must be confirmed by server', (done) => {
    client.sendOrder({
      AccountId: accountId,
      Side: Side.Buy,
      ClientOrderId: Date.now(),
      DisplayQuantity: 0,
      UseDisplayQuantity: false,
      InstrumentId: 1, // BTCBRL
      OMSId: omsId,
      Quantity: 1,
      OrderType: OrderType.Limit,
      TimeInForce: TimeInForce.GTC,
      PegPriceType: PegPriceType.Last,
      TrailingAmount: 1.0,
      LimitOffset: 2.0,
      OrderIdOCO: 0,
      LimitPrice: 1,
      StopPrice: 0
    }).pipe(
      concatMap((orderResult) => {
        expect(orderResult.OrderId, '[CancelOrder/SendOrder] OrderId cannot be null').not.to.be.null;
        expect(orderResult.OrderId, '[CancelOrder/SendOrder] OrderId cannot be "0" (ZERO)').not.to.be.eq(0);
        expect(orderResult.errormsg, '[CancelOrder/SendOrder] ErrorMsg must be empty').to.be.empty;
        return client.cancelOrder(omsId, accountId, orderResult.OrderId, null);
      })
    ).subscribe((resp) => {
      expect(resp.result, 'CancelOrder, serve must respond "result=true"').to.be.true;
      done();
    }, (err) => done(err));
  });

  it('CancelAllOrders must be confirmed by server', (done) => {
    client.cancelAllOrders(omsId, accountId, authSession.UserId, 1)
      .pipe(
        concatMap((resp) => {
          expect(resp.result, 'CancelAllOrders, serve must respond "result=true"').to.be.true;
          return client.getOpenOrders(accountId, omsId);
        })
      ).subscribe((orders) => {
        expect(orders, 'After CancellAllOrders, OpenOrders must be empty').to.be.empty;
        done();
      }, (err) => done(err));
  });

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
  // [OK] CancelAllOrders,
  // [OK] CancelOrder,
  // CancelQuote,
  // CancelReplaceOrder,
  // GetAccountInfo,
  // [OK] GetAccountPositions,
  // [OK] GetAccountTrades,
  // [OK] GetAccountTransactions,
  // [OK] GetOpenOrders,
  // [OK] SendOrder,
  // GetOrderFee,
  // GetOrderHistory,
  // GetAllDepositTickets,
  // GetAllWithdrawTickets,
  // GetDepositTicket,
  // GetWithdrawTicket,


});
