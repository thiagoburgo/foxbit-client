export declare enum MessageType {
    Request = 0,
    Reply = 1,
    Subscribe = 2,
    Event = 3,
    Unsubscribe = 4,
    Error = 5
}
export declare enum InstrumentType {
    Unknown = 0,
    Standard = 1
}
export declare enum SessionStatus {
    Unknown = 0,
    Running = 1,
    Paused = 2,
    Stopped = 3,
    Starting = 4
}
export declare enum ProductType {
    Unknown = 0,
    NationalCurrency = 1,
    CryptoCurrency = 2,
    Contract = 3
}
export declare enum Side {
    Buy = 0,
    Sell = 1,
    Short = 2,
    Unknown = 3
}
export declare enum SideResponse {
    Buy = 0,
    Sell = 1,
    Short = 2,
    Unknown = 3
}
export declare enum ActionType {
    New = 0,
    Update = 1,
    Delete = 2
}
export declare enum MarketPriceDirection {
    NoChange = 0,
    UpTick = 1,
    DownTick = 2
}
export declare enum PegPriceType {
    Unknown = 0,
    Last = 1,
    Bid = 2,
    Ask = 3,
    Midpoint = 4
}
export declare enum TimeInForce {
    Unknown = 0,
    GTC = 1,
    IOC = 2,
    FOK = 3
}
export declare enum OrderType {
    Unknown = 0,
    Market = 1,
    Limit = 2,
    StopMarket = 3,
    StopLimit = 4,
    TrailingStopMarket = 5,
    TrailingStopLimit = 6,
    BlockTrade = 7
}
export declare enum MakerTaker {
    Unknown = 0,
    Maker = 1,
    Taker = 2
}
export declare enum OrderTypeResponse {
    Unknown = "Unknown",
    Market = "Market",
    Limit = "Limit",
    StopMarket = "StopMarket",
    StopLimit = "StopLimit",
    TrailingStopMarket = "TrailingStopMarket",
    TrailingStopLimit = "TrailingStopLimit",
    BlockTrade = "BlockTrade"
}
export declare enum OrderStateResponse {
    Working = "Working",
    Rejected = "Rejected",
    Canceled = "Canceled",
    Expired = "Expired",
    FullyExecuted = "FullyExecuted"
}
export declare enum ChangeReasonResponse {
    NewInputAccepted = "NewInputAccepted",
    NewInputRejected = "NewInputRejected",
    OtherRejected = "OtherRejected",
    Expired = "Expired",
    Trade = "Trade",
    SystemCanceled_NoMoreMarket = "SystemCanceled_NoMoreMarket",
    SystemCanceled_BelowMinimum = "SystemCanceled_BelowMinimum",
    NoChange = "NoChange",
    UserModified = "UserModified"
}
export declare enum SendOrderStatusResponse {
    Accepted = "Accepted",
    Rejected = "Rejected"
}
export declare enum DepositStatus {
    New = 0,
    AdminProcessing = 1,
    Accepted = 2,
    Rejected = 3,
    SystemProcessing = 4,
    FullyProcessed = 5,
    Failed = 6,
    Pending = 7
}
export declare enum WithdrawStatus {
    New = 0,
    AdminProcessing = 1,
    Accepted = 2,
    Rejected = 3,
    SystemProcessing = 4,
    FullyProcessed = 5,
    Failed = 6,
    Pending = 7,
    Pending2Fa = 8,
    AutoAccepted = 9,
    Delayed = 10
}
export declare enum DepositStatusResponse {
    New = "New",
    AdminProcessing = "AdminProcessing",
    Accepted = "Accepted",
    Rejected = "Rejected",
    SystemProcessing = "SystemProcessing",
    FullyProcessed = "FullyProcessed",
    Failed = "Failed",
    Pending = "Pending"
}
export declare enum AmountOperator {
    TicketsEqualToAmount = 0,
    TicketsEqualOrGreaterThanAmount = 1,
    TicketsLessThanAmount = 2
}
