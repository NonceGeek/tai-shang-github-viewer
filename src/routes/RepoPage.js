import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import queryString from 'query-string';
import { Octokit } from "@octokit/rest";

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

  useEffect(() => {
    const getData = async () => {
      let data = await octokit.rest.repos.get({
        owner,
        repo: name,
      }).then(res => res.data);
      setRepository(data);
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
