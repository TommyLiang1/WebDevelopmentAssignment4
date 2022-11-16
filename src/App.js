/*==================================================
src/App.js
This is the top-level component of the app.
It contains the top-level state.
==================================================*/
import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
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
var Day = currentDate.getUTCDate();
var Year = currentDate.getUTCFullYear();
var Time = Year + '-' + Month + '-' + Day;

class App extends Component {
  constructor() {  // Create and initialize state
    super(); 
    this.state = {
      accountBalance: 1234567.89,
      debitList: [],
      currentUser: {
        userName: 'Joe Smith',
        memberSince: '11/22/99',
      },
      //creating two Arrays to be used to store data for debit and credit
      creditsArray: [],
      debitsArray: [],
      
    }
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
    this.setState({creditsArray: credit.data});
    this.setState({debitsArray: debit.data});
    
  }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {  
    const newUser = {...this.state.currentUser}
    newUser.userName = logInInfo.userName
    this.setState({currentUser: newUser})
  }

  // helper function alongside addDebit in Debits.js to add Debits
  addDebits = (event) => {

    // if empty there is nothing to add so return aka dont do anything
    if (event.target.description.value === "" || event.target.amount.value === ""){
      return;
    }
    else{
      this.setState((prevState) => ({ 
        // states the balance to the nearest 2 digits as requested
        accountBalance: (this.state.accountBalance - event.target.amount.value).toFixed(2), 
        // triple dot copies the contents of the debitArray
        debitsArray: [...prevState.debitsArray, {amount: event.target.amount.value, description: event.target.description.value, date: Time}],
    }))
   }
  }

  addCredits = (event) => {
    // if empty, don't do anything and return
    // if(this.state.creditsArray.indexOf(event.target.description.value) !== -1)
    //   return;
    if(event.target.description.value === "" || event.target.amount.value === ""){
      return;
    }
    this.setState((prevState) => ({
      // add to account balance as credit is positive
      accountBalance: (Number(this.state.accountBalance) + Number(event.target.amount.value)).toFixed(2),
      // show in the credits array along with the previous credit records
      creditsArray: [...prevState.creditsArray, {amount : event.target.amount.value, description: event.target.description.value, date: Time}],
    }))
  }


  // Create Routes and React elements to be rendered using React components
  render() {  
    // Create React elements and pass input props to components
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance} />);
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince} />
    );
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)

    // Debit component will state the account balance on the page alongside being able to add debit and display the array
    const DebitsComponent = () => (<Debits accountBalance = {this.state.accountBalance} debitsArray = {this.state.debitsArray} addDebits = {this.addDebits} />); 

    // Credit component will state the account balance on the page alongside being able to add ceredit and display the array
    const CreditsComponent = () => (<Credits accountBalance = {this.state.accountBalance} creditsArray = {this.state.creditsArray} addCredits = {this.addCredits} />);

    // Important: Include the "basename" in Router, which is needed for deploying the React app to GitHub Pages
    return(
      <Router basename="/WebDevelopmentAssignment4">
        <div>
          <Route exact path="/" render={HomeComponent}/>
          <Route exact path="/userProfile" render={UserProfileComponent}/>
          <Route exact path="/login" render={LogInComponent}/>
          <Route exact path="/credits" render={CreditsComponent}/>
          <Route exact path="/debits" render={DebitsComponent}/>
        </div>
      </Router>
    );
  }
}

export default App;