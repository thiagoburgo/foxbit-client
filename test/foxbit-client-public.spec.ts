// tslint:disable:no-unused-expression
import 'mocha';

import { expect } from 'chai';
import { subDays } from 'date-fns';
import { take } from 'rxjs/operators';

import { FoxBitClient } from '../src/foxbit-client';

describe('# Client FoxBit - Public Api', function suite() {
  this.timeout('30s');
  const client = new FoxBitClient();
  const omsId = 1;

  before((done) => {
    client.connect()
      .subscribe((connected) => {
        expect(connected, 'Client must be connected').to.be.true;
        done();
      }, (err) => {
        done(err);
      });
  });

  after(() => {
    client.logOut().subscribe(() => {
      client.disconnect();
      expect(client.isConnected, 'isConnected must be false, after disconnect').to.be.false;
    });
  });

  it('after connect, client.isConnected() must be true', () => {
    expect(client.isConnected, 'isConnected must be true').to.be.true;
  });

  it('instruments must return data', (done) => {
    client.getInstruments(omsId).subscribe((instruments) => {
      expect(instruments, 'Instruments cannot be empty').to.not.be.empty;
      done();
    }, (err) => done(err));
  });

  it('instrument by id=1 must return data', (done) => {
    client.getInstrument(omsId, 1).subscribe((instrument) => {
      expect(instrument, 'Instrument cannot be null').to.not.be.null;
      expect(instrument.InstrumentId, 'InstrumentId must be 1').to.be.eq(1);
      done();
    }, (err) => done(err));
  });

  it('GetProducts must return data', (done) => {
    client.getProducts(omsId).subscribe((products) => {
      expect(products, 'Products cannot be empty').to.not.be.empty;
      done();
    }, (err) => done(err));
  });

  it('GetProduct by id=1 must return data', (done) => {
    client.getProduct(omsId, 1).subscribe((product) => {
      expect(product, 'Product cannot be null').to.not.be.null;
      expect(product.ProductId, 'Product must be 1').to.be.eq(1);
      done();
    }, (err) => done(err));
  });

  it('GetL2Snapshot must return data', (done) => {
    client.getL2Snapshot(omsId, 1).subscribe((snapshots) => {
      expect(snapshots, 'Instruments cannot be empty').to.not.be.empty;
      done();
    }, (err) => done(err));
  });

  it('GetTickerHistory must return data', (done) => {
    const fromDate = subDays(new Date(), 1);
    client.getTickerHistory(omsId, 1, fromDate).subscribe((ticks) => {
      expect(ticks, 'Ticks history cannot be empty').to.not.be.empty;
      done();
    }, (err) => done(err));
  });

  describe('# Events Test', function suiteEvents() {

    this.timeout('200s');

    it('SubscribeLevel1 must return data and fire Level1UpdateEvent', function thunk(done) {
      let eventCount = 0;
      client.subscribeLevel1(omsId, 'BTC/BRL')
        .pipe(take(2))
        .subscribe((level1Data) => {
          expect(level1Data, 'Level1Data cannot be empty').to.not.be.empty;
          if (++eventCount === 2) {
            done();
          }
        }, (err) => done(err));
      after(() => {
        expect(eventCount, 'Level1UpdateEvent events must be equal "2"').to.be.eq(2);
      });
    });

    it('UnsubscribeLevel1 must be cofirmed by server', () => {
      const unsubsPromise = client.unsubscribeLevel1(omsId, 1).toPromise();
      unsubsPromise.then((resp) => {
        expect(resp.result, 'When unsubscribeLevel1, serve must respond "result=true"').to.be.true;
      });
      return unsubsPromise;
    });

    it('SubscribeLevel2 must return data and fire Level2UpdateEvent', function thunk(done) {
      let eventCount = 0;
      client.subscribeLevel2(omsId, 'BTC/BRL')
        .pipe(take(2))
        .subscribe((level2Data) => {

          expect(level2Data, 'Level2Data cannot be empty').to.not.be.empty;
          if (++eventCount === 2) {
            done();
          }
        }, (err) => done(err));
      after(() => {
        expect(eventCount, 'Level2UpdateEvent events must be equal "2"').to.be.eq(2);
      });
    });

    it('UnsubscribeLevel2 must be cofirmed by server', () => {
      const unsubsPromise = client.unsubscribeLevel2(omsId, 1).toPromise();
      unsubsPromise.then((resp) => {
        expect(resp.result, 'When unsubscribeLevel2, serve must respond "result=true"').to.be.true;
      });
      return unsubsPromise;
    });

    it('SubscribeTicker must return data and fire TickerDataUpdateEvent', function thunk(done) {
      let eventCount = 0;
      client.subscribeTicker(omsId, /*intrumentId*/ 1, /*intervalInSecondd*/ 60, /*includeLastCount*/ 1)
        .pipe(take(2))
        .subscribe((ticks) => {

          expect(ticks, 'SubscribeTicker cannot be empty').to.not.be.empty;
          if (++eventCount === 2) {
            done();
          }
        }, (err) => done(err));
      after(() => {
        expect(eventCount, 'TickerDataUpdateEvent events must be equal "2"').to.be.eq(2);
      });
    });

    it('UnsubscribeTicker must be cofirmed by server', () => {
      const unsubsPromise = client.unsubscribeTicker(omsId, 1).toPromise();
      unsubsPromise.then((resp) => {
        expect(resp.result, 'When UnsubscribeTicker, serve must respond "result=true"').to.be.true;
      });
      return unsubsPromise;
    });

    it('SubscribeTrades must return data and fire TradeDataUpdateEvent', function thunk(done) {
      let eventCount = 0;
      client.subscribeTrades(omsId, /*intrumentId*/ 1, /*includeLastCount*/ 15000)
        .pipe(take(2))
        .subscribe((trades) => {

          expect(trades, 'SubscribeTrades cannot be empty').to.not.be.empty;

          if (++eventCount === 1) {
            expect(trades.length, 'First subscription must return last 10000 trades').to.be.eq(10000);
          }

          if (eventCount === 2) {
            done();
          }
        }, (err) => done(err));
      after(() => {
        expect(eventCount, 'TradeDataUpdateEvent events must be equal "2"').to.be.eq(2);
      });
    });

    it('UnsubscribeTrades must be cofirmed by server', () => {
      const unsubsPromise = client.unsubscribeTrades(omsId, 1).toPromise();
      unsubsPromise.then((resp) => {
        expect(resp.result, 'When UnsubscribeTrades, serve must respond "result=true"').to.be.true;
      });
      return unsubsPromise;
    });

  });

  // // publico
  // Authenticate2FA,
  // [OK] WebAuthenticateUser,
  // [OK] LogOut,
  // ResetPassword,
  // [OK] GetAccountFees,
  // [OK] GetInstrument,
  // [OK] GetInstruments,
  // [OK] GetProduct,
  // [OK] GetProducts,
  // [OK] GetL2Snapshot,
  // [OK] GetTickerHistory,
  // [OK] SubscribeLevel1,
  // [OK] SubscribeLevel2,
  // [OK] SubscribeTicker,
  // [OK] UnsubscribeLevel1,
  // [OK] UnsubscribeLevel2,
  // [OK] UnsubscribeTicker,
  // [OK] SubscribeTrades
  // [OK] UnsubscribeTrades
  //   // Privado
  // GetAvailablePermissionList,
  // GetUserConfig,
  // GetUserInfo,
  // GetUserPermissions,
  // RemoveUserConfig,
  // SetUserConfig,
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
