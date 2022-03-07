import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import ChipBase from '@material-ui/core/Chip';

import Info from '../svgIcons/Info';

const styles = theme => ({
  root: {
    background: '#01D48A', // Green
    color: '#fff',
    fontWeight: 500,
  },
  red: {
    background: '#FF5252', // Red
  },
  icon: {
    height: 16,
    width: 16,
    marginLeft: theme.spacing.unit,
    color: theme.palette.common.white,
  },
});

const Chip = ({ classes, className, state }) => (
  <ChipBase
    className={cx(classes.root, className, { [classes.red]: state === 'CLOSED' })}
    icon={<Info color="inherit" className={classes.icon} />}
    label={state === "OPEN" ? "Open" : "Closed"}
  />
);

Chip.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default withStyles(styles)(Chip);
