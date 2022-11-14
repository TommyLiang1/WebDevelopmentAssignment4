import React, {Component} from 'react';
import {Link} from 'react-router-dom';
class Debits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountBalance: 0,
      debitsArray: [],
    };
  }

  //Creating the list of debits. 
  debitView = () => {
    const listofDebits = this.props.debitsArray.map((eachDebit) => 
      <li style={{listStylePosition: "inside"}} key={eachDebit.description}>{eachDebit.description}, ${eachDebit.amount}, {eachDebit.date.slice(0,10)}</li>
    ) 
    return (
      <ul>{listofDebits}</ul>
    )
  }

  //Function to add a new debit including the description, cost, and time.
  addDebit = (event) => {
    //preventing default stops page from reloading everytime something is added
    event.preventDefault();
    this.props.addDebits(event);

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
        accountBalance: (this.state.accountBalance - event.target.amount.value).toFixed(2), 
        // triple dot copies the contents of the debitArray
        debitsArray: [...prevState.debitsArray, {amount: event.target.amount.value, description: event.target.description.value, date: Time}],
      }))
    }
  }


  render() {
    return (
      <div>
      <h1>Debits</h1>
      {this.debitView()}
      <h2>Balance: {this.props.accountBalance}</h2>
      <form onSubmit={this.addDebit}>
      <label>Description: 
        <input type="text" name="description" />
        </label>
        <label> Amount:
        <input type="number" step="0.01" name="amount" />
        </label>
        <button type="submit">Add Debit</button>
      </form>
      <Link to="/">Return to Home</Link>
      <br /><br />
      <Link to="/credits">Credits</Link>
    </div>
    );
  }
}

export default Debits;