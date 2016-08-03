import React, {Component} from "react";
import {fromJS} from "immutable";
import Tiles from "grommet/components/Tiles";
import PrinterTile from "./PrinterTile";

export default class PrintersDashboard extends Component {
  constructor() {
    super();
    this.state = {data: fromJS({'create-new': false})};
    // this._createNewPrinter = this._createNewPrinter.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.cursor.deref() !== this.props.cursor.deref();
  }


  render() {
    const printers = this.props.cursor.get('printers');
    const conditions = this.props.cursor.get('conditions');
    return (
      <Tiles flush={false} justify="center" colorIndex="light-2">
        {printers.entrySeq().map(([name,printer], index) =>
          <PrinterTile protocols={this.props.cursor.cursor(['protocols'])}
                       condition={conditions && conditions.has(name) && conditions.get(name)}
                       name={name}
                       cursor={printer} key={`printer${index}`}/>
        )}
      </Tiles>
    );
  }
}
