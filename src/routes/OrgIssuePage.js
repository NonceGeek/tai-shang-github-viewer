
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import { Octokit } from "@octokit/rest";

import Content from '../components/LayoutContent';
import Header from '../components/LayoutHeader';
import OrgHeader from '../components/OrgHeader';
import IssueListItem from '../components/IssueListItem';
import IssueListFilter from '../components/IssueListFilter';
import Message from '../components/Message';
import Pagination from '../components/Pagination';
import { IssueState } from '../constants';
import InputSearch from '../components/InputSearch';
// import MessageError from '../components/MessageError';

const styles = theme => ({
  content: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  title: {
    ...theme.mixins.gutters(),
  },
  filters: {
    marginBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
  },
  searchInput: {
    transition: theme.transitions.create('width'),
    width: 400,
  },
  searchForm: {
    paddingLeft: theme.spacing.unit * 2
  }
});

// const DEFAULT_QUERY = 'stars:>1000';

const OrgIssuePage = ({ classes, match, location, history }) => {
  // const { q } = queryString.parse(location.search);
  const { owner } = match.params;

  const octokit = new Octokit({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { _state = IssueState.OPEN } = queryString.parse(location.search);
  const [stateValue, setStateValue] = useState(_state.toLowerCase());

  const [org, setOrg] = useState({});
  const [filterValue, setFilterValue] = useState('');

  const inputRef = useRef(null)

  useEffect(() => {
    getOrg();
  }, [])

  useEffect(() => {
    getIssues();
  }, [stateValue, page, filterValue])

  const getOrg = async () => {
    let data = await octokit.rest.orgs.get({
      org: owner,
    }).then(res => res.data);
    setOrg(data);
  }

  const getIssues = async (page) => {
    let q = `${filterValue}+org:${owner}+type:issue+state:${stateValue}`;
    let data = await octokit.rest.search.issuesAndPullRequests({
      q,
      page,
    }).then(res => res.data);
    setIssues(data.items);
  }

  const onLoadNext = async () => {
    setPage(page + 1);
    getIssues(page + 1);
  }
  const onLoadPrevious = async () => {
    setPage(page - 1);
    getIssues(page - 1);
  }
  const hasNextPage = issues.length === 30;
  const hasPreviousPage = page !== 1;

  const handleChangeState = (e, value) => {
    setStateValue(value.toLowerCase());
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
        <OrgHeader org={org} />
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
        {loading ?
          <List>
            <IssueListItem loading />
            <IssueListItem loading />
            <IssueListItem loading />
            <IssueListItem loading />
          </List> :
          issues.length === 0 ? (<Message
            title="Oops"
            description={`We couldn't find results for "${filterValue}"`}
          />) : (
            <>
              <IssueListFilter
                className={classes.filters}
                state={stateValue.toUpperCase()}
                onChange={handleChangeState}
                name=''
                owner={owner}
                q={filterValue}
              />
              <List>
                {issues.map(issue => (
                  <Link key={issue.id} to={`/${issue.repository_url.split('https://api.github.com/repos/')[1]}/issues/${issue.number}`}>
                    <IssueListItem
                      number={issue.number}
                      title={issue.title}
                      author={issue.user ? issue.user.login : undefined}
                      createdAt={issue.created_at}
                      commentCount={issue.comments}
                      state={issue.state === "open" ? IssueState.OPEN : IssueState.CLOSED}
                      tabIndex={-1}
                      repository={issue.repository_url.split('https://api.github.com/repos/')[1]}
                    />
                  </Link>
                ))}
              </List>
              <Pagination
                page={page}
                onLoadNext={onLoadNext}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
                onLoadPrevious={onLoadPrevious}
              />
            </>)
        }
      </Content>
    </>
  );
};

OrgIssuePage.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
  children: PropTypes.node,
};

export default withStyles(styles)(OrgIssuePage);
