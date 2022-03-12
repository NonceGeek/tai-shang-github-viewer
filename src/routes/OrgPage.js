
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import { Octokit } from "@octokit/rest";

import Header from '../components/LayoutHeader';
import OrgHeader from '../components/OrgHeader';
import Content from '../components/LayoutContent';
import RepoListItem from '../components/RepoListItem';
import Message from '../components/Message';
import Pagination from '../components/Pagination';

const styles = theme => ({
  content: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  title: {
    ...theme.mixins.gutters(),
  }
});

// const SEARCH_REPO = gql`
//   query SearchRepo($query: String!) {
//     search(query: $query, type: REPOSITORY, first: 10) {
//       edges {
//         node {
//           ...on Repository {
//             id
//             name
//             nameWithOwner
//             owner { login }
//             description
//             stargazers {
//               totalCount
//             }
//           }
//         }
//       }
//     }
//   }
// `;

// const DEFAULT_QUERY = 'stars:>1000';

const OrgPage = ({ classes, children, match, location }) => {
  // const { q } = queryString.parse(location.search);

  //   const { classes, match, location } = props;
  const { owner } = match.params;

  const [auth, setAuth] = useState(() => {
    const initialValue = localStorage.getItem("access_token");
    return initialValue || "";
  });

  const octokit = new Octokit({auth: auth});
  const [repos, setRepos] = useState([]);
  const [org, setOrg] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    loadMore(page);
    getOrg();
  }, [])

  const getOrg = async () => {
    let data = await octokit.rest.orgs.get({
      org: owner,
    }).then(res => res.data);
    setOrg(data);
  }

  const loadMore = async (page) => {
    setLoading(true);
    setIsError(false);
    let data = await octokit.rest.repos.listForOrg({
      org: owner,
      page
    }).then(res => {
      let data = res.data
      setRepos(data);
      setLoading(false);
    }).catch(err => {
      setIsError(true);
    });
  }

  const onLoadNext = async () => {
    setPage(page + 1);
    loadMore(page + 1);
  }
  const onLoadPrevious = async () => {
    setPage(page - 1);
    loadMore(page - 1);
  }
  const hasNextPage = repos.length === 30;
  const hasPreviousPage = page !== 1;

  return (
    <>
      <Header>
        <OrgHeader org={org} />
      </Header>
      <Content className={classes.content}>
        {isError ? (<Message
            title="Oops"
            description={`We couldn't find repo results for "${owner}"`}
          />) : loading ?
          <List>
            <RepoListItem loading />
            <RepoListItem loading />
            <RepoListItem loading />
            <RepoListItem loading />
          </List> :
          repos.length === 0 ? (<Message
            title="Oops"
            description={`We couldn't find repo results for "${owner}"`}
          />) : (
            <>
              <List>
                {repos.map((repo) => {
                  return (
                    <Link
                      key={repo.id}
                      to={`/${repo.owner.login}/${repo.name}`}
                    >
                      <RepoListItem
                        title={repo.full_name}
                        description={repo.description}
                        starCount={repo.stargazers_count}
                      />
                    </Link>
                  );
                })}
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

OrgPage.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
  children: PropTypes.node,
};

export default withStyles(styles)(OrgPage);
