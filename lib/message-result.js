"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=message-result.js.map