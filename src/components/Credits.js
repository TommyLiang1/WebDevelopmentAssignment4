/*==================================================
src/components/Credits.js

The Credits component contains information for Credits page view.
Note: You need to work on this file for the Assignment.
==================================================*/
import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Credits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountBalance: 0,
      creditsArray: [],
    };
  }


  creditView = () => {
    const listofCredits = this.props.creditsArray.map((item) =>
      <li style={{listStylePosition: "inside"}} key={item.description}>{item.description}, ${item.amount}, {item.date.slice(0,10)}</li>
    )
    return (
      <ul>{listofCredits}</ul>
    )
  }

  addCredit = (event) => {
    event.preventDefault();
    // call function in App.js
    this.props.addCredits(event);

    //setting time
    var currentDate = new Date();
    var Month = currentDate.getUTCMonth() + 1;
    var Day = currentDate.getUTCDate();
    var Year = currentDate.getUTCFullYear();
    var Time = Year + '-' + Month + '-' + Day;

    // if description and amount boxes are empty there is nothing to add so return
    if (event.target.description.value === "" || event.target.amount.value === ""){
      return;
    }
    else{
      this.setState((prevState) => ({ 
        // states the balance to the nearest 2 digits
        accountBalance: (Number(this.state.accountBalance) + Number(event.target.amount.value)).toFixed(2),
        // add credit to creditsArray alongside with the exist logs
        creditsArray: [...prevState.creditsArray, {amount: event.target.amount.value, description: event.target.description.value, date: Time}],
      }))
    }
  }

  render() {
    return (
      <div>
        <h1>Credits</h1>
        {this.creditView()}
        <h2>Balance: {this.props.accountBalance}</h2>
        <form onSubmit={this.addCredit}>
          <label>
            Description:
            <input type="text" name="description" />
          </label>
          <label>
            Amount:
            <input type="number" step=".01" name="amount" />
          </label>
          <button type="submit">Add Credit</button>
        </form>
        <Link to="/">Return to Home</Link>
        <br /><br />
        <Link to="/debits">Debits</Link>
      </div>
    );
  }
}

export default Credits;