import "core-js/stable";
import "regenerator-runtime/runtime";
import view from "./view";
import {
  getStudents,
  status,
  createStudent,
  getStudent,
  editStudent,
  deleteStudent,
  getTempDeletedStudents,
  optionsTemporaryDeletedStudents,
  searchStudent,
  resetData,
} from "./Students";
const loadStudents = async function () {
  view.showTableSpinner();
  // get students data
  await getStudents();
  // show it in the view
  view.render(status.students);
  view.hideTableSpinner();
};
loadStudents();

(function () {
  view.createStudentHandler(createStudent);
  view.showEditStudentModalHandler(getStudent);
  view.editStudentHandler(editStudent);
  view.deleteStudentHandler(deleteStudent);
  view.showTemporaryDeletedStudentsHandler(getTempDeletedStudents);
  view.temporaryDeletedStudentOptionsHandler(optionsTemporaryDeletedStudents);
  view.searchStudentHandler(searchStudent);
  view.resetDataHandler(resetData);
})();
