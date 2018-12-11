import { OrderType, PegPriceType, Side, TimeInForce, MakerTaker } from './message-enums';

export interface CancelReplaceOrderRequest {
    /**
     * The ID of the Order Management System on which the order is being canceled
     * and replaced by another order.
     * @type {number}
     * @memberof CancelReplaceOrderRequest
     */
    OMSId: number;

    /**
     * The ID of the order to replace with this order.
     * @type {number}
     * @memberof CancelReplaceOrderRequest
     */
    OrderIdToReplace: number;

    /**
     * A user-assigned ID for the new, replacement order (like a
     * purchase-order number assigned by a company). This ID is useful for recognizing
     * future states related to this order. ClientOrderId defaults to 0.
     * @type {number}
     * @memberof CancelReplaceOrderRequest
     */
    ClientOrdId: number;

    /**
     * The type of the replacement order.
     * - 0 Unknown
     * - 1 Market
     * - 2 Limit
     * - 3 StopMarket
     * - 4 StopLimit
     * - 5 TrailingStopMarket
     * - 6 TrailingStopLimit
     * - 7 BlockTrade
     * @type {OrderType}
     * @memberof CancelReplaceOrderRequest
     */
    OrderType: OrderType;

    /**
     * The side of the replacement order:
     * - 0 Buy
     * - 1 Sell
     * - 2 Short (reserved for future use)
     * - 3 Unknown (error condition)
     * @type {Side}
     * @memberof CancelReplaceOrderRequest
     */
    Side: Side;

    /**
     * The ID of the account under which the original order was placed and the
     * new order will be placed.
     * @type {number}
     * @memberof CancelReplaceOrderRequest
     */
    AccountId: number;

    /**
     * The ID of the instrument being traded.
     * @type {number}
     * @memberof CancelReplaceOrderRequest
     */
    InstrumentId: number;

    /**
     * The offset by which to trail the market in one of the trailing order types.
     * Set this to the current price of the market to ensure that the trailing offset is the
     * amount intended in a fast-moving market
     * @type {number}
     * @memberof CancelReplaceOrderRequest
     */
    TrailingAmount: number;

    /**
     * When entering a Trailing Limit order, set this to offset the activation price.
     * This allows you to activate your order away from the market.
     * @type {number}
     * @memberof CancelReplaceOrderRequest
     */
    LimitOffset: number;

    /**
     * Quantity to Display on the Market. If your order is for 1000,
     * and you only want to show 100 at a time in market data, set this to 100. Set to 0 to display all
     * @type {number}
     * @memberof CancelReplaceOrderRequest
     */
    DisplayQuantity: number;

    /**
     * The price at which to execute the new order, if the order is a Limit order.
     * @type {number}
     * @memberof CancelReplaceOrderRequest
     */
    LimitPrice: number;

    /**
     * The price at which to execute the new order, if the order is a Stop order
     * (either buy or sell).
     * @type {number}
     * @memberof CancelReplaceOrderRequest
     */
    StopPrice: number;

    /**
     * When entering a stop/trailing order, set PegPriceType to the type of price
     * that pegs the stop.
     * - 1 Last
     * - 2 Bid
     * - 3 Ask
     * - 4 Midpoint
     * @type {PegPriceType}
     * @memberof CancelReplaceOrderRequest
     */
    PegPriceType: PegPriceType;

    /**
     * The period during which the new order is executable.
     * - 0 Unknown (error condition)
     * - 1 GTC good ’til canceled
     * - 3 IOC immediate or canceled
     * - 4 FOK fill or kill — fill the order immediately, or cancel it immediately
     *
     * There may be other settings for TimeInForce depending on the trading venue
     * @type {TimeInForce}
     * @memberof CancelReplaceOrderRequest
     */
    TimeInForce: TimeInForce;

    /**
     * One Cancels the Other — If the order being canceled in this call is order
     * A, and the order replacing order A in this call is order B, then OrderIdOCO refers
     * to an order C that is currently open. If order C executes, then order B is canceled.
     * You can also set up order C to watch order B in this way, but that will require an
     * update to order C.
     * @type {number}
     * @memberof CancelReplaceOrderRequest
     */
    OrderIdOCO: number;

    /**
     * The amount of the order (buy or sell).
     * @type {number}
     * @memberof CancelReplaceOrderRequest
     */
    Quantity: number;
}

export interface SendOrderRequest {

    /**
     * The ID of the account placing the order.
     * @type {number}
     * @memberof SendOrderRequest
     */
    AccountId: number;

    /**
     * A user-assigned ID for the order (like a purchase-order number
     * assigned by a company). This ID is useful for recognizing future states related to
     * this order. ClientOrderId defaults to 0.
     * @type {number}
     * @memberof SendOrderRequest
     */
    ClientOrderId: number;

    /**
     * The quantity of the instrument being ordered.
     * @type {number}
     * @memberof SendOrderRequest
     */
    Quantity: number;

    /**
     * The quantity available to buy or sell that is publicly displayed to the market.
     * To display a DisplayQuantity value, an order must be a Limit order with a reserve
     * @type {number}
     * @memberof SendOrderRequest
     */
    DisplayQuantity: number;

    /**
     * If you enter a Limit order with a reserve, you must set UseDisplayQuantity to true
     * @type {boolean}
     * @memberof SendOrderRequest
     */
    UseDisplayQuantity: boolean;

    /**
     * The price at which to execute the order, if the order is a Limit order
     * @type {number}
     * @memberof SendOrderRequest
     */
    LimitPrice: number;

    /**
     * One *Cancels the Other* — If this order is order A, *OrderIdOCO* refers to
     * the order ID of an order B (which is not the order being created by this call). If
     * order B executes, then order A created by this call is canceled. You can also set
     * up order B to watch order A in the same way, but that may require an update to
     * order B to make it watch this one, which could have implications for priority in the
     * order book. See **CancelReplaceOrder** and **ModifyOrder**.
     * @type {number}
     * @memberof SendOrderRequest
     */
    OrderIdOCO: number;

    /**
     * The type of this order, as expressed in integer format. One of:
     * - 1 Market
     * - 2 Limit
     * - 3 StopMarket
     * - 4 StopLimit
     * - 5 TrailingStopMarket
     * - 6 TrailingStopLimit
     * - 7 BlockTrade.
     * @type {number}
     * @memberof SendOrderRequest
     */
    OrderType: OrderType;

    /**
     * When entering a stop/trailing order, set *PegPriceType* to the type of price
     * that pegs the stop.
     * - 1 Last
     * - 2 Bid
     * - 3 Ask
     * - 4 Midpoint
     * @type {PegPriceType}
     * @memberof SendOrderRequest
     */
    PegPriceType: PegPriceType;

    /**
     * The ID of the instrument being traded in the order
     * @type {number}
     * @memberof SendOrderRequest
     */
    InstrumentId: number;

    /**
     * The offset by which to trail the market in one of the trailing order types.
     * Set this to the current price of the market to ensure that the trailing offset is the
     * amount intended in a fast-moving market.
     * @type {number}
     * @memberof SendOrderRequest
     */
    TrailingAmount: number;

    /**
     * The amount by which a trailing limit order is offset from the activation price.
     * @type {number}
     * @memberof SendOrderRequest
     */
    LimitOffset: number;

    /**
     * The side of the replacement order:
     * - 0 Buy
     * - 1 Sell
     * - 2 Short (reserved for future use)
     * - 3 Unknown (error condition)
     * @type {Side}
     * @memberof SendOrderRequest
     */
    Side: Side;

    /**
     * The price at which to execute the order, if the order is a Stop order
     * (either buy or sell).
     * @type {number}
     * @memberof SendOrderRequest
     */
    StopPrice: number;

    /**
     * The period during which the new order is executable.
     * - 0 Unknown (error condition)
     * - 1 GTC good ’til canceled
     * - 3 IOC immediate or canceled
     * - 4 FOK fill or kill — fill the order immediately, or cancel it immediately
     *
     * There may be other settings for TimeInForce depending on the trading venue
     *
     * @type {TimeInForce}
     * @memberof SendOrderRequest
     */
    TimeInForce: TimeInForce;

    /**
     * The ID of the Order Management System on which the order is being placed.
     * @type {number}
     * @memberof SendOrderRequest
     */
    OMSId: number;
}

export interface OrderFeeRequest {
    /**
     * The ID of the Order Management System on which the trade would take place.
     * @type {number}
     * @memberof OrderFeeRequest
     */
    OMSId: number;

    /**
     * The ID of the account requesting the fee estimate
     * @type {number}
     * @memberof OrderFeeRequest
     */
    AccountId: number;

    /**
     * The proposed instrument against which a trading fee would be charged
     * @type {number}
     * @memberof OrderFeeRequest
     */
    InstrumentId: number;

    /**
     * The ID of the product (currency) in which the fee will be denominated.
     * @type {number}
     * @memberof OrderFeeRequest
     */
    ProductId: number;

    /**
     * The quantity of the proposed trade for which the Order Management System would charge a fee.
     * @type {number}
     * @memberof OrderFeeRequest
     */
    Amount: number;

    /**
     * The price at which the proposed trade would take place. Supply your price for a limit order; 
     * the exact price is difficult to know before execution.
     * @type {number}
     * @memberof OrderFeeRequest
     */
    Price: number;

    /**
     * The type of the proposed order. One of:
     * - 0 Unknown
     * - 1 Market
     * - 2 Limit
     * - 3 StopMarket
     * - 4 StopLimit
     * - 5 TrailingStopMarket
     * - 6 TrailingStopLimit
     * - 7 BlockTrade
     * @type {OrderType}
     * @memberof OrderFeeRequest
     */
    OrderType: OrderType;

    /**
     * Depending on the venue, there may be different fees for a maker (the
     * order remains on the books for a period) or taker (the order executes directly). If
     * the user places a large order that is only partially filled, he is a partial maker.
     * - 0 Unknown
     * - 1 Maker
     * - 2 Taker
     * @type {MakerTaker}
     * @memberof OrderFeeRequest
     */
    MakerTaker: MakerTaker;
}
