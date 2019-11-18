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
  Platform,
  NetInfo
} from "react-native";
import _ from "lodash";
import I18n from "react-native-i18n";
// var moment = require("moment-timezone");
import moment, { version } from "moment";
import { Calendar } from "react-native-calendars";
import axios from "axios";
// import { API_URL, API_FAILURE_CAPTION, API_INTERNET_CONNECTION_CAPTION, API_USER_TYPE, API_USER_ID } from './../../Api';

const API_URL = "https://api.bsk.edu.kw/api/";

if (I18n.currentLocale() === "nl-NL") {
  moment.locale("nl");
} else {
  moment.locale("en");
}

let currentdate = new Date().getDate();
let currentmonth = new Date().getMonth() + 1; //Current Month.
let currentyear = new Date().getFullYear(); //Current Year.
let formatCurrentData = "";

let timeMax = "2019-09-23T10:00:00-07:00";
let timeMin = "2019-09-21T10:00:00-07:00";
let timeZone = "GMT+5:30";
let calenderObj = {};
let markedDate, markeddateShow;

const height = Dimensions.get("window").height;

export default class EventCalendarNew extends React.Component {
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
      refreshing: false,
      currentdate: "",
      calendarId: "",
      markedArray: {}
    };
    this.newDate = [];
    this.heights = [];
    this.onLayout = this.onLayout.bind(this);
  }
  componentDidMount() {
    // this.getEvents();
    NetInfo.isConnected.fetch().done(isConnected => {
      if (isConnected == true) {
        axios
          .get(API_URL + "parent/calender-id")
          .then(res => {
            return res.data;
          })
          .then(data => {
            this.setState({ calendarId: data.payload.calender_id });
            this.getEvents();
          });
      }
    });
  }

  componentWillMount() {
    // this.props.navigation.addListener("willFocus", payload => {
    NetInfo.isConnected.fetch().done(isConnected => {
      if (isConnected == true) {
        axios
          .get(API_URL + "parent/calender-id")
          .then(res => {
            return res.data;
          })
          .then(data => {
            this.setState({ calendarId: data.payload.calender_id });
            this.getEvents();
          });
      }
    });
    // });
  }

  componentWillUnmount() {
    this.getEvents();
  }

  getEvents() {
    let url =
      "https://www.googleapis.com/calendar/v3/calendars/" +
      this.state.calendarId +
      "/events?key=AIzaSyC-Q9jucdl_iZRCgzNOeqqQ6Pqyhyl3fsU";
    this.setState({ loading: true });
    fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          // pageToken: responseJson.nextPageToken,
          dataSource: responseJson.items,
          loading: false,
          refreshing: false,
          error: responseJson.error || null
        });
        let lenghtArray = responseJson.items.length;
        for (let i = 0; i < lenghtArray; i++) {
          if (responseJson.items[i].start.dateTime) {
            markedDate = responseJson.items[i].start.dateTime;
            let timeDisply = markedDate.split("T");
            markeddateShow = timeDisply[0];
          } else if (responseJson.items[i].start.date) {
            markeddateShow = responseJson.items[i].start.date;
          }
          this.setState({ markedArray: markeddateShow });

          let datevalue = this.state.markedArray;

          const workout = {
            key: "workout",
            color: "#BD10E0",
            selectedDotColor: "white"
          };
          calenderObj[datevalue] = {
            selected: true,
            dots: [workout],
            selectedColor: "#e282f5"
          };
        }
      })
      .then(() => {
        this.getDates();
      })
      .catch(error => {
        this.setState({ error, loading: false, refreshing: false });
      });
  }

  // handleLoadMore = () => {
  //   this.setState(
  //     {
  //       pageToken: this.state.pageToken,
  //       refreshing: true
  //     },
  //     () => {
  //       this.getEvents();
  //     }
  //   );
  // };
  getDates() {
    let tempDate = "";
    tempDate = _.map(this.state.dataSource, "start.date");
    this.newDate.length = 0;
    for (let j in tempDate) {
      this.newDate.push(tempDate[j]);
    }
  }
  renderDate(item) {
    let date = item.start.date || item.start.dateTime;
    if (date.includes("T")) {
      let timeDisply = date.split("T");
      date = timeDisply[0];
    }

    let checkDate = moment(date).format("YYYY-MM-DD");
    // if (this.newDate.includes(date)) {
    return (
      <View style={styles.day}>
        <Text allowFontScaling={false} style={[styles.dayNum, checkDate]}>
          {moment(checkDate).format("DD")}
        </Text>
        <Text allowFontScaling={false} style={[styles.dayText, checkDate]}>
          {moment(checkDate).format("ddd")}
        </Text>
      </View>
    );
    // } else {
    //     return <View style={styles.day} />;
    // }
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

  onDayPress(day, lastdate) {
    //this.setState({ isloading: true });
    let selectedDate =
      day.year +
      "-" +
      (day.month < 10 ? "0" + "" + day.month : day.month) +
      "-" +
      (day.day < 10 ? "0" + "" + day.day : day.day);
    let date = day.dateString;
    this.setState({ currentdate: day.dateString });
    let PreviousDate = parseFloat(day.day) - 1;
    timeMax = selectedDate + "T10:00:00-07:00";
    timeMin =
      day.year + "-" + day.month + "-" + PreviousDate + "T10:00:00-07:00";
    let compareDate = "";
    let newData = [];
    console.warn("adas", this.state.dataSource);

    for (var i = 0; i < this.state.dataSource.length; i++) {
      compareDate =
        this.state.dataSource[i].start.date ||
        this.state.dataSource[i].start.dateTime;

      if (selectedDate == compareDate) {
        // console.warn('data matcheddddd');
        this.scrollToIndex(i);
      }
    }
  }

  scrollToIndex(gotoIndex) {
    this.flatListRef.scrollToIndex({ animated: true, index: gotoIndex });
  }

  getItemLayout = (data, index) => ({
    length: 50,
    offset: (height - 490) * index,
    index
  });

  render() {
    const { navigation } = this.props;
    const { dataSource, loading } = this.state;
    return (
      <Container>
        <View style={{ height: 350 }}>
          <Calendar
            onDayPress={day => this.onDayPress(day, this.state.currentdate)}
            monthFormat={"yyyy MM"}
            onMonthChange={month => {}}
            markedDates={calenderObj}
            hideArrows={false}
            hideExtraDays={false}
            // disableMonthChange={false}
            firstDay={1}
            hideDayNames={false}
            showWeekNumbers={false}
            onPressArrowLeft={substractMonth => substractMonth()}
            onPressArrowRight={addMonth => addMonth()}
            theme={{
              agendaKnobColor: "#BD10E0",
              selectedDayBackgroundColor: "#BD10E0",
              // dotColor: "#ffffff",
              monthTextColor: "#BD10E0",
              indicatorColor: "#BD10E0",
              agendaDayTextColor: "#BD10E0",
              agendaDayNumColor: "#BD10E0",
              agendaTodayColor: "#BD10E0",
              todayTextColor: "#BD10E0",
              selectedDotColor: "#BD10E0",
              arrowColor: "#BD10E0"
            }}
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
                {loading === false ? (
                  <FlatList
                    // ref={c => (this.list = c)}
                    getItemLayout={this.getItemLayout}
                    data={dataSource}
                    renderItem={this.renderRow.bind(this)}
                    ListFooterComponent={this.renderFooter}
                    // onScroll={this.onScroll.bind(this)}
                    ref={ref => {
                      this.flatListRef = ref;
                    }}
                    keyExtractor={item => item}
                    refreshing={this.state.refreshing}
                    // onEndReached={this.handleLoadMore}
                    initialScrollIndex={0}
                    initialNumToRender={5}
                    // onEndReachedThreshold={100}
                  />
                ) : (
                  <View
                    style={{
                      paddingVertical: 20,
                      borderTopWidth: 1,
                      borderColor: "white"
                    }}
                  >
                    <ActivityIndicator animating size="large" color="#BD10E0" />
                  </View>
                )}
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
