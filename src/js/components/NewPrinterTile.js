import React, { Component, PropTypes } from 'react';
import Button from 'grommet/components/Button';
import ChapterAdd from 'grommet/components/icons/base/ChapterAdd';

export default class NewPrinterTile extends Component {
  constructor () {
    super();
    // this.state = {active: false};
    // this._onClose = this._onClose.bind(this);
  }
  render() {
    return(
        <Button primary={true} onClick={this.props.onClick} icon={<ChapterAdd size="large" />} />
    );
  }
}

NewPrinterTile.propTypes = {
  onClick: PropTypes.func
};

NewPrinterTile.defaultProps = {
  onClick: ()=> {
    console.log("NewPrinterTile.defaultProps.onClick");
  }
};

