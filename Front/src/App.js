import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Sources from "./pages/sources";
import Decay from "./pages/decay";
import Norms from "./pages/norms";
import ClassFunctions from "./pages/class_func";
import Substance from "./pages/substance";
import Db from "./pages/db";
import Coeff from "./pages/coeff";
import Irradiation from "./pages/irradiation";
import IntegralPeriod from "./pages/integral_period";
import AerosolSol from "./pages/aerosol_sol";
import AerosolAmad from "./pages/aerosol_amad";
import LetLevel from "./pages/let_level";
import AgeGroup from "./pages/agegroup";
//import Page from "./page";
//import lastID from "./pages/coeff";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Substance/>} />
        <Route path="/substance" element={<Substance/>} />
        <Route path="/decay" element={<Decay/>} />
        <Route path="/sources" element={<Sources/>} />
        <Route path="/norms" element={<Norms/>} />
        <Route path="/class_func" element={<ClassFunctions/>} />
        <Route path="/coeff" element={<Coeff />} />
        <Route path="/irradiation" element={<Irradiation/>} />
        <Route path="/integral_period" element={<IntegralPeriod/>} />        
        <Route path="/aerosol_sol" element={<AerosolSol />} />
        <Route path="/aerosol_amad" element={<AerosolAmad/>} />
        <Route path="/let_level" element={<LetLevel/>} />
        <Route path="/agegroup" element={<AgeGroup/>} />        
{/*             render={(props) => (
            <Page title="Типы облучаемых лиц">
              <Coeff {...props} />
            </Page>
          )}
            */}
        <Route path="/db" element={<Db/>} />
      </Routes>
    </Router>
  );
}
export default App;
