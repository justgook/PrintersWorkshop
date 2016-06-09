import React, { Component, PropTypes} from 'react';

import createScene from "./renderer";
import createObjectFromGCode from './gcode-model';

const gcode = `
G21 ; set units to millimeters
G90 ; use absolute coordinates
M82 ; use absolute distances for extrusion
G92 E0
G1 Z0.150 F9000.000
G1 E-1.00000 F2400.00000
G92 E0
G1 Z0.550 F9000.000
G1 X20.821 Y0.000 F9000.000
G1 Z0.150 F9000.000
G1 E1.20000 F2400.00000
G1 X20.821 Y10.000 E1.26297 F4500.000
G1 X20.422 Y12.908 E1.28145
G1 X19.257 Y15.602 E1.29994
G1 X17.411 Y17.884 E1.31842
G1 X15.019 Y19.586 E1.33691
G1 X12.258 Y20.582 E1.35539
G1 X10.000 Y20.821 E1.36969
G1 X-10.000 Y20.821 E1.49563
G1 X-12.908 Y20.422 E1.51411
G1 X-15.602 Y19.257 E1.53260
G1 X-17.884 Y17.411 E1.55108
G1 X-19.586 Y15.019 E1.56957
G1 X-20.582 Y12.258 E1.58805
G1 X-20.821 Y10.000 E1.60235
G1 X-20.821 Y-10.000 E1.72829
G1 X-20.422 Y-12.908 E1.74677
G1 X-19.257 Y-15.602 E1.76526
G1 X-17.411 Y-17.884 E1.78374
G1 X-15.019 Y-19.586 E1.80223
G1 X-12.258 Y-20.582 E1.82071
G1 X-10.000 Y-20.821 E1.83501
G1 X10.000 Y-20.821 E1.96095
G1 X12.908 Y-20.422 E1.97943
G1 X15.602 Y-19.257 E1.99792 F4500.000`;


export default class GCodeViewer extends Component {
  constructor () {
    super();
    this.scene = null;
  }
  componentDidMount() {
    const p = this.props.prefix;
    const element = document.getElementById(`${p}gcode-screen`);
    element.width = ()=> {
      return 640;
    };
    element.height = ()=> {
      return 480;
    };
    this.scene = createScene(element);
    var object = createObjectFromGCode(this.props.gcode);
    this.scene.add(object);

  }
  render() {
    const p = this.props.prefix;
    return (
      <div id={`${p}gcode-screen`}></div>
    );
  }
};

GCodeViewer.propTypes = {
  gcode: PropTypes.string,
  prefix: PropTypes.string
};

GCodeViewer.defaultProps = {
  gcode,
  prefix: 'gg'
};


