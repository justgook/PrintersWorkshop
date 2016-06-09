import React from 'react';
import Box from 'grommet/components/Box';
// import Menu from 'grommet/components/Menu';
import Button from 'grommet/components/Button';

// import Tiles from 'grommet/components/Tiles';
// import Tile from 'grommet/components/Tile';




import CaretDown from 'grommet/components/icons/base/CaretDown';
import CaretNext from 'grommet/components/icons/base/CaretNext';
import CaretPrevious from 'grommet/components/icons/base/CaretPrevious';
import CaretUp from 'grommet/components/icons/base/CaretUp';
import Home from 'grommet/components/icons/base/Home';

export default (props) => {
  return (
    <Box direction="column" pad={{horizontal:"none",vertical:"small", between:"small"}} align="start" >
      <Box direction="row" justify="center" pad={{ between:"small"}}>
          <Button icon={<Home />} primary={true} onClick={()=> props.send('up')} />
          <Button label="X" primary={true} onClick={()=> props.send('up')} />
          <Button label="Y" primary={true} onClick={()=> props.send('up')} />
          <Button label="Z" primary={true} onClick={()=> props.send('up')} />
      </Box>
      <Box direction="row" pad={{ between:"small"}} >
        <Box direction="column" pad={{ between:"small"}}  >
          <Button icon={<CaretUp />} primary={true} onClick={()=> props.send('up')} />
          <Box direction="row" pad={{ between:"small"}}>
            <Button icon={<CaretPrevious />} primary={true} onClick={()=> props.send('left')} />
            <Button icon={<CaretNext />} primary={true} onClick={()=> props.send('right')}  />
          </Box>
          <Button icon={<CaretDown />} primary={true} onClick={()=> props.send('down')} />
        </Box>
        <Box direction="column" justify="between">
          <Button icon={<CaretUp />} primary={true} onClick={()=> props.send('up')} />
          <Button icon={<CaretDown />} primary={true} onClick={()=> props.send('down')} />
        </Box>
      </Box>
    </Box>
  );
};
