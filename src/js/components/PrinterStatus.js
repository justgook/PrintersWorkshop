import React, { Component, PropTypes } from 'react';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Layer from 'grommet/components/Layer';
import Chart from 'grommet/components/Chart';




import Manual from 'grommet/components/icons/base/Manual';
import Video from 'grommet/components/icons/base/Video';
import LineChart from 'grommet/components/icons/base/LineChart';
import CommandLine from 'grommet/components/icons/base/CommandLine';


import PrinterControl from './PrinterControl';
import GCodeViewer from './gcode/GCodeViewer';



export default class PrinterStatus extends Component {
  constructor () {
    super();

    this._onClose = this._onClose.bind(this);
  //   // this._onChange = this._onChange.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.temperature.deref() !== this.props.temperature.deref();
  }

  _onClose() {
    this.props.onClose();
  }

  render () {
    const temperature = this.props.temperature.map(item => item.entrySeq()).toJS();
    return (
      <Layer onClose={this._onClose} closer={true} align="top">
       <Tabs justify="center" initialIndex={3}>
        <Tab title="G Code">
          <h3>G Code</h3>
          <GCodeViewer />
        </Tab>
        <Tab title="Temperature graph">
          <h3><LineChart />Temperature graph</h3>
          <Chart size="large" legend={{"position":"after"}} series={[
            {
              "label": "Extrude 0",
              "values": temperature[0],
              "colorIndex": "graph-1"
            },
            {
              "label": "Heating Bed",
              "values": temperature[1],
              "colorIndex": "graph-2"
            }
          ]} max={250} units="°C" />
          </Tab>
          <Tab title="Video">
            <h3><Video />TimeLapse</h3>
            <p>Contents of the third tab</p>
          </Tab>
          <Tab title="Control">
            <h3><Manual />Control</h3>
            <PrinterControl />
          </Tab>
          <Tab title="Terminal">
            <h3><CommandLine />Terminal</h3>
            <p>terminal..</p>
          </Tab>
        </Tabs>
      </Layer>
      );
  }
}

PrinterStatus.propTypes = {
  onClose: PropTypes.func.isRequired,
  prefix: PropTypes.string
};

PrinterStatus.defaultProps = {
  prefix: 'pt'
};
