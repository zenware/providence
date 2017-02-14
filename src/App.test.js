import React from 'react';
import ReactDOM from 'react-dom';
import App, {TableField, TableRow} from './App';

it('<App /> renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('<TableField /> renders without crashing with no properties', () => {
  const tr = document.createElement('tr');
  ReactDOM.render(<TableField />, tr);
});

it('<TableField /> renders without crashing with properties', () => {
  const tr = document.createElement('tr');
  ReactDOM.render(<TableField fieldName="test" data="test"/>, tr);
});

it('<TableRow /> renders without crashing with no properties', () => {
  const tbody = document.createElement('tbody');;
  ReactDOM.render(<TableRow />, tbody);
});

it('<TableRow /> renders without crashing with properties', () => {
  const tbody = document.createElement('tbody');;
  const somedata = {
    here: "is",
    some: "test",
    data: 4,
    ensuring: true,
  }
  ReactDOM.render(<TableRow data={somedata}/>, tbody);
});
