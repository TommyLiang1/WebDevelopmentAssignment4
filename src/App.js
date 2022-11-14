/*==================================================
src/App.js
This is the top-level component of the app.
It contains the top-level state.
==================================================*/
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
//importing axios to read the data from the heroku api page
import axios from 'axios';

// Import other components
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Credits from './components/Credits';
import Debits from './components/Debits';

//globally calling time once instead of calling it twice for both debit and credit
var currentDate = new Date();
var Month = currentDate.getUTCMonth() + 1;
var Day = currentDate.getUTCDay();
var Year = currentDate.getUTCFullYear();
var Time =  Day + '/' + Month + '/' + Year ;

class App extends Component {
  constructor() {  // Create and initialize state
    super();
    this.state = {
      currentUser:0,//first num will be index of current user
      all_users: [
        {userName: 'Joe Smith',
        memberSince: '11/22/99',
        accountBalance: 0,
        creditsArray: [],
        debitsArray: []}
      ]} //making each user have their own array so they have their own balance
  }

  //checks heroku for both debit and credit (Populates the pages with the preexisting items purchased)
  async componentDidMount() {
    // setting the API link to a variable
    let creditAPI = 'https://moj-api.herokuapp.com/credits'
    let debitAPI = 'https://moj-api.herokuapp.com/debits';

    //setting a variable to the API response to the link
    let credit = await axios.get(creditAPI);
    let debit = await axios.get(debitAPI);

    //sets the array of items on the linked page to the data
    this.setState({
      currentUser:0,//first num will be index of current user
      all_users: [
        {userName: 'Joe Smith',
        memberSince: '11/22/1999',
        accountBalance: 1234567.89,
        creditsArray: credit.data,
        debitsArray: debit.data}
      ]});
  }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {
    // const newUser = { ...this.state.currentUser }
    // newUser.userName = logInInfo.userName
    const userName = logInInfo
    let bool = false;
    for(let i =0; i < this.state.all_users.length ; i++){
      if(userName === this.state.all_users[i].userName){ //if this user already exists 
        bool = true
        this.setState({currentUser : i})
      }
    }
    if(!bool){ //if its a new user
      var currentDate = new Date();
      var Month = currentDate.getUTCMonth() + 1;
      var Day = currentDate.getUTCDay();
      var Year = currentDate.getUTCFullYear();
      var Time =  Day + '/' + Month + '/' + Year ;

      let shallowState = this.state.all_users
      shallowState.push({
        userName: userName,
        memberSince: Time,
        accountBalance: 0,
        creditsArray: [],
        debitsArray: []
      })
      this.setState( {all_users : shallowState})
      this.setState({currentUser : shallowState.length -1})
    }

  }
  //HERE ...prevState.creditsArray, { amount: event.target.amount.value, description: event.target.description.value, date: Time }
  // helper function alongside addDebit in Debits.js to add Debits
  addDebits = (event) => {

    // if empty there is nothing to add so return aka dont do anything
    if (event.target.description.value === "" || event.target.amount.value === "") {
      return;
    }
    let shallowStateUsers = this.state.all_users
    let currentUser =  shallowStateUsers[this.state.currentUser]
    currentUser.accountBalance = (Number(currentUser.accountBalance) - Number(event.target.amount.value)).toFixed(2)
    currentUser.debitsArray.push({ amount: event.target.amount.value, description: event.target.description.value, date: Time })
    shallowStateUsers[this.state.currentUser] = currentUser
    
    this.setState({all_users : shallowStateUsers}) 
  }

  addCredits = (event) => {
    // if empty, don't do anything and return
    if (event.target.description.value === "" || event.target.amount.value === "") {
      return;
    }
    let shallowStateUsers = this.state.all_users
    let currentUser =  shallowStateUsers[this.state.currentUser]
    currentUser.accountBalance = (Number(currentUser.accountBalance) + Number(event.target.amount.value)).toFixed(2)
    currentUser.creditsArray.push({ amount: event.target.amount.value, description: event.target.description.value, date: Time })
    shallowStateUsers[this.state.currentUser] = currentUser
    this.setState({all_users : shallowStateUsers}) 
  }


  // Create Routes and React elements to be rendered using React components
  render() {
    // Create React elements and pass input props to components
    const HomeComponent = () => (<Home accountBalance={this.state.all_users[this.state.currentUser].accountBalance} />);
    const UserProfileComponent = () => (
       //this.state.all_users[this.state.currentUser].userName
      <UserProfile userProfile={this.state.all_users[this.state.currentUser]} memberSince={this.state.currentUser.memberSince} />
    );
    console.log(this.state.all_users)
    // const LogInComponent = () => (<LogIn user={this.state.all_users[this.state.currentUser]} mockLogIn={this.mockLogIn} />)
    const LogInComponent = () => (<LogIn info={this.state} mockLogIn={this.mockLogIn} />)
    // Debit component will state the account balance on the page alongside being able to add debit and display the array
    const DebitsComponent = () => (<Debits accountBalance={this.state.all_users[this.state.currentUser].accountBalance} debitsArray={this.state.all_users[this.state.currentUser].debitsArray} addDebits={this.addDebits} />);

    // Credit component will state the account balance on the page alongside being able to add ceredit and display the array
    const CreditsComponent = () => (<Credits accountBalance={this.state.all_users[this.state.currentUser].accountBalance} creditsArray={this.state.all_users[this.state.currentUser].creditsArray} addCredits={this.addCredits} />);

    // Important: Include the "basename" in Router, which is needed for deploying the React app to GitHub Pages
    return (
      <Router basename="/WebDevelopmentAssignment4">
        <div>
          <Route exact path="/" render={HomeComponent} />
          <Route exact path="/userProfile" render={UserProfileComponent} />
          <Route exact path="/login" render={LogInComponent} />
          <Route exact path="/credits" render={CreditsComponent} />
          <Route exact path="/debits" render={DebitsComponent} />
        </div>
      </Router>
    );
  }
}

export default App;