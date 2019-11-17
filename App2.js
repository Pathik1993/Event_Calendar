import React, { Component } from "react";
import {
  Container,
  Content,
  Left,
  Right,
  Header,
  Button,
  Icon,
  Body,
  Title,
  Text
} from "native-base";
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Platform
} from "react-native";
import _ from "lodash";
import I18n from "react-native-i18n";

var moment = require("moment-timezone");

import { Calendar } from "react-native-calendars";

// requires('moment/min/locales.min');
if (I18n.currentLocale() === "nl-NL") {
  moment.locale("nl");
} else {
  moment.locale("en");
}
export default class eventCalenderNew2 extends React.Component {
  constructor(props) {
    super(props);
    let date = moment().format("MMMM");
    const windowSize = Dimensions.get("window");
    this.viewHeight = windowSize.height;
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
    this.onLayout = this.onLayout.bind(this);
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
        console.warn("sada", responseJson.items);

        this.setState({
          pageToken: responseJson.nextPageToken,
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
  handleLoadMore = () => {
    this.setState(
      {
        pageToken: this.state.pageToken,
        refreshing: true
      },
      () => {
        this.getEvents();
      }
    );
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
  renderDate(item) {
    const date = item.start.dateTime;
    const eventdate = moment(item.start.dateTime);
    const today = moment() == eventdate ? styles.today : undefined;
    const checkDate = moment(item.start.dateTime).format("YYYY-MM-DD");

    if (this.newDate.includes(date)) {
      return (
        <View style={styles.day}>
          <Text allowFontScaling={false} style={[styles.dayNum, today]}>
            {moment(checkDate).format("DD")}
          </Text>
          <Text allowFontScaling={false} style={[styles.dayText, today]}>
            {moment(checkDate).format("dd")}
          </Text>
        </View>
      );
    } else {
      return <View style={styles.day} />;
    }
  }
  renderRow({ item, index }) {
    return (
      <View
        style={styles.datesContainer}
        onLayout={this.onRowLayoutChange.bind(this, index)}
      >
        {this.renderDate(item)}
        <View style={[styles.item, { height: item.height }]}>
          <Text style={styles.itemtitle}>{item.summary}</Text>
          <Text>
            {moment(item.start.dateTime).format("HH:mm")} -{" "}
            {moment(item.end.dateTime).format("HH:mm")}
          </Text>
          <Text>{item.description}</Text>
        </View>
      </View>
    );
  }
  onScroll(event) {
    const yOffset = event.nativeEvent.contentOffset.y;
    let topRowOffset = 0;
    let topRow;
    for (topRow = 0; topRow < this.heights.length; topRow++) {
      if (topRowOffset + this.heights[topRow] / 2 >= yOffset) {
        break;
      }
      topRowOffset += this.heights[topRow];
    }
    const row = this.state.dataSource[topRow];
    if (!row) return;
    const month = moment(row.start.dateTime).format("MMMM");
    this.setState({ month: month[0].toUpperCase() + month.substr(1) });
  }
  onLayout(event) {
    console.warn("event", event);

    this.viewHeight = event.nativeEvent.layout.height;
  }
  onRowLayoutChange(ind, event) {
    this.heights[ind] = event.nativeEvent.layout.height;
  }
  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  // onDayPress(day, lastdate) {
  //   this.setState({ items: [], isloading: true });
  //   selectedDate = day.year + "-" + day.month + "-" + day.day;
  //   date = day.dateString;
  //   this.setState({ currentdate: day.dateString });
  //   let PreviousDate = parseFloat(day.day) - 1;
  //   timeMax = selectedDate + "T10:00:00-07:00";
  //   timeMin =
  //     day.year + "-" + day.month + "-" + PreviousDate + "T10:00:00-07:00";

  //   NetInfo.isConnected.fetch().done(isConnected => {
  //     if (isConnected == true) {
  //       let url =
  //         "https://www.googleapis.com/calendar/v3/calendars/" +
  //         this.state.calendarId +
  //         "/events?key=AIzaSyC-Q9jucdl_iZRCgzNOeqqQ6Pqyhyl3fsU&timeMax=" +
  //         timeMax +
  //         "&timeMin=" +
  //         timeMin +
  //         "&timeZone=" +
  //         timeZone +
  //         "";
  //       // let url =
  //       //   "https://www.googleapis.com/calendar/v3/calendars/" + this.state.calendarId + "/events?key=AIzaSyC-Q9jucdl_iZRCgzNOeqqQ6Pqyhyl3fsU&";
  //       axios
  //         .get(url)
  //         .then(res => {
  //           return res.data;
  //         })
  //         .then(data => {
  //           let lenghtArray = data.items.length;
  //           setTimeout(() => {
  //             if (
  //               this.state.items[date] != null &&
  //               this.state.items[date].length > 0
  //             ) {
  //               let DateArrlength = this.state.items[date].length;
  //               if (DateArrlength == 1) {
  //                 this.setState({ isloading: false });
  //                 for (let i = 0; i < lenghtArray; i++) {
  //                   this.state.items[date].push({
  //                     eventName: data.items[i].summary,
  //                     isAdd: "true",
  //                     index: this.index(i),
  //                     startTime: data.items[i].start
  //                   });
  //                   if (i == lenghtArray - 1) {
  //                     this.setState({ isloading: false });
  //                   }
  //                 }
  //               }
  //             }
  //           }, 1000);
  //         });
  //     }
  //   });
  // }

  render() {
    const { navigation } = this.props;
    return (
      <Container>
        <View style={{ height: 350 }}>
          <Calendar
            // onDayPress={day => {
            //   console.warn("selected day", day);
            // }}

            onDayPress={day => this.onDayPress(day, this.state.currentdate)}
            monthFormat={"yyyy MM"}
            onMonthChange={month => {
              console.warn("month changed", month);
            }}
            hideArrows={false}
            hideExtraDays={false}
            disableMonthChange={false}
            firstDay={1}
            hideDayNames={false}
            showWeekNumbers={false}
            onPressArrowLeft={substractMonth => substractMonth()}
            onPressArrowRight={addMonth => addMonth()}
          />
        </View>
        <View style={styles.container}>
          <Content
            style={{ backgroundColor: "white" }}
            contentContainerStyle={{ flex: 1 }}
            scrollsToTop={true}
          >
            <View
              style={{
                flex: 1,
                overflow: "hidden",
                backgroundColor: "white",
                ...Platform.select({ ios: { marginTop: 0 } })
              }}
            >
              <View style={styles.reservations}>
                <FlatList
                  ref={c => (this.list = c)}
                  data={this.state.dataSource}
                  renderItem={this.renderRow.bind(this)}
                  ListFooterComponent={this.renderFooter}
                  onScroll={this.onScroll.bind(this)}
                  keyExtractor={(item, index) => String(index)}
                  refreshing={this.state.refreshing}
                  onEndReached={this.handleLoadMore}
                  onEndReachedThreshold={100}
                />
              </View>
            </View>
          </Content>
        </View>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  whiteTheme: {
    borderColor: "#eee",
    borderStyle: "solid",
    borderLeftWidth: 1
  },
  datesContainer: {
    flexDirection: "row"
  },
  headerNav: {
    alignSelf: "stretch",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 0,
    paddingTop: 10,
    backgroundColor: "#ffffff"
  },
  headerTitle: {
    backgroundColor: "transparent",
    paddingTop: 10,
    borderColor: "#eee",
    borderStyle: "solid",
    borderBottomWidth: 1,
    paddingBottom: 20
  },
  content: {
    flex: 1,
    backgroundColor: "transparent",
    paddingTop: 30
  },
  subText: {
    fontSize: 11,
    color: "#fff",
    marginLeft: 32
  },
  subTextWhite: {
    fontSize: 11,
    color: "black",
    marginLeft: 32
  },
  buttontext: {
    fontSize: 16,
    color: "#67B26F"
  },
  buttontextWhite: {
    fontSize: 16,
    color: "black"
  },
  backIcon: {
    height: 20,
    width: 12
  },
  buttons: {
    flexDirection: "row"
  },
  button: {
    marginTop: -7
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20
  },
  titleWhite: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20
  },
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  itemtitle: {
    fontWeight: "bold",
    fontSize: 16
  },
  subtitle: {
    fontSize: 12,
    color: "#ffffff"
  },
  subtitle: {
    fontSize: 12,
    color: "black"
  },
  labelStyle: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff"
  },
  labelStyleWhite: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: "black"
  },
  reservations: {
    flex: 1,
    backgroundColor: "#f4f4f4"
  },
  dayNum: {
    fontSize: 28,
    fontWeight: "200",
    color: "#7a92a5"
  },
  dayText: {
    fontSize: 14,
    fontWeight: "300",
    color: "#7a92a5",
    marginTop: -5,
    backgroundColor: "rgba(0,0,0,0)"
  },
  day: {
    width: 63,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 32
  },
  today: {
    color: "#00adf5"
  },
  marginR10: {
    marginRight: 10
  }
});
