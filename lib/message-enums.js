"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageType;
(function (MessageType) {
    MessageType[MessageType["Request"] = 0] = "Request";
    MessageType[MessageType["Reply"] = 1] = "Reply";
    MessageType[MessageType["Subscribe"] = 2] = "Subscribe";
    MessageType[MessageType["Event"] = 3] = "Event";
    MessageType[MessageType["Unsubscribe"] = 4] = "Unsubscribe";
    MessageType[MessageType["Error"] = 5] = "Error";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
var InstrumentType;
(function (InstrumentType) {
    InstrumentType[InstrumentType["Unknown"] = 0] = "Unknown";
    InstrumentType[InstrumentType["Standard"] = 1] = "Standard";
})(InstrumentType = exports.InstrumentType || (exports.InstrumentType = {}));
var SessionStatus;
(function (SessionStatus) {
    SessionStatus[SessionStatus["Unknown"] = 0] = "Unknown";
    SessionStatus[SessionStatus["Running"] = 1] = "Running";
    SessionStatus[SessionStatus["Paused"] = 2] = "Paused";
    SessionStatus[SessionStatus["Stopped"] = 3] = "Stopped";
    SessionStatus[SessionStatus["Starting"] = 4] = "Starting";
})(SessionStatus = exports.SessionStatus || (exports.SessionStatus = {}));
var ProductType;
(function (ProductType) {
    ProductType[ProductType["Unknown"] = 0] = "Unknown";
    ProductType[ProductType["NationalCurrency"] = 1] = "NationalCurrency";
    ProductType[ProductType["CryptoCurrency"] = 2] = "CryptoCurrency";
    ProductType[ProductType["Contract"] = 3] = "Contract";
})(ProductType = exports.ProductType || (exports.ProductType = {}));
var Side;
(function (Side) {
    Side[Side["Buy"] = 0] = "Buy";
    Side[Side["Sell"] = 1] = "Sell";
    Side[Side["Short"] = 2] = "Short";
    Side[Side["Unknown"] = 3] = "Unknown";
})(Side = exports.Side || (exports.Side = {}));
var SideResponse;
(function (SideResponse) {
    SideResponse[SideResponse["Buy"] = 0] = "Buy";
    SideResponse[SideResponse["Sell"] = 1] = "Sell";
    SideResponse[SideResponse["Short"] = 2] = "Short";
    SideResponse[SideResponse["Unknown"] = 3] = "Unknown";
})(SideResponse = exports.SideResponse || (exports.SideResponse = {}));
var ActionType;
(function (ActionType) {
    ActionType[ActionType["New"] = 0] = "New";
    ActionType[ActionType["Update"] = 1] = "Update";
    ActionType[ActionType["Delete"] = 2] = "Delete";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
var MarketPriceDirection;
(function (MarketPriceDirection) {
    MarketPriceDirection[MarketPriceDirection["NoChange"] = 0] = "NoChange";
    MarketPriceDirection[MarketPriceDirection["UpTick"] = 1] = "UpTick";
    MarketPriceDirection[MarketPriceDirection["DownTick"] = 2] = "DownTick";
})(MarketPriceDirection = exports.MarketPriceDirection || (exports.MarketPriceDirection = {}));
var PegPriceType;
(function (PegPriceType) {
    PegPriceType[PegPriceType["Unknown"] = 0] = "Unknown";
    PegPriceType[PegPriceType["Last"] = 1] = "Last";
    PegPriceType[PegPriceType["Bid"] = 2] = "Bid";
    PegPriceType[PegPriceType["Ask"] = 3] = "Ask";
    PegPriceType[PegPriceType["Midpoint"] = 4] = "Midpoint";
})(PegPriceType = exports.PegPriceType || (exports.PegPriceType = {}));
var TimeInForce;
(function (TimeInForce) {
    TimeInForce[TimeInForce["Unknown"] = 0] = "Unknown";
    TimeInForce[TimeInForce["GTC"] = 1] = "GTC";
    TimeInForce[TimeInForce["IOC"] = 2] = "IOC";
    TimeInForce[TimeInForce["FOK"] = 3] = "FOK";
})(TimeInForce = exports.TimeInForce || (exports.TimeInForce = {}));
var OrderType;
(function (OrderType) {
    OrderType[OrderType["Unknown"] = 0] = "Unknown";
    OrderType[OrderType["Market"] = 1] = "Market";
    OrderType[OrderType["Limit"] = 2] = "Limit";
    OrderType[OrderType["StopMarket"] = 3] = "StopMarket";
    OrderType[OrderType["StopLimit"] = 4] = "StopLimit";
    OrderType[OrderType["TrailingStopMarket"] = 5] = "TrailingStopMarket";
    OrderType[OrderType["TrailingStopLimit"] = 6] = "TrailingStopLimit";
    OrderType[OrderType["BlockTrade"] = 7] = "BlockTrade";
})(OrderType = exports.OrderType || (exports.OrderType = {}));
var MakerTaker;
(function (MakerTaker) {
    MakerTaker[MakerTaker["Unknown"] = 0] = "Unknown";
    MakerTaker[MakerTaker["Maker"] = 1] = "Maker";
    MakerTaker[MakerTaker["Taker"] = 2] = "Taker";
})(MakerTaker = exports.MakerTaker || (exports.MakerTaker = {}));
var OrderTypeResponse;
(function (OrderTypeResponse) {
    OrderTypeResponse["Unknown"] = "Unknown";
    OrderTypeResponse["Market"] = "Market";
    OrderTypeResponse["Limit"] = "Limit";
    OrderTypeResponse["StopMarket"] = "StopMarket";
    OrderTypeResponse["StopLimit"] = "StopLimit";
    OrderTypeResponse["TrailingStopMarket"] = "TrailingStopMarket";
    OrderTypeResponse["TrailingStopLimit"] = "TrailingStopLimit";
    OrderTypeResponse["BlockTrade"] = "BlockTrade";
})(OrderTypeResponse = exports.OrderTypeResponse || (exports.OrderTypeResponse = {}));
var OrderStateResponse;
(function (OrderStateResponse) {
    OrderStateResponse["Working"] = "Working";
    OrderStateResponse["Rejected"] = "Rejected";
    OrderStateResponse["Canceled"] = "Canceled";
    OrderStateResponse["Expired"] = "Expired";
    OrderStateResponse["FullyExecuted"] = "FullyExecuted";
})(OrderStateResponse = exports.OrderStateResponse || (exports.OrderStateResponse = {}));
var ChangeReasonResponse;
(function (ChangeReasonResponse) {
    ChangeReasonResponse["NewInputAccepted"] = "NewInputAccepted";
    ChangeReasonResponse["NewInputRejected"] = "NewInputRejected";
    ChangeReasonResponse["OtherRejected"] = "OtherRejected";
    ChangeReasonResponse["Expired"] = "Expired";
    ChangeReasonResponse["Trade"] = "Trade";
    ChangeReasonResponse["SystemCanceled_NoMoreMarket"] = "SystemCanceled_NoMoreMarket";
    ChangeReasonResponse["SystemCanceled_BelowMinimum"] = "SystemCanceled_BelowMinimum";
    ChangeReasonResponse["NoChange"] = "NoChange";
    ChangeReasonResponse["UserModified"] = "UserModified";
})(ChangeReasonResponse = exports.ChangeReasonResponse || (exports.ChangeReasonResponse = {}));
var SendOrderStatusResponse;
(function (SendOrderStatusResponse) {
    SendOrderStatusResponse["Accepted"] = "Accepted";
    SendOrderStatusResponse["Rejected"] = "Rejected";
})(SendOrderStatusResponse = exports.SendOrderStatusResponse || (exports.SendOrderStatusResponse = {}));
var DepositStatus;
(function (DepositStatus) {
    DepositStatus[DepositStatus["New"] = 0] = "New";
    DepositStatus[DepositStatus["AdminProcessing"] = 1] = "AdminProcessing";
    DepositStatus[DepositStatus["Accepted"] = 2] = "Accepted";
    DepositStatus[DepositStatus["Rejected"] = 3] = "Rejected";
    DepositStatus[DepositStatus["SystemProcessing"] = 4] = "SystemProcessing";
    DepositStatus[DepositStatus["FullyProcessed"] = 5] = "FullyProcessed";
    DepositStatus[DepositStatus["Failed"] = 6] = "Failed";
    DepositStatus[DepositStatus["Pending"] = 7] = "Pending";
})(DepositStatus = exports.DepositStatus || (exports.DepositStatus = {}));
var WithdrawStatus;
(function (WithdrawStatus) {
    WithdrawStatus[WithdrawStatus["New"] = 0] = "New";
    WithdrawStatus[WithdrawStatus["AdminProcessing"] = 1] = "AdminProcessing";
    WithdrawStatus[WithdrawStatus["Accepted"] = 2] = "Accepted";
    WithdrawStatus[WithdrawStatus["Rejected"] = 3] = "Rejected";
    WithdrawStatus[WithdrawStatus["SystemProcessing"] = 4] = "SystemProcessing";
    WithdrawStatus[WithdrawStatus["FullyProcessed"] = 5] = "FullyProcessed";
    WithdrawStatus[WithdrawStatus["Failed"] = 6] = "Failed";
    WithdrawStatus[WithdrawStatus["Pending"] = 7] = "Pending";
    WithdrawStatus[WithdrawStatus["Pending2Fa"] = 8] = "Pending2Fa";
    WithdrawStatus[WithdrawStatus["AutoAccepted"] = 9] = "AutoAccepted";
    WithdrawStatus[WithdrawStatus["Delayed"] = 10] = "Delayed";
})(WithdrawStatus = exports.WithdrawStatus || (exports.WithdrawStatus = {}));
var DepositStatusResponse;
(function (DepositStatusResponse) {
    DepositStatusResponse["New"] = "New";
    DepositStatusResponse["AdminProcessing"] = "AdminProcessing";
    DepositStatusResponse["Accepted"] = "Accepted";
    DepositStatusResponse["Rejected"] = "Rejected";
    DepositStatusResponse["SystemProcessing"] = "SystemProcessing";
    DepositStatusResponse["FullyProcessed"] = "FullyProcessed";
    DepositStatusResponse["Failed"] = "Failed";
    DepositStatusResponse["Pending"] = "Pending";
})(DepositStatusResponse = exports.DepositStatusResponse || (exports.DepositStatusResponse = {}));
var AmountOperator;
(function (AmountOperator) {
    AmountOperator[AmountOperator["TicketsEqualToAmount"] = 0] = "TicketsEqualToAmount";
    AmountOperator[AmountOperator["TicketsEqualOrGreaterThanAmount"] = 1] = "TicketsEqualOrGreaterThanAmount";
    AmountOperator[AmountOperator["TicketsLessThanAmount"] = 2] = "TicketsLessThanAmount";
})(AmountOperator = exports.AmountOperator || (exports.AmountOperator = {}));
//# sourceMappingURL=message-enums.js.map