import { Observable } from 'rxjs';
import { AccountFeesResponse, AuthenticateResponse, GenericResponse, InstrumentResponse, L2SnapshotResponse, ProductResponse, SubscriptionL2Response, SubscriptionLevel1Response, SubscriptionTickerResponse, UserInfoResponse } from './message-result';
export declare class FoxBitClient {
    private sequenceByMessageType;
    private endpointDescriptorByMethod;
    private socket;
    constructor();
    private connectSubject;
    /**
     * Connect to FoxBit websocket endpoint
     *
     * @param {string} [url='wss://apifoxbitprodlb.alphapoint.com/WSGateway/']
     * @returns {Observable<boolean>}
     * @memberof FoxBitClient
     */
    connect(url?: string): Observable<boolean>;
    /**
     * Discover if websocket connection is open
     *
     * @readonly
     * @type {boolean}
     * @memberof FoxBitClient
     */
    readonly isConnected: boolean;
    /**
     * Disconnect from FoxBit websocket connection
     *
     * @memberof FoxBitClient
     */
    disconnect(): void;
    private initEventHandlers;
    private calculateMessageFrameSequence;
    private prepareAndSendFrame;
    /**
     * Logout ends the current websocket session
     * **********************
     * Endpoint Type: Public
     * @returns {Observable<any>}
     * @memberof FoxBitClient
     */
    logOut(): Observable<any>;
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
    logIn(username: string, password: string): Observable<AuthenticateResponse>;
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
    resetPassword(username: string): Observable<GenericResponse>;
    /**
     * Retrieves Fee structure for specific Account
     * **********************
     * Endpoint Type: Public
     * @param {number} accountId The ID of the account for which information was requested.
     * @param {number} omsId The ID of the Order Management System that includes the product.
     * @returns {Observable<AccountFeesResponse[]>}
     * @memberof FoxBitClient
     */
    getAccountFees(accountId: number, omsId: number): Observable<AccountFeesResponse[]>;
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
    getProduct(omsId: number, productId: number): Observable<ProductResponse>;
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
    getInstrument(omsId: number, instrumentId: number): Observable<InstrumentResponse>;
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
    getInstruments(omsId: number): Observable<InstrumentResponse[]>;
    /**
     * Returns an array of products available on the trading venue. A product is an asset that is tradable
     * or paid out
     * **********************
     * Endpoint Type: Public
     * @param {number} omsId The ID of the Order Management System that includes the product
     * @returns {Observable<ProductResponse[]>}
     * @memberof FoxBitClient
     */
    getProducts(omsId: number): Observable<ProductResponse[]>;
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
    getL2Snapshot(omsId: number, instrumentId: number, depth?: number): Observable<L2SnapshotResponse[]>;
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
    getTickerHistory(instrumentId: number, fromDate: Date): Observable<SubscriptionTickerResponse[]>;
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
    subscribeLevel1(omsId: number, instrumentIdOrSymbol: number | string): Observable<SubscriptionLevel1Response>;
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
    subscribeLevel2(omsId: number, instrumentIdOrSymbol: number | string, depth: number): Observable<SubscriptionL2Response>;
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
    subscribeTicker(omsId: number, instrumentId: number, interval?: number, includeLastCount?: number): Observable<SubscriptionTickerResponse>;
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
    unsubscribeLevel1(omsId: number, instrumentId: number): Observable<GenericResponse>;
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
    unsubscribeLevel2(omsId: number, instrumentId: number): Observable<GenericResponse>;
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
    unsubscribeTicker(omsId: number, instrumentId: number): Observable<GenericResponse>;
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
    getAvailablePermissionList(): Observable<string[]>;
    /**
     * **GetUserConfig** returns the list of key/value pairs set by the **SetUserConfig** call and associated with
     * a user record. A trading venue can use Config strings to store custom information or compliance
     * information with a user record.
     *
     * @returns {Observable<Array<{ Key: string, Value: string }>>}
     * @memberof FoxBitClient
     */
    getUserConfig(): Observable<Array<{
        Key: string;
        Value: string;
    }>>;
    /**
     * Retrieves basic information about a user from the Order Management System. A user may only see
     * information about himself; an administrator (or superuser) may see, enter, or change information
     * about other users
     *
     * @returns {Observable<UserInfoResponse>}
     * @memberof FoxBitClient
     */
    getUserInfo(): Observable<UserInfoResponse>;
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
    getUserPermissions(userId: number): Observable<string[]>;
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
    removeUserConfig(userId: number, userName: string, key: string): Observable<GenericResponse>;
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
    setUserConfig(userId: number, userName: string, config: Array<{
        Key: string;
        Value: string;
    }>): Observable<GenericResponse>;
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
    setUserInfo(userId: number, userName: string, password: string, email: string, emailVerified: boolean, accountId: number, use2FA: boolean): Observable<UserInfoResponse>;
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
    cancelAllOrders(omsId: number, accountId?: number, userId?: number, instrumentId?: number): Observable<GenericResponse>;
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
    cancelOrder(omsId: number, accountId?: number, clientOrderId?: number, orderId?: number): Observable<GenericResponse>;
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
    cancelQuote(omsId: number, bidQuoteId: number, askQuoteId: number, accountId?: number, instrumentId?: number): Observable<GenericResponse>;
}
