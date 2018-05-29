import { PolymerElement, html } from "@polymer/polymer/polymer-element";
import { GestureEventListeners } from "@polymer/polymer/lib/mixins/gesture-event-listeners";
import "@polymer/iron-media-query/iron-media-query";
import "gw2-coin-input/gw2-coin-input";
import "gw2-coin-output/gw2-coin-output";
/**
  `gw2-tpcalc` renders a paper style Trading Post Calculator for Guild Wars 2.

  @element gw2-tpcalc
  @demo demo/index.html 
*/
class GW2TPCalc extends GestureEventListeners(PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        display: block;        
      }

      h2 {
        text-transform: uppercase;
        font-size: 1rem;
        font-weight: 100;
        margin: 0;
      }

      .row {
        display: flex;
        flex-direction: column;
      }

      .row[wide-layout] {
        flex-direction: row;
        justify-content: space-between;
      }

      .column {
        display: flex;
        flex-direction: column;
      }

      .row[wide-layout] .column {
        flex-basis: calc(50% - .5rem);
      }

      .card {
        background-color: var(--gw2-tpcalc-card-background-color, #EEEEEE);
        border-radius: .1rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 
                    0 1px 2px rgba(0,0,0,0.24);
        color: var(--gw2-tpcalc-card-color, #000000);
        margin-bottom: 1rem;
        padding: .5rem;
      }

      .card p:last-child {
        margin-bottom: 0;
      }

      .row[wide-layout] .results {
        height: 100%;
      }

      .results p {
        margin: .5rem 0;
      }

      .results p:first-of-type {
        margin-top: 1rem;
      }

      .changemode {
        text-align: center;
        margin-top: 0;
      }

      .changemode span {
        font-size: 80%;
        text-decoration: underline;
        cursor: pointer;
      }

    </style>

    <iron-media-query query="(min-width: 600px)" query-matches="{{ isWide }}"></iron-media-query>

    <div class="row" wide-layout$="{{ isWide }}">
      <div class="column">
        
        <div class="card">
          <h2>Buy Price</h2>
          <gw2-coin-input is-single-input="{{ isEvonGnashblade }}" coin-string="{{ buyPrice }}"></gw2-coin-input>
        </div>

        <div class="card">
          <h2>Sell Price</h2>
          <gw2-coin-input is-single-input="{{ isEvonGnashblade }}" coin-string="{{ sellPrice }}"></gw2-coin-input>
        </div>

        <div class="card">
          <div class="input-list">
            <paper-input label="Quantity" always-float-label="" type="tel" allowed-pattern="^\\d*\\.?\\d+\$" maxlength="7" value="{{ quantity }}"></paper-input>
          </div>
        </div>

      </div>
      <div class="column">

        <div class="card results">
          <h2>Result</h2>
          <p><strong>Cost:</strong> 
             <gw2-coin-output coin-string="[[ cost ]]"></gw2-coin-output></p>
          <p><strong>Listing Fee:</strong> 
             <gw2-coin-output coin-string="[[ listingFee ]]"></gw2-coin-output></p>
          <p><strong>Selling Fee:</strong> 
             <gw2-coin-output coin-string="[[ sellingFee ]]"></gw2-coin-output></p>
          <p><strong>Profit:</strong> 
             <gw2-coin-output coin-string="[[ profit ]]"></gw2-coin-output></p>
        </div> 

      </div>
    </div>

    <p class="changemode">
      <span on-tap="changeMode">
        <template is="dom-if" if="{{ !_isEvonGnashblade(isEvonGnashblade) }}">
          Enable
        </template>
        <template is="dom-if" if="{{ _isEvonGnashblade(isEvonGnashblade) }}">
          Disable
        </template>
        Evon Gnashblade Mode</span>
    </p>
    `;
  }

  static get is() {
    return "gw2-tpcalc";
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
        computed: '_calculateCost(quantity, buyPrice)'
      },
      listingFee: {
        type: Number,
        computed: '_calculateFee(quantity, sellPrice, 5)'
      },
      sellingFee: {
        type: Number,
        computed: '_calculateFee(quantity, sellPrice, 10)'
      },
      profit: {
        type: Number
      },
      quantity: {
        type: Number,
        value: 1
      },
      isEvonGnashblade: {
        type: Boolean,
        observer: "_isEvonGnashbladeChanged"
      },
      isWide: {
        type: Boolean
      }
    };
  }

  static get observers() {
    return [
      "_calculateProfit(listingFee, sellingFee, cost, sellPrice, quantity)"
    ];
  }

  ready() {
    super.ready();

    var value = localStorage.getItem("isEvonGnashblade");

    // Convert the string to a Boolean value
    var value_check = value == "true";

    this.set("isEvonGnashblade", value_check);
  }

  _calculateCost(quantity, buyPrice) {
    return quantity * buyPrice;
  }

  _calculateFee(quantity, price, tax) {
    if (this._isZero(price) || !quantity) return 0;
    return Math.max(Math.round(quantity * price * (tax / 100)), 1);
  }

  _calculateProfit(listingFee, sellingFee, cost, sellPrice, quantity) {
    var totalProfit = 0;

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

    totalProfit = sellPrice * quantity - listingFee - sellingFee - cost;
    this.set("profit", totalProfit);
  }

  _isZero(value) {
    if (value === 0 || value === NaN || value === "") {
      return true;
    }

    return false;
  }

  changeMode() {
    if (!this.isEvonGnashblade) {
      return this.set("isEvonGnashblade", true);
    }

    return this.set("isEvonGnashblade", false);
  }

  _isEvonGnashbladeChanged() {
    localStorage.setItem("isEvonGnashblade", this.isEvonGnashblade.toString());
  }

  _isEvonGnashblade(bool) {
    if (bool) {
      return true;
    }

    return false;
  }
}

window.customElements.define(GW2TPCalc.is, GW2TPCalc);
