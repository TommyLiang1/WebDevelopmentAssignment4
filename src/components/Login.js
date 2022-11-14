/*==================================================
src/components/Login.js

The LogIn component is used to demonstrate the use of Redirect.
Note: You don't need to work on this file for the Assignment.
==================================================*/
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {Link} from 'react-router-dom';

class LogIn extends Component {
  constructor (props) {  // Create and initialize state
    super(props)
    this.state =  {username : this.props.info.all_users[this.props.info.currentUser].userName}
    // this.props.info
      // redirect: false  // Redirect property used to trigger Redirect
  }

  // When User Name input is changed, capture the new input value and update state
  handleChange = (e) => {
    const userName = e.target.value 
    this.setState({username: userName})
  }

  // When user clicked "Log In" button, store user data and then redirect to "User Profile" page
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.mockLogIn(this.state.username)  // Update state in the top-level component (App.js)
    this.setState({redirect: true})  // Update state to trigger Redirect
  }
  
  render () {
    // Redirect to "User Profile" page when "Log In" button is clicked
    if (this.state.redirect) {  
      return (<Redirect to="/userProfile"/>)
    }

    // Render the login form (and call "handleSubmit" method when "Log In" button is clicked to submit form)
    return (
      <div>
        <h1>Login</h1>
        
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>User Name</label>
            <input type="text" name="userName" defaultValue={this.state.username} onChange={this.handleChange} />
          </div>
          <div>
            <label>Password</label>
            <input type="password" name="password" />
          </div>
          <button>Log In</button>
        </form>  
        <br/>
        <Link to="/">Return to Home</Link>
      </div>
    )
  }
}

export default LogIn