"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var date_fns_1 = require("date-fns");
var reconnecting_websocket_1 = __importDefault(require("reconnecting-websocket"));
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var ws_1 = __importDefault(require("ws"));
var api_descriptors_1 = require("./api-descriptors");
var log_service_1 = require("./log-service");
var message_enums_1 = require("./message-enums");
var message_frame_1 = require("./message-frame");
var FoxBitClient = /** @class */ (function () {
    function FoxBitClient() {
        this.sequenceByMessageType = {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
        };
        this.endpointDescriptorByMethod = {
            // Privado
            GetAvailablePermissionList: new api_descriptors_1.EndpointMethodDescriptor(),
            GetUserConfig: new api_descriptors_1.EndpointMethodDescriptor(),
            GetUserInfo: new api_descriptors_1.EndpointMethodDescriptor(),
            GetUserPermissions: new api_descriptors_1.EndpointMethodDescriptor(),
            RemoveUserConfig: new api_descriptors_1.EndpointMethodDescriptor(),
            SetUserConfig: new api_descriptors_1.EndpointMethodDescriptor(),
            SetUserInfo: new api_descriptors_1.EndpointMethodDescriptor(),
            CancelAllOrders: new api_descriptors_1.EndpointMethodDescriptor(),
            CancelOrder: new api_descriptors_1.EndpointMethodDescriptor(),
            CancelQuote: new api_descriptors_1.EndpointMethodDescriptor(),
            CancelReplaceOrder: new api_descriptors_1.EndpointMethodDescriptor(),
            GetAccountInfo: new api_descriptors_1.EndpointMethodDescriptor(),
            GetAccountPositions: new api_descriptors_1.EndpointMethodDescriptor(),
            GetAccountTrades: new api_descriptors_1.EndpointMethodDescriptor(),
            GetAccountTransactions: new api_descriptors_1.EndpointMethodDescriptor(),
            GetOpenOrders: new api_descriptors_1.EndpointMethodDescriptor(),
            SendOrder: new api_descriptors_1.EndpointMethodDescriptor(),
            GetOrderFee: new api_descriptors_1.EndpointMethodDescriptor(),
            GetOrderHistory: new api_descriptors_1.EndpointMethodDescriptor(),
            GetAllDepositTickets: new api_descriptors_1.EndpointMethodDescriptor(),
            GetAllWithdrawTickets: new api_descriptors_1.EndpointMethodDescriptor(),
            GetDepositTicket: new api_descriptors_1.EndpointMethodDescriptor(),
            GetWithdrawTicket: new api_descriptors_1.EndpointMethodDescriptor(),
            // publico
            Authenticate2FA: {
                methodReplyType: api_descriptors_1.EndpointMethodReplyType.Response,
                methodSubject: new rxjs_1.Subject(),
                methodType: api_descriptors_1.EndpointMethodType.Public,
            },
            WebAuthenticateUser: {
                methodReplyType: api_descriptors_1.EndpointMethodReplyType.Response,
                methodSubject: new rxjs_1.Subject(),
                methodType: api_descriptors_1.EndpointMethodType.Public,
            },
            LogOut: {
                methodReplyType: api_descriptors_1.EndpointMethodReplyType.Response,
                methodSubject: new rxjs_1.Subject(),
                methodType: api_descriptors_1.EndpointMethodType.Public,
            },
            ResetPassword: {
                methodReplyType: api_descriptors_1.EndpointMethodReplyType.Response,
                methodSubject: new rxjs_1.Subject(),
                methodType: api_descriptors_1.EndpointMethodType.Public,
            },
            GetAccountFees: {
                methodReplyType: api_descriptors_1.EndpointMethodReplyType.Response,
                methodSubject: new rxjs_1.Subject(),
                methodType: api_descriptors_1.EndpointMethodType.Public,
            },
            GetInstrument: {
                methodReplyType: api_descriptors_1.EndpointMethodReplyType.Response,
                methodSubject: new rxjs_1.Subject(),
                methodType: api_descriptors_1.EndpointMethodType.Public,
            },
            GetInstruments: {
                methodReplyType: api_descriptors_1.EndpointMethodReplyType.Response,
                methodSubject: new rxjs_1.Subject(),
                methodType: api_descriptors_1.EndpointMethodType.Public,
            },
            GetProduct: {
                methodReplyType: api_descriptors_1.EndpointMethodReplyType.Response,
                methodSubject: new rxjs_1.Subject(),
                methodType: api_descriptors_1.EndpointMethodType.Public,
            },
            GetProducts: {
                methodReplyType: api_descriptors_1.EndpointMethodReplyType.Response,
                methodSubject: new rxjs_1.Subject(),
                methodType: api_descriptors_1.EndpointMethodType.Public,
            },
            GetL2Snapshot: {
                methodReplyType: api_descriptors_1.EndpointMethodReplyType.Response,
                methodSubject: new rxjs_1.Subject(),
                methodType: api_descriptors_1.EndpointMethodType.Public,
            },
            GetTickerHistory: {
                methodReplyType: api_descriptors_1.EndpointMethodReplyType.Response,
                methodSubject: new rxjs_1.Subject(),
                methodType: api_descriptors_1.EndpointMethodType.Public,
            },
            SubscribeLevel1: {
                methodReplyType: api_descriptors_1.EndpointMethodReplyType.ResponseAndEvent,
                methodSubject: new rxjs_1.Subject(),
                methodType: api_descriptors_1.EndpointMethodType.Public,
                associatedEvent: 'Level1UpdateEvent',
            },
            SubscribeLevel2: {
                methodReplyType: api_descriptors_1.EndpointMethodReplyType.ResponseAndEvent,
                methodSubject: new rxjs_1.Subject(),
                methodType: api_descriptors_1.EndpointMethodType.Public,
                associatedEvent: 'Level2UpdateEvent',
            },
            SubscribeTicker: {
                methodReplyType: api_descriptors_1.EndpointMethodReplyType.ResponseAndEvent,
                methodSubject: new rxjs_1.Subject(),
                methodType: api_descriptors_1.EndpointMethodType.Public,
            },
            UnsubscribeLevel1: {
                methodReplyType: api_descriptors_1.EndpointMethodReplyType.Response,
                methodSubject: new rxjs_1.Subject(),
                methodType: api_descriptors_1.EndpointMethodType.Public,
            },
            UnsubscribeLevel2: {
                methodReplyType: api_descriptors_1.EndpointMethodReplyType.Response,
                methodSubject: new rxjs_1.Subject(),
                methodType: api_descriptors_1.EndpointMethodType.Public,
            },
            UnsubscribeTicker: {
                methodReplyType: api_descriptors_1.EndpointMethodReplyType.Response,
                methodSubject: new rxjs_1.Subject(),
                methodType: api_descriptors_1.EndpointMethodType.Public,
            },
            SubscribeTrades: {
                methodReplyType: api_descriptors_1.EndpointMethodReplyType.ResponseAndEvent,
                methodSubject: new rxjs_1.Subject(),
                methodType: api_descriptors_1.EndpointMethodType.Public,
            },
            UnsubscribeTrades: {
                methodReplyType: api_descriptors_1.EndpointMethodReplyType.Response,
                methodSubject: new rxjs_1.Subject(),
                methodType: api_descriptors_1.EndpointMethodType.Public,
            },
        };
        this.mapTicker = function (ticks) {
            var typedTicks = [];
            for (var _i = 0, ticks_1 = ticks; _i < ticks_1.length; _i++) {
                var tick = ticks_1[_i];
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
        };
        // Only alias for SubscribeLevel1
        this.endpointDescriptorByMethod['Level1UpdateEvent'] = this.endpointDescriptorByMethod['SubscribeLevel1'];
        // Only alias for SubscribeLevel2
        this.endpointDescriptorByMethod['Level2UpdateEvent'] = this.endpointDescriptorByMethod['SubscribeLevel2'];
        // Only alias for SubscribeTicker
        this.endpointDescriptorByMethod['TickerDataUpdateEvent'] = this.endpointDescriptorByMethod['SubscribeTicker'];
        this.endpointDescriptorByMethod['TradeDataUpdateEvent'] = this.endpointDescriptorByMethod['SubscribeTrades'];
    }
    /**
     * Connect to FoxBit websocket endpoint
     *
     * @param {string} [url='wss://apifoxbitprodlb.alphapoint.com/WSGateway/']
     * @returns {Observable<boolean>}
     * @memberof FoxBitClient
     */
    FoxBitClient.prototype.connect = function (url) {
        if (url === void 0) { url = 'wss://apifoxbitprodlb.alphapoint.com/WSGateway/'; }
        try {
            this.connectSubject = new rxjs_1.Subject();
            var logEnabled = process.env.LOG_ENABLED === 'true';
            this.socket = new reconnecting_websocket_1.default(url, [], {
                WebSocket: ws_1.default,
                debug: logEnabled,
            });
            this.initEventHandlers();
        }
        catch (err) {
            this.connectSubject.error(err);
            this.connectSubject.complete();
        }
        return this.connectSubject.asObservable();
    };
    Object.defineProperty(FoxBitClient.prototype, "isConnected", {
        /**
         * Discover if websocket connection is open
         *
         * @readonly
         * @type {boolean}
         * @memberof FoxBitClient
         */
        get: function () {
            return this.socket && this.socket.readyState === ws_1.default.OPEN;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Disconnect from FoxBit websocket connection
     *
     * @memberof FoxBitClient
     */
    FoxBitClient.prototype.disconnect = function () {
        if (this.isConnected) {
            this.socket.close();
        }
    };
    FoxBitClient.prototype.initEventHandlers = function () {
        var _this = this;
        this.socket.addEventListener('open', function () {
            log_service_1.wsLogger.info('Conexão iniciada com sucesso!');
            _this.connectSubject.next(true);
            _this.connectSubject.complete();
        });
        this.socket.addEventListener('message', function (message) {
            var data = message.data;
            log_service_1.wsLogger.info('Mensagem recebida (raw)', data);
            var response = JSON.parse(data);
            response.o = response.o && JSON.parse(response.o);
            log_service_1.wsLogger.info('Mensagem recebida (parsed)', response);
            var endpointDescriptorByMethod = _this.endpointDescriptorByMethod[response.n];
            if (response.o.hasOwnProperty('errorcode') && response.o.hasOwnProperty('result') && response.o.errorcode) {
                // GenericResponse
                var err = response.o;
                endpointDescriptorByMethod.methodSubject.error(new Error(response.o.errorcode + " - " + err.errormsg + ". " + err.detail));
                endpointDescriptorByMethod.methodSubject.complete();
            }
            else {
                endpointDescriptorByMethod.methodSubject.next(response.o);
            }
            if (endpointDescriptorByMethod.methodReplyType === api_descriptors_1.EndpointMethodReplyType.Response) {
                endpointDescriptorByMethod.methodSubject.complete();
                endpointDescriptorByMethod.methodSubject = new rxjs_1.Subject();
            }
        });
        this.socket.addEventListener('error', function (err) {
            log_service_1.wsLogger.error("[Socket Error] " + err.type + " - " + err.message + " - " + err.target, err.error);
            _this.connectSubject.error(err);
            _this.connectSubject.complete();
            for (var prop in _this.endpointDescriptorByMethod) {
                if (_this.endpointDescriptorByMethod.hasOwnProperty(prop)) {
                    var endpointDescriptor = _this.endpointDescriptorByMethod[prop];
                    endpointDescriptor.methodSubject.error(err);
                    endpointDescriptor.methodSubject.complete();
                }
            }
        });
        this.socket.addEventListener('close', function (closeEvent) {
            var code = closeEvent.code;
            var reason = closeEvent.reason;
            if (code > 1000) {
                log_service_1.wsLogger.error('Socket closed: %d-%s', code, reason);
            }
            else {
                log_service_1.wsLogger.info('Socket closed normally', code, reason);
            }
            for (var prop in _this.endpointDescriptorByMethod) {
                if (_this.endpointDescriptorByMethod.hasOwnProperty(prop)) {
                    var endpointDescriptor = _this.endpointDescriptorByMethod[prop];
                    if (code !== 0) {
                        endpointDescriptor.methodSubject.error(reason);
                    }
                    endpointDescriptor.methodSubject.complete();
                }
            }
        });
    };
    FoxBitClient.prototype.calculateMessageFrameSequence = function (messageFrame) {
        switch (messageFrame.messageType) {
            case message_enums_1.MessageType.Request:
            case message_enums_1.MessageType.Subscribe:
            case message_enums_1.MessageType.Unsubscribe:
                this.sequenceByMessageType[messageFrame.messageType] += 2;
                messageFrame.sequence = this.sequenceByMessageType[messageFrame.messageType];
                break;
            default:
                this.sequenceByMessageType[messageFrame.messageType] += 1;
                messageFrame.sequence = this.sequenceByMessageType[messageFrame.messageType];
                break;
        }
    };
    FoxBitClient.prototype.prepareAndSendFrame = function (frame) {
        this.calculateMessageFrameSequence(frame);
        var strLoginFrame = JSON.stringify(frame);
        log_service_1.wsLogger.info('Envio de Frame', frame);
        this.socket.send(strLoginFrame);
    };
    /**
     * Logout ends the current websocket session
     * **********************
     * Endpoint Type: Public
     * @returns {Observable<boolean>}
     * @memberof FoxBitClient
     */
    FoxBitClient.prototype.logOut = function () {
        var _this = this;
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, 'LogOut', {});
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod['LogOut'].methodSubject.pipe(operators_1.concatMap(function (val) {
            _this.disconnect();
            return rxjs_1.of(val);
        }));
    };
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
    FoxBitClient.prototype.webAuthenticateUser = function (username, password) {
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, 'WebAuthenticateUser', {
            Username: username,
            Password: password,
        });
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod['WebAuthenticateUser'].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.authenticate2FA = function (code, sessionToken) {
        var endpointName = 'Authenticate2FA';
        var param;
        if (sessionToken) {
            param = {
                SessionToken: sessionToken,
            };
        }
        else {
            param = {
                Code: code,
            };
        }
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.resetPassword = function (username) {
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, 'ResetPassword', {
            UserName: username,
        });
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod['ResetPassword'].methodSubject.asObservable();
    };
    /**
     * Retrieves Fee structure for specific Account
     * **********************
     * Endpoint Type: Public
     * @param {number} accountId The ID of the account for which information was requested.
     * @param {number} omsId The ID of the Order Management System that includes the product.
     * @returns {Observable<AccountFeesResponse[]>}
     * @memberof FoxBitClient
     */
    FoxBitClient.prototype.getAccountFees = function (accountId, omsId) {
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, 'GetAccountFees', {
            AccountId: accountId,
            OMSId: omsId,
        });
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod['GetAccountFees'].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.getProduct = function (omsId, productId) {
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, 'GetProduct', {
            OMSId: omsId,
            ProductId: productId,
        });
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod['GetProduct'].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.getInstrument = function (omsId, instrumentId) {
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, 'GetInstrument', {
            OMSId: omsId,
            InstrumentId: instrumentId,
        });
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod['GetInstrument'].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.getInstruments = function (omsId) {
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, 'GetInstruments', {
            OMSId: omsId,
        });
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod['GetInstruments'].methodSubject.asObservable();
    };
    /**
     * Returns an array of products available on the trading venue. A product is an asset that is tradable
     * or paid out
     * **********************
     * Endpoint Type: Public
     * @param {number} omsId The ID of the Order Management System that includes the product
     * @returns {Observable<ProductResponse[]>}
     * @memberof FoxBitClient
     */
    FoxBitClient.prototype.getProducts = function (omsId) {
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, 'GetProducts', {
            OMSId: omsId,
        });
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod['GetProducts'].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.getL2Snapshot = function (omsId, instrumentId, depth) {
        if (depth === void 0) { depth = 100; }
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, 'GetL2Snapshot', {
            OMSId: omsId,
            InstrumentId: instrumentId,
            Depth: depth,
        });
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod['GetL2Snapshot'].methodSubject.pipe(operators_1.map(function (snapshots) {
            var snapshotsResponse = [];
            for (var _i = 0, snapshots_1 = snapshots; _i < snapshots_1.length; _i++) {
                var snapshot = snapshots_1[_i];
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
                    Side: snapshot[9],
                });
            }
            return snapshotsResponse;
        }));
    };
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
    FoxBitClient.prototype.getTickerHistory = function (omsId, instrumentId, fromDate, toDate, interval) {
        if (toDate === void 0) { toDate = new Date(); }
        if (interval === void 0) { interval = 60; }
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, 'GetTickerHistory', {
            OMSId: omsId,
            InstrumentId: instrumentId,
            FromDate: date_fns_1.format(fromDate, "yyyy-MM-dd'T'hh:mm:ssZ"),
            ToDate: date_fns_1.format(toDate, "yyyy-MM-dd'T'hh:mm:ssZ"),
            Interval: interval,
        });
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod['GetTickerHistory'].methodSubject.pipe(operators_1.map(this.mapTicker));
    };
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
    FoxBitClient.prototype.subscribeLevel1 = function (omsId, instrumentIdOrSymbol) {
        var param;
        if (typeof instrumentIdOrSymbol === 'number') {
            param = {
                OMSId: omsId,
                InstrumentId: instrumentIdOrSymbol,
            };
        }
        else {
            param = {
                OMSId: omsId,
                Symbol: instrumentIdOrSymbol,
            };
        }
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, 'SubscribeLevel1', param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod['SubscribeLevel1'].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.subscribeLevel2 = function (omsId, instrumentIdOrSymbol, depth) {
        if (depth === void 0) { depth = 300; }
        var param;
        if (typeof instrumentIdOrSymbol === 'number') {
            param = {
                OMSId: omsId,
                InstrumentId: instrumentIdOrSymbol,
                Depth: depth,
            };
        }
        else {
            param = {
                OMSId: omsId,
                Symbol: instrumentIdOrSymbol,
                Depth: depth,
            };
        }
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, 'SubscribeLevel2', param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod['SubscribeLevel2'].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.subscribeTicker = function (omsId, instrumentId, interval, includeLastCount) {
        if (interval === void 0) { interval = 60; }
        if (includeLastCount === void 0) { includeLastCount = 100; }
        var param = {
            OMSId: omsId,
            InstrumentId: instrumentId,
            Interval: interval,
            IncludeLastCount: includeLastCount,
        };
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, 'SubscribeTicker', param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod['SubscribeTicker'].methodSubject.pipe(operators_1.map(this.mapTicker));
    };
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
    FoxBitClient.prototype.unsubscribeLevel1 = function (omsId, instrumentId) {
        var param = {
            OMSId: omsId,
            InstrumentId: instrumentId,
        };
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, 'UnsubscribeLevel1', param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod['UnsubscribeLevel1'].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.unsubscribeLevel2 = function (omsId, instrumentId) {
        var param = {
            OMSId: omsId,
            InstrumentId: instrumentId,
        };
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, 'UnsubscribeLevel2', param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod['UnsubscribeLevel2'].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.unsubscribeTicker = function (omsId, instrumentId) {
        var param = {
            OMSId: omsId,
            InstrumentId: instrumentId,
        };
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, 'UnsubscribeTicker', param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod['UnsubscribeTicker'].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.getUserConfig = function () {
        var endpointName = 'GetUserConfig';
        var param = {};
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
    /**
     * Retrieves basic information about a user from the Order Management System. A user may only see
     * information about himself; an administrator (or superuser) may see, enter, or change information
     * about other users
     *
     * @returns {Observable<UserInfoResponse>}
     * @memberof FoxBitClient
     */
    FoxBitClient.prototype.getUserInfo = function () {
        var endpointName = 'GetUserInfo';
        var param = {};
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.getUserPermissions = function (userId) {
        var endpointName = 'GetUserPermissions';
        var param = {
            UserId: userId,
        };
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.removeUserConfig = function (userId, userName, key) {
        var endpointName = 'RemoveUserConfig';
        var param = {
            UserId: userId,
            UserName: userName,
            Key: key,
        };
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.setUserConfig = function (userId, userName, config) {
        var endpointName = 'SetUserConfig';
        var param = {
            UserId: userId,
            UserName: userName,
            Config: config,
        };
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.setUserInfo = function (userId, userName, password, email, emailVerified, accountId, use2FA) {
        var endpointName = 'SetUserInfo';
        var param = {
            UserId: userId,
            UserName: userName,
            Password: password,
            Email: email,
            EmailVerified: emailVerified,
            AccountId: accountId,
            Use2FA: use2FA,
        };
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
    /**
     * Cancels all open matching orders for the specified instrument, account, user (subject to permission level)
     * or a combination of them on a specific Order Management System.
     * User and account permissions govern cancellation actions.
     *
     * | UserId 37 | AccId 14 | Instr 25 |                                    Result                                   |
     * |:---------:|:--------:|:--------:|:---------------------------------------------------------------------------:|
     * |     X     |     X    |     X    | Account #14 belonging to user #37 for instrument #25.                       |
     * |     X     |     X    |          | Account #14 belonging to user #37 for all instruments.                      |
     * |     X     |          |     X    | All accounts belonging to user #37 for instrument #25.                      |
     * |     X     |          |          | All accounts belonging to user #37 for all instruments.                     |
     * |           |     X    |     X    | All users of account #14 for instrument #25.                                |
     * |           |     X    |          | All users of account #14 for all instruments.                               |
     * |           |          |     X    | All accounts of all users for instrument #25. (requires special permission) |
     * |           |          |          | All accounts of all users for all instruments (requires special permission) |
     *
     * @param {number} omsId The Order Management System under which the account operates.Required
     * @param {number} [accountId] The account for which all orders are being canceled. Conditionally optional.
     * @param {number} [userId] The ID of the user whose orders are being canceled. Conditionally optional.
     * @param {number} [instrumentId] The ID of the instrument for which all orders are being cancelled. Conditionally optional.
     * @returns {Observable<UserInfoResponse>}
     * @memberof FoxBitClient
     */
    FoxBitClient.prototype.cancelAllOrders = function (omsId, accountId, userId, instrumentId) {
        var endpointName = 'CancelAllOrders';
        var param = {
            UserId: userId,
            AccountId: accountId,
            InstrumentId: instrumentId,
            OMSId: omsId,
        };
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.cancelOrder = function (omsId, accountId, orderId, clientOrderId) {
        if (clientOrderId === void 0) { clientOrderId = null; }
        var endpointName = 'CancelOrder';
        var param = {
            OMSId: omsId,
            AccountId: accountId,
            OrderId: orderId,
        };
        if (clientOrderId != null) {
            param.ClientOrderId = clientOrderId;
        }
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.cancelQuote = function (omsId, bidQuoteId, askQuoteId, accountId, instrumentId) {
        var endpointName = 'CancelQuote';
        var param = {
            OMSId: omsId,
            BidQuoteId: bidQuoteId,
            AskQuoteId: askQuoteId,
            AccountId: accountId,
            InstrumentId: instrumentId,
        };
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.cancelReplaceOrder = function (cancelReplaceOrderReq) {
        var endpointName = 'CancelReplaceOrder';
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, cancelReplaceOrderReq);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.getAccountInfo = function (omsId, accountId, accountHandle) {
        var endpointName = 'GetAccountInfo';
        var param = {
            OMSId: omsId,
            AccountId: accountId,
            AccountHandle: accountHandle,
        };
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.getAccountPositions = function (accountId, omsId) {
        var endpointName = 'GetAccountPositions';
        var param = {
            OMSId: omsId,
            AccountId: accountId,
        };
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.getAccountTrades = function (accountId, omsId, startIndex, count) {
        var endpointName = 'GetAccountTrades';
        var param = {
            OMSId: omsId,
            AccountId: accountId,
            StartIndex: startIndex,
            Count: count,
        };
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.getAccountTransactions = function (accountId, omsId, depth) {
        var endpointName = 'GetAccountTransactions';
        var param = {
            OMSId: omsId,
            AccountId: accountId,
            Depth: depth,
        };
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.getOpenOrders = function (accountId, omsId) {
        var endpointName = 'GetOpenOrders';
        var param = {
            OMSId: omsId,
            AccountId: accountId,
        };
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
    /**
     * Creates an order. Anyone submitting an order should also subscribe to the various market data and
     * event feeds, or call GetOpenOrders or GetOrderStatus to monitor the status of the order. If the
     * order is not in a state to be executed, GetOpenOrders will not return it.
     * @param {SendOrderRequest} sendOrderRequest
     * @returns {Observable<SendOrderResult>}
     * @memberof FoxBitClient
     */
    FoxBitClient.prototype.sendOrder = function (sendOrderRequest) {
        var endpointName = 'SendOrder';
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, sendOrderRequest);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
    /**
     * Returns an estimate of the fee for a specific order and order type.
     * Fees are set and calculated by the operator of the trading venue.
     * @param {OrderFeeRequest} orderFeeRequest
     * @returns {Observable<OrderFeeResult>}
     * @memberof FoxBitClient
     */
    FoxBitClient.prototype.getOrderFee = function (orderFeeRequest) {
        var endpointName = 'GetOrderFee';
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, orderFeeRequest);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
    /**
     * Returns a complete list of all orders, both open and executed, for a specific account on the specified
     * Order Management System.
     * @param {number} accountId The ID of the Order Management System where the orders were placed
     * @param {number} omsId The ID of the account whose orders will be returned
     * @returns {Observable<OrderHistoryResult>}
     * @memberof FoxBitClient
     */
    FoxBitClient.prototype.getOrderHistory = function (accountId, omsId) {
        var endpointName = 'GetOrderHistory';
        var param = {
            OMSId: omsId,
            AccountId: accountId,
        };
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
    /**
     * Returns all deposit tickets that match the string/value pairs included in the request, starting at a
     * specific ticket, and returning up to a total number that can be specified in the request.
     * @param {AllDepositOrWithdrawTicketsRequest} allDepositTicketsRequest OMSId and OperatorId are required;
     * other string/value pairs are optional.
     * AmountOperator must be included if an Amount value is included.
     * @returns {Observable<AllDepositTicketsResult>}
     * @memberof FoxBitClient
     */
    FoxBitClient.prototype.getAllDepositTickets = function (allDepositTicketsRequest) {
        var endpointName = 'GetAllDepositTickets';
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, allDepositTicketsRequest);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
    FoxBitClient.prototype.getAllWithdrawTickets = function (allWithdrawTicketsRequest) {
        var endpointName = 'GetAllWithdrawTickets';
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, allWithdrawTicketsRequest);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.getDepositTicket = function (omsId, operatorId, requestCode, accountId) {
        var endpointName = 'GetDepositTicket';
        var param = {
            OMSId: omsId,
            OperatorId: operatorId,
            RequestCode: requestCode,
            AccountId: accountId,
        };
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.getWithdrawTicket = function (omsId, operatorId, requestCode, accountId) {
        var endpointName = 'GetWithdrawTicket';
        var param = {
            OMSId: omsId,
            OperatorId: operatorId,
            RequestCode: requestCode,
            AccountId: accountId,
        };
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
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
    FoxBitClient.prototype.subscribeTrades = function (omsId, instrumentId, includeLastCount) {
        if (includeLastCount === void 0) { includeLastCount = 100; }
        var endpointName = 'SubscribeTrades';
        var param = {
            OMSId: omsId,
            InstrumentId: instrumentId,
            IncludeLastCount: includeLastCount,
        };
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.pipe(operators_1.map(function (trades) {
            var tradesResponse = [];
            for (var _i = 0, trades_1 = trades; _i < trades_1.length; _i++) {
                var snapshot = trades_1[_i];
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
                    Order1or2ClientId: snapshot[10],
                });
            }
            return tradesResponse;
        }));
    };
    /**
     * Unsubscribes a user from the Trades Market Data Feed.
     * @param {number} omsId The ID of the Order Management System on which the user has
     * subscribed to a trades market data feed.
     * @param {number} instrumentId The ID of the instrument being tracked by the trades
     * market data feed.
     * @returns {Observable<GenericResponse>}
     * @memberof FoxBitClient
     */
    FoxBitClient.prototype.unsubscribeTrades = function (omsId, instrumentId) {
        var endpointName = 'UnsubscribeTrades';
        var param = {
            OMSId: omsId,
            InstrumentId: instrumentId,
        };
        var frame = new message_frame_1.MessageFrame(message_enums_1.MessageType.Request, endpointName, param);
        this.prepareAndSendFrame(frame);
        return this.endpointDescriptorByMethod[endpointName].methodSubject.asObservable();
    };
    return FoxBitClient;
}());
exports.FoxBitClient = FoxBitClient;
//# sourceMappingURL=foxbit-client.js.map