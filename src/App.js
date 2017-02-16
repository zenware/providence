// @flow
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Table, Column, Cell } from 'fixed-data-table';

export class TableField extends Component {
  handleClick() {
    // TODO(zenware): Figure out how to get this clipboard nonsense working...
    const copystring = this.props.fieldName + " = " + this.props.data
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

export class TableRow extends Component {
  handleClick() {
    // TODO(zenware): this should copy as a dictionary...
    let copystring = "record = " + JSON.stringify(this.props.data)
    console.log(copystring)
  }
  render() {
    if (!this.props.data) {
      return (
        <tr className="table-row">
          <td>No Data</td>
        </tr>
      )
    }
    const fields = Object.getOwnPropertyNames(this.props.data).map((x, idx) => {
      return <TableField key={idx} fieldName={x} data={this.props.data[x]} />
    })
    return (
      <tr className="table-row" onClick={() => this.handleClick()}>
        {fields}
      </tr>
    )
  }
}
/*
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
*/

// NOTE(zenware): This is just for testing out fixed-data-table instead.
// I'm pretty sure I'm going to prefer and switch to it though.
/*
const rows = [
  ["4.2.2.2", "27.739852ms", "41.894612ms", "56.049373ms", "10.016575ms"],
  ["8.8.8.8", "0s", "49.947716ms", "99.895432ms", "35.318488ms"],
  ["8.8.4.4", "27.292806ms", "31.437785ms", "44.763166ms", "4.410396ms"],
  ["208.67.222.22", "16.96265ms", "20.916955ms", "40.815678ms", "4.829886ms"],
]
*/

const rows = [
{
  id: 0,
  ip: "4.2.2.2",
  min: "27.739852ms",
  avg: "41.894612ms",
  max: "56.049373ms",
  std: "10.016575ms",
}, 
{
  id: 1,
  ip: "8.8.8.8",
  min: "0s",
  avg: "49.947716ms",
  max: "99.895432ms",
  std: "35.318488ms",
}, 
{
  id: 2,
  ip: "8.8.4.4",
  min: "27.292806ms",
  avg: "31.437785ms",
  max: "44.763166ms",
  std: "4.410396ms",
},
{
  id: 3,
  ip: "208.67.222.222",
  min: "16.96265ms",
  avg: "20.916955ms",
  max: "40.815678ms",
  std: "4.829886ms",
},
]


const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
}

const reverseSortDirection = (sortDir) => (
  sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC
)


class SortHeaderCell extends Component {
  handleClick(e){
    e.preventDefault()
    if (this.props.onSortChange) {
      this.props.onSortChange(
        this.props.columnKey,
        this.props.sortDir ?
          reverseSortDirection(this.props.sortDir) :
          SortTypes.DESC
      )
    }
  }
  render() {
    let {sortDir, children, onSortChange, ...props} = this.props;
    return (
      <Cell {...props}>
        <a onClick={(e) => this.handleClick(e)}>
          {children} {sortDir ? (sortDir === SortTypes.DESC ? '↓' : '↑') : ''}      
        </a>
      </Cell>
    )
  }
}

const TextCell = ({rowIndex, data, columnKey, ...props}) => (
  <Cell {...props}>
    {data.getObjectAt(rowIndex)[columnKey]}
  </Cell>
)

//TODO(zenware) Write some kind of object which has a few of the DLW methods
// It should have getSize() and it should also initialize the indexMap
class DataListWrapper {
  _indexMap = []
  _data: DNSAnalysisDataList
  constructor(indexMap, dataList) {
    this._indexMap = indexMap;
    this._data = new DNSAnalysisDataList(dataList);
  }
  getSize() {
    return this._indexMap.length
  }
  getObjectAt(index) {
    return this._data.getObjectAt(
      this._indexMap[index],
    )
  }
}

// TODO(zenware) this should just spawn out data like what's in rows
// except it should be compatible with the DataListWrapper object.
class DNSAnalysisDataList {
  // TODO(zenware) Figure out if I can require the constructor values passed.
  _size: number
  _data = []
  constructor(recordArray) { 
    this._size = recordArray.length
    this._data = recordArray
  }
  getObjectAt(index) {
    if (index < 0 || index > this._size) {
      return undefined;
    }
    return this._data[index];
  }
  getSize() {
    return this._size
  }
}

class SortableDNSTable extends Component {
  constructor(props){
    super(props)

    this._dataList = new DNSAnalysisDataList(rows);
    
    this._defaultSortIndexes = []
    let size = this._dataList.getSize()
    for (let i = 0; i < size; i++) {
      this._defaultSortIndexes.push(i)
    }

    this.state = {
      sortedDataList: this._dataList,
      colSortDirs: {},
    }
  }
  handleSortChange(colKey, sortDir) {
    let sortIndexes = this._defaultSortIndexes.slice()
    sortIndexes.sort((indexA, indexB) => {
      let valueA
      let valueB
      let sortVal = 0
      if (valueA > valueB) {
        sortVal = 1
      }
      if (valueA < valueB) {
        sortVal = -1
      }
      if (sortVal !== 0 && sortDir === SortTypes.ASC) {
        sortVal *= -1
      }

      return sortVal
    })
    this.setState({
      sortedDataList: new DataListWrapper(sortIndexes, this._dataList),
      colSortDirs: {
        [colKey]: sortDir,
      },
    })
  }
  render(){
    let {sortedDataList, colSortDirs} = this.state;
    return (
      <Table
        rowHeight={50}
        rowsCount={sortedDataList.getSize()}
        headerHeight={50}
        width={1000}
        height={500}
        {...this.props}>
        <Column
          columnKey="id"
          header={
            <SortHeaderCell
              onSortChange={() => this.handleSortChange()}
              sortDir={colSortDirs.id}>
              id
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={100}
        />
        <Column
          columnKey="ip"
          header={
            <SortHeaderCell
              onSortChange={() => this.handleSortChange()}
              sortDir={colSortDirs.ip}>
              IP Address 
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={150}
        />
      </Table>
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
        <div className="table-container">
          <SortableDNSTable />
        </div>
      </div>
    );
  }
}

export default App;
