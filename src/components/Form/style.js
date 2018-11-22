import styled from 'styled-components'
import { colors } from '../../constants/css'

export const EmailForm = styled.div`
  display: block;
  margin-top: 10px;
  h2{
    color: ${colors.brandHeader};
    font-weight: 500;
    margin: 0;
  }
  h3 {
    color: ${colors.success};
    font-weight: 500;
  }
`
export const FormGroup = styled.label`
  width: 100%;
  margin-top: 15px;
  display: block;
  font-size: 14px;
  color: ${colors.brandHeader};
  input, select{
    display: block;
    width: 97%;
    height: 30px;
    border-radius: 0;
    background-image: none;
    background-clip: padding-box;
    font-size: 14px;
    margin-top:5px;
    border: solid 1px #f5f5f5;
  }
`
export const FormButton = styled.button`
  width:100%;
  margin-top: 20px;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  line-height: 1.4;
  font-family: Ciutadella-Medium;
  color: rgb(255, 255, 255);
  border-width: 2px;
  border-style: solid;
  border-color: transparent;
  border-image: initial;
  padding: 0.75rem 1rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease-in-out 0s;
  background: #008bce;
`
export const ErrorBox = styled.div`
  position: relative;
  background: ${colors.errorColor};
  font-size: 14px;
  padding: .75rem 1rem;
  margin-top: 1rem;
  :before{
    content: "";
    display: block;
    width: 0;
    height: 0;
    border-left: 0.625rem solid transparent;
    border-right: 0.625rem solid transparent;
    border-bottom: 0.625rem solid ${colors.errorColor};
    position: absolute;
    top: -0.625rem;
    left: 1.25rem;
  }
`
