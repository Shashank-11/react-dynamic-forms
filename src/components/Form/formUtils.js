import moment from 'moment'
import validate from 'validate.js'

validate.extend(validate.validators.datetime, {
  parse: function(value, options) {
    return +moment.utc(value);
  },
  format: function(value, options) {
    return moment.utc(value).format('DD/MM/YYYY');
  }
});

// check if blank contraint function
const isPresent = ((val) => {
  return {
    presence: {
      allowEmpty: false,
      message: `^Please enter your ${val}`
    }
  }
})

//check if the value is numeric
const isNumeric = (val) => {
  return {
    numericality: {
      onlyInteger: true,
      message: `^Please enter a valid ${val}`
    }
  }  
}

//validation constraints
export const constraints = {  
  fullName: isPresent('name'),
  guardianName: isPresent('name'),
  mobileNumber: isNumeric('mobile number'),
  homeNumber: isNumeric('home number'),
  guardianContact: isNumeric('guardian number'),
  dob: {
    datetime: {
      latest: moment.utc().subtract(18, 'years'),
      message: "^You need to be atleast 18 years old"
    }
  }
}