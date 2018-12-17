import { ActionType, InstrumentType, MarketPriceDirection, ProductType, SessionStatus, Side, OrderType, SideResponse, OrderStateResponse, ChangeReasonResponse, SendOrderStatusResponse, OrderTypeResponse, DepositStatusResponse } from './message-enums';
import { window } from 'rxjs/operators';

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

export interface CancelReplaceOrderResult {
  /**
   * The order ID assigned to the replacement order by the server.
   *
   * @type {number}
   * @memberof CancelReplaceOrderResult
   */
  ReplacementOrderId: number;
  /**
   * Echoes the contents of the ClientOrderId value from the request
   *
   * @type {number}
   * @memberof CancelReplaceOrderResult
   */
  ReplacementClOrdId: number;
  /**
   * Echoes OrderIdToReplace, which is the original order you are replacing.
   *
   * @type {number}
   * @memberof CancelReplaceOrderResult
   */
  OrigOrderId: number;
  /**
   * Provides the client order ID of the original order (not specified in the requesting call)
   *
   * @type {number}
   * @memberof CancelReplaceOrderResult
   */
  OrigClOrdId: number;
}

export interface AccountInfoResult {
  /**
   * The ID of the Order Management System on which the account resides.
   * @type {number}
   * @memberof AccountInfoResult
   */
  OMSID: number;

  /**
   * The ID of the account for which information was requested.
   * @type {number}
   * @memberof AccountInfoResult
   */
  AccountId: number;

  /**
   * A non-unique name for the account assigned by the user
   * @type {string}
   * @memberof AccountInfoResult
   */
  AccountName: string;

  /**
   * AccountHandle is a unique user-assigned name that is checked at create
   * time by the Order Management System to assure its uniqueness.
   * @type {string}
   * @memberof AccountInfoResult
   */
  AccountHandle: string;

  /**
   * An arbitrary identifier assigned by a trading venue operator to a trading
   * firm as part of the initial company, user, and account set up process. For
   * example, Smith Financial Partners might have the ID SMFP.
   * @type {string}
   * @memberof AccountInfoResult
   */
  FirmId: string;
  /**
   * A longer, non-unique version of the trading firm’s name;
   * for example, Smith Financial Partners.
   * @type {string}
   * @memberof AccountInfoResult
   */
  FirmName: string;
  /**
   * The type of the account for which information is being returned. One of:
   * - Asset
   * - Liability
   * - ProfitLoss
   *
   * Responses for this string/value pair for Market Participants are almost exclusively
   * Asset.
   * @type {Acc}
   * @memberof AccountInfoResult
   */
  AccountType: string;

  /**
   * Defines account attributes relating to how fees are calculated and
   * assessed. Set by trading venue operator.
   * @type {number}
   * @memberof AccountInfoResult
   */
  FeeGroupID: number;

  /**
   * Reserved for future development.
   * @type {number}
   * @memberof AccountInfoResult
   */
  ParentID: number;
  /**
   * One of:
   * - Unkown (an error condition)
   * - Normal
   * - NoRiskCheck
   * - NoTrading
   *
   * Returns Normal for virtually all market participants. Other types indicate account
   * configurations assignable by the trading venue operator.
   * @type {string}
   * @memberof AccountInfoResult
   */
  RiskType: string;

  /**
   * Verification level ID (how much verification does this account require)
   * defined by and set by the trading venue operator for this account.
   * @type {number}
   * @memberof AccountInfoResult
   */
  VerificationLevel: number;

  /**
   * One of:
   * - BaseProduct
   * - SingleProduct
   *
   * Trading fees may be charged by a trading venue operator. This value shows
   * whether fees for this account’s trades are charged in the product being traded
   * (BaseProduct, for example BitCoin) or whether the account has a preferred
   * fee-paying product (SingleProduct, for example USD) to use in all cases and
   * regardless of product being traded.
   * @type {AccountTypeOrRiskTypeOrFeeProductType}
   * @memberof AccountInfoResult
   */
  FeeProductType: string;

  /**
   * The ID of the preferred fee product, if any. Defaults to 0
   * @type {number}
   * @memberof AccountInfoResult
   */
  FeeProduct: number;
  /**
   * Captures the ID of the person who referred this account to the trading
   * venue, usually for marketing purposes.
   * @type {number}
   * @memberof AccountInfoResult
   */
  RefererId: number;
  /**
   * Comma-separated array. Reserved for future expansion.
   * @type {number[]}
   * @memberof AccountInfoResult
   */
  SupportedVenueIds: number[];
}

export interface AccountPositionResult {
  /**
   * The ID of the Order Management System (OMS) to which the user
   * belongs. A user will only ever belong to one Order Management System.
   * @type {number}
   * @memberof AccountPositionResult
   */
  OMSId: number;
  /**
   * Returns the ID of the user’s account to which the positions belong.
   * @type {number}
   * @memberof AccountPositionResult
   */
  AccountId: number;
  /**
   * The symbol of the product on this account’s side of the trade. For
   * example:
   *  - BTC — BitCoin
   *  - USD — US Dollar
   *  - NZD — New Zealand Dollar
   * Many other values are possible depending on the nature of the trading venue.
   * @type {string}
   * @memberof AccountPositionResult
   */
  ProductSymbol: string;
  /**
   * The ID of the product being traded. The system assigns product IDs as
   * they are entered into the system
   * Use **GetProduct** to return information about the product by its ID.
   * @type {number}
   * @memberof AccountPositionResult
   */
  ProductId: number;
  /**
   * Unit amount of the product; for example, 10 or 138.5
   * @type {number}
   * @memberof AccountPositionResult
   */
  Amount: number;
  /**
   * Amount of currency held and not available for trade. A pending trade of 100
   * units at $1 each will reduce the amount in the account available for trading by
   * $100. Amounts on hold cannot be withdrawn while a trade is pending.
   * @type {number}
   * @memberof AccountPositionResult
   */
  Hold: number;
  /**
   * Deposits accepted but not yet cleared for trade
   * @type {number}
   * @memberof AccountPositionResult
   */
  PendingDeposits: number;
  /**
   * Withdrawals acknowledged but not yet cleared from the account. Amounts
   * in *PendingWithdraws* are not available for trade.
   * @type {number}
   * @memberof AccountPositionResult
   */
  PendingWithdraws: number;
  /**
   * Total deposits on today’s date. The trading day runs
   * between UTC Midnight and UTC Midnight.
   * @type {number}
   * @memberof AccountPositionResult
   */
  TotalDayDeposits: number;
  /**
   * Total withdrawals on today’s date. The trading day runs
   * between UTC Midnight and UTC Midnight.
   * @type {number}
   * @memberof AccountPositionResult
   */
  TotalDayWithdraws: number;
  /**
   * Total withdrawals during this month to date. The trading day runs between
   * UTC Midnight and UTC Midnight — likewise a month begins at UTC Midnight on
   * the first day of the month.
   * @type {number}
   * @memberof AccountPositionResult
   */
  TotalMonthWithdraws: number;
}

export interface AccountTradesResult {
  /**
   * The date and time stamp of the trade in Microsoft tick format and UTC time zone
   * @type {number}
   * @memberof AccountTradesResult
   */
  TradeTimeMS: number;

  /**
   * The fee for this trade in units and fractions of units (a $10 USD fee would be
   * 10.00, a .5-BitCoin fee would be 0.5).
   * @type {number}
   * @memberof AccountTradesResult
   */
  Fee: number;

  /**
   * The ID of the product that denominates the fee. Product types will vary
   * on each trading venue. See **GetProduct**.
   * @type {number}
   * @memberof AccountTradesResult
   */
  FeeProductId: number;

  /**
   * The user ID of the user who entered the order that caused the trade for
   * this account. (Multiple users can have access to an account.)
   * @type {number}
   * @memberof AccountTradesResult
   */
  OrderOriginator: number;

  /**
   * The ID of the Order Management System to which the user belongs.
   * A user will belong only to one OMS.
   * @type {number}
   * @memberof AccountTradesResult
   */
  OMSId: number;

  /**
   * The ID of this account’s side of the trade. Every trade has two sides.
   * @type {number}
   * @memberof AccountTradesResult
   */
  ExecutionId: number;

  /**
   * The ID of the overall trade.
   * @type {number}
   * @memberof AccountTradesResult
   */
  TradeId: number;

  /**
   * The ID of the order causing the trade.
   * @type {number}
   * @memberof AccountTradesResult
   */
  OrderId: number;

  /**
   * The Account ID that made the trade.
   * @type {number}
   * @memberof AccountTradesResult
   */
  AccountId: number;

  /**
   * Not currently used.
   * @type {number}
   * @memberof AccountTradesResult
   */
  SubAccountId: number;

  /**
   * Your Client Order Id
   * @type {number}
   * @memberof AccountTradesResult
   */
  ClientOrderId: number;

  /**
   * The ID of the instrument being traded. See **GetInstrument** to find
   * information about this instrument by its ID.
   * @type {number}
   * @memberof AccountTradesResult
   */
  InstrumentId: number;

  /**
   * Buy or Sell
   * - 0 Buy
   * - 1 Sell
   * - 2 Short (reserved for future use)
   * - 3 Unknown (error condition)
   * @type {Side}
   * @memberof AccountTradesResult
   */
  Side: Side;

  /**
   * The unit quantity of the trade.
   * @type {number}
   * @memberof AccountTradesResult
   */
  Quantity: number;

  /**
   * The number of units remaining to be traded by the order after this
   * execution. This number is not revealed to the other party in the trade. This value
   * is also known as “leave size” or “leave quantity.”
   * @type {number}
   * @memberof AccountTradesResult
   */
  RemainingQuantity: number;

  /**
   * The unit price at which the instrument traded.
   * @type {number}
   * @memberof AccountTradesResult
   */
  Price: number;

  /**
   * The total value of the deal. The system calculates this as:
   * unit price X quantity executed
   * @type {number}
   * @memberof AccountTradesResult
   */
  Value: number;

  /**
   * The time at which the trade took place, in POSIX format and UTC time zone
   * @type {number}
   * @memberof AccountTradesResult
   */
  TradeTime: number;

  /**
   * Shows 0
   * @type {(number | null)}
   * @memberof AccountTradesResult
   */
  CounterParty?: number | null;

  /**
   * This value increments if the trade has changed. Default is 1.
   * For example, if the trade busts (fails to conclude), the trade
   * will need to be modified and a revision number then will apply.
   * @type {number}
   * @memberof AccountTradesResult
   */
  OrderTradeRevision: number;

  /**
   * Shows if this trade has moved the book price up, down, or no change.
   * Values:
   * - NoChange
   * - UpTick
   * - DownTick
   * @type {string}
   * @memberof AccountTradesResult
   */
  Direction: MarketPriceDirection;

  /**
   * Returns true if the trade was a reported trade; false otherwise.
   * @type {boolean}
   * @memberof AccountTradesResult
   */
  IsBlockTrade: boolean;
}

export interface OpenOrdersResult {
  /**
   * The open order can be Buy or Sell.
   * - 0 Buy
   * - 1 Sell
   * - 2 Short (reserved for future use)
   * - 3 Unknown (error condition)
   * @type {SideResponse}
   * @memberof OpenOrdersResult
   */
  Side: SideResponse;

  /**
   * The ID of the open order. The OrderID is unique in each Order Management Systsem.
   * @type {number}
   * @memberof OpenOrdersResult
   */
  OrderId: number;

  /**
   * The price at which the buy or sell has been ordered.
   * @type {number}
   * @memberof OpenOrdersResult
   */
  Price: number;

  /**
   * The quantity to be bought or sold.
   * @type {number}
   * @memberof OpenOrdersResult
   */
  Quantity: number;

  /**
   * The quantity available to buy or sell that is publicly displayed to the market.
   * To display a DisplayQuantity value, an order must be a Limit order with a reserve.
   * @type {number}
   * @memberof OpenOrdersResult
   */
  DisplayQuantity: number;

  /**
   * ID of the instrument being traded. See **GetInstruments**
   * @type {number}
   * @memberof OpenOrdersResult
   */
  Instrument: number;

  /**
   * The ID of the account that placed the order
   * @type {number}
   * @memberof OpenOrdersResult
   */
  Account: number;

  /**
   * There are currently seven types of order
   * @type {OrderType}
   * @memberof OpenOrdersResult
   */
  OrderType: OrderType;

  /**
   * A user-assigned ID for the order (like a purchase-order number assigned by a company).
   * ClientOrderId defaults to 0.
   * @type {number}
   * @memberof OpenOrdersResult
   */
  ClientOrderId: number;

  /**
   * The current condition of the order. There are five order states:
   * - Working
   * - Rejected
   * - Canceled
   * - Expired
   * - FullyExecuted
   * @type {OrderStateResponse}
   * @memberof OpenOrdersResult
   */
  OrderState: OrderStateResponse;

  /**
   * The time at which the system received the order, in POSIX format and UTC time zone
   * @type {number}
   * @memberof OpenOrdersResult
   */
  ReceiveTime: number;

  /**
   * The time stamp of the received order in Microsoft Tick format, and UTC time zone
   * @type {number}
   * @memberof OpenOrdersResult
   */
  ReceiveTimeTicks: number;

  /**
   * Original quantity of the order. The quantity of the actual execution may
   * be lower than this number, but OrigQuantity shows the quantity in the order as placed.
   * @type {number}
   * @memberof OpenOrdersResult
   */
  OrigQuantity: number;

  /**
   * The number of units executed in this trade.
   * @type {number}
   * @memberof OpenOrdersResult
   */
  QuantityExecuted: number;

  /**
   * Not currently used.
   * @type {number}
   * @memberof OpenOrdersResult
   */
  AvgPrice: number;

  /**
   * Shows 0.
   * @type {number}
   * @memberof OpenOrdersResult
   */
  CounterPartyId: number;

  /**
   * The reason that an order has been changed. Values:
   * - 1 NewInputAccepted
   * - 2 NewInputRejected
   * - 3 OtherRejected
   * - 4 Expired
   * - 5 Trade
   * - 6 SystemCanceled_NoMoreMarket
   * - 7 SystemCanceled_BelowMinimum
   * - 8 NoChange
   * - 100 UserModified
   * @type {ChangeReasonResponse}
   * @memberof OpenOrdersResult
   */
  ChangeReason: ChangeReasonResponse;

  /**
   * ID of the original order. This number is also appended to **CancelReplaceOrder**
   * @type {number}
   * @memberof OpenOrdersResult
   */
  OrigOrderId: number;

  /**
   * The Orignal Client-Designate Order Id.
   * @type {number}
   * @memberof OpenOrdersResult
   */
  OrigClOrdId: number;

  /**
   * User ID of the person who entered the order
   * @type {number}
   * @memberof OpenOrdersResult
   */
  EnteredBy: number;

  /**
   * True if the open order is a quote; false if not.
   * @type {boolean}
   * @memberof OpenOrdersResult
   */
  IsQuote: boolean;

  /**
   * Best price available at time of entry (for ask or bid, respectively).
   * @type {number}
   * @memberof OpenOrdersResult
   */
  InsideAsk: number;

  /**
   * Quantity available at the best inside ask (or bid) price.
   * @type {number}
   * @memberof OpenOrdersResult
   */
  InsideAskSize: number;

  /**
   * Best price available at time of entry (for ask or bid, respectively).
   * @type {number}
   * @memberof OpenOrdersResult
   */
  InsideBid: number;

  /**
   * Quantity available at the best inside ask (or bid) price.
   * @type {number}
   * @memberof OpenOrdersResult
   */
  InsideBidSize: number;

  /**
   * Last trade price for this product before this order was entered.
   * @type {number}
   * @memberof OpenOrdersResult
   */
  LastTradePrice: number;

  /**
   * If this order was rejected, RejectReason holds the reason for the rejection.
   * @type {string}
   * @memberof OpenOrdersResult
   */
  RejectReason: string;

  /**
   * True if both parties to a block trade agree that one party will report
   * the trade for both. Otherwise false.
   * @type {boolean}
   * @memberof OpenOrdersResult
   */
  IsLockedIn: boolean;

  /**
   * ID of the Order Management System on which the order was placed.
   * @type {number}
   * @memberof OpenOrdersResult
   */
  OMSId: number;
}

export interface SendOrderResult {

  /**
   * If the order is accepted by the system, it returns 0.
   * - 0 Accepted
   * - 1 Rejected
   * @type {SendOrderStatusResponse}
   * @memberof SendOrderResult
   */
  status: SendOrderStatusResponse;

  /**
   * Any error message the server returns
   * @type {string}
   * @memberof SendOrderResult
   */
  errormsg: string;

  /**
   * The ID assigned to the order by the server. This allows you to track the order.
   * @type {number}
   * @memberof SendOrderResult
   */
  OrderId: number;
}

export interface OrderFeeResult {
  /**
   * The estimated fee for the trade as described. The minimum value is 0.01.
   * @type {number}
   * @memberof OrderFeeResult
   */
  OrderFee: number;
  /**
   * The ID of the product (currency) in which the fee is denominated.
   * @type {number}
   * @memberof OrderFeeResult
   */
  ProductId: number;
}

export interface OrderHistoryResult {
  /**
   * The open order can be Buy or Sell.
   * - 0 Buy
   * - 1 Sell
   * - 2 Short (reserved for future use)
   * - 3 Unknown (error condition)
   * @type {SideResponse}
   * @memberof OrderHistoryResult
   */
  Side: SideResponse;

  /**
   *  The ID of this order
   * @type {number}
   * @memberof OrderHistoryResult
   */
  OrderId: number;

  /**
   * Price of the order.
   * @type {number}
   * @memberof OrderHistoryResult
   */
  Price: number;

  /**
   * Quantity of the order.
   * @type {number}
   * @memberof OrderHistoryResult
   */
  Quantity: number;

  /**
   * The quantity available to buy or sell that is publicly displayed to the market.
   * To display a DisplayQuantity value, an order must be a Limit order with a reserve
   * @type {number}
   * @memberof OrderHistoryResult
   */
  DisplayQuantity: number;

  /**
   * The ID of the instrument being ordered.
   * @type {number}
   * @memberof OrderHistoryResult
   */
  Instrument: number;

  /**
   * The ID of the account ordering the instrument.
   * @type {number}
   * @memberof OrderHistoryResult
   */
  Account: number;

  /**
   * One of:
   * - Unknown
   * - Market
   * - Limit
   * - StopMarket
   * - StopLimit
   * - TrailingStopMarket
   * - TrailingStopLimit
   * - BlockTrade
   * @type {OrderTypeResponse}
   * @memberof OrderHistoryResult
   */
  OrderType: OrderTypeResponse;

  /**
   * A user-assigned ID for the order (like a purchase-order number assigned by a company).
   * ClientOrderId defaults to 0
   * @type {number}
   * @memberof OrderHistoryResult
   */
  ClientOrderId: number;

  /**
   * One of:
   * - Unknown
   * - Working
   * - Rejected
   * - Canceled
   * - Expired
   * - FullyExecuted
   * An open order will probably not yet be fully executed.
   * @type {OrderStateResponse}
   * @memberof OrderHistoryResult
   */
  OrderState: OrderStateResponse;

  /**
   * The time at which the system received the quote, in POSIX format
   * @type {number}
   * @memberof OrderHistoryResult
   */
  ReceiveTime: number;

  /**
   * The time stamp of the received quote in Microsoft Ticks format.
   * @type {number}
   * @memberof OrderHistoryResult
   */
  ReceiveTimeTicks: number;

  /**
   * If the order has been changed, this value shows the original quantity
   * @type {number}
   * @memberof OrderHistoryResult
   */
  OrigQuantity: number;

  /**
   * This value states the quantity that was executed in the order. It may be the
   * same as the quantity of the order; it may be different.
   * @type {number}
   * @memberof OrderHistoryResult
   */
  QuantityExecuted: number;

  /**
   * Not currently used.
   * @type {number}
   * @memberof OrderHistoryResult
   */
  AvgPrice: number;

  /**
   * Shows 0
   * @type {number}
   * @memberof OrderHistoryResult
   */
  CounterPartyId: number;

  /**
   * The reason that an order has been changed. Values:
   * - 1 NewInputAccepted
   * - 2 NewInputRejected
   * - 3 OtherRejected
   * - 4 Expired
   * - 5 Trade
   * - 6 SystemCanceled_NoMoreMarket
   * - 7 SystemCanceled_BelowMinimum
   * - 8 NoChange
   * - 100 UserModified
   * @type {ChangeReasonResponse}
   * @memberof OrderHistoryResult
   */
  ChangeReason: ChangeReasonResponse;

  /**
   * If the order has been changed, shows the original order ID.
   * @type {number}
   * @memberof OrderHistoryResult
   */
  OrigOrderId: number;

  /**
   * If the order has been changed, shows the original client order ID, a
   * value that the client can create (much like a purchase order).
   * @type {number}
   * @memberof OrderHistoryResult
   */
  OrigClOrdId: number;

  /**
   * The ID of the user who entered the order in this account.
   * @type {number}
   * @memberof OrderHistoryResult
   */
  EnteredBy: number;

  /**
   * If this order is a quote (rather than an order), returns true, otherwise false.
   * Default is false.
   * @type {boolean}
   * @memberof OrderHistoryResult
   */
  IsQuote: boolean;

  /**
   * Best Ask price available at time of entry (generally available to market makers)
   * @type {number}
   * @memberof OrderHistoryResult
   */
  InsideAsk: number;

  /**
   * Quantity available at the best inside ask price (generally available to market makers).
   * @type {number}
   * @memberof OrderHistoryResult
   */
  InsideAskSize: number;

  /**
   * Best Bid price available at time of entry (generally available to market makers).
   * @type {number}
   * @memberof OrderHistoryResult
   */
  InsideBid: number;

  /**
   * Quantity available at the best inside Bid price (generally available to market makers).
   * @type {number}
   * @memberof OrderHistoryResult
   */
  InsideBidSize: number;

  /**
   * The price at which the instrument last traded.
   * @type {number}
   * @memberof OrderHistoryResult
   */
  LastTradePrice: number;

  /**
   * If the order was rejected, this string value holds the reason
   * @type {string}
   * @memberof OrderHistoryResult
   */
  RejectReason: string;

  /**
   * True if both parties to a block trade agree that one party will report the
   * trade for both. Otherwise false.
   * @type {boolean}
   * @memberof OrderHistoryResult
   */
  IsLockedIn: boolean;

  /**
   * The ID of the Order Management System on which the order was created.
   * @type {number}
   * @memberof OrderHistoryResult
   */
  OMSId: number;
}

export interface AllDepositTicketsResult {
  /**
   * The ID of the Asset Manager module, which interacts with the OMS and
   * the trading venue’s matching engine. The Asset Manager accepts, holds, and
   * disburses assets (products)
   * @type {number}
   * @memberof AllDepositTicketsResult
   */
  AssetManagerId: number;

  /**
   * The ID of the account into which the deposit was made.
   * @type {number}
   * @memberof AllDepositTicketsResult
   */
  AccountId: number;

  /**
   * The ID of the asset being deposited. Equivalent to product ID. *AssetId = ProductId*,
   * and uses the same ID numbers.
   * @type {number}
   * @memberof AllDepositTicketsResult
   */
  AssetId: number;

  /**
   * The name of the asset being deposited. USD (dollars), BTC (bitcoin),
   * gold, NZD (New Zealand dollars) for example. This is not an enumerated field, to
   * allow for flexibility.
   * @type {string}
   * @memberof AllDepositTicketsResult
   */
  AssetName: string;

  /**
   * The amount of the asset being deposited.
   * @type {number}
   * @memberof AllDepositTicketsResult
   */
  Amount: number;

  /**
   * The ID of the Order Management System handling the deposits.
   * @type {number}
   * @memberof AllDepositTicketsResult
   */
  OMSId: number;

  /**
   * A GUID (globally unique ID) string that identifies this specific deposit.
   * @type {string}
   * @memberof AllDepositTicketsResult
   */
  RequestCode: string;

  /**
   * The on-line IP (Internet Protocol) address from which the deposit is made.
   * This can be a traditional IPv4 dotted quad (192.168.168.1) or a 128-bit IPv6 address.
   * @type {string}
   * @memberof AllDepositTicketsResult
   */
  RequestIP: string;

  /**
   * The ID of the user sending the request and making the deposit
   * @type {number}
   * @memberof AllDepositTicketsResult
   */
  RequestUser: number;

  /**
   * The name of the user sending the request and making the deposit.
   * For example, “John Smith.”
   * @type {string}
   * @memberof AllDepositTicketsResult
   */
  RequestUserName: string;

  /**
   * The ID of the operator of the trading venue
   * @type {number}
   * @memberof AllDepositTicketsResult
   */
  OperatorId: number;

  /**
   * The current status of the deposit. One of:
   * - 0 New
   * - 1 AdminProcessing
   * - 2 Accepted
   * - 3 Rejected
   * - 4 SystemProcessing
   * - 5 FullyProcessed
   * - 6 Failed
   * - 7 Pending
   * ***********************************
   * Note: The value of Status is an integer in the request for GetAllDepositTickets.
   * In the response, it is a string..
   * ***********************************
   * @type {DepositStatusResponse}
   * @memberof AllDepositTicketsResult
   */
  Status: DepositStatusResponse;

  /**
   * The value of the fee for making the deposit, if any
   * @type {number}
   * @memberof AllDepositTicketsResult
   */
  FeeAmt: number;

  /**
   * The ID of the most recent user updating this deposit ticket
   * @type {number}
   * @memberof AllDepositTicketsResult
   */
  UpdatedByUser: number;

  /**
   * The name of the most recent user updating this deposit ticket,
   * for example, “Joan Smith.”
   * @type {string}
   * @memberof AllDepositTicketsResult
   */
  UpdatedByUserName: string;

  /**
   * A system-assigned unique deposit ticket number that identifies the
   * deposit. The value for TicketNumber is returned by the **GetDepositTicket** calls:
   * **GetAllDepositTickets** and **GetDepositTicket**
   * @type {number}
   * @memberof AllDepositTicketsResult
   */
  TicketNumber: number;

  /**
   * A list of strings and string/value pairs that holds information about the
   * source of funds being deposited. This information was entered when the deposit
   * ticket was created, and as required by the account provider.
   * @type {string}
   * @memberof AllDepositTicketsResult
   */
  DepositInfo: string;

  /**
   * The time and date that the deposit was created, in ISO 8601 format.
   * @type {string}
   * @memberof AllDepositTicketsResult
   */
  CreatedTimestamp: string;

  /**
   * The time and date that the deposit ticket last was updated, in ISO 8601 format.
   * @type {string}
   * @memberof AllDepositTicketsResult
   */
  LastUpdateTimeStamp: string;

  /**
   * *Comments* are sets of system-generated string/value pairs
   * that provide information about the deposit’s process through the system. Neither
   * users nor admins enter these comments directly.
   * @type {string[]}
   * @memberof AllDepositTicketsResult
   */
  Comments?: string[];

  /**
   * A set of base-64 strings usually providing an image or a PDF.
   * This image or file may be a transaction receipt or other information that the
   * depositor wishes to attach to the deposit for record-keeping purposes.
   * @type {string[]}
   * @memberof AllDepositTicketsResult
   */
  Attachments?: string[];
}

export interface AllWithdrawTicketsResult {
  /**
   * The ID of the Asset Manager module.
   * @type {number}
   * @memberof AllWithdrawTicketsResult
   */
  AssetManagerId: number;
  /**
   * The ID of the account that made the withdrawal.
   * @type {number}
   * @memberof AllWithdrawTicketsResult
   */
  AccountId: number;
  /**
   * The ID of the asset in which the withdrawal is denominated, for example,
   * US Dollar or BitCoin both have an associated *AssetId*. *AssetId* and *ProductId* are
   * identical in numerical content. You must use *AssetId* here.
   * @type {number}
   * @memberof AllWithdrawTicketsResult
   */
  AssetId: number;
  /**
   * The readable name of the asset in which the withdrawal is denominated, 
   * for example, “US Dollar” or “BitCoin.”
   * @type {string}
   * @memberof AllWithdrawTicketsResult
   */
  AssetName: string;
  /**
   * The amount of the withdrawal.
   * @type {number}
   * @memberof AllWithdrawTicketsResult
   */
  Amount: number;
  /**
   * See the TemplateForm object, following.
   * The content of a template depends on the account provider that you use for
   * deposits and withdrawals. This template is provided as a general reference example
   * @type {*}
   * @memberof AllWithdrawTicketsResult
   */
  TemplateForm: any;
  /**
   * The name of the template being used. The template controls the string/value
   * pairs in the TemplateForm object returned for each withdrawal.
   * These vary by account provider
   * @type {string}
   * @memberof AllWithdrawTicketsResult
   */
  TemplateType: string;

  /**
   * 
   * @type {string}
   * @memberof AllWithdrawTicketsResult
   */
  TemplateFormType: string;
  /**
   *
   *
   * @type {string}
   * @memberof AllWithdrawTicketsResult
   */
  Comment: string;
  /**
   *
   *
   * @type {string}
   * @memberof AllWithdrawTicketsResult
   */
  ExternalAddress: string;

  /**
   * The ID of the Order Management System
   * @type {number}
   * @memberof AllWithdrawTicketsResult
   */
  OMSId: number;
  /**
   * A GUID (globally unique ID) string that identifies this specific withdrawal.
   * @type {string}
   * @memberof AllWithdrawTicketsResult
   */
  RequestCode: string;
  /**
   * The IP address from which the withdrawal was initiated,
   * in either IPv4 dotted quad format or IPv6 format.
   * @type {string}
   * @memberof AllWithdrawTicketsResult
   */
  RequestIP: string;
  /**
   * The ID of the user who made the original withdrawal reques
   * @type {number}
   * @memberof AllWithdrawTicketsResult
   */
  RequestUserId: number;
  /**
   * The name of the user who made the original withdrawal request.
   * @type {string}
   * @memberof AllWithdrawTicketsResult
   */
  RequestUserName: string;
  /**
   * The ID of the operator of the trading venue on which
   * the withdrawal request was made.
   * @type {number}
   * @memberof AllWithdrawTicketsResult
   */
  OperatorId: number;
  /**
   *
   *
   * @type {string}
   * @memberof AllWithdrawTicketsResult
   */
  Status: string;
  /**
   *
   *
   * @type {number}
   * @memberof AllWithdrawTicketsResult
   */
  FeeAmt: number;
  /**
   *
   *
   * @type {number}
   * @memberof AllWithdrawTicketsResult
   */
  UpdatedByUser: number;
  /**
   *
   *
   * @type {string}
   * @memberof AllWithdrawTicketsResult
   */
  UpdatedByUserName: string;
  /**
   *
   *
   * @type {number}
   * @memberof AllWithdrawTicketsResult
   */
  TicketNumber: number;
  /**
   *
   *
   * @type {string}
   * @memberof AllWithdrawTicketsResult
   */
  CreatedTimestamp: string;
  /**
   *
   *
   * @type {string}
   * @memberof AllWithdrawTicketsResult
   */
  LastUpdateTimestamp: string;
  /**
   *
   *
   * @type {Comment[]}
   * @memberof AllWithdrawTicketsResult
   */
  Comments?: Comment[];
  /**
   *
   *
   * @type {string[]}
   * @memberof AllWithdrawTicketsResult
   */
  Attachments?: string[];
  /**
   *
   *
   * @type {any[]}
   * @memberof AllWithdrawTicketsResult
   */
  AuditLog?: any[];
}

export interface Comment {
  /**
   *
   *
   * @type {number}
   * @memberof Comment
   */
  CommentId: number;
  /**
   *
   *
   * @type {number}
   * @memberof Comment
   */
  EnteredBy: number;
  /**
   *
   *
   * @type {string}
   * @memberof Comment
   */
  EnteredDateTime: string;
  /**
   *
   *
   * @type {string}
   * @memberof Comment
   */
  Comment: string;
  /**
   *
   *
   * @type {number}
   * @memberof Comment
   */
  OperatorId: number;
  /**
   *
   *
   * @type {number}
   * @memberof Comment
   */
  OMSId: number;
  /**
   *
   *
   * @type {string}
   * @memberof Comment
   */
  TicketCode: string;
  /**
   *
   *
   * @type {number}
   * @memberof Comment
   */
  TicketId: number;
}
