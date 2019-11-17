import React, { Component } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { Agenda } from "react-native-calendars";
import _ from "lodash";
import I18n from "react-native-i18n";

var moment = require("moment-timezone");
// requires('moment/min/locales.min');
if (I18n.currentLocale() === "nl-NL") {
  moment.locale("nl");
} else {
  moment.locale("en");
}

const url =
  "https://www.googleapis.com/calendar/v3/calendars/bi.edu.kw_o7skn9i4i1t8lvcilacpikrhm8@group.calendar.google.com/events?key=AIzaSyC-Q9jucdl_iZRCgzNOeqqQ6Pqyhyl3fsU";

export default class AgendaScreen extends Component {
  constructor(props) {
    let date = moment().format("MMMM");
    const windowSize = Dimensions.get("window");
    // this.viewHeight = windowSize.height;
    super(props);
    this.state = {
      dataSource: [],
      pageToken: "",
      loading: false,
      scrollPosition: 0,
      selectedDay: moment(),
      month: (date = date[0].toUpperCase() + date.substr(1)),
      error: null,
      refreshing: false
    };
    this.newDate = [];
    this.heights = [];
    // this.onLayout = this.onLayout.bind(this);
  }
  componentDidMount() {
    this.getEvents();
  }
  componentWillUnmount() {
    this.getEvents();
  }
  getEvents = () => {
    const CALENDAR_ID = "someCalendarID";
    const API_KEY = "API-KEY";
    const beginDate = moment();

    let url =
      "https://www.googleapis.com/calendar/v3/calendars/xongolab.com_747tspi56uevi2dcq6rur7hfoo@group.calendar.google.com/events?key=AIzaSyC-Q9jucdl_iZRCgzNOeqqQ6Pqyhyl3fsU";

    this.setState({ loading: true });
    fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          // pageToken: responseJson.nextPageToken,
          dataSource: [...this.state.dataSource, ...responseJson.items],
          loading: false,
          refreshing: false,
          error: responseJson.error || null
        });
      })
      .then(() => {
        this.getDates();
      })
      .catch(error => {
        this.setState({ error, loading: false, refreshing: false });
      });
  };
  getDates() {
    let tempDate = "";
    tempDate = _.map(this.state.dataSource, "start.dateTime");
    this.newDate.length = 0;
    for (let j in tempDate) {
      this.newDate.push(tempDate[j]);
    }
    this.newDate = this.newDate.map(
      (v, i, a) => (a[i - 1] || "").slice(0, 10) !== v.slice(0, 10) && v
    );
  }

  render() {
    return (
      <Agenda
        items={this.state.items}
        loadItemsForMonth={this.loadItems.bind(this)}
        // selected={"2017-05-16"}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
        markingType={"period"}
        // markedDates={{
        //    '2017-05-08': {textColor: '#666'},
        //    '2017-05-09': {textColor: '#666'},
        //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
        //    '2017-05-21': {startingDay: true, color: 'blue'},
        //    '2017-05-22': {endingDay: true, color: 'gray'},
        //    '2017-05-24': {startingDay: true, color: 'gray'},
        //    '2017-05-25': {color: 'gray'},
        //    '2017-05-26': {endingDay: true, color: 'gray'}}}
        // monthFormat={'yyyy'}
        // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
      />
    );
  }

  loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];

          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: "Item for Apthik " + strTime,
              height: Math.max(100, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      //console.log(this.state.items);
      //   const newItems = {};
      //   Object.keys(this.state.items).forEach(key => {
      //     newItems[key] = this.state.items[key];
      //   });
      //   this.setState({
      //     items: newItems
      //   });
    }, 1000);
    // console.log(`Load Items for ${day.year}-${day.month}`);
  }

  renderItem(item) {
    return (
      <View style={[styles.item, { height: item.height }]}>
        <Text>{item.name}</Text>
      </View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split("T")[0];
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  }
});
