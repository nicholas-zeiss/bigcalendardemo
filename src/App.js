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

    this.handleSelectEvent = this._handleSelectEvent.bind(this);
    this.handleSelectSlot = this._handleSelectSlot.bind(this);
  }

  _handleSelectEvent(event) {
    this.setState(state => ({
      events: state.events.filter(ev => ev !== event)
    }));
  }

  _handleSelectSlot({ start, end }) {
    if (start < new Date() || start.getTime() === end.getTime()) {
      return;
    }

    this.setState(state => {
      const mergedSlots = this.mergeSlots([
        ...state.events.map(ev => ({ ...ev })),
        { title: 'Available', start, end }
      ]);

      return { events: mergedSlots }
    });
  }

  mergeSlots(slots) {
    const merged = [];

    slots.sort((a,b) => {
      if (a.start >= b.start) {
        return -1;
      } else if (a.start < b.start) {
        return 1;
      } else {
        return 0;
      }
    });

    merged.push(slots.pop());

    while (slots.length) {
      const prev = merged[merged.length - 1];
      const next = slots.pop();

      if (next.start <= prev.end) {
        prev.end = next.end >= prev.end ? next.end : prev.end;
      } else {
        merged.push(next);
      }
    }

    return [...merged.map(ev => ({ ...ev }))];
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
          defaultView={BigCalendar.Views.WORK_WEEK}
          events={this.state.events}
          localizer={localizer}
          max={ new Date(1970, 1, 1, 20)}
          min={ new Date(1970, 1, 1, 8)}
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
