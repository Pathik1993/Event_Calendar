import React, { Component } from "react";
import { View, Text } from "react-native";
import { getLeng } from "./Database/allSchema";

export default class GetData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getlable: ""
    };
  }
  componentWillMount() {
    getLeng()
      .then(leng => {
        var getData = JSON.parse(leng[0].leng);
        var secondgetData = getData.logout;
        this.setState({ getlable: secondgetData });
      })
      .catch(error => {
        console.warn(error.toString());
      });
  }
  render() {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text> {this.state.getlable} </Text>
      </View>
    );
  }
}
