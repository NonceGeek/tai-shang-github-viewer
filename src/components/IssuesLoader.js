import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Octokit } from '@octokit/rest';
import { setIssueOpenCount, setIssueClosedCount } from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';

// const ISSUES_QUERY = gql`
//   query IssuesList($owner: String!, $name: String!, $state: [IssueState!], $cursor: String, $pageSize: Int) {
//     repository(owner: $owner, name: $name) {
//       issues(
//           first: $pageSize,
//           states: $state,
//           orderBy: { field: UPDATED_AT, direction: DESC },
//           after: $cursor
//         ) {
//         pageInfo {
//           endCursor
//           hasNextPage
//         }
//         edges {
//           cursor
//           node {
//             id
//             number
//             title
//             author { login }
//             state
//             createdAt
//             comments { totalCount }
//           }
//         }
//       }
//     }
//   }
// `;

const IssuesLoader = ({ children, owner, name, state, q, pageSize }) => {
  let dispatch = useDispatch();
  const [auth, setAuth] = useState(() => {
    const initialValue = localStorage.getItem("access_token");
    return initialValue || "";
  });

  const octokit = new Octokit({auth: auth});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadMore(1);
  }, [state, q])

  const loadMore = async (page) => {
    let data = []
    if (q === '') {
      data = await octokit.rest.issues.listForRepo({
        owner,
        repo: name,
        page: page,
        state: state.toLowerCase(),
      }).then(res => {
        let _issues = res.data;
        setIssues(_issues);
      });
      
    } else {
      let _q = `${q}+repo:${owner}/${name}+type:issue+state:${state.toLowerCase()}`;
      data = await octokit.rest.search.issuesAndPullRequests({
        q: _q,
        page: page,
      }).then(res => {
        let _issues = res.data;
        setIssues(_issues.items);
        if (state.toLowerCase() === "open") {
          dispatch(setIssueOpenCount(_issues.total_count));
        } else {
          dispatch(setIssueClosedCount(data.total_count));
        }
      });
      
    }
    setLoading(false);
    return data;
  }

  useEffect(() => {
    calIssueCount();
  }, [q])

  const calIssueCount = async () => {
    if (q === '') {
      let _q = `${q}+repo:${owner}/${name}+type:issue+state:${state.toLowerCase()}`;
      await octokit.rest.search.issuesAndPullRequests({
        q: _q,
        per_page: 1,
      }).then(res => {
        let data = res.data;
        if (state.toLowerCase() === "open") {
          dispatch(setIssueOpenCount(data.total_count));
        } else {
          dispatch(setIssueClosedCount(data.total_count));
        }
      });
    }
    let _state = state.toLowerCase() === "open" ? "closed" : "open";
    let _q = `${q}+repo:${owner}/${name}+type:issue+state:${_state}`;
    await octokit.rest.search.issuesAndPullRequests({
      q: _q,
      per_page: 1,
    }).then(res => {
      let data = res.data;
      if (_state === "open") {
        dispatch(setIssueOpenCount(data.total_count));
      } else {
        dispatch(setIssueClosedCount(data.total_count));
      }
    });
  }

  return children({
    loading,
    // error,
    issues: issues,
    hasNextPage: issues.length < pageSize ? false : true,
    hasPreviousPage: page === 1 ? false : true,
    page: page,
    onLoadNext: () => {
      setPage(page + 1);
      loadMore(page + 1)
    },
    onLoadPrevious: () => {
      setPage(page - 1);
      loadMore(page - 1)
    }
  });
};

IssuesLoader.propTypes = {
  owner: PropTypes.string,
  name: PropTypes.string,
  state: PropTypes.string,
  pageSize: PropTypes.number,
  children: PropTypes.func.isRequired,
};

IssuesLoader.defaultProps = {
  pageSize: 10,
};

export default IssuesLoader;
