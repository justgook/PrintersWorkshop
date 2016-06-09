import '../scss/index.scss';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {fromJS} from "immutable";
import Cursor from 'immutable/contrib/cursor';


import App from 'grommet/components/App';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Title from 'grommet/components/Title';
import Button from 'grommet/components/Button';



import ChapterAdd from 'grommet/components/icons/base/ChapterAdd';
import Configuration from 'grommet/components/icons/base/Configuration';
import Copy from 'grommet/components/icons/base/Copy';

import Menu from 'grommet/components/Menu';


import PrintersDashboard from './components/PrintersDashboard';

import NewPrinter from './components/NewPrinter';
import Files from './components/Files';


var data = {
  //based on https://github.com/SteveVitali/react-form-generator
  protocols:[
    {
      name:"serial",
      label: 'Serial Port Connection',
      properties:[
        {
          name: "port",
          type: String,
          enum: ['COM1', 'COM2', 'COM3'],
          label: 'Port',
          defaultValue: 0
        }
      ]
    },
    {
      name: "tcp",
      label: 'TCP/IP',
      properties: [
        {
          name: "ip",
          type: String,
          label: 'IP address',
          defaultValue: '127.0.0.1'
        },
        {
          name: "port",
          type: String,
          label: 'Port',
          defaultValue: '8082'
        }
      ]
    },
    {
      name: "octoprint",
      label: 'octoPrint',
      properties: [
        {
          name: "url",
          type: String,
          label: 'octoPrint server address',
          defaultValue: '127.0.0.1'
        },
        {
          name: "apikey",
          type: String,
          label: 'API key',
          defaultValue: 'abc'
        }
      ]
    }
  ],
  'files-visible':false,
  files:[
    {name: "test.gcode",bytes: 124442213},
    {name: "test.gcode",bytes: 124442213},
    {name: "test.gcode",bytes: 124442213},
    {name: "test.gcode",bytes: 124442213},
    {name: "test.gcode",bytes: 124442213},
    {name: "test.gcode",bytes: 124442213},
    {name: "test.gcode",bytes: 124442213},
    {name: "test.gcode",bytes: 124442213},
    {name: "test.gcode",bytes: 124442213}
  ],
  'new-printers-visible':false,
  printers: [
    {
      id: "001",
      status: {
        text:"printing",
        file: "test.gcode",
        progress: [231321, 1231321], //printed / total lines of gcode-file
        temperature: [
          [25,30,75,100,170,210,230,220,195,191,193,196,195,195,191,193,196,195,193,196,195],//Extruder 0
          [25,27,29,30,35,39,44,56,58,70,75,73,72,75,70,71,72,75,70,71,12]// Heating Bed
        ]
      },
      settings:{
        name: "Mega Delta",
        protocol: {
          type: "serial",
          args: {
            port: "COM2"
          }
        }
      }

    },
    {
      id: "002",
      status: {
        text: "ready",
        file: "test2.gcode",
        progress: [0, 121244], //printed / total lines of gcode-file
        temperature: [
          [25,30,75,100,170,210,230,220,195,191,193,196,195,195,191,193,196,195,193,196,195],//Extruder 0
          [25,27,29,30,35,39,44,56,58,70,75,73,72,75,70,71,72,75,70,71,12]// Heating Bed
        ]
      },
      settings:{
        name: "Prusa i3",
        protocol: {
          type: "serial",
          args: {
            port: "COM1"
          }
        }
      }
    },
    {
      id: "003",
      status: {
        text: "no-сonfig"
      },
      settings:{
        name: "Kossel Mini",
        protocol: {type: "none"} // Not set any configs
      }
    }
  ]
};

class Main extends Component {
  constructor () {
    super();
    this.state = {data: fromJS(data)};
    this.updateState = this.updateState.bind(this);
    this.openFiles = this.openFiles.bind(this);
    this.closeFiles = this.closeFiles.bind(this);
    this._createNewPrinter = this._createNewPrinter.bind(this);
    this.openCreatePrinter = this.openCreatePrinter.bind(this);
    this.closeCreatePrinter = this.closeCreatePrinter.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.data !== nextState.data;
  }
  updateState(data) {
    console.log("updateState", data.toJS());
    this.setState(()=> ({data}));
  }
  openFiles() {
    this.setState(({data})=> ({data: data.set('files-visible', true)}));
  }
  closeFiles() {
    this.setState(({data})=> ({data: data.set('files-visible', false)}));
  }
  openCreatePrinter() {
    this.setState(({data})=> ({data: data.set('new-printers-visible', true)}));
  }
  closeCreatePrinter() {
    this.setState(({data})=> ({data: data.set('new-printers-visible', false)}));
  }
  _createNewPrinter(newName) {
    this.setState(({data})=> ({data: data.update('printers', (printers)=>(
        printers.push(
          fromJS({
            status: {
              text: "no-сonfig"
            },
            settings:{
              name: newName,
              protocol: {type: "none"} // Not set any configs
            }}))))}));
  }
  render () {
    const cursor = Cursor.from(this.state.data, [], this.updateState);
    return (
      <App centered={false}>
      {this.state.data.get('files-visible') &&
        <Files
          files={cursor.get('files')}
          onClose={this.closeFiles}
        />
      }
      {this.state.data.get('new-printers-visible') &&
        <NewPrinter
          onClose={this.closeCreatePrinter}
          onSubmit={this._createNewPrinter}
        />
      }
        <Header direction="row" justify="between" large={true}
          pad={{horizontal: 'medium'}}>
          <Title>Printer Workshop</Title>
          <Menu inline={true} responsive={false} direction="row">
            <Button icon={<ChapterAdd />} onClick={this.openCreatePrinter} />
            <Button icon={<Configuration />} />
            <Button icon={<Copy />} onClick={this.openFiles} />
          </Menu>
        </Header>
        <PrintersDashboard cursor = {cursor} />
        <Footer primary={true} appCentered={true} direction="column"
          align="center" pad="small" colorIndex="grey-1">
          <p>
             <a href="https://github.com/justgook/PrintersWorkshop" target="_blank">PrinterWorkshop</a> 2016
          </p>
        </Footer>
      </App>
    );
  }
};

let element = document.getElementById('content');
ReactDOM.render(React.createElement(Main), element);

document.body.classList.remove('loading');
