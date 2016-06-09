import React, { Component,PropTypes } from 'react';
// import Header from 'grommet/components/Header';


import Layer from 'grommet/components/Layer';
import Form from 'grommet/components/Form';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Menu from 'grommet/components/Menu';
import Button from 'grommet/components/Button';

import {Map} from 'immutable';
import Cursor from 'immutable/contrib/cursor';

// import CheckBox from 'grommet/components/CheckBox';
// import RadioButton from 'grommet/components/RadioButton';
// import SearchInput from 'grommet/components/SearchInput';
// import NumberInput from 'grommet/components/NumberInput';
// import Table from 'grommet/components/Table';

// import Calendar from 'grommet/components/Calendar';
// import DateTime from 'grommet/components/DateTime';

const Input = ({schemaData, id, cursor}) => {
  const value = cursor.get(schemaData.name) || schemaData.defaultValue;
  const onChange = (e)=> cursor.update(schemaData.name, prop => e.target.value);
  console.log(schemaData.name, value);
  return schemaData.enum != null ?
      <select id={id} name={id} value={value} onChange={onChange} >
        {schemaData.enum.map((item, index) => <option value={item} key={`${id}-option-${index}`}>{item}</option>)}
      </select>
      :
      <input id={id} name={id} value={value} onChange={onChange} type="text" />;
};

const FieldsetFromSchema = ({prefix, schema, cursor}) => {
  const p = `${prefix}-${schema.get('name')}`;
  const reset = {padding:0,margin:0};
  return (
    <div style={reset}>
      {schema.get('properties').map((item, index) => {
        const schemaData = item.toJS();
        const key = `${p}-${schemaData.name}`;
        return (
          <FormField label={schemaData.label} key={key} htmlFor={key}>
            <Input
              schemaData={schemaData} key={key} id={key} cursor={cursor}
             />
          </FormField>
        );
      })}
    </div>
  );
};


export default class PrintersSettings extends Component {
  constructor (props) {
    super(props);
    console.log("PrintersSettings.constructor");
    //TODO create Undo history!
    this.state = {data: props.cursor.deref()};
    this._onClose = this._onClose.bind(this);
    this._onNameChange = this._onNameChange.bind(this);
    this._onProtocolChange = this._onProtocolChange.bind(this);
    this._updateProtocolArgs = this._updateProtocolArgs.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this._onReset = this._onReset.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.cursor.deref() !== this.props.cursor.deref() || nextState.data !== this.state.data;
  }

  setImmState(fn) {
    return this.setState(({data}) => ({
      data: fn(data)
    }));
  }

  _updateProtocolArgs(data) {
    // console.log("PrintersSettings._updateProtocolArgs");
    this.setState(()=> ({data}));
  }
  _onNameChange(e) {
    const value = e.target.value;//https://facebook.github.io/react/docs/events.html#event-pooling
    this.setImmState(d => d.update('name', name => value));
  }

  _onProtocolChange(e) {
    const value = e.target.value;//https://facebook.github.io/react/docs/events.html#event-pooling

    //TODO optimize that call / make it as function, and closure results
    const schema = this.props.protocols
    .find(item => item.get('name') === value);

    this.setImmState(d => d.set('protocol',
    schema?
        new Map({type: value, args: new Map(schema.get('properties')
      .map(x => [x.get('name'), x.get('defaultValue')]))}): // defaultValue - if save without editing
        {type: value}
      ));
  }

  _onClose() {
    if (this.props.cursor.deref() === this.state.data) { // Data not changed
      this.props.statusCursor.set('reconnecting');
    }
    // this.props.statusCursor.set();
    console.log();
    // console.log(this);
    // this.props.onClose();
  }
  _onSubmit() {
    this.props.cursor.set(this.state.data);
  }
  _onReset() {
    this.setState({data: this.props.cursor.deref()});
  }
  render () {
    const protocols = this.props.protocols;
    const p = this.props.prefix;
    const state = this.state.data.toJS();

    return (
      <Layer onClose={this._onClose} closer={true}
        align="left">
        <Form compact={false}>
          <Header>
            <h1>Edit </h1>
          </Header>
          <FormFields>
          <fieldset>
            <legend>{state.name}</legend>
            <FormField label="Name" htmlFor={p + "-name"}>
              <input id={p + "-name"} value={state.name} name="name" type="text" onChange={this._onNameChange} />
            </FormField>
          </fieldset>
          <fieldset>
            <legend>Communication</legend>
            <FormField label="Protocol" htmlFor={p + "-protocol"}>
              <select id={p + "-protocol"} value = {state.protocol.type} name="protocol" onChange={this._onProtocolChange}>
                <option value = "none" >None</option>
                {protocols.map((item, index)=>{
                  return (<option key = {`${p}-protocol-${index}`} value={item.get('name')}>{item.get('label')}</option>);
                })}
              </select>
            </FormField>
            {
              state.protocol.type !== "none"
              &&
              <FieldsetFromSchema
                prefix = {`${p}-protocol`}
                schema = {protocols.find(item => (state.protocol.type === item.get('name')))}
                cursor = {Cursor.from(this.state.data, ['protocol','args'], this._updateProtocolArgs)} />
            }
          </fieldset>
          </FormFields>
          <Footer pad={{vertical: 'medium'}} justify="end">
            <Menu direction="row" justify="end">
              <Button label="Save" primary={true} strong={true} onClick={this._onSubmit} />
              <Button label="Reset" strong={true} onClick={this._onReset} />
            </Menu>
          </Footer>
        </Form>
      </Layer>
    );
  }
};

PrintersSettings.propTypes = {
  prefix: PropTypes.string
};

PrintersSettings.defaultProps = {
  prefix: 'settings'
};
