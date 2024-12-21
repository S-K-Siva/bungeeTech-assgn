import {Dropdown} from 'semantic-ui-react';

const DropDown = ({options, placeholder}) => {
    return <Dropdown 
        placeholder={placeholder}
        fluid
        search
        selection 
        options={options}
    />
};

export default DropDown;