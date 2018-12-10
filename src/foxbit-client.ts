import { Observable, Subject } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import WebSocket from 'ws';

import { EndpointMethodDescriptor, EndpointMethodReplyType, EndpointMethodType } from './api-descriptors';
import { MessageFrame } from './message-frame';
import {
  AccountFeesResponse,
  AuthenticateResponse,
  GenericResponse,
  InstrumentResponse,
  L2SnapshotResponse,
  ProductResponse,
  SubscriptionL2Response,
  SubscriptionLevel1Response,
  SubscriptionTickerResponse,
  UserInfoResponse,
} from './message-result';
import { MessageType } from './message-type';

export class FoxBitClient {

  private sequenceByMessageType: { [messageType: number]: number } = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  private endpointDescriptorByMethod: { [methodName: string]: EndpointMethodDescriptor } = {
    // Privado
    GetAvailablePermissionList: new EndpointMethodDescriptor(),
    GetUserConfig: new EndpointMethodDescriptor(),
    GetUserInfo: new EndpointMethodDescriptor(),
    GetUserPermissions: new EndpointMethodDescriptor(),
    RemoveUserConfig: new EndpointMethodDescriptor(),
    SetUserConfig: new EndpointMethodDescriptor(),
    SetUserInfo: new EndpointMethodDescriptor(),
    CancelAllOrders: new EndpointMethodDescriptor(),
    CancelOrder: new EndpointMethodDescriptor(),
    CancelQuote: new EndpointMethodDescriptor(),
    CancelReplaceOrder: new EndpointMethodDescriptor(),
    GetAccountInfo: new EndpointMethodDescriptor(),
    GetAccountPositions: new EndpointMethodDescriptor(),
    GetAccountTrades: new EndpointMethodDescriptor(),
    GetAccountTransactions: new EndpointMethodDescriptor(),
    GetOpenOrders: new EndpointMethodDescriptor(),
    SendOrder: new EndpointMethodDescriptor(),
    GetOrderFee: new EndpointMethodDescriptor(),
    GetOrderHistory: new EndpointMethodDescriptor(),
    GetAllDepositTickets: new EndpointMethodDescriptor(),
    GetAllWithdrawTickets: new EndpointMethodDescriptor(),
    GetDepositTicket: new EndpointMethodDescriptor(),
    GetWithdrawTicket: new EndpointMethodDescriptor(),
    // publico
    LogOut: {
      methodReplyType: EndpointMethodReplyType.Response,
      methodSubject: new Subject<any>(),
      methodType: EndpointMethodType.Public,
    },
    ResetPassword: {
      methodReplyType: EndpointMethodReplyType.Response,
      methodSubject: new Subject<any>(),
      methodType: EndpointMethodType.Public,
    },
    GetAccountFees: {
      methodReplyType: EndpointMethodReplyType.Response,
      methodSubject: new Subject<any>(),
      methodType: EndpointMethodType.Public,
    },
    GetInstrument: {
      methodReplyType: EndpointMethodReplyType.Response,
      methodSubject: new Subject<any>(),
      methodType: EndpointMethodType.Public,
    },
    GetInstruments: {
      methodReplyType: EndpointMethodReplyType.Response,
      methodSubject: new Subject<any>(),
      methodType: EndpointMethodType.Public,
    },
    GetProduct: {
      methodReplyType: EndpointMethodReplyType.Response,
      methodSubject: new Subject<any>(),
      methodType: EndpointMethodType.Public,
    },
    GetProducts: {
      methodReplyType: EndpointMethodReplyType.Response,
      methodSubject: new Subject<any>(),
      methodType: EndpointMethodType.Public,
    },
    GetL2Snapshot: {
      methodReplyType: EndpointMethodReplyType.Response,
      methodSubject: new Subject<any>(),
      methodType: EndpointMethodType.Public,
    },
    GetTickerHistory: {
      methodReplyType: EndpointMethodReplyType.Response,
      methodSubject: new Subject<any>(),
      methodType: EndpointMethodType.Public,
    },
    SubscribeLevel1: {
      methodReplyType: EndpointMethodReplyType.Response,
      methodSubject: new Subject<any>(),
      methodType: EndpointMethodType.Public,
    },
    SubscribeLevel2: {
      methodReplyType: EndpointMethodReplyType.Response,
      methodSubject: new Subject<any>(),
      methodType: EndpointMethodType.Public,
    },
    SubscribeTicker: {
      methodReplyType: EndpointMethodReplyType.Response,
      methodSubject: new Subject<any>(),
      methodType: EndpointMethodType.Public,
    },
    UnsubscribeLevel1: {
      methodReplyType: EndpointMethodReplyType.Response,
      methodSubject: new Subject<any>(),
      methodType: EndpointMethodType.Public,
    },
    UnsubscribeLevel2: {
      methodReplyType: EndpointMethodReplyType.Response,
      methodSubject: new Subject<any>(),
      methodType: EndpointMethodType.Public,
    },
    UnsubscribeTicker: {
      methodReplyType: EndpointMethodReplyType.Response,
      methodSubject: new Subject<any>(),
      methodType: EndpointMethodType.Public,
    },
    UnsubscribeTrades: {
      methodReplyType: EndpointMethodReplyType.Response,
      methodSubject: new Subject<any>(),
      methodType: EndpointMethodType.Public,
    },
    /* Existe?
    Activate2FA: null,
    AddUserAffiliateTag: null,
    Authenticate2FA: null,
    WebAuthenticateUser: null,
    AuthenticateUser: null,
    CancelUserReport: null,
    GetLevel1: null,
    GetUserAccountInfos: null,
    GetUserAccounts: null,
    GetUserAffiliateCount: null,
    GetUserAffiliateTag: null,
    GetUserReportTickets: null,
    SubscribeAccountEvents: null,
    SubscribeTrades: null,
    UpdateUserAffiliateTag: null,
    GenerateTradeActivityReport: null,
    GenerateTransactionActivityReport: null,
    GenerateTreasuryActivityReport: null,
    ScheduleTradeActivityReport: null,
    ScheduleTransactionActivityReport: null,
    ScheduleTreasuryActivityReport: null,
    GetOpenTradeReports: null,
    GetTradesHistory: null,
    CreateQuote: null,
    GetOpenQuotes: null,
    GetOrderHistoryByOrderId: null,
    GetOrdersHistory: null,
    ModifyOrder: null,
    SubmitBlockTrade: null,
    UpdateQuote: null,
    CreateDepositTicket: null,
    CreateWithdrawTicket: null,
    GetDeposits: null,
    GetDepositInfo: null,
    GetDepositTickets: null,
    GetWithdrawFee: null,
    GetWithdrawTemplate: null,
    GetWithdrawTemplateTypes: null,
    GetEarliestTickTime: null,
    Ping: null,*/
  };

  private socket: WebSocket;

  constructor() {
  }

  private connectSubject;

  /**
   * Connect to FoxBit websocket endpoint
   *
   * @param {string} [url='wss://apifoxbitprodlb.alphapoint.com/WSGateway/']
   * @returns {Observable<boolean>}
   * @memberof FoxBitClient
   */
  public connect(url: string = 'wss://apifoxbitprodlb.alphapoint.com/WSGateway/'): Observable<boolean> {
    try {
      this.connectSubject = new Subject<boolean>();
      this.socket = new WebSocket(url);
      this.initEventHandlers();
    } catch (err) {
      this.connectSubject.error(err);
      this.connectSubject.complete();

    }

    return this.connectSubject.asObservable();
  }

  /**
   * Discover if websocket connection is open
   *
   * @readonly
   * @type {boolean}
   * @memberof FoxBitClient
   */
  get isConnected(): boolean {
    return this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  /**
   * Disconnect from FoxBit websocket connection
   *
   * @memberof FoxBitClient
   */
  public disconnect() {
    if (this.isConnected) {
      this.socket.close();
    }
  }

  private initEventHandlers() {
    this.socket.on('open', () => {
      // console.log('Conexão iniciada com sucesso!');
      this.connectSubject.next(true);
      this.connectSubject.complete();
    });

    this.socket.on('message', (data: any) => {
      // console.log('Mensagem recebida (raw): ', data);
      const response = JSON.parse(data);
      response.o = JSON.parse(response.o);
      // console.log('Mensagem recebida: ', data);

      const endpointDescriptorByMethod = this.endpointDescriptorByMethod[response.n];

      if (response.o.hasOwnProperty('errorcode')
        && response.o.hasOwnProperty('result')
        && response.o.errorcode) { // GenericResponse
        const err = response.o;
        endpointDescriptorByMethod.methodSubject.error(new Error(`${err.errormsg}. ${err.detail}`));
      } else {
        endpointDescriptorByMethod.methodSubject.next(response.o);
      }

      if (endpointDescriptorByMethod.methodReplyType === EndpointMethodReplyType.Response) {
        endpointDescriptorByMethod.methodSubject.complete();
        endpointDescriptorByMethod.methodSubject = new Subject<any>();
      }

    });

    this.socket.on('error', (err: Error) => {
      console.log('[WEBSOCKET] Error: ', err);

      this.connectSubject.error(err);
      this.connectSubject.complete();

      for (const prop in this.endpointDescriptorByMethod) {
        if (this.endpointDescriptorByMethod.hasOwnProperty(prop)) {
          const endpointDescriptor = this.endpointDescriptorByMethod[prop];
          endpointDescriptor.methodSubject.error(err);
          endpointDescriptor.methodSubject.complete();
        }
      }
    });

    this.socket.on('close', (code: number, reason: string) => {
      // console.log(`Conexão finalizada (${code}-${reason})`);
      for (const prop in this.endpointDescriptorByMethod) {
        if (this.endpointDescriptorByMethod.hasOwnProperty(prop)) {
          const endpointDescriptor = this.endpointDescriptorByMethod[prop];

          if (code !== 0) {
            endpointDescriptor.methodSubject.error(reason);
          }

          endpointDescriptor.methodSubject.complete();
        }
      }
    });
  }

  private calculateMessageFrameSequence(messageFrame: MessageFrame) {
    switch (messageFrame.messageType) {
      case MessageType.Request:
      case MessageType.Subscribe:
      case MessageType.Unsubscribe:
        this.sequenceByMessageType[messageFrame.messageType] += 2;
        messageFrame.sequence = this.sequenceByMessageType[messageFrame.messageType];
        break;
      default:
        this.sequenceByMessageType[messageFrame.messageType] += 1;
        messageFrame.sequence = this.sequenceByMessageType[messageFrame.messageType];
        break;
    }
  }

  private prepareAndSendFrame(loginFrame: MessageFrame) {
    this.calculateMessageFrameSequence(loginFrame);
    const strLoginFrame = JSON.stringify(loginFrame);
    this.socket.send(strLoginFrame);
  }

  /**
   * Logout ends the current websocket session
   * **********************
   * Endpoint Type: Public
   * @returns {Observable<any>}
   * @memberof FoxBitClient
   */
  logOut(): Observable<any> {
    const frame = new MessageFrame(MessageType.Request, 'LogOut', {});
    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod['LogOut'].methodSubject.pipe(
      concatMap((val) => {
        this.disconnect();
        return val;
      }),
    );
  }

  /**
   * WebAuthenticateUser authenticates a user (logs in a user) for the current websocket session.
   * You must call WebAuthenticateUser in order to use the calls in this document not otherwise shown as
   * "No authentication required."
   * **********************
   * Endpoint Type: Public
   * @param {string} username The name of the user, for example, jsmith.
   * @param {string} password The user password. The user logs into a specific Order Management
   * System via Secure Socket Layer (SSL and HTTPS).
   * @returns {Observable<AuthenticateResponse>}
   * @memberof FoxBitClient
   */
  logIn(username: string, password: string): Observable<AuthenticateResponse> {
    const frame = new MessageFrame(MessageType.Request,
      'WebAuthenticateUser',
      {
        Username: username,
        Password: password,
      });

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod['WebAuthenticateUser'].methodSubject.asObservable();
  }

  /**
   * ResetPassword is a two-step process. The first step calls ResetPassword with the user’s username.
   * The Order Management System then sends an email to the user’s registered email address. The
   * email contains a reset link. Clicking the link sends the user to a web page where he can enter a new
   * password.
   * **********************
   * Endpoint Type: Public
   * @param {string} username The name of the user, for example, jsmith.
   * @returns {Observable<GenericResponse>}
   * @memberof FoxBitClient
   */
  resetPassword(username: string): Observable<GenericResponse> {
    const frame = new MessageFrame(MessageType.Request,
      'ResetPassword',
      {
        UserName: username,
      });

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod['ResetPassword'].methodSubject.asObservable();
  }

  /**
   * Retrieves Fee structure for specific Account
   * **********************
   * Endpoint Type: Public
   * @param {number} accountId The ID of the account for which information was requested.
   * @param {number} omsId The ID of the Order Management System that includes the product.
   * @returns {Observable<AccountFeesResponse[]>}
   * @memberof FoxBitClient
   */
  getAccountFees(accountId: number, omsId: number): Observable<AccountFeesResponse[]> {
    const frame = new MessageFrame(MessageType.Request,
      'GetAccountFees',
      {
        AccountId: accountId,
        OMSId: omsId,
      });

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod['GetAccountFees'].methodSubject.asObservable();
  }

  /**
   * Retrieves the details about a specific product on the trading venue. A product is an asset that is
   * tradable or paid out.
   * **********************
   * Endpoint Type: Public
   * @param {number} omsId The ID of the Order Management System that includes the product
   * @param {number} productId The ID of the product (often a currency) on the specified
   * Order Management System.
   * @returns {Observable<ProductResponse>}
   * @memberof FoxBitClient
   */
  getProduct(omsId: number, productId: number): Observable<ProductResponse> {
    const frame = new MessageFrame(MessageType.Request,
      'GetProduct', {
        OMSId: omsId,
        ProductId: productId,
      });

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod['GetProduct'].methodSubject.asObservable();
  }

  /**
   * Retrieves the details of a specific instrument from the Order Management System of the trading
   * venue. An instrument is a pair of exchanged products (or fractions of them) such as US dollars and
   * ounces of gold.
   * **********************
   * Endpoint Type: Public
   * @param {number} omsId The ID of the Order Management System from where the instrument is traded.
   * @param {number} instrumentId The ID of the instrument.
   * @returns {Observable<InstrumentResponse>}
   * @memberof FoxBitClient
   */
  getInstrument(omsId: number, instrumentId: number): Observable<InstrumentResponse> {
    const frame = new MessageFrame(MessageType.Request,
      'GetInstrument', {
        OMSId: omsId,
        InstrumentId: instrumentId,
      });

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod['GetInstrument'].methodSubject.asObservable();
  }

  /**
   * Retrieves the details of a specific instrument from the Order Management System of the trading
   * venue. An instrument is a pair of exchanged products (or fractions of them) such as US dollars and
   * ounces of gold.
   * **********************
   * Endpoint Type: Public
   * @param {number} omsId The ID of the Order Management System on which the instruments are available.
   * @returns {Observable<InstrumentResponse[]>}
   * @memberof FoxBitClient
   */
  getInstruments(omsId: number): Observable<InstrumentResponse[]> {
    const frame = new MessageFrame(MessageType.Request,
      'GetInstruments', {
        OMSId: omsId,
      });

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod['GetInstruments'].methodSubject.asObservable();
  }

  /**
   * Returns an array of products available on the trading venue. A product is an asset that is tradable
   * or paid out
   * **********************
   * Endpoint Type: Public
   * @param {number} omsId The ID of the Order Management System that includes the product
   * @returns {Observable<ProductResponse[]>}
   * @memberof FoxBitClient
   */
  getProducts(omsId: number): Observable<ProductResponse[]> {
    const frame = new MessageFrame(MessageType.Request,
      'GetProducts', {
        OMSId: omsId,
      });

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod['GetProducts'].methodSubject.asObservable();
  }

  /**
   * Provides a current Level 2 snapshot of a specific instrument trading on an Order Management
   * System to a user-determined market depth
   * **********************
   * Endpoint Type: Public
   * @param {number} omsId The ID of the Order Management System where the instrument is traded.
   * @param {number} instrumentId The ID of the instrument that is the subject of the snapshot.
   * @param {number} [depth=100] in this call is "depth of market," the number of buyers and sellers at greater or lesser prices in
   * the order book for the instrument.
   * @returns {Observable<L2SnapshotResponse[]>}
   * @memberof FoxBitClient
   */
  getL2Snapshot(omsId: number, instrumentId: number, depth: number = 100): Observable<L2SnapshotResponse[]> {

    const frame = new MessageFrame(MessageType.Request,
      'GetL2Snapshot', {
        OMSId: omsId,
        InstrumentId: instrumentId,
        Depth: depth,
      });

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod['GetL2Snapshot'].methodSubject.asObservable();
  }

  /**
   * Requests a ticker history (high, low, open, close, volume, bid, ask, ID) of a specific instrument
   * from a given date forward to the present. You will need to format the returned data per your
   * requirements.
   * **********************
   * Endpoint Type: Public
   * @param {number} instrumentId The ID of a specific instrument. The Order Management System
   * and the default Account ID of the logged-in user are assumed.
   * @param {Date} fromDate Oldest date from which the ticker history will start, in POSIX format
   * and UTC time zone. The report moves toward the present from this point.
   * @returns {Observable<SubscriptionTickerResponse[]>}
   * @memberof FoxBitClient
   */
  getTickerHistory(instrumentId: number, fromDate: Date): Observable<SubscriptionTickerResponse[]> {
    const frame = new MessageFrame(MessageType.Request,
      'GetTickerHistory', {
        InstrumentId: instrumentId,
        FromDate: fromDate, // POSIX-format date and time
      });

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod['GetTickerHistory'].methodSubject.pipe(
      map((ticks: number[]) => {
        const typedTicks: SubscriptionTickerResponse[] = [];

        for (const tick of ticks) {
          typedTicks.push({
            TickerDate: tick[0],
            High: tick[1],
            Low: tick[2],
            Open: tick[3],
            Close: tick[4],
            Volume: tick[5],
            BidPrice: tick[6],
            AskPrice: tick[7],
            InstrumentId: tick[8],
          });
        }

        return typedTicks;
      }),
    );
  }

  /**
   * Retrieves the latest Level 1 Ticker information and then subscribes the user to ongoing Level 1
   * market data event updates for one specific instrument. For more information about Level 1
   * and Level 2. The SubscribeLevel1 call responds with the Level 1 response shown below.
   * The OMS then periodically sends *Leve1UpdateEvent* information when best bid/best offer
   * issues in the same format as this response, until you send the UnsubscribeLevel1 call.
   * **********************
   * Endpoint Type: Public
   * @param {number} omsId The ID of the Order Management System on which the instrument trades.
   * @param {(number | string)} instrumentIdOrSymbol The ID of the instrument you’re tracking.
   * or The symbol of the instrument you’re tracking.
   * @returns {Observable<SubscriptionLevel1Response>}
   * @memberof FoxBitClient
   */
  subscribeLevel1(omsId: number, instrumentIdOrSymbol: number | string): Observable<SubscriptionLevel1Response> {
    let param;
    if (typeof instrumentIdOrSymbol === 'number') {
      param = {
        OMSId: omsId,
        InstrumentId: instrumentIdOrSymbol,
      };
    } else {
      param = {
        OMSId: omsId,
        Symbol: instrumentIdOrSymbol,
      };
    }

    const frame = new MessageFrame(MessageType.Subscribe, 'SubscribeLevel1', param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod['SubscribeLevel1'].methodSubject.asObservable();
  }

  /**
   * Retrieves the latest Level 2 Ticker information and then subscribes the user to Level 2 market data
   * event updates for one specific instrument. Level 2 allows the user to specify the level of market
   * depth information on either side of the bid and ask. The SubscribeLevel2 call responds
   * with the Level 2 response shown below. The OMS then periodically sends *Level2UpdateEvent*
   * information in the same format as this response until you send the UnsubscribeLevel2 call.
   * **********************
   * Endpoint Type: Public
   * @param {number} omsId The ID of the Order Management System on which the instrument trades.
   * @param {(number | string)} instrumentIdOrSymbol The ID of the instrument you’re tracking
   * or The symbol of the instrument you’re tracking
   * @param {number} depth Depth in this call is “depth of market,” the number of buyers and sellers at greater or lesser prices in
   * the order book for the instrument.
   * @returns {Observable<SubscriptionL2Response>}
   * @memberof FoxBitClient
   */
  subscribeLevel2(omsId: number, instrumentIdOrSymbol: number | string, depth: number): Observable<SubscriptionL2Response> {
    let param;
    if (typeof instrumentIdOrSymbol === 'number') {
      param = {
        OMSId: omsId,
        InstrumentId: instrumentIdOrSymbol,
        Depth: depth,
      };
    } else {
      param = {
        OMSId: omsId,
        Symbol: instrumentIdOrSymbol,
        Depth: depth,
      };
    }

    const frame = new MessageFrame(MessageType.Subscribe, 'SubscribeLevel2', param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod['SubscribeLevel2'].methodSubject.asObservable();
  }

  /**
   * Subscribes a user to a Ticker Market Data Feed for a specific instrument and interval.
   * SubscribeTicker sends a response object as described below, and then periodically returns a
   * *TickerDataUpdateEvent* that matches the content of the response object.
   * **********************
   * Endpoint Type: Public
   * @param {number} omsId The ID of the Order Management System
   * @param {number} instrumentId The ID of the instrument whose information you want to track.
   * @param {number} [interval=60]  Specifies in seconds how frequently to obtain ticker updates.
   * Default is 60 — one minute.
   * @param {number} [includeLastCount=100] The limit of records returned in the ticker history. The default is 100.
   * @returns {Observable<SubscriptionTickerResponse>}
   * @memberof FoxBitClient
   */
  subscribeTicker(omsId: number, instrumentId: number, interval: number = 60, includeLastCount: number = 100)
    : Observable<SubscriptionTickerResponse> {
    const param = {
      OMSId: omsId,
      InstrumentId: instrumentId,
      Interval: interval,
      IncludeLastCount: includeLastCount,
    };
    const frame = new MessageFrame(MessageType.Subscribe, 'SubscribeTicker', param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod['SubscribeTicker'].methodSubject.asObservable();
  }

  /**
   * Unsubscribes the user from a Level 1 Market Data Feed subscription..
   * **********************
   * Endpoint Type: Public
   * @param {number} omsId  The ID of the Order Management System on which the user has
   * subscribed to a Level 1 market data feed.
   * @param {number} instrumentId The ID of the instrument being tracked by the Level 1 market data feed.
   * @returns {Observable<GenericResponse>}
   * @memberof FoxBitClient
   */
  unsubscribeLevel1(omsId: number, instrumentId: number): Observable<GenericResponse> {
    const param = {
      OMSId: omsId,
      InstrumentId: instrumentId,
    };
    const frame = new MessageFrame(MessageType.Subscribe, 'UnsubscribeLevel1', param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod['UnsubscribeLevel1'].methodSubject.asObservable();
  }

  /**
   * Unsubscribes the user from a Level 2 Market Data Feed subscription.
   * **********************
   * Endpoint Type: Public
   * @param {number} omsId  The ID of the Order Management System on which the user has
   * subscribed to a Level 2 market data feed.
   * @param {number} instrumentId The ID of the instrument being tracked by the Level 2 market data feed.
   * @returns {Observable<GenericResponse>}
   * @memberof FoxBitClient
   */
  unsubscribeLevel2(omsId: number, instrumentId: number): Observable<GenericResponse> {
    const param = {
      OMSId: omsId,
      InstrumentId: instrumentId,
    };
    const frame = new MessageFrame(MessageType.Subscribe, 'UnsubscribeLevel2', param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod['UnsubscribeLevel2'].methodSubject.asObservable();
  }

  /**
   * Unsubscribes a user from a Ticker Market Data Feed
   * **********************
   * Endpoint Type: Public
   * @param {number} omsId  The ID of the Order Management System on which the user has
   * subscribed to a ticker market data feed.
   * @param {number} instrumentId The ID of the instrument being tracked by the ticker market data feed.
   * @returns {Observable<GenericResponse>}
   * @memberof FoxBitClient
   */
  unsubscribeTicker(omsId: number, instrumentId: number): Observable<GenericResponse> {
    const param = {
      OMSId: omsId,
      InstrumentId: instrumentId,
    };
    const frame = new MessageFrame(MessageType.Subscribe, 'UnsubscribeTicker', param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod['UnsubscribeTicker'].methodSubject.asObservable();
  }

  // ============== Private Endpoints ================

  /**
   * Retrieves a comma-separated array of all permissions that can be assigned to a user.
   * An administrator or superuser can set permissions for each user on an API-call by API-call
   * basis, to allow for highly granular control. Common permission sets include Trading, Deposit,
   * and Withdrawal (which allow trading, deposit of funds, and account withdrawals, respectively);
   * or AdminUI, UserOperator, and AccountOperator (which allow control of the Order Management
   * System, set of users, or an account).
   * **********************
   * Endpoint Type: Private
   * @returns {Observable<string[]>}
   * @memberof FoxBitClient
   */
  getAvailablePermissionList(): Observable<string[]> {
    const endpointName = 'GetAvailablePermissionList';
    const param = {};
    const frame = new MessageFrame(MessageType.Request, endpointName, param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

  /**
   * **GetUserConfig** returns the list of key/value pairs set by the **SetUserConfig** call and associated with
   * a user record. A trading venue can use Config strings to store custom information or compliance
   * information with a user record.
   *
   * @returns {Observable<Array<{ Key: string, Value: string }>>}
   * @memberof FoxBitClient
   */
  getUserConfig(): Observable<Array<{ Key: string, Value: string }>> {
    const endpointName = 'GetUserConfig';
    const param = {};
    const frame = new MessageFrame(MessageType.Request, endpointName, param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

  /**
   * Retrieves basic information about a user from the Order Management System. A user may only see
   * information about himself; an administrator (or superuser) may see, enter, or change information
   * about other users
   *
   * @returns {Observable<UserInfoResponse>}
   * @memberof FoxBitClient
   */
  getUserInfo(): Observable<UserInfoResponse> {
    const endpointName = 'GetUserInfo';
    const param = {};
    const frame = new MessageFrame(MessageType.Request, endpointName, param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

  /**
   * Retrieves an array of permissions for the logged-in user. Permissions can be set only by an
   * administrator or superuser.
   * An administrator or superuser can set permissions for each user on an API-call by API-call
   * basis, to allow for highly granular control. Common permission sets include Trading, Deposit,
   * and Withdrawal (which allow trading, deposit of funds, and account withdrawals, respectively);
   * or AdminUI, UserOperator, and AccountOperator (which allow control of the Order Management
   * System, set of users, or an account)
   *
   * @param {number} userId  The ID of the user whose permission information will be returned. A user
   * can only retrieve his own permissions; an administrator can retrieve information
   * about the permissions of others.
   * @returns {Observable<string[]>}
   * @memberof FoxBitClient
   */
  getUserPermissions(userId: number): Observable<string[]> {
    const endpointName = 'GetUserPermissions';
    const param = {
      UserId: userId,
    };

    const frame = new MessageFrame(MessageType.Request, endpointName, param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

  /**
   * RemoveUserConfig deletes a single key/value Config pair from a user record. A trading venue uses
   * onfig strings to store custom information or compliance information with a user’s record.
   *
   * @param {number} userId The ID of the user from whose record you’re deleting the custom key/value pair
   * @param {string} userName The name of the user from whose record you’re deleting the custom key/value pair
   * @param {string} key The name of the key/value pair to delete
   * @returns {Observable<GenericResponse>}
   * @memberof FoxBitClient
   */
  removeUserConfig(userId: number, userName: string, key: string): Observable<GenericResponse> {
    const endpointName = 'RemoveUserConfig';
    const param = {
      UserId: userId,
      UserName: userName,
      Key: key,
    };

    const frame = new MessageFrame(MessageType.Request, endpointName, param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

  /**
   * SetUserConfig adds an array of one or more arbitrary key/value pairs to a user record. A trading
   * venue can use Config strings to store custom information or compliance information with a user’s record.
   *
   * @param {number} userId The ID of the user to whose record you’re adding the custom key/value pairs.
   * @param {string} userName The name of the user to whose record you’re adding the custom key/value pairs.
   * @param {{}} config array of key/value pairs. “Key” is always a string; but the associated Value of Key
   * can be of any data type.
   * @returns {Observable<GenericResponse>}
   * @memberof FoxBitClient
   */
  setUserConfig(userId: number, userName: string, config: Array<{ Key: string, Value: string }>): Observable<GenericResponse> {
    const endpointName = 'SetUserConfig';
    const param = {
      UserId: userId,
      UserName: userName,
      Config: config,
    };

    const frame = new MessageFrame(MessageType.Request, endpointName, param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

  /**
   * Enters basic information about a user into the Order Management System. A user may only
   * enter or change information about himself; an administrator (or superuser) may enter or change
   * information about other users.
   *
   * @param {number} userId The ID of the user; set by the system when the user registers.
   * @param {string} userName User’s name; “John Smith.”
   * @param {string} password User’s password.
   * @param {string} email User’s email address.
   * @param {boolean} emailVerified  Send true if you have verified the user’s email; send false if you have
   * not verified the email address. Default is false.
   * @param {number} accountId The ID of the default account with which the user is associated. A user
   * may be associated with more than one account, and more than one user may be
   * associated with a single account. An admin or superuser can specify additional accounts
   * @param {boolean} use2FA  Set to true if this user must use two-factor authentication; set to false if
   * this user does not need to user two-factor authentication. Default is false.
   * @returns {Observable<GenericResponse>}
   * @memberof FoxBitClient
   */
  setUserInfo(userId: number, userName: string, password: string, email: string,
              emailVerified: boolean, accountId: number, use2FA: boolean): Observable<UserInfoResponse> {

    const endpointName = 'SetUserInfo';
    const param = {
      UserId: userId,
      UserName: userName,
      Password: password,
      Email: email,
      EmailVerified: emailVerified,
      AccountId: accountId,
      Use2FA: use2FA,
    };

    const frame = new MessageFrame(MessageType.Request, endpointName, param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

 /*
  * | UserId 37 | AccId 14 | Instr 25 |                                    Result                                   |
   * |:---------:|:--------:|:--------:|:---------------------------------------------------------------------------:|
   * |     X     |     X    |     X    | Account #14 belonging to user #37 for instrument #25.                       |
   * |     X     |     X    |          | Account #14 belonging to user #37 for all instruments.                      |
   * |     X     |          |     X    | All accounts belonging to user #37 for instrument #25.                      |
   * |     X     |          |          | All accounts belonging to user #37 for all instruments.                     |
   * |           |     X    |     X    | All users of account #14 for instrument #25.                                |
   * |           |     X    |          | All users of account #14 for all instruments.                               |
   * |           |          |     X    | All accounts of all users for instrument #25. (requires special permission) |
   * |           |          |          | All accounts of all users for all instruments (requires special permission) |
   *
 */

  /**
   * Cancels all open matching orders for the specified instrument, account, user (subject to permission level)
   * or a combination of them on a specific Order Management System.
   * User and account permissions govern cancellation actions.
   *   
   * @param {number} omsId The Order Management System under which the account operates.Required
   * @param {number} [accountId] The account for which all orders are being canceled. Conditionally optional.
   * @param {number} [userId] The ID of the user whose orders are being canceled. Conditionally optional.
   * @param {number} [instrumentId] The ID of the instrument for which all orders are being cancelled. Conditionally optional.
   * @returns {Observable<UserInfoResponse>}
   * @memberof FoxBitClient
   */
  cancelAllOrders(omsId: number, accountId?: number, userId?: number, instrumentId?: number): Observable<GenericResponse> {

    const endpointName = 'CancelAllOrders';
    const param = {
      UserId: userId,
      AccountId: accountId,
      InstrumentId: instrumentId,
      OMSId: omsId,
    };

    const frame = new MessageFrame(MessageType.Request, endpointName, param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

  /**
   * Cancels an open order that has been placed but has not yet been executed. Only a trading venue
   * operator can cancel orders for another user or account
   *
   * @param {number} omsId The Order Management System on which the order exists. Required
   * @param {number} [accountId]  The ID of account under which the order was placed. Conditionally optional.
   * @param {number} [clientOrderId] A user-assigned ID for the order (like a purchase-order number
   * assigned by a company). ClientOrderId defaults to 0. Conditionally optional.
   * @param {number} [orderId] The order to be cancelled. Conditionally optional
   * @returns {Observable<UserInfoResponse>}
   * @memberof FoxBitClient
   */
  cancelOrder(omsId: number, accountId?: number, clientOrderId?: number, orderId?: number): Observable<GenericResponse> {

    const endpointName = 'CancelOrder';
    const param = {
      ClientOrderId: clientOrderId,
      AccountId: accountId,
      OrderId: orderId,
      OMSId: omsId,
    };

    const frame = new MessageFrame(MessageType.Request, endpointName, param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

  /**
   * Cancels a quote that has not been executed yet.
   * Quoting is not enabled for the retail end user of the AlphaPoint software.
   * Only registered market participants or market makers may quote.
   * Only a trading venue operator can cancel quotes for another user.
   *
   * @param {number} omsId The ID of the Order Management System where the quote was requested. Required
   * @param {number} bidQuoteId The ID of the bid quote. Required.
   * @param {number} askQuoteId The ID of the ask quote. Required
   * @param {number} [accountId] The ID of the account that requested the quote. Conditionally optional
   * @param {number} [instrumentId] The ID of the instrument being quoted. Conditionally optional.
   * @returns {Observable<GenericResponse>}
   * @memberof FoxBitClient
   */
  cancelQuote(omsId: number, bidQuoteId: number, askQuoteId: number, accountId?: number, instrumentId?: number) 
  : Observable<GenericResponse> {

    const endpointName = 'CancelQuote';
    const param = {
      OMSId: omsId,
      BidQuoteId: bidQuoteId,
      AskQuoteId: askQuoteId,
      AccountId: accountId,
      InstrumentId: instrumentId
    };

    const frame = new MessageFrame(MessageType.Request, endpointName, param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

  //
  // cancelReplaceOrder() {
  // }
  //
  //
  // getAccountPositions() {
  // }
  //
  // getAccountTrades() {
  // }
  //
  // getAccountTransactions() {
  // }
  //
  // getOpenOrders() {
  // }
  //
  // sendOrder() {
  // }
  //
  // getOrderFee() {
  // }
  //
  // getOrderHistory() {
  // }
  //
  // getAllDepositTickets() {
  // }
  //
  // getAllWithdrawTickets() {
  // }
  //
  // getDepositTicket() {
  // }
  //
  // getWithdrawTicket() {
  // }
  //
  // subscribeTrades(omsId: number, instrumentId: number, includeLastCount: number = 100): SubscriptionTradesResponse[] {
  //   const param = {
  //     OMSId: omsId,
  //     InstrumentId: instrumentId,
  //     IncludeLastCount: includeLastCount,
  //   };
  //   return [];
  // }
  //
  // unsubscribeTrades(omsId: number, instrumentId: number): GenericResponse {
  // }

}
