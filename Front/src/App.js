import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Sources from "./pages/sources";
import Decay from "./pages/decay";
import Norms from "./pages/norms";
import ClassFunctions from "./pages/class_func";
import Substance from "./pages/substance";
import Db from "./pages/db";
import Coeff from "./pages/coeff";
function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Substance} />
        <Route path="/substance" component={Substance} />
        <Route path="/decay" component={Decay} />
        <Route path="/sources" component={Sources} />
        <Route path="/norms" component={Norms} />
        <Route path="/class_func" component={ClassFunctions} />
        <Route path="/coeff" component={Coeff} />
        <Route path="/db" component={Db} />
      </Switch>
    </Router>
  );
}
export default App;
