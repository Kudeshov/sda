/* import React from "react"; */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Sources from "./pages/data_source";
import Chelement from "./pages/chelement";
import Norms from "./pages/norms";
import ClassFunctions from "./pages/class_func";
import Substance from "./pages/substance";
import SubstForm from "./pages/substform";
import PeopleClass from "./pages/people_class";
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
import ActionLevel from "./pages/action_level";
import Action from "./pages/action";
import Organ from "./pages/organ";
import ChemCompGr from "./pages/chem_comp_gr";
import Isotope from "./pages/isotope";
import Griterion from "./pages/criterion";
import ValueIntDose from "./pages/value_int_dose";
import RadiationType from "./pages/radiation_type";

//import ServerPaginationGrid from "./pages/pagination_test";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Isotope/>} />
        <Route path="/substance" element={<Substance/>} />
        <Route path="/chelement" element={<Chelement/>} />
        <Route path="/data_source" element={<Sources/>} />
        <Route path="/norms" element={<Norms/>} />
        <Route path="/class_func" element={<ClassFunctions/>} />
        <Route path="/people_class" element={<PeopleClass />} />
        <Route path="/irradiation" element={<Irradiation/>} />
        <Route path="/integral_period" element={<IntegralPeriod/>} />        
        <Route path="/aerosol_sol" element={<AerosolSol />} />
        <Route path="/aerosol_amad" element={<AerosolAmad/>} />
        <Route path="/let_level" element={<LetLevel/>} />       
        <Route path="/exp_scenario" element={<ExpScenario/>} />               
        <Route path="/agegroup" element={<AgeGroup/>} />
        <Route path="/subst_form" element={<SubstForm/>} />
        <Route path="/dose_ratio" element={<DoseRatio/>} />
        <Route path="/calcfunction" element={<CalcFunction/>} />
        <Route path="/criterion_gr" element={<GriterionGr/>} />
        <Route path="/action_level" element={<ActionLevel/>} />
        <Route path="/action" element={<Action/>} />
        <Route path="/organ" element={<Organ/>} />
        <Route path="/chem_comp_gr" element={<ChemCompGr/>} />
        <Route path="/isotope" element={<Isotope/>} />
        <Route path="/criterion" element={<Griterion/>} />  
        <Route path="/value_int_dose" element={<ValueIntDose/>} />
        <Route path="/radiation_type" element={<RadiationType/>} />          
      {/*  <Route path="/db" element={<ServerPaginationGrid/>} />  */}          
      </Routes>
    </Router>
  );
}
export default App;
