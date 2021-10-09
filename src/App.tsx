import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link, RouteComponentProps
} from "react-router-dom";
import Test from "./Test";
import SubmissionExplorer from "./SubmissionsExplorer";

export default function App() {
  return (
      <Router>
        <div>
          {/*<nav>*/}
          {/*  <ul>*/}
          {/*    <li>*/}
          {/*      <Link to="/">Home</Link>*/}
          {/*    </li>*/}
          {/*    <li>*/}
          {/*      <Link to="/about">About</Link>*/}
          {/*    </li>*/}
          {/*    <li>*/}
          {/*      <Link to="/test/lk-1">LK-1</Link>*/}
          {/*    </li>*/}
          {/*  </ul>*/}
          {/*</nav>*/}

          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/test/:id" component={TestRouter}/>
            <Route path="/submissions/:id" component={SubmissionsRouter}/>
            <Route path="/success" component={Success}/>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
  );
}

type TParams = { id?: string };
function TestRouter({ match }: RouteComponentProps<TParams>): JSX.Element {
  return (<Test test_id={match.params.id || ''}/>)
}
function SubmissionsRouter({ match }: RouteComponentProps<TParams>): JSX.Element {
  return (<SubmissionExplorer test_id={match.params.id || ''}/>)
}

function Home() {
  const windowUrl = window.location.search;
  const params = new URLSearchParams(windowUrl);

  const test_id: string = params.get('test_id') || '';
  if (test_id)
    window.location.href = '/test/' + test_id;
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

function Success() {
  const windowUrl = window.location.search;
  const params = new URLSearchParams(windowUrl);

  const sid: string = params.get('sid') || '';
  return <div>
        <h3>Ваши результаты приняты, спасибо за отправку.</h3>
        <p>Идентификатор отправки: {sid}</p>
      </div>;
}