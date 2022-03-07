import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import { withSkeletonProvider, placeholder, Span } from './Skeleton';

const styles = theme => ({
  subtitle: {
    fontWeight: theme.typography.fontWeightRegular,
  }
});

const OrgHeader = ({ classes, children, org }) => {
  const { name, login, description } = org;
  return (
    <div className={classes.root}>

      <Typography variant="h6">
        <Span><Link to={`/${login}`}>{login}</Link></Span>
      </Typography>

      <Typography variant="subtitle1" className={classes.subtitle} color="textSecondary">
        <Span>{description}</Span>
      </Typography>
    </div>
  );
};

OrgHeader.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
  children: PropTypes.node,
  org: PropTypes.shape({
    login: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
  }),
};

const isLoading = props => !props.org;
export default compose(
  withSkeletonProvider({
    org: {
      login: placeholder(15),
      name: placeholder(15),
      description: placeholder(160),
    }
  }, isLoading),
  withStyles(styles),
)(OrgHeader);
