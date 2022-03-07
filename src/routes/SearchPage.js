
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import { Octokit } from "@octokit/rest";

import Content from '../components/LayoutContent';
import RepoListItem from '../components/RepoListItem';
import Message from '../components/Message';
// import MessageError from '../components/MessageError';

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

const Search = ({ classes, children, location }) => {
  const { q } = queryString.parse(location.search);

  const octokit = new Octokit({});
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      let data = await octokit.rest.repos.listForOrg({
        org: q
      }).then(res => res.data);
      console.log(data.items);
      setRepos(data);
      setLoading(false);
    }
    getData();
  }, [])

  return (
    <>
      <Content className={classes.content}>
        <Typography className={classes.title} variant="h6" gutterBottom>
          Search Repositories
        </Typography>
        {loading ?
          <List>
            <RepoListItem loading />
            <RepoListItem loading />
            <RepoListItem loading />
            <RepoListItem loading />
          </List> :
          repos.length === 0 ? (<Message
            title="Oops"
            description={`We couldn't find results for "${q}"`}
          />) : (
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
            </List>)
        }
      </Content>
    </>
  );
};

Search.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
  children: PropTypes.node,
};

export default withStyles(styles)(Search);
