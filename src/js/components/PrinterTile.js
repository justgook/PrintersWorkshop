import React, { Component } from 'react';


// import Status from 'grommet/components/icons/Status';

import Meter from 'grommet/components/Meter';
import Chart from 'grommet/components/Chart';
import Title from 'grommet/components/Title';
import Tile from 'grommet/components/Tile';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';

import PrinterStatus from './PrinterStatus';
import PrintersSettings from './PrintersSettings';


import Edit from 'grommet/components/icons/base/Edit';


import Prining from 'grommet/components/icons/base/3d';
import Lock from 'grommet/components/icons/base/Lock';
// import Unlock from 'grommet/components/icons/base/Unlock';
import NoConfig from 'grommet/components/icons/base/DocumentMissing';
import Spinning from 'grommet/components/icons/Spinning';
import Pause from 'grommet/components/icons/base/Pause';
import Checkmark from 'grommet/components/icons/base/Checkmark';
import DocumentVerified from 'grommet/components/icons/base/DocumentVerified';



const Status = ({value}) => {
  switch (value) {
    case "connected":
      return <Checkmark />;
    case "ready":
      return <DocumentVerified />;
    case "printing":
      return <Prining />;
    case "editing":
      return <Lock />;
    case "updating":
    case "reconnecting":
      return <Spinning />;
    case "no-сonfig":
      return <NoConfig />;
    case "pause":
      return <Pause />;
    default:
      return null; //TODO set some default value
  }
};


export default class PrinterTile extends Component {
  static prepareGraphValues(arr) {
    var i, index, len, num, results;
    results = [];
    for (index = i = 0, len = arr.length; i < len; index = i += 2) {
      num = arr[index];
      results.push([index / 2 + 1, num]);
    }
    return results.reverse(); //TODO update with invert loop
  }

  constructor () {
    super();
    this.state = {active:false};

    // this.state = {active:false};
    this.prepareGraphValues =  PrinterTile.prepareGraphValues; //TODO - find why!!
    this._startEdit = this._startEdit.bind(this);
    this._showStatus = this._showStatus.bind(this);
    this._hideStatus = this._hideStatus.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.cursor.deref() !== this.props.cursor.deref()
    //React on updates of protocols only if we are in printer editing state
    || (this.props.cursor.getIn(['status','text']) === 'editing' && nextProps.protocols.deref() !== this.props.protocols.deref())
    || this.state.active !== nextState.active;
  }

  _hideStatus() {
    this.setState({active:false});
  }
  _showStatus() {
    this.setState({active:true});
  }

  _startEdit(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.cursor.updateIn(['status', 'text'], text => 'editing');
  }

  render () {
    const state = this.state;
    const data = this.props.cursor.toJS();

    return (
      <Tile onClick={this._showStatus} focusable={false} colorIndex="light-1" justify="between" pad={{vertical:"small"}}>
        {data.status.text === 'editing'
          &&
          <PrintersSettings
          statusCursor = {this.props.cursor.cursor(['status','text'])}
          protocols = {this.props.protocols}
          cursor={this.props.cursor.cursor(['settings'])}
          prefix={`printer${data.id}`} />
        }
        {state.active
          && <PrinterStatus onClose={this._hideStatus} temperature={this.props.cursor.getIn(['status','temperature'])} />}
        <Title>{data.settings.name} <Status value={data.status.text} /></Title>
        {data.status.temperature &&
          <Chart max={250} units="°C" size="small"  series={[
            {
              "label": "Ex0",
              "values": this.prepareGraphValues(data.status.temperature[0]),
              "colorIndex": "graph-1"
            },
            {
              "label": "Bed",
              "values": this.prepareGraphValues(data.status.temperature[1]),
              "colorIndex": "graph-2"
            }
          ]} legend={{"position": "after"}} />

        }
        <Meter legend={{"placement": "inline"}} series={[
          {
            "label": data.status.file || "none",
            "value": data.status.progress != null && data.status.progress[0] ? Math.floor(data.status.progress[1] / data.status.progress[0]) : 0,
            "colorIndex": "graph-1"
          }
        ]} units="%" />
        <Footer justify="center"><Button icon={<Edit />} onClick={this._startEdit} label="Edit" /></Footer>
      </Tile>
    );
  }
};


