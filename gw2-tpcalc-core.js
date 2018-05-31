import { PolymerElement, html } from "@polymer/polymer/polymer-element";

/**
  `gw2-tpcalc-core` contains the tp-calc logic for you to make your own visual representation of the calculator.

  @element gw2-tpcalc-core
  @demo demo/index.html 
*/
class GW2TPCalcCore extends PolymerElement {
  static get is() {
    return 'gw2-tpcalc-core';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: none;
        }
      </style>
    `;
  }

  static get properties() {
    return {
      buyPrice: {
        type: Number
      },
      sellPrice: {
        type: Number
      },
      cost: {
        type: Number,
        computed: "_calculateCost(quantity, buyPrice)",
        notify: true
      },
      listingFee: {
        type: Number,
        computed: "_calculateFee(quantity, sellPrice, 5)",
        notify: true
      },
      sellingFee: {
        type: Number,
        computed: "_calculateFee(quantity, sellPrice, 10)",
        notify: true
      },
      profit: {
        type: Number,
        computed: "_calculateProfit(listingFee, sellingFee, cost, sellPrice, quantity)",
        notify: true
      },
      quantity: {
        type: Number,
        value: 1,
        notify: true
      }
    };
  }

  /**
   * Calculates the cost by multiplying quantity and buyPrice.
   * @returns {number}
   * @param {number} quantity
   * @param {number} buyPrice
   */
  _calculateCost(quantity, buyPrice) {
    return quantity * buyPrice;
  }

  /**
   * Calculate a fee. Tax is a percentage.
   * @returns {number}
   * @param {number} quantity 
   * @param {number} price 
   * @param {number} tax 
   */
  _calculateFee(quantity, price, tax) {
    if (this._isZero(price) || !quantity) return 0;
    return Math.max(Math.round(quantity * price * (tax / 100)), 1);
  }

  /**
   * Calculate the profit
   * @returns {number}
   * @param {number} listingFee 
   * @param {number} sellingFee 
   * @param {number} cost 
   * @param {number} sellPrice 
   * @param {number} quantity 
   */
  _calculateProfit(listingFee, sellingFee, cost, sellPrice, quantity) {
    if (isNaN(listingFee)) {
      listingFee = 0;
    }

    if (isNaN(sellingFee)) {
      sellingFee = 0;
    }

    if (isNaN(cost)) {
      cost = 0;
    }

    if (isNaN(sellPrice)) {
      sellPrice = 0;
    }

    if (isNaN(quantity)) {
      quantity = 0;
    }

    return (sellPrice * quantity) - listingFee - sellingFee - cost;
  }

  _isZero(value) {
    if (value === 0 || value === NaN || value === "") {
      return true;
    }

    return false;
  }
}

window.customElements.define(GW2TPCalcCore.is, GW2TPCalcCore);