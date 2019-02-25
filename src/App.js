import React, { Component } from 'react';
import './App.css';

import BigCalendar from 'react-big-calendar'
import moment from 'moment'

const localizer = BigCalendar.momentLocalizer(moment)

let first = true;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      events: []
    }

    this.handleNavigate = this._handleNavigate.bind(this);
    this.handleRangeChange = this._handleRangeChange.bind(this);
    this.handleSelectEvent = this._handleSelectEvent.bind(this);
    this.handleSelectSlot = this._handleSelectSlot.bind(this);
  }

  _handleNavigate(...args) {
    // if (args[0].getTime() >= Date.now()) {
      this.setState({ date: args[0] });
    // }
  }

  _handleRangeChange(...args) {
    // console.log(args);
    // if (args[0][4] <)
  }

  _handleSelectEvent(event) {
    console.log(event)
    this.setState(state => ({
      events: state.events.filter(ev => ev !== event)
    }));
  }

  _handleSelectSlot({ start, end }) {
    console.log(start, end,  start.getTime() === end.getTime())

    if (start < new Date()) {
      return;
    } else if (start.getTime() === end.getTime()) {
      return;
    }
    
    for (const event of this.state.events) {
      if (event.start <= start && event.end >= start) {
        return;
      } else if (event.start <= end && event.start >= start) {
        return;
      }
    }


    this.setState(state => ({
      events: [
        ...state.events,
        {
          start,
          end,
          title: 'Available'
        }
      ]
    }))
  }

  eventPropGetter() {

  }

  slotPropGetter(time) {
    if (time < new Date()) {
      return {
        style: { backgroundColor: "grey" }
      }
    }
  }

  render() {
    if (first) {
      first = false;
      setTimeout(() => this.forceUpdate(), 100);
      return (
        <p>loading...</p>
      )
    }

    return (
      <div className="App">
        <BigCalendar
          date={ this.state.date }
          defaultView={BigCalendar.Views.WORK_WEEK}
          events={this.state.events}
          localizer={localizer}
          max={ new Date(1970, 1, 1, 20)}
          min={ new Date(1970, 1, 1, 8)}
          onNavigate={this.handleNavigate}
          onRangeChange={this.handleRangeChange}
          onSelectEvent={this.handleSelectEvent}
          onSelectSlot={this.handleSelectSlot}
          selectable={true}
          slotPropGetter={this.slotPropGetter}
          style={{ margin: '50px 100px' }}
          views={[BigCalendar.Views.WORK_WEEK]}
        />
      </div>
    );
  }
}

export default App;
