// @flow
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Table, Column, Cell } from 'fixed-data-table';

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
        width={850}
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
        <Column
          columnKey="min"
          header={
            <SortHeaderCell
              onSortChange={() => this.handleSortChange()}
              sortDir={colSortDirs.min}>
              Min 
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={150}
        />
        <Column
          columnKey="avg"
          header={
            <SortHeaderCell
              onSortChange={() => this.handleSortChange()}
              sortDir={colSortDirs.avg}>
              Avg 
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={150}
        />
        <Column
          columnKey="max"
          header={
            <SortHeaderCell
              onSortChange={() => this.handleSortChange()}
              sortDir={colSortDirs.max}>
              Max
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={150}
        />
        <Column
          columnKey="std"
          header={
            <SortHeaderCell
              onSortChange={() => this.handleSortChange()}
              sortDir={colSortDirs.std}>
              Std 
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
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Public DNS Server Response Times</h2>
        </div>
        <div className="container">
          <SortableDNSTable />
        </div>
      </div>
    );
  }
}

export default App;
