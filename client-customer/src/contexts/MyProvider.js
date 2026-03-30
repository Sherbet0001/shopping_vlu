import React, { Component } from "react";
import MyContext from "./MyContext";

class MyProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // ===== Global variables =====
      token: "",
      customer: null,
      mycart: [],

      // ===== Global functions =====
      setToken: this.setToken,
      setCustomer: this.setCustomer,
      setMycart: this.setMycart,
    };
  }

  // ===== Set token =====
  setToken = (value) => {
    this.setState({ token: value });
  };

  // ===== Set customer =====
  setCustomer = (value) => {
    this.setState({ customer: value });
  };

  // ===== Set cart =====
  setMycart = (value) => {
    this.setState({ mycart: value });
  };

  render() {
    return (
      <MyContext.Provider value={this.state}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default MyProvider;