// Proof of concept for the react-big-calendar package

import React, { Component } from 'react';
import './App.css';

import BigCalendar from 'react-big-calendar'
import moment from 'moment'


const localizer = BigCalendar.momentLocalizer(moment)


// BigCalendar doesn't play well with the intial page render (its container needs to have well defined dimensions)
// so as a quick hacky work around the first render of this component shows a loading message
let firstRender = true;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
    };

    this.handleSelectEvent = this._handleSelectEvent.bind(this);
    this.handleSelectSlot = this._handleSelectSlot.bind(this);
  }


  _handleSelectEvent(event) {
    this.setState(state => ({
      events: state.events.filter(ev => !this.eventsEqual(ev, event))
    }));
  }


  // Handles event creation
  _handleSelectSlot({ start, end }) {
    // Don't allow new events to start in the past or have no duration (which is how all day events work in BigCalendar)
    if (start < new Date() || start.getTime() === end.getTime()) {
      return;
    }

    this.setState(state => {
      const mergedEvents = this.mergeEvents([
        ...state.events.map(ev => ({ ...ev })),
        { title: 'Available', start, end }
      ]);

      return { events: mergedEvents }
    });
  }


  mergeEvents(events) {
    const merged = [];

    events.sort((a, b) => {
      if (a.start >= b.start) {
        return -1;
      } else if (a.start < b.start) {
        return 1;
      } else {
        return 0;
      }
    });

    merged.push(events.pop());

    while (events.length) {
      const prev = merged[merged.length - 1];
      const next = events.pop();

      if (next.start <= prev.end) {
        prev.end = next.end >= prev.end ? next.end : prev.end;
      } else {
        merged.push(next);
      }
    }

    return merged;
  }


  slotPropGetter(time) {
    if (time < new Date()) {
      return {
        style: { backgroundColor: "grey" }
      }
    }
  }


  eventsEqual(a, b) {
    return ['end', 'start'].every(key => a[key].getTime() === b[key].getTime());
  }


  render() {
    if (firstRender) {
      firstRender = false;

      setTimeout(() => this.forceUpdate(), 100);
      
      return (
        <p>loading...</p>
      )
    }

    return (
      <div className="App">
        <BigCalendar
          defaultView={ BigCalendar.Views.WORK_WEEK }
          events={ this.state.events }
          localizer={ localizer }
          max={ new Date(1970, 1, 1, 21) }
          min={ new Date(1970, 1, 1, 8) }
          onSelectEvent={ this.handleSelectEvent }
          onSelectSlot={ this.handleSelectSlot }
          selectable
          slotPropGetter={ this.slotPropGetter }
          style={{ margin: '50px 100px' }}
          views={ [BigCalendar.Views.WORK_WEEK] }
        />
      </div>
    );
  }
}

export default App;
