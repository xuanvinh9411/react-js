/**
 * Created by THIPHUNG on 12/16/2016.
 */
import React, {PropTypes} from 'react';
import {FormControl} from 'react-bootstrap';
const Combobox = (props) => {
  let data=props.data;
  return (
    <FormControl {...props}>
      {data.map(item =>
        <option key={item.id} value={item.id}>{item.name}</option>)}
    </FormControl>
  );
};
Combobox.propTypes = {
  data: PropTypes.array.isRequired
};
export default Combobox;
