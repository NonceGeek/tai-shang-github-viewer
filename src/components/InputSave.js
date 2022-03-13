import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Save from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import { CircularProgress } from '@material-ui/core';
import InputBase from './InputBase';

const styles = theme => ({
  searchButton: {
    height: 30,
    width: 30,
    padding: 0,
    color: theme.palette.text.secondary,
  },
  rippleVisible: {
    opacity: 0.5,
    animation: `$enter 550ms ${theme.transitions.easing.easeInOut}`
  },
});

const InputSave = ({ classes, loading, ...props }) => (
  <InputBase
    endAdornment={
      <InputAdornment position="end">
        <IconButton
          TouchRippleProps={classes.rippleClasses}
          disabled={props.disabled}
          tabIndex={-1}
          className={classes.searchButton}
          type="submit"
        >
         {loading?<CircularProgress size={25}/>:<Save />}
        </IconButton>
      </InputAdornment>
    }
    {...props}
  />
);

InputSave.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
  className: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  loading: PropTypes.bool,
};

InputSave.defaultProps = {
  loading: false,
};

export default withStyles(styles)(InputSave);
