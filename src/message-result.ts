/**
 * Generic response
 * @interface GenericResponse
 */
export interface GenericResponse {

  /**
   * If the call has been successfully received by the Order Management System,
   * result is true; otherwise, it is false.
   * @type {boolean}
   * @memberof GenericResponse
   */
  result: boolean;

  /**
   * A successful receipt of the call returns null; the errormsg parameter for an unsuccessful call returns one of the following messages:
   * - Not Authorized (errorcode 20)
   * - Invalid Request (errorcode 100)
   * - Operation Failed (errorcode 101)
   * - Server Error (errorcode 102)
   * - Resource Not Found (errorcode 104)
   * @type {string}
   * @memberof GenericResponse
   */
  errormsg: string;

  /**
   * A successful receipt of the call returns 0.
   * An unsuccessful receipt of the call returns one of the errorcodes
   * shown in the errormsg list.
   * - Not Authorized (errorcode 20)
   * - Invalid Request (errorcode 100)
   * - Operation Failed (errorcode 101)
   * - Server Error (errorcode 102)
   * - Resource Not Found (errorcode 104)
   * @type {number}
   * @memberof GenericResponse
   */
  errorcode?: number;

  /**
   * Message text that the system may send.
   * The content of this parameter is usually null.
   * @type {string}
   * @memberof GenericResponse
   */
  detail: string;
}

export interface AccountFeesResponse {
  FeeId: number;
  FeeAmt: number;
  FeeCalcType: string;
  FeeType: string;
  LadderThreshold: number;
  LadderSeconds: number;
  IsActive: boolean;
  InstrumentId: number;
  OrderType: string;
  OMSId: number;
  AccountId: number;
}

export enum InstrumentType {
  Unknown = 0,
  Standard = 1,
}

export enum SessionStatus {
  Unknown = 0,
  Running = 1,
  Paused = 2,
  Stopped = 3,
  Starting = 4,
}

export enum ProductType {
  Unknown = 0,
  NationalCurrency = 1,
  CryptoCurrency = 2,
  Contract = 3,
}

export enum Side {
  Buy = 0,
  Sell = 1,
  Short = 2,
  Unknown = 3,
}

export interface AuthenticateResponse {
  Authenticated: boolean;
  SessionToken: string;
  UserId: number;
  twoFaToken: string;
}
export interface InstrumentResponse {
  OMSId: number;
  InstrumentId: number;
  Symbol: string;
  Product1: number;
  Product1Symbol: string;
  Product2: number;
  Product2Symbol: string;
  InstrumentType: InstrumentType;
  VenueInstrumentId: number;
  VenueId: number;
  SortIndex: number;
  SessionStatus: SessionStatus;
  PreviousSessionStatus: SessionStatus;
  SessionStatusDateTime: Date;
  SelfTradePrevention: boolean;
  QuantityIncrement: number;
}

export interface ProductResponse {
  OMSId: number;
  ProductId: number;
  Product: string;
  ProductFullName: string;
  ProductType: ProductType;
  DecimalPlaces: number;
  TickSize: number;
  NoFees: boolean;
}

export interface L2SnapshotResponse {
  MDUpdateID: number;
  Accounts: number;
  ActionDateTime: string;
  ActionType: number;
  LastTradePrice: number;
  Orders: number;
  Price: number;
  ProductPairCode: number;
  Quantity: number;
  Side: Side;
}

export interface SubscriptionLevel1Response {
  OMSId: number;
  InstrumentId: number;
  BestBid: number;
  BestOffer: number;
  LastTradedPx: number;
  LastTradedQty: number;
  LastTradeTime: number;
  SessionOpen: number;
  SessionHigh: number;
  SessionLow: number;
  SessionClose: number;
  Volume: number;
  CurrentDayVolume: number;
  CurrentDayNumTrades: number;
  CurrentDayPxChange: number;
  Rolling24HrVolume: number;
  Rolling24NumTrades: number;
  Rolling24HrPxChange: number;
  TimeStamp: number;
}

export enum ActionType {
  New = 0,
  Update = 1,
  Delete = 2,
}

export interface SubscriptionL2Response {
  MDUpdateID: number;
  Accounts: number;
  ActionDateTime: number;
  ActionType: ActionType;
  LastTradePrice: number;
  Orders: number;
  Price: number;
  ProductPairCode: number;
  Quantity: number;
  Side: Side;
}

export interface SubscriptionTickerResponse {
  TickerDate: number;
  High: number;
  Low: number;
  Open: number;
  Close: number;
  Volume: number;
  BidPrice: number;
  AskPrice: number;
  InstrumentId: number;
}

export enum MarketPriceDirection {
  NoChange = 0,
  UpTick = 1,
  DownTick = 2,
}

// From array
export interface SubscriptionTradesResponse {
  TradeId: number;
  ProductPairCode: number;
  Quantity: number;
  Price: number;
  Order1: number;
  Order2: number;
  Tradetime: number;
  Direction: MarketPriceDirection;
  TakerSide: Side;
  BlockTrade: boolean;
  Order1or2ClientId: number;
}

export interface UserInfoResponse {

  /**
   * ID number of the user whose information is being set.
   *
   * @type {number}
   * @memberof UserInfoResponse
   */
  UserId: number;

  /**
   * Log-in name of the user; “jsmith”
   *
   * @type {string}
   * @memberof UserInfoResponse
   */
  UserName: string;

  /**
   * Email address of the user; “person@company.com”.
   *
   * @type {string}
   * @memberof UserInfoResponse
   */
  Email: string;

  /**
   * Not currently used. Returns an empty string.
   *
   * @type {string}
   * @memberof UserInfoResponse
   */
  PasswordHash: string;

  /**
   * Usually contains an empty string. Contains a GUID — a globally unique ID string — during the time that
   * a new user has been sent a registration email and before the user clicks the confirmation link.
   * @type {string}
   * @memberof UserInfoResponse
   */
  PendingEmailCode: string;

  /**
   * Has your organization verified this email as correct and operational? True if yes; false if no.
   * Defaults to false.
   *
   * @type {boolean}
   * @memberof UserInfoResponse
   */
  EmailVerified: boolean;

  /**
   * The ID of the default account with which the user is associated.
   *
   * @type {number}
   * @memberof UserInfoResponse
   */
  AccountId: number;

  /**
   * The date and time at which this user record was created, in ISO 8601 format.
   *
   * @type {number}
   * @memberof UserInfoResponse
   */
  DateTimeCreated: number;
  /**
   * The ID of an affiliated organization, if the user comes from an affiliated link.
   * This is set to 0 if the user it not associated with an affiliated organization.
   *
   * @type {number}
   * @memberof UserInfoResponse
   */
  AffiliatedId: number;

  /**
   * Captures the ID of the person who referred this account member to the trading venue,
   * usually for marketing purposes.
   * Returns 0 if no referrer.
   *
   * @type {number}
   * @memberof UserInfoResponse
   */
  RefererId: number;

  /**
   * The ID of the Order Management System with which the user is associated.
   *
   * @type {number}
   * @memberof UserInfoResponse
   */
  OMSId: number;

  /**
   * True if the user must use two-factor authentication;
   * false if the user does not need to use two-factor authentication. Defaults to false.
   *
   * @type {boolean}
   * @memberof UserInfoResponse
   */
  Use2FA: boolean;

  /**
   * Reserved for future use. Currently returns an empty string
   *
   * @type {string}
   * @memberof UserInfoResponse
   */
  Salt: string;

  /**
   * A date and time in ISO 8601 format. Reserved.
   *
   * @type {number}
   * @memberof UserInfoResponse
   */
  PendingCodeTime: number;
}
