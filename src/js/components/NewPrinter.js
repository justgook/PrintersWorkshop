import React from 'react';
import Layer from 'grommet/components/Layer';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import Form from 'grommet/components/Form';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';

export default ({name, bytes, onClose, onSubmit}) => {
  var inputRef; //TODO find better solution
  return (
    <Layer closer={true} align="top" onClose={onClose} >
      <Form compact={false} onSubmit={(e)=>{
        e.preventDefault();
      }}>
        <Header>
          <h1>Create New Printer</h1>
        </Header>
        <FormFields>
          <fieldset>
            <FormField label="Name" htmlFor="new-printer-name">
              <input id="new-printer-name" name="name" type="text" ref={(ref) => inputRef = ref} />
            </FormField>
          </fieldset>
        </FormFields>
        <Footer pad={{vertical: 'medium'}} direction="row" justify="end">
          <Button onClick={()=> onSubmit(inputRef.value)} label="Create" primary={true} strong={true} />
        </Footer>
      </Form>
    </Layer>
  );
};
