import React, {Component} from "react";
import Meter from "grommet/components/Meter";
import Chart from "grommet/components/Chart";
import Title from "grommet/components/Title";
import Tile from "grommet/components/Tile";
import Footer from "grommet/components/Footer";
import Button from "grommet/components/Button";
import PrinterStatus from "./PrinterStatus";
import PrintersSettings from "./PrintersSettings";
import Edit from "grommet/components/icons/base/Edit";
import Prining from "grommet/components/icons/base/3d";
import Lock from "grommet/components/icons/base/Lock";
import NoConfig from "grommet/components/icons/base/DocumentMissing";
import Spinning from "grommet/components/icons/Spinning";
import Pause from "grommet/components/icons/base/Pause";
import Checkmark from "grommet/components/icons/base/Checkmark";
import DocumentVerified from "grommet/components/icons/base/DocumentVerified";


// import Status from 'grommet/components/icons/Status';

// import Unlock from 'grommet/components/icons/base/Unlock';


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
    case "connecting":
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

  constructor() {
    super();
    this.state = {active: false};

    // this.state = {active:false};
    this.prepareGraphValues = PrinterTile.prepareGraphValues; //TODO - find why!!
    this._startEdit = this._startEdit.bind(this);
    this._showStatus = this._showStatus.bind(this);
    this._hideStatus = this._hideStatus.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.cursor.deref() !== this.props.cursor.deref()
      //React on updates of protocols only if we are in printer editing state
      || (this.props.cursor.getIn(['status']) === 'editing' && nextProps.protocols.deref() !== this.props.protocols.deref())
      || this.props.condition !== nextProps.condition
      || this.state.active !== nextState.active;
  }

  _hideStatus() {
    this.setState({active: false});
  }

  _showStatus() {
    this.setState({active: true});
  }

  _startEdit(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.cursor.updateIn(['status'], text => 'editing');
  }

  render() {
    const state = this.state;

    const data = this.props.cursor.toJS();
    const condition = this.props.condition && this.props.condition.toJS();

    return (
      <Tile onClick={this._showStatus} focusable={false} colorIndex="light-1" justify="between"
            pad={{vertical: "small"}}>
        {data.status && data.status === 'editing'
        &&
        <PrintersSettings
          statusCursor={this.props.cursor.cursor(['status'])}
          protocols={this.props.protocols}
          cursor={this.props.cursor.cursor(['settings'])}
          name={this.props.name}
          prefix={`printer${data.id}`}/>
        }
        {state.active && condition.temperatures
        && <PrinterStatus onClose={this._hideStatus} temperature={this.props.condition.getIn(['temperatures'])}/>}
        <Title>{this.props.name} <Status value={data.status && data.status}/></Title>
        {condition && condition.temperatures &&
        <Chart max={250} units="°C" size="small" series={[
          {
            "label": "Ex0",
            "values": this.prepareGraphValues(condition.temperatures[0].data),
            "colorIndex": "graph-1"
          }
        ]} legend={{"position": "after"}}/>

        }
        {condition && <Meter legend={{"placement": "inline"}} series={[
          {
            "label": data.status && data.status.file || "none",
            "value": data.status && data.status.progress != null && data.status.progress[0] ? Math.floor(data.status.progress[1] / data.status.progress[0]) : 0,
            "colorIndex": "graph-1"
          }
        ]} units="%"/>}
        <Footer justify="center"><Button icon={<Edit />} onClick={this._startEdit} label="Edit"/></Footer>
      </Tile>
    );
  }
};


