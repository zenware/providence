import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class TableField extends Component {
  handleClick() {
    // TODO(zenware): Figure out how to get this clipboard nonsense working...
    const copystring = this.props.fieldName + " = " + this.props.data
    let cpe = document.getElementById("copyspace");
    cpe.value = copystring
    cpe.select()
    document.execCommand('copy')
    console.log(copystring)
  }
  render() {
    return (
      <td className="table-field" onClick={() => this.handleClick()}>
        {this.props.data}
      </td>
    )
  }
}

class TableRow extends Component {
  handleClick(e) {
    e.preventDefault()
    // TODO(zenware): this should copy as a dictionary...
    let copystring = "record = " + JSON.stringify(this.props.data)
    console.log(copystring)
  }
  render() {
    const fields = Object.getOwnPropertyNames(this.props.data).map((x, idx) => {
      return <TableField key={idx} fieldName={x} data={this.props.data[x]} />
    })
    return (
      <tr className="table-row" onClick={(e) => this.handleClick(e)}>
        {fields}
      </tr>
    )
  }
}

class Table extends Component {
  constructor() {
    super()
    this.state = {
      rows: [
        {
          ip: "4.2.2.2",
          min: "27.739852ms",
          avg: "41.894612ms",
          max: "56.049373ms",
          std: "10.016575ms",
        }, 
        {
          ip: "8.8.8.8",
          min: "0s",
          avg: "49.947716ms",
          max: "99.895432ms",
          std: "35.318488ms",
        }, 
        {
          ip: "8.8.4.4",
          min: "27.292806ms",
          avg: "31.437785ms",
          max: "44.763166ms",
          std: "4.410396ms",
        },
        {
          ip: "208.67.222.222",
          min: "16.96265ms",
          avg: "20.916955ms",
          max: "40.815678ms",
          std: "4.829886ms",
        },
      ],
    }
  }
  render() {
    const rows = this.state.rows.map(row => {
      return <TableRow key={row.ip} data={row} />
    })
    // TODO(zenware): Capitalize table header field names.
    const fields = Object.getOwnPropertyNames(this.state.rows[0]).map(x => {
      return <th key={x}>{x}</th>
    })
    return (
      <table className="table table-bordered table-hover table-condensed">
        <thead><tr>{fields}</tr></thead>
        <tbody>{rows}</tbody>
      </table>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <textarea id="copyspace"></textarea>
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Public DNS Server Response Times</h2>
        </div>
        <div className="container-fluid">
          <Table />
        </div>
      </div>
    );
  }
}

export default App;
