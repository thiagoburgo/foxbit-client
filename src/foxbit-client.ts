import { format } from 'date-fns';
import ReconnectingWebSocket, { CloseEvent, ErrorEvent } from 'reconnecting-websocket';
import { Observable, of, Subject } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import WebSocket from 'ws';

import { EndpointMethodDescriptor, EndpointMethodReplyType, EndpointMethodType } from './api-descriptors';
import { wsLogger } from './log-service';
import { MessageType } from './message-enums';
import { MessageFrame } from './message-frame';
import {
  AllDepositOrWithdrawTicketsRequest,
  CancelReplaceOrderRequest,
  OrderFeeRequest,
  SendOrderRequest,
} from './message-request';
import {
  AccountFeesResponse,
  AccountInfoResult,
  AccountPositionResult,
  AccountTradesResult,
  AllDepositTicketsResult,
  AllWithdrawTicketsResult,
  AuthenticateResponse,
  CancelReplaceOrderResult,
  GenericResponse,
  InstrumentResponse,
  L2SnapshotResponse,
  OpenOrdersResult,
  OrderFeeResult,
  OrderHistoryResult,
  ProductResponse,
  SendOrderResult,
  SubscriptionL2Response,
  SubscriptionLevel1Response,
  SubscriptionTickerResponse,
  UserInfoResponse,
  SubscriptionTradesResponse,
} from './message-result';

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
    Authenticate2FA: {
      methodReplyType: EndpointMethodReplyType.Response,
      methodSubject: new Subject<any>(),
      methodType: EndpointMethodType.Public,
    },
    WebAuthenticateUser: {
      methodReplyType: EndpointMethodReplyType.Response,
      methodSubject: new Subject<any>(),
      methodType: EndpointMethodType.Public,
    },
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
      methodReplyType: EndpointMethodReplyType.ResponseAndEvent,
      methodSubject: new Subject<any>(),
      methodType: EndpointMethodType.Public,
      associatedEvent: 'Level1UpdateEvent'
    },
    SubscribeLevel2: {
      methodReplyType: EndpointMethodReplyType.ResponseAndEvent,
      methodSubject: new Subject<any>(),
      methodType: EndpointMethodType.Public,
      associatedEvent: 'Level2UpdateEvent'
    },
    SubscribeTicker: {
      methodReplyType: EndpointMethodReplyType.ResponseAndEvent,
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
    SubscribeTrades: {
      methodReplyType: EndpointMethodReplyType.ResponseAndEvent,
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

  private socket: ReconnectingWebSocket;

  constructor() {
    // Only alias for SubscribeLevel1
    this.endpointDescriptorByMethod['Level1UpdateEvent']
      = this.endpointDescriptorByMethod['SubscribeLevel1'];

    // Only alias for SubscribeLevel2
    this.endpointDescriptorByMethod['Level2UpdateEvent']
      = this.endpointDescriptorByMethod['SubscribeLevel2'];

    // Only alias for SubscribeTicker
    this.endpointDescriptorByMethod['TickerDataUpdateEvent']
      = this.endpointDescriptorByMethod['SubscribeTicker'];

    this.endpointDescriptorByMethod['TradeDataUpdateEvent']
      = this.endpointDescriptorByMethod['SubscribeTrades'];
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
      const logEnabled = process.env.LOG_ENABLED === 'true';
      this.socket = new ReconnectingWebSocket(url, [], {
        WebSocket: WebSocket,
        debug: logEnabled
      });

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

    this.socket.addEventListener('open', () => {
      wsLogger.info('Conexão iniciada com sucesso!');
      this.connectSubject.next(true);
      this.connectSubject.complete();
    });

    this.socket.addEventListener('message', (message: any) => {
      const data = message.data;

      wsLogger.info('Mensagem recebida (raw)', data);
      const response = JSON.parse(data);

      response.o = response.o && JSON.parse(response.o);

      wsLogger.info('Mensagem recebida (parsed)', response);

      const endpointDescriptorByMethod = this.endpointDescriptorByMethod[response.n];

      if (response.o.hasOwnProperty('errorcode')
        && response.o.hasOwnProperty('result')
        && response.o.errorcode) { // GenericResponse
        const err = response.o;
        endpointDescriptorByMethod.methodSubject.error(new Error(`${response.o.errorcode} - ${err.errormsg}. ${err.detail}`));
        endpointDescriptorByMethod.methodSubject.complete();
      } else {
        endpointDescriptorByMethod.methodSubject.next(response.o);
      }

      if (endpointDescriptorByMethod.methodReplyType === EndpointMethodReplyType.Response) {
        endpointDescriptorByMethod.methodSubject.complete();
        endpointDescriptorByMethod.methodSubject = new Subject<any>();
      }

    });

    this.socket.addEventListener('error', (err: ErrorEvent) => {
      wsLogger.error(`[Socket Error] ${err.type} - ${err.message} - ${err.target}`, err.error);

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

    this.socket.addEventListener('close', (closeEvent: CloseEvent) => {
      const code: number = closeEvent.code;
      const reason: string = closeEvent.reason;

      if (code > 1000) {
        wsLogger.error('Socket closed: %d-%s', code, reason);
      } else {
        wsLogger.info('Socket closed normally', code, reason);
      }

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

  private prepareAndSendFrame(frame: MessageFrame) {
    this.calculateMessageFrameSequence(frame);
    const strLoginFrame = JSON.stringify(frame);

    wsLogger.info('Envio de Frame', frame);
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
        return of(val);
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
  webAuthenticateUser(username: string, password: string): Observable<AuthenticateResponse> {
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
   * Completes the second part of a two-factor authentication by sending the authentication token from
   * the non-AlphaPoint authentication system to the Order Management System. The call returns a
   * verification that the user logging in has been authenticated, and a token.
   * Here is how the two-factor authentication process works:
   *   1. Call WebAuthenticateUser. The response includes values for TwoFAType and
   *      TwoFAToken. For example, TwoFAType may return “Google,” and the TwoFAToken then
   *      returns a Google-appropriate token (which in this case would be a QR code).
   *   2. Enter the TwoFAToken into the two-factor authentication program, for example, Google
   *      Authenticator. The authentication program returns a different token.
   *   3. Call Authenticate2FA with the token you received from the two-factor authentication
   *      program (shown as YourCode in the request example below).
   *
   * @param {string} code Code holds the token obtained from the other authentication source.
   * @param {string} [sessionToken] To send a session token to re-establish an interrupted session
   * @returns {Observable<AuthenticateResponse>}
   * @memberof FoxBitClient
   */
  authenticate2FA(code: string, sessionToken?: string): Observable<AuthenticateResponse> {

    const endpointName = 'Authenticate2FA';
    let param;
    if (sessionToken) {
      param = {
        SessionToken: sessionToken
      };
    } else {
      param = {
        Code: code
      };
    }

    const frame = new MessageFrame(MessageType.Request, endpointName, param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
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
        Depth: depth
      });

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod['GetL2Snapshot'].methodSubject.pipe(
      map((snapshots: number[][]) => {
        const snapshotsResponse: L2SnapshotResponse[] = [];

        for (const snapshot of snapshots) {
          snapshotsResponse.push({
            MDUpdateID: snapshot[0],
            Accounts: snapshot[1],
            ActionDateTime: snapshot[2],
            ActionType: snapshot[3],
            LastTradePrice: snapshot[4],
            Orders: snapshot[5],
            Price: snapshot[6],
            ProductPairCode: snapshot[7],
            Quantity: snapshot[8],
            Side: snapshot[9]
          } as L2SnapshotResponse);
        }

        return snapshotsResponse;
      })
    );
  }

  //#region IMPLEMENTATION FOLLOWING DOCUMENTATION, BUT WRONG
  // /**
  //  * Requests a ticker history (high, low, open, close, volume, bid, ask, ID) of a specific instrument
  //  * from a given date forward to the present. You will need to format the returned data per your
  //  * requirements.
  //  * **********************
  //  * Endpoint Type: Public
  //  * @param {number} instrumentId The ID of a specific instrument. The Order Management System
  //  * and the default Account ID of the logged-in user are assumed.
  //  * @param {Date} fromDate Oldest date from which the ticker history will start, in POSIX format
  //  * and UTC time zone. The report moves toward the present from this point.
  //  * @returns {Observable<SubscriptionTickerResponse[]>}
  //  * @memberof FoxBitClient
  //  */
  // getTickerHistory(instrumentId: number, fromDate: Date): Observable<SubscriptionTickerResponse[]> {
  //   const frame = new MessageFrame(MessageType.Request,
  //     'GetTickerHistory', {
  //       InstrumentId: instrumentId,
  //       FromDate: getUnixTime(fromDate), // POSIX-format date and time
  //     });

  //   this.prepareAndSendFrame(frame);

  //   return this.endpointDescriptorByMethod['GetTickerHistory'].methodSubject.pipe(
  //     map((ticks: number[][]) => {
  //       const typedTicks: SubscriptionTickerResponse[] = [];

  //       for (const tick of ticks) {
  //         typedTicks.push({
  //           TickerDate: tick[0],
  //           High: tick[1],
  //           Low: tick[2],
  //           Open: tick[3],
  //           Close: tick[4],
  //           Volume: tick[5],
  //           BidPrice: tick[6],
  //           AskPrice: tick[7],
  //           InstrumentId: tick[8],
  //         });
  //       }

  //       return typedTicks;
  //     }),
  //   );
  // }
  //#endregion

  /**
   * Requests a ticker history (high, low, open, close, volume, bid, ask, ID) of a specific instrument
   * from a given date forward to the present. You will need to format the returned data per your
   * requirements.
   * **********************
   * Endpoint Type: Public
   * @param {number} omsId The ID of the Order Management System.
   * @param {number} instrumentId The ID of a specific instrument. The Order Management System
   * and the default Account ID of the logged-in user are assumed.
   * @param {Date} fromDate Oldest date from which the ticker history will start, in 'yyyy-MM-ddThh:mm:ssZ' format.
   * The report moves toward the present from this point.
   * @param {Date} [toDate=new Date()]
   * @param {number} [interval=60] Interval in minutes to consider tickers
   * @returns {Observable<SubscriptionTickerResponse[]>}
   * @memberof FoxBitClient
   */
  getTickerHistory(omsId: number, instrumentId: number, fromDate: Date, toDate: Date = new Date(), interval: number = 60)
    : Observable<SubscriptionTickerResponse[]> {
    // ws.send(JSON.stringify({"m":0,"i":1,"n":"GetTickerHistory","o":"{\"OMSId\":1,\"InstrumentId\":1,\"FromDate\":\"2018-12-20\",\"ToDate\":\"2018-12-21\",\"Interval\":\"60\"}"}))
    const frame = new MessageFrame(MessageType.Request,
      'GetTickerHistory', {
        OMSId: omsId,
        InstrumentId: instrumentId,
        FromDate: format(fromDate, 'yyyy-MM-dd\'T\'hh:mm:ssZ'), // POSIX-format date and time
        ToDate: format(toDate, 'yyyy-MM-dd\'T\'hh:mm:ssZ'),
        Interval: interval
      });

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod['GetTickerHistory'].methodSubject.pipe(
      map(this.mapTicker)
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

    const frame = new MessageFrame(MessageType.Request, 'SubscribeLevel1', param);

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
   * @param {number} depth Depth in this call is “depth of market”, the number of buyers and sellers at greater or lesser prices in
   * the order book for the instrument.
   * @returns {Observable<SubscriptionL2Response>}
   * @memberof FoxBitClient
   */
  subscribeLevel2(omsId: number, instrumentIdOrSymbol: number | string, depth: number = 300): Observable<SubscriptionL2Response[]> {
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

    const frame = new MessageFrame(MessageType.Request, 'SubscribeLevel2', param);

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
    : Observable<SubscriptionTickerResponse[]> {
    const param = {
      OMSId: omsId,
      InstrumentId: instrumentId,
      Interval: interval,
      IncludeLastCount: includeLastCount,
    };
    const frame = new MessageFrame(MessageType.Request, 'SubscribeTicker', param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod['SubscribeTicker'].methodSubject.pipe(
      map(this.mapTicker)
    );
  }

  private mapTicker = (ticks: number[][]) => {
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
    const frame = new MessageFrame(MessageType.Request, 'UnsubscribeLevel1', param);

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
    const frame = new MessageFrame(MessageType.Request, 'UnsubscribeLevel2', param);

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
    const frame = new MessageFrame(MessageType.Request, 'UnsubscribeTicker', param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod['UnsubscribeTicker'].methodSubject.asObservable();
  }

  // ============== Private Endpoints ================

  /**
   * ************************** 
   * API returns 'Endpoint not found'
   * **************************
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
  // getAvailablePermissionList(): Observable<string[]> {
  //   const endpointName = 'GetAvailablePermissionList';
  //   const param = {};
  //   const frame = new MessageFrame(MessageType.Request, endpointName, param);

  //   this.prepareAndSendFrame(frame);

  //   return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  // }

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
  setUserInfo(
    userId: number, userName: string, password: string, email: string,
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

  /**
   * Cancels all open matching orders for the specified instrument, account, user (subject to permission level)
   * or a combination of them on a specific Order Management System.
   * User and account permissions govern cancellation actions.
   *
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
  cancelOrder(omsId: number, accountId?: number, orderId?: number, clientOrderId: number = null): Observable<GenericResponse> {

    const endpointName = 'CancelOrder';

    const param: any = {
      OMSId: omsId,
      AccountId: accountId,
      OrderId: orderId
    };

    if (clientOrderId != null) {
      param.ClientOrderId = clientOrderId;
    }
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

  /**
   * CancelReplaceOrder is single API call that both cancels an existing order and replaces it with a
   * new order. Canceling one order and replacing it with another also cancels the order’s priority in
   * the order book. You can use ModifyOrder to preserve priority in the book; but ModifyOrder only
   * allows a reduction in order quantity.
   * `Note: ` CancelReplaceOrder sacrifices the order’s priority in the order book.
   * @param {CancelReplaceOrderRequest} cancelReplaceOrderReq
   * @returns {Observable<CancelReplaceOrderResult>}
   * @memberof FoxBitClient
   */
  cancelReplaceOrder(cancelReplaceOrderReq: CancelReplaceOrderRequest): Observable<CancelReplaceOrderResult> {

    const endpointName = 'CancelReplaceOrder';

    const frame = new MessageFrame(MessageType.Request, endpointName, cancelReplaceOrderReq);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

  /**
   * Returns detailed information about one specific account belonging to the authenticated user and
   * existing on a specific Order Management System
   *
   * @param {number} omsId The ID of the Order Management System on which the account exists
   * @param {number} accountId  The ID of the account on the Order Management System for which information will be returned.
   * @param {string} accountHandle  AccountHandle is a unique user-assigned name that is checked at create
   * time by the Order Management System. Alternate to Account ID.
   * @returns {Observable<AccountInfoResult>}
   * @memberof FoxBitClient
   */
  getAccountInfo(omsId: number, accountId: number, accountHandle: string): Observable<AccountInfoResult> {
    const endpointName = 'GetAccountInfo';

    const param = {
      OMSId: omsId,
      AccountId: accountId,
      AccountHandle: accountHandle
    };

    const frame = new MessageFrame(MessageType.Request, endpointName, param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

  /**
   * Retrieves a list of positions (balances) for a specific user account running
   * under a specific Order Management System.
   * The trading day runs from UTC Midnight to UTC Midnight.
   * @param {number} accountId  The ID of the authenticated user’s account on the Order Management
   * System for which positions will be returned.
   * @param {number} omsId  The ID of the Order Management System to which the user belongs.
   * A user will belong only to one OMS.
   * @returns {Observable<AccountPositionResult[]>}
   * @memberof FoxBitClient
   */
  getAccountPositions(accountId: number, omsId: number): Observable<AccountPositionResult[]> {
    const endpointName = 'GetAccountPositions';

    const param = {
      OMSId: omsId,
      AccountId: accountId
    };

    const frame = new MessageFrame(MessageType.Request, endpointName, param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

  /**
   * Requests the details on up to `200` past trade executions for a single specific user account and its
   * Order Management System, starting at index `i`, where `i` is an integer identifying a specific execution
   * in reverse order; that is, the most recent execution has an index of `0`, and increments by one as trade
   * executions recede into the past.
   * The operator of the trading venue determines how long to retain an accessible trading history
   * before archiving.
   * @param {number} accountId The ID of the authenticated user’s account.
   * @param {number} omsId The ID of the Order Management System to which the user belongs.
   * A user will belong only to one OMS.
   * @param {number} startIndex The starting index into the history of trades, from `0`
   * (the most recent trade).
   * @param {number} count The number of trades to return. The system can return up to `200` trades.
   * @returns {Observable<AccountTradesResult>}
   * @memberof FoxBitClient
   */
  getAccountTrades(accountId: number, omsId: number, startIndex: number, count: number): Observable<AccountTradesResult[]> {
    const endpointName = 'GetAccountTrades';

    const param = {
      OMSId: omsId,
      AccountId: accountId,
      StartIndex: startIndex,
      Count: count
    };

    const frame = new MessageFrame(MessageType.Request, endpointName, param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

  /**
   * Returns a list of transactions for a specific account on an Order Management System.
   * The owner of the trading venue determines how long to retain order history before archiving.
   * @param {number} accountId The ID of the account for which transactions will be returned.
   * If not specified, the call returns transactions for the default account for the logged-in user
   * @param {number} omsId The ID of the Order Management System from which the account’s
   * transactions will be returned.
   * @param {number} depth The number of transactions that will be returned, starting with
   * the most recent transaction.
   * @returns {Observable<AccountTradesResult[]>}
   * @memberof FoxBitClient
   */
  getAccountTransactions(accountId: number, omsId: number, depth: number): Observable<AccountTradesResult[]> {
    const endpointName = 'GetAccountTransactions';

    const param = {
      OMSId: omsId,
      AccountId: accountId,
      Depth: depth
    };

    const frame = new MessageFrame(MessageType.Request, endpointName, param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

  /**
   * Returns an array of 0 or more orders that have not yet been filled (open orders) for a single account
   * for a given user on a specific Order Management System. The call returns an empty array if a user
   * has no open orders.
   * @param {number} accountId The ID of the authenticated user’s account
   * @param {number} omsId The ID of the Order Management System to which the user belongs.
   * A user will belong only to one OMS.
   * @returns {Observable<OpenOrdersResult>}
   * @memberof FoxBitClient
   */
  getOpenOrders(accountId: number, omsId: number): Observable<OpenOrdersResult[]> {
    const endpointName = 'GetOpenOrders';

    const param = {
      OMSId: omsId,
      AccountId: accountId
    };

    const frame = new MessageFrame(MessageType.Request, endpointName, param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

  /**
   * Creates an order. Anyone submitting an order should also subscribe to the various market data and
   * event feeds, or call GetOpenOrders or GetOrderStatus to monitor the status of the order. If the
   * order is not in a state to be executed, GetOpenOrders will not return it.
   * @param {SendOrderRequest} sendOrderRequest
   * @returns {Observable<SendOrderResult>}
   * @memberof FoxBitClient
   */
  sendOrder(sendOrderRequest: SendOrderRequest): Observable<SendOrderResult> {
    const endpointName = 'SendOrder';

    const frame = new MessageFrame(MessageType.Request, endpointName, sendOrderRequest);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

  /**
   * Returns an estimate of the fee for a specific order and order type.
   * Fees are set and calculated by the operator of the trading venue.
   * @param {OrderFeeRequest} orderFeeRequest
   * @returns {Observable<OrderFeeResult>}
   * @memberof FoxBitClient
   */
  getOrderFee(orderFeeRequest: OrderFeeRequest): Observable<OrderFeeResult> {
    const endpointName = 'GetOrderFee';

    const frame = new MessageFrame(MessageType.Request, endpointName, orderFeeRequest);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

  /**
   * Returns a complete list of all orders, both open and executed, for a specific account on the specified
   * Order Management System.
   * @param {number} accountId The ID of the Order Management System where the orders were placed
   * @param {number} omsId The ID of the account whose orders will be returned
   * @returns {Observable<OrderHistoryResult>}
   * @memberof FoxBitClient
   */
  getOrderHistory(accountId: number, omsId: number): Observable<OrderHistoryResult> {
    const endpointName = 'GetOrderHistory';

    const param = {
      OMSId: omsId,
      AccountId: accountId
    };

    const frame = new MessageFrame(MessageType.Request, endpointName, param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

  /**
   * Returns all deposit tickets that match the string/value pairs included in the request, starting at a
   * specific ticket, and returning up to a total number that can be specified in the request.
   * @param {AllDepositOrWithdrawTicketsRequest} allDepositTicketsRequest OMSId and OperatorId are required;
   * other string/value pairs are optional.
   * AmountOperator must be included if an Amount value is included.
   * @returns {Observable<AllDepositTicketsResult>}
   * @memberof FoxBitClient
   */
  getAllDepositTickets(allDepositTicketsRequest: AllDepositOrWithdrawTicketsRequest): Observable<AllDepositTicketsResult[]> {
    const endpointName = 'GetAllDepositTickets';

    const frame = new MessageFrame(MessageType.Request, endpointName, allDepositTicketsRequest);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

  getAllWithdrawTickets(allWithdrawTicketsRequest: AllDepositOrWithdrawTicketsRequest): Observable<AllWithdrawTicketsResult[]> {
    const endpointName = 'GetAllWithdrawTickets';

    const frame = new MessageFrame(MessageType.Request, endpointName, allWithdrawTicketsRequest);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

  /**
   * Returns a single deposit ticket by matching its request code to one already in the database.
   * ************
   * Only admin-level users can issue this call.
   * @param {number} omsId  The ID of the Order Management System where the withdrawal was made.
   * @param {number} operatorId  The ID of the trading venue operator on the system where
   * the withdraw was made.
   * @param {string} requestCode A GUID (globally unique ID) that identifies the specific withdrawal ticket
   * you want to return. Obtain the RequestCode from **CreateWithdrawTicket** or **GetAllWithdrawTickets**.
   * @param {number} accountId The ID of the account from which the withdrawal was made.
   * @returns {Observable<AllWithdrawTicketsResult>}
   * @memberof FoxBitClient
   */
  getDepositTicket(omsId: number, operatorId: number, requestCode: string, accountId: number): Observable<AllDepositTicketsResult> {
    const endpointName = 'GetDepositTicket';

    const param = {
      OMSId: omsId,
      OperatorId: operatorId,
      RequestCode: requestCode,
      AccountId: accountId
    };

    const frame = new MessageFrame(MessageType.Request, endpointName, param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

  /**
   * Returns a single withdraw ticket from the Order Management System, trading venue operator, and
   * account that matches the GUID (globally unique identifier) in RequestCode. Obtain the GUID from
   * the call CreateWithdrawTicket when the ticket is first created, or from GetAllWithdrawTickets,
   * another admin-level-only call. An administrator can use GetWithdrawTicket to return any single
   * withdrawal ticket in the system.
   * @param {number} omsId  The ID of the Order Management System where the withdrawal was made.
   * @param {number} operatorId  The ID of the trading venue operator on the system where
   * the withdraw was made.
   * @param {string} requestCode A GUID (globally unique ID) that identifies the specific withdrawal ticket
   * you want to return. Obtain the RequestCode from **CreateWithdrawTicket** or **GetAllWithdrawTickets**.
   * @param {number} accountId The ID of the account from which the withdrawal was made.
   * @returns {Observable<AllWithdrawTicketsResult>}
   * @memberof FoxBitClient
   */
  getWithdrawTicket(omsId: number, operatorId: number, requestCode: string, accountId: number): Observable<AllWithdrawTicketsResult> {
    const endpointName = 'GetWithdrawTicket';

    const param = {
      OMSId: omsId,
      OperatorId: operatorId,
      RequestCode: requestCode,
      AccountId: accountId
    };

    const frame = new MessageFrame(MessageType.Request, endpointName, param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

  /**
   * Retrieves the latest public market trades and Subscribes User to Trade updates for the
   * specified Instrument.
   * ******************
   * **When subscribed to Trades, you will receive TradeDataUpdateEvent messages from the server**
   * @param {number} omsId Order Management System ID
   * @param {number} instrumentId Instrument's Identifier
   * @param {number} [includeLastCount=100] Specifies the number of previous trades to
   * retrieve in the immediate snapshot. Default is 100.
   * @returns {Observable<SubscriptionTradesResponse[]>}
   * @memberof FoxBitClient
   */
  subscribeTrades(omsId: number, instrumentId: number, includeLastCount: number = 100): Observable<SubscriptionTradesResponse[]> {
    const endpointName = 'SubscribeTrades';
    const param = {
      OMSId: omsId,
      InstrumentId: instrumentId,
      IncludeLastCount: includeLastCount,
    };

    const frame = new MessageFrame(MessageType.Request, endpointName, param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.pipe(
      map((trades: number[][]) => {
        const tradesResponse: SubscriptionTradesResponse[] = [];

        for (const snapshot of trades) {
          tradesResponse.push({
            TradeId: snapshot[0],
            InstrumentId: snapshot[1],
            Quantity: snapshot[2],
            Price: snapshot[3],
            Order1: snapshot[4],
            Order2: snapshot[5],
            Tradetime: snapshot[6],
            Direction: snapshot[7],
            TakerSide: snapshot[8],
            BlockTrade: !!snapshot[9],
            Order1or2ClientId: snapshot[10]
          });
        }

        return tradesResponse;
      })
    );
  }

  unsubscribeTrades(omsId: number, instrumentId: number): Observable<GenericResponse> {
    const endpointName = 'UnsubscribeTrades';
    const param = {
      OMSId: omsId,
      InstrumentId: instrumentId
    };

    const frame = new MessageFrame(MessageType.Request, endpointName, param);

    this.prepareAndSendFrame(frame);

    return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
  }

}
