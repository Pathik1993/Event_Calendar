import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import i18n from "./i18n";
import getsetlanguge from "./languagefunction";

export default class Second_demo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    i18n.locale = "en";
    console.warn(i18n.t("logout"));
    i18n.locale = "hi";
    console.warn(i18n.t("logout"));
  }
  onsetlanguage(lable) {
    i18n.locale = lable;
  }

  render() {
    const abc = getsetlanguge(false);
    console.warn("abc", abc);
    return (
      <TouchableOpacity
        onPress={() => this.onsetlanguage("hi")}
        style={{ justifyContent: "center", flex: 1, alignItems: "center" }}
      >
        <Text>{i18n.t("logout")}</Text>
      </TouchableOpacity>
    );
  }
}
