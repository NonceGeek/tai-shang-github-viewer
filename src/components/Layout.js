import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import cx from 'classnames';
import compose from 'recompose/compose';
import { Link, withRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import ThemeToggle from './ThemeToggle';
import InputSave from './InputSave';
import GithubIcon from '../svgIcons/Github';

import { Span } from './Skeleton';

const styles = theme => {
  const appBarBackground = theme.palette.background.contrast;

  return {
    appBar: {
      background: appBarBackground,
    },
    header: {
      background: appBarBackground,
      color: theme.palette.getContrastText(appBarBackground)
    },
    centered: {
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto',
    },
    toolbar: {
      position: 'relative',
      minHeight: 60,
    },
    toolbarContent: {
      display: 'flex',
      alignItems: 'center',
    },
    main: {
      padding: '24px 16px 24px',
    },
    logo: {
      height: 32,
      width: 'auto',
      position: 'absolute',
      top: '50%',
      // left: 16,
      transform: 'translateY(-50%)',
      color: theme.palette.text.primary,
    },
    searchInput: {
      transition: theme.transitions.create('width'),
      width: 180,
    },
    grow: {
      flex: 1,
    },
    allissue: {
      marginLeft: '75px'
    },
    span: {
      marginLeft: theme.spacing.unit * 2
    }
  };
};


function Layout(props) {
  let input = useRef(null);
  const [loading, setLoading] = useState(false);
  
  const onSubmitSave = (e) => {
    setLoading(true);
    e.preventDefault();
    localStorage.setItem('access_token', input.current.value);
    setTimeout(function(){
      setLoading(false);
   }, 1000);
  }

  const { classes, children } = props;

  return (
    <div>
      <AppBar elevation={0} className={classes.appBar} position="static">
        <Toolbar className={classes.toolbar}>
          <div className={cx(classes.toolbarContent, classes.centered)}>
            <Link to="/">
              <GithubIcon className={classes.logo} />
            </Link>
            <Typography variant="h6">
              <Span className={classes.allissue}><Link to="/WeLightProject">Repos</Link></Span>
              <Span className={classes.span}><Link to="/WeLightProject/issues">Issues</Link></Span>
              <Span className={classes.span}><a href="https://github.com/orgs/WeLightProject/projects/4/views/1" target="_blank">Hackathon</a></Span>
            </Typography>
            <div className={classes.grow} />
            <form onSubmit={onSubmitSave}>
              <InputSave
                fullWidth={false}
                placeholder="Add github access token"
                inputProps={{
                  ref: input,
                  className: classes.searchInput,
                }}
                loading={loading}
              />
            </form>
            <ThemeToggle />
          </div>
        </Toolbar>
      </AppBar>
      {children}
    </div>
  );
}

Layout.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
  children: PropTypes.node,
  history: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  withStyles(styles),
)(Layout);
