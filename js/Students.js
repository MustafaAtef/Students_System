export const status = {
  students: [],
  deletedStudents: [],
  searchedStudents: [],
};
const API_URL = "http://localhost:3000/students/";
const getJSON = async function (url) {
  const data = await fetch(url);
  return await data.json();
};

export const getStudents = async function () {
  status.students = await getJSON(`${API_URL}?isDeleted=false`);
};

export const createStudent = async function (data) {
  console.log(data);
  const studentsBody = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "content-type": "application/json" },
  });

  const student = await studentsBody.json();
  status.students.push(student);
  return status.students;
};

export const getStudent = async function (id) {
  return await getJSON(`${API_URL}${id}`);
};
export const editStudent = async function (id, data) {
  await fetch(`${API_URL}${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "content-type": "application/json" },
  });

  await getStudents();
  return status.students;
};

export const deleteStudent = async function (method, id) {
  if (method === "PERM") {
    await fetch(`${API_URL}${id}`, {
      method: "DELETE",
    });
    await getStudents();
    return status.students;
  }

  if (method === "TEMP") {
    const student = await getStudent(id);
    student.isDeleted = true;
    return await editStudent(id, student);
  }
};

export const getTempDeletedStudents = async function () {
  status.deletedStudents = await getJSON(`${API_URL}?isDeleted=true`);
  return status.deletedStudents;
};

export const optionsTemporaryDeletedStudents = async function (option, id) {
  if (option === "restore") {
    const student = await getStudent(id);
    student.isDeleted = false;
    await editStudent(id, student);
    await getTempDeletedStudents();
    return status;
  }

  if (option === "delete") {
    await deleteStudent("PERM", id);
    await getTempDeletedStudents();
    return status;
  }
};

export const searchStudent = function (student) {
  status.searchedStudents = [];
  status.students.forEach((std) => {
    if (std.name === student) status.searchedStudents.push(std);
  });
  return status.searchedStudents;
};

export const resetData = function () {
  status.searchedStudents = [];
  return status.students;
};
