import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import queryString from 'query-string';
import { Octokit } from "@octokit/rest";
import { Select, MenuItem, Button, InputLabel } from "@material-ui/core";

import IssueList from '../components/IssueList';
import Header from '../components/LayoutHeader';
import Content from '../components/LayoutContent';
import IssueListFilter from '../components/IssueListFilter';
import { IssueState } from '../constants';
import RepoHeader from '../components/RepoHeader';
import InputSearch from '../components/InputSearch';

// const REPO_INFO_QUERY = gql`
// query Repo($owner: String!, $name: String!) {
//   repository(owner: $owner, name: $name) {
//     name
//     owner { login }
//     description
//   }
// }
// `;

const styles = theme => ({
  content: {
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  filters: {
    marginBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
  },
  searchInput: {
    transition: theme.transitions.create('width'),
    width: 400
  },
  searchForm: {
    paddingLeft: theme.spacing.unit * 2
  },
  label: {
    marginRight: 10,
  }
});

const RepoPage = (props) => {

  const octokit = new Octokit({});
  const [repository, setRepository] = useState();

  const { classes, match, location } = props;
  const { owner, name } = match.params;
  const { _state = IssueState.OPEN } = queryString.parse(location.search);
  const [stateValue, setStateValue] = useState(_state);
  const [filterValue, setFilterValue] = useState('');
  const inputRef = useRef(null)
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const getData = async () => {
      let data = await octokit.rest.repos.get({
        owner,
        repo: name,
      }).then(res => res.data);
      setRepository(data);
      let _labels = await octokit.rest.issues.listLabelsForRepo({
        owner,
        repo: name,
      }).then(res => res.data);
      _labels.splice(0, 0, { name: '', id: 0 })
      setLabels(_labels);
    }
    getData();
  }, [])

  const handleChangeState = (e, value) => {
    const { history } = props;
    setStateValue(value);
    history.replace({ search: `?state=${value}` });
  }

  const onSubmitSearch = (e) => {
    e.preventDefault();
    const q = inputRef.current.value;
    setFilterValue(q);
  }

  // const labelSwitch = [
  //   {code: '', title: 'No value'},
  //   {code: 'enhancement', title: 'enhancement'},
  //   {code: 'bug', title: 'bug'}
  // ]
  const handleLabelSwitch = (e) => {
    setLabel(e.target.value);
    if (filterValue === '' || filterValue.search(/label:\w+/g) === -1){
      setFilterValue(e.target.value !== '' ? `${filterValue} label:${e.target.value}`: filterValue);
      return
    }
    let _fv = filterValue.replace(/label:\w+/g, e.target.value !== '' ? `label:${e.target.value}`: '');
    console.log(_fv);
    setFilterValue(_fv)
  }

  return (
    <>
      <Header>
        <RepoHeader repository={repository} />
      </Header>
      <Content className={classes.content}>
        <form onSubmit={onSubmitSearch} className={classes.searchForm}>
          <InputSearch
            fullWidth={false}
            placeholder="Search for issues, is:issue is:open sort:created order:desc"
            inputProps={{
              ref: inputRef,
              className: classes.searchInput,
            }}
          />
          <Button
            color="inherit"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <InputLabel className={classes.label} id="select-label-label">Label</InputLabel>
            <Select
              // className={classes.root}
              lavel='Label'
              labelId="select-label-label"
              id="select-label"
              onClick={() => setOpen(!open)}
              onClose={() => {}}
              onOpen={() => {}}
              value={label==='' ? '' : label}
              onChange={handleLabelSwitch}
              open={open}
            >
              {labels.map((lang, index) => {
                return (
                  <MenuItem key={index} value={lang.name}>
                    {lang.name ? lang.name : 'No value'}
                  </MenuItem>
                );
              })}
            </Select>
          </Button>
        </form>
        <IssueListFilter
          className={classes.filters}
          state={stateValue}
          onChange={handleChangeState}
          name={name}
          owner={owner}
          q={filterValue}
        />
        <IssueList
          owner={owner}
          name={name}
          state={stateValue}
          q={filterValue}
        />
      </Content>
    </>
  );
}

RepoPage.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
  history: PropTypes.object,
  match: PropTypes.object,
  location: PropTypes.object,
}

export default withStyles(styles)(RepoPage);
