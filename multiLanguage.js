import React, { Component } from "react";
import {
  I18nManager,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import * as RNLocalize from "react-native-localize";
import i18n from "./i18n";

// import i18n from "i18n-js";
// import memoize from "lodash.memoize";

// const translationGetters = {
//   // lazy requires (metro bundler does not support symlinks)
//   en: () => require("./language/en.json"),
//   fr: () => require("./language/fr.json")
// };

// const translate = memoize(
//   (key, config) => i18n.t(key, config),
//   (key, config) => (config ? key + JSON.stringify(config) : key)
// );

// const setI18nConfig = lable => {
//   // fallback if no available language fits
//   const fallback = { languageTag: "fr", isRTL: false };

//   const { languageTag, isRTL } =
//     RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
//     fallback;

//   // clear translation cache
//   translate.cache.clear();
//   // update layout direction
//   I18nManager.forceRTL(isRTL);
//   // set i18n-js config
//   i18n.translations = { [languageTag]: translationGetters[languageTag]() };
//   i18n.locale = languageTag;
// };

export default class multiLanguage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    setI18nConfig();
  }

  //   componentDidMount() {
  //     RNLocalize.addEventListener("change", this.handleLocalizationChange);
  //   }

  //   componentWillUnmount() {
  //     RNLocalize.removeEventListener("change", this.handleLocalizationChange);
  //   }

  //   handleLocalizationChange = () => {
  //     setI18nConfig();
  //     this.forceUpdate();
  //   };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.value}>{i18n.t("logout")}</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  value: {
    fontSize: 18
  }
});
