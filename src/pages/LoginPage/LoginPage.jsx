import React from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';



function LoginPage() {

  const navigate = useNavigate();

  class LoginForm extends React.Component{
    constructor(){
      super();
      this.state = {
        //holds the users values for the form fields
        input: {},
        //holds errors that occur during form submission
        errors: {}
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    //called when the user interacts with any input field
    handleChange(event){
      let input = this.state.input;
      //identify the input field based on its name attribute
      input[event.target.name] = event.target.value;
      this.setState({input});
    }
    //called when the form is submitted
    async handleSubmit(event){
      //prevents the default form submission behavior
      event.preventDefault();
      // console.log("submitted but not validated");
      //calls the validate function to check the validity of the form inputs and if it is valid the form is submitted
      if (this.validate()){
        // console.log(this.state);

        let input = {};
        input["username"] = "";
        input["password"] = "";
        this.setState({input : input});

        console.log("submitted. username is ", this.state.input["username"]);
        // redirect
        navigate("/");
      }
    }

    validate() {
      let input = this.state.input;
      let errors = {};
      let isValid = true;

      //checks if the username is null or undefined
      if (!input["username"]){
        isValid = false;
        errors["username"] ="Please enter your username";
      }

      if (typeof input["username"] !== "undefined"){
        const re = /^\S*$/;
        if(input["username"].length < 6 || !re.test(input["username"])){
          isValid = false;
          errors["username"] = "Please enter valid username"
        }
      }

      this.setState({errors: errors});

      return isValid;
    }
    render(){
      return(
        <div className='container'>
          <h1>LOGIN</h1>
          <form onSubmit={this.handleSubmit}>
            <div className='form-group'>
              <label for="email" className='form-label fs-5 fw-bold'>USERNAME:</label>
              <input
              type="text"
              name="username"
              value={this.state.input.username}
              onChange={this.handleChange}
              className='form-control fs-5'
              placeholder='Enter username'
              id="username"
              />
              <div className='text-danger form-text fw-bold fs-5'>{this.state.errors.email}</div>

            </div>
            <input 
              type="submit"
              value="LOGIN"
              className='btn btn-success d-flex justify-content-center mx-auto mb-3 px-3'
              />
          </form>
        </div>
      )
    }
  }
  return (
    <div className="App">
      <LoginForm/>
    </div>
  );
}

export default LoginPage
