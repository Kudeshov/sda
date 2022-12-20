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
import ExpScenario from "./pages/exp_scenario";
import AgeGroup from "./pages/agegroup";
import DoseRatio from "./pages/dose_ratio";
import CalcFunction from "./pages/calcfunction";
import GriterionGr from "./pages/criterion_gr";
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
        <Route path="/exp_scenario" element={<ExpScenario/>} />               
        <Route path="/agegroup" element={<AgeGroup/>} />
        <Route path="/db" element={<Db/>} />
        <Route path="/dose_ratio" element={<DoseRatio/>} />
        <Route path="/calcfunction" element={<CalcFunction/>} />
        <Route path="/criterion_gr" element={<GriterionGr/>} />
      </Routes>
    </Router>
  );
}
export default App;
