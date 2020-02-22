import React, { Component } from "react";
import { View, Text, TouchableOpacity, AsyncStorage } from "react-native";
import i18n from "./i18n";
import getsetlanguge from "./languagefunction";
import { insertleng, deleteLeng, getLeng } from "./Database/allSchema";

export default class DataBaseDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lable: i18n.t("logout"),
      getlable: ""
    };
  }
  componentDidMount() {
    // i18n.locale = "en";
    // console.warn(i18n.t("logout"));
    //i18n.locale = "hi";
    //console.warn(i18n.t("logout"));
    // AsyncStorage.getItem("savelanguage")
    //   .then(value => {
    //     console.warn("AsyncStorage1", value);
    //     console.warn(i18n.t("logout"));
    //   })
    //   .done();
    let url =
      "https://firebasestorage.googleapis.com/v0/b/mlkitproject-ea18a.appspot.com/o/en.json?alt=media&token=a4407c77-ef1b-4fc9-9ef8-8b529ebf545c";
    fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        // console.warn("hello", responseJson);

        this.saveUser(1, responseJson);
      })
      .then(() => {})
      .catch(error => {});

    setTimeout(() => {
      getLeng()
        .then(leng => {
          var getData = JSON.parse(leng[0].leng);
          var secondgetData = getData.logout;
          this.setState({ getlable: secondgetData });
        })
        .catch(error => {
          console.warn(error.toString());
        });
    }, 10000);
  }

  saveUser = (id, objleng) => {
    console.warn("fullname 123", JSON.stringify(objleng));
    console.warn("id", id);
    deleteLeng()
      .then(() => {
        const newUser = {
          id: id === null ? 1 : id, // primary key
          leng: objleng === null ? {} : JSON.stringify(objleng)
        };
        insertleng(newUser)
          .then(() => {
            console.warn("Insert Suceess");
            console.warn(newUser);
          })
          .catch(error => {
            console.warn("error 123", error.toString());
          });
      })
      .catch(error => {
        console.warn("Error", error.toString());
      });
  };

  onsetlanguage(lable) {
    i18n.locale = "hi";
    console.warn("lale", lable);
    this.setState({ lable: i18n.t("logout") });

    //   // AsyncStorage.setItem("savelanguage", lable);
    //   i18n.locale = lable;
  }

  render() {
    // const abc = getsetlanguge(false);
    // console.warn("abc", abc);
    // console.warn(i18n.t("logout"));
    return (
      <TouchableOpacity
        onPress={() => this.onsetlanguage("hi")}
        style={{ justifyContent: "center", flex: 1, alignItems: "center" }}
      >
        {/* <Text>{i18n.t("logout")}</Text> */}
        <Text>{this.state.getlable}</Text>
      </TouchableOpacity>
    );
  }
}
