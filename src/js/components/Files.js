import React, { Component, PropTypes } from 'react';
import Layer from 'grommet/components/Layer';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';

import Box from 'grommet/components/Box';
import Menu from 'grommet/components/Menu';
import Anchor from 'grommet/components/Anchor';


import Checkmark from 'grommet/components/icons/base/Checkmark';
import Close from 'grommet/components/icons/base/Close';
import DocumentUpload from 'grommet/components/icons/base/DocumentUpload';
import Trash from 'grommet/components/icons/base/Trash';
import Print from 'grommet/components/icons/base/Print';

function fileSizeSI(a,b,c,d,e) {
  return (b=Math,c=b.log,d=1e3,e=c(a)/c(d)|0,a/b.pow(d,e)).toFixed(2)
  +' '+(e?'kMGTPEZY'[--e]+'B':'Bytes');
}

// function fileSizeIEC(a,b,c,d,e) {
//   return (b=Math,c=b.log,d=1024,e=c(a)/c(d)|0,a/b.pow(d,e)).toFixed(2)
//   +' '+(e?'KMGTPEZY'[--e]+'iB':'Bytes');
// }


const File = ({name, bytes}) => {
  return (
    <TableRow>
      <td style={{verticalAlign:"middle"}}>{name}</td>
      <td style={{verticalAlign:"middle"}}>{fileSizeSI(bytes)}</td>
      <td style={{verticalAlign:"middle"}}>
        <Box direction="row">
          <Menu icon={<Trash />} direction="row">
            <Anchor icon={<Checkmark />} />
            <Anchor icon={<Close />} />
          </Menu>
          <Menu icon={<DocumentUpload />}>
            <Anchor href="#">
              upload to First SD
            </Anchor>
            <Anchor href="#">
              upload to Second SD
            </Anchor>
            <Anchor href="#">
              upload to Third SD
            </Anchor>
          </Menu>
          <Menu icon={<Print />}>
            <Anchor href="#">
              First Printer
            </Anchor>
            <Anchor href="#">
              Second Printer
            </Anchor>
            <Anchor href="#">
              Third Printer
            </Anchor>
          </Menu>
        </Box>
      </td>
    </TableRow>
    );
};


export default class Files extends Component {

  constructor () {
    super();
    this.state = {visible:3};
    this._onClose = this._onClose.bind(this);
    this._onMore = this._onMore.bind(this);
    this._action = this._action.bind(this);
  }

  _onClose() {
    console.log("Close Files");
  }

  _onMore() {
    requestAnimationFrame( ()=> this.setState({visible:this.state.visible + 10}));
  }

  _action() {

  }

  render () {
    const files = this.props.files;
    return (
      <Layer onClose={this.props.onClose} closer={true} align="right">
        <Table selectable={true} onMore={this.state.visible > files.count() ? null : this._onMore} scrollable={true}>
          <thead>
            <tr>
              <th style={{textAlign:"center"}}>Name</th>
              <th style={{textAlign:"center"}}>Size</th>
              <th style={{textAlign:"center"}}>Action</th>
            </tr>
          </thead>
          <tbody>{
            files.take(this.state.visible).map((file, index) => <File key={index} name = {file.get('name')} bytes = {file.get('bytes')} />)}
          </tbody>
        </Table>
      </Layer>
    );
  }
}



Files.propTypes = {
  onClose: PropTypes.func.isRequired
};

