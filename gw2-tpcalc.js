import { PolymerElement, html } from "@polymer/polymer/polymer-element";
import "@polymer/iron-media-query/iron-media-query";
import "gw2-coin-input/gw2-coin-input";
import "gw2-coin-output/gw2-coin-output";
import "./gw2-tpcalc-core";

/**
  `gw2-tpcalc` renders a paper style Trading Post Calculator for Guild Wars 2.

  @element gw2-tpcalc
  @demo demo/index.html 
*/
class GW2TPCalc extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      }

      h2 {
        font-size: 1rem;
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
        flex-basis: calc(66% - .5rem);
      }

      .row[wide-layout] .column:last-child {
        flex-basis: calc(33% - .5rem);
      }

      .card {
        background-color: var(--gw2-tpcalc-card-background-color, #EEEEEE);
        border-radius: 2px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 
                    0 1px 2px rgba(0,0,0,0.24);
        color: var(--gw2-tpcalc-card-color, #000000);
        margin-bottom: 1rem;
        padding: 1rem 1rem .75rem;
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
    </style>

    <gw2-tpcalc-core
      buy-price="[[buyPrice]]"
      sell-price="[[sellPrice]]"
      cost="{{cost}}"
      listing-fee="{{listingFee}}"
      selling-fee="{{sellingFee}}"
      profit="{{profit}}"
      quantity="{{quantity}}"></gw2-tpcalc-core>

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
        type: Number
      },
      listingFee: {
        type: Number
      },
      sellingFee: {
        type: Number
      },
      profit: {
        type: Number
      },
      quantity: {
        type: Number
      },
      isEvonGnashblade: {
        type: Boolean,
        value: false
      },
      isWide: {
        type: Boolean
      }
    };
  }

  changeMode() {
    if (!this.isEvonGnashblade) {
      return this.set("isEvonGnashblade", true);
    }

    return this.set("isEvonGnashblade", false);
  }

  _isEvonGnashblade(bool) {
    if (bool) {
      return true;
    }

    return false;
  }
}

window.customElements.define(GW2TPCalc.is, GW2TPCalc);
