import React, { Component } from 'react';
import {fromJS} from "immutable";


import Tiles from 'grommet/components/Tiles';
import PrinterTile from './PrinterTile';

export default class PrintersDashboard extends Component {
  constructor () {
    super();
    this.state = {data:fromJS({'create-new': false})};
    // this._createNewPrinter = this._createNewPrinter.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.cursor.deref() !== this.props.cursor.deref();
  }


  render () {
    const printers = this.props.cursor.get('printers');
    return (
      <Tiles flush={false} justify="center" colorIndex="light-2" >

        {printers.map((printer, index) =>
            <PrinterTile protocols = {this.props.cursor.cursor(['protocols'])} cursor={this.props.cursor.cursor(['printers', index])} key = {`printer${index}`} />
        )}
      </Tiles>
    );
  }
}
