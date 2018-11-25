import React,{Component} from 'react'
import validate from 'validate.js'

import { constraints } from './formUtils.js'

import {
  EmailForm,
  FormGroup,
  FormButton,
  ErrorBox
} from './style'

class Form  extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  
  static getDerivedStateFromProps(nextProps, prevState) {

    // Assign default values of '' to our controlled input
    //to avoid react error
    if(nextProps.fields && Object.keys(nextProps.fields).length){
      let initialState = nextProps.fields.reduce((acc, val) => {
        acc[val.name] = val.value ? val.value : '';
        return acc;
      },{});
      if(JSON.stringify(initialState) === JSON.stringify(prevState) || Object.keys(prevState).length === 0){
          return {
            ...initialState
        }
      }
        return {
          ...prevState
      }
    }
    return null
  }

  onChange = (field) => {
    return (event) => {
      const state = {}
      state[field] = event.target.value
      this.setState(state)
    }
  }

  //handle validation function
  handleValidations= () => validate(this.state, constraints, { format: 'grouped' }) || null

  //handle submit function
  handleSubmit=(event) => {
    event.preventDefault()
    if (!this.handleValidations()) {
      console.log(this.state)
    } else {
      this.setState({ activateErrors: true })
    }
  }

  //rendering errors
  renderErrorText = (field) => {
    if (this.state.activateErrors) {
      const errors = this.handleValidations()
      return errors && errors[field] && <ErrorBox>{errors[field]}</ErrorBox>
    }
    return null
  }

  //redering form based on type
  renderForm = (field) =>{
  if(field.type ==='select'){
    return(
      <FormGroup>
        {field.label}
        <select  onChange={this.onChange(field.name)} value={this.state[field.name]}>
          {field.options.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </FormGroup>
    )
  }
  return(
    <FormGroup>
      {field.label}
        <input
          type="text"
          value={this.state[field.name]}
          onChange={this.onChange(field.name)}
        />
    </FormGroup>
  )
 }
  render(){
    const { title, fields } = this.props

    return (
      <EmailForm>
        <h2>{title}</h2>
        <form onSubmit={this.handleSubmit}>
          {fields && 
            <div>
              {fields.map((field, index) =>      
                <div key={index}>     
                  {this.renderForm(field)}
                  {this.renderErrorText(field.name)}
                </div>
              )}
            </div>
           }
          <FormButton>
            Submit
          </FormButton>
        </form>
      </EmailForm> 
    )
  }
} 

export default Form
