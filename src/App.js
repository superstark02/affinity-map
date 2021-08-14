import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import BucketView from './Pages/BucketView';
import Group from './Pages/Group';

function App() {
  return (
    <div>
      <Router >
        <Switch>
          <Route exact path='/' component={BucketView} />
          <Route exact path='/group' component={Group} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;