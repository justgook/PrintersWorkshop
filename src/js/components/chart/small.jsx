import React, { Component } from 'react';
// https://github.com/borisyankov/react-sparklines/tree/master/src
export default class smallLineGraph extends Component {
  render() {
    return (
      <g>
        <polyline points={fillPoints.join(' ')} style={fillStyle} />
        <polyline points={linePoints.join(' ')} style={lineStyle} />
      </g>
    );
  }
}
