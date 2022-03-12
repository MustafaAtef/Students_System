import { Modal } from "./modal";
class View {
  constructor() {
    this.dataTable = document.querySelector(".students_data tbody");
    this.tableSpinner = document.querySelector(
      ".students_data .loading-spinner"
    );

    this.createStudentModal = document.querySelector(".user_creation_modal");
    this.editStudentModal = document.querySelector(".user_edit_modal");
    this.deleteModal = document.querySelector(".user_delete_modal");
    this.temporaryDeletedModal = document.querySelector(
      ".temporary_deleted_modal"
    );

    this.createStudentModalHandler = new Modal(this.createStudentModal);
    this.editStudentModalHandler = new Modal(this.editStudentModal);
    this.deleteModalHandler = new Modal(this.deleteModal);
    this.temporaryDeletedModalHandler = new Modal(this.temporaryDeletedModal);

    this.createStudBtn = document.querySelector(".add_user");
    this.tempDeletedBtn = document.querySelector(".temp-deleted_btn");
    this.searchStudentsBtn = document.querySelector(".search_user button");
    this.searchStudentsInput = document.querySelector(".search_user input");
    this.resetDataBtn = document.querySelector(".reset_data button");

    this.createStudBtn.addEventListener(
      "click",
      this.createStudentModalHandler.open.bind(this.createStudentModalHandler)
    );

    this.dataTable.addEventListener("click", async (e) => {
      if (e.target.closest(".delete")) {
        const id = e.target.closest(".delete").dataset.id;
        this.deleteModal.querySelector(".temp-delete").dataset.id = id;
        this.deleteModal.querySelector(".perm-delete").dataset.id = id;
        this.deleteModalHandler.open();
      }
    });
  }
  render(students, type = "view") {
    this.dataTable.innerHTML = "";
    let html;
    if (!students.length) {
      html = `
            <tr>
                <td colspan="5">
                ${
                  type === "search"
                    ? "No Students With This Name Please Try With                    Another ."
                    : "No Students Exist Please Add One To Be viewed ..."
                }
                
                </td>
            </tr>
        `;
    } else {
      html = students
        .map((student) => {
          return `
            <tr>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.phone_number}</td>
                <td>${student.grade}</td>
                <td>
                    <button class="edit" data-id="${student.id}">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button class="delete" data-id="${student.id}">
                        <i class="fas fa-trash"></i>
                        delete
                    </button>
                </td>
            </tr>`;
        })
        .join("");
    }

    this.dataTable.insertAdjacentHTML("beforeend", html);
  }

  renderTDS(data) {
    this.temporaryDeletedModal.querySelector(".stds").innerHTML = "";
    let html;
    if (!data.length) {
      html = `
            <p>There Are No Temporary Deleted Students .</p>
        `;
    } else {
      html = data
        .map((std) => {
          return `
                <div class="std">
                    <p>${std.name}</p>
                    <div class="options">
                        <button class="std-restore" data-id="${std.id}"><i class="fas fa-sync-alt"></i> Restore</button>
                        <button class="std-delete" data-id="${std.id}"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </div>`;
        })
        .join("");
    }
    this.temporaryDeletedModal
      .querySelector(".stds")
      .insertAdjacentHTML("beforeend", html);
  }

  showTableSpinner() {
    this.tableSpinner.style.display = "block";
  }

  hideTableSpinner() {
    this.tableSpinner.style.display = "none";
  }

  showModalSpinner(modal) {
    modal.querySelector(".loading-spinner").style.display = "block";
  }

  hideModalSpinner(modal) {
    modal.querySelector(".loading-spinner").style.display = "none";
  }

  createStudentHandler(createStudent) {
    this.createStudentModal
      .querySelector(".save")
      .addEventListener("click", async () => {
        this.createStudentModalHandler.close();
        this.showTableSpinner();
        const stdName = this.createStudentModal.querySelector(".stdName").value;
        const stdEmail =
          this.createStudentModal.querySelector(".stdEmail").value;
        const stdPhone =
          this.createStudentModal.querySelector(".stdPhone").value;
        const stdGrade =
          this.createStudentModal.querySelector(".stdGrade").value;
        if (!(stdName && stdPhone && stdGrade && stdEmail)) return;
        const students = await createStudent({
          name: stdName,
          email: stdEmail,
          phone_number: stdPhone,
          grade: stdGrade,
          isDeleted: false,
        });
        this.render(students);
        this.hideTableSpinner();
      });
  }

  editStudentHandler(editStudent) {
    this.editStudentModal.querySelector(".update").addEventListener(
      "click",
      async function () {
        this.editStudentModalHandler.close();
        this.showTableSpinner();
        const stdName = this.editStudentModal.querySelector(".stdName").value;
        const stdEmail = this.editStudentModal.querySelector(".stdEmail").value;
        const stdPhone = this.editStudentModal.querySelector(".stdPhone").value;
        const stdGrade = this.editStudentModal.querySelector(".stdGrade").value;
        const id = this.editStudentModal.querySelector(".update").dataset.id;
        if (!(stdName && stdPhone && stdGrade && stdEmail)) return;
        const students = await editStudent(id, {
          name: stdName,
          email: stdEmail,
          phone_number: stdPhone,
          grade: stdGrade,
          isDeleted: false,
        });
        this.render(students);
        this.hideTableSpinner();
      }.bind(this)
    );
  }

  showEditStudentModalHandler(getStudent) {
    this.dataTable.addEventListener("click", async (e) => {
      if (e.target.closest(".edit")) {
        this.showTableSpinner();
        const id = e.target.closest(".edit").dataset.id;
        const student = await getStudent(id);
        this.editStudentModal.querySelector(".stdName").value = student.name;
        this.editStudentModal.querySelector(".stdEmail").value = student.email;
        this.editStudentModal.querySelector(".stdGrade").value = student.grade;
        this.editStudentModal.querySelector(".stdPhone").value =
          student.phone_number;
        this.editStudentModal.querySelector(".update").dataset.id = id;
        this.hideTableSpinner();
        this.editStudentModalHandler.open();
      }
    });
  }

  deleteStudentHandler(deleteStudent) {
    this.deleteModal.addEventListener(
      "click",
      async function (e) {
        if (e.target.closest(".temp-delete")) {
          this.deleteModalHandler.close();
          this.showTableSpinner();
          const id = e.target.closest(".temp-delete").dataset.id;
          const students = await deleteStudent("TEMP", id);
          this.render(students);
          this.hideTableSpinner();
        }

        if (e.target.closest(".perm-delete")) {
          this.deleteModalHandler.close();
          this.showTableSpinner();
          const id = e.target.closest(".perm-delete").dataset.id;
          const students = await deleteStudent("PERM", id);
          this.render(students);
          this.hideTableSpinner();
        }
      }.bind(this)
    );
  }

  showTemporaryDeletedStudentsHandler(getTDS) {
    this.tempDeletedBtn.addEventListener(
      "click",
      async function () {
        this.temporaryDeletedModalHandler.open.call(
          this.temporaryDeletedModalHandler
        );
        this.showModalSpinner(this.temporaryDeletedModal);
        const tempDeletedStudents = await getTDS();
        this.renderTDS(tempDeletedStudents);
        this.hideModalSpinner(this.temporaryDeletedModal);
      }.bind(this)
    );
  }

  async _handleOptionsTDS(e, func, type) {
    this.showModalSpinner(this.temporaryDeletedModal);
    const id = e.target.closest(`.std-${type}`).dataset.id;
    const status = await func(type, id);
    this.renderTDS(status.deletedStudents);
    this.hideModalSpinner(this.temporaryDeletedModal);
    this.showTableSpinner();
    this.render(status.students);
    this.hideTableSpinner();
  }

  temporaryDeletedStudentOptionsHandler(optionsTDS) {
    this.temporaryDeletedModal.querySelector(".modal .stds").addEventListener(
      "click",
      async function (e) {
        if (e.target.closest(".std-restore")) {
          await this._handleOptionsTDS(e, optionsTDS, "restore");
        }
        if (e.target.closest(".std-delete")) {
          await this._handleOptionsTDS(e, optionsTDS, "delete");
        }
      }.bind(this)
    );
  }

  searchStudentHandler(searchStudent) {
    this.searchStudentsBtn.addEventListener(
      "click",
      function () {
        if (this.searchStudentsInput.value === "") return;
        this.showTableSpinner();
        this.render(searchStudent(this.searchStudentsInput.value), "search");
        this.searchStudentsInput.value = "";
        this.resetDataBtn.classList.remove("disabled");
        this.hideTableSpinner();
      }.bind(this)
    );
  }

  resetDataHandler(resetData) {
    this.resetDataBtn.addEventListener(
      "click",
      function () {
        this.showTableSpinner();
        this.searchStudentsInput.value = "";
        this.render(resetData());
        this.resetDataBtn.classList.add("disabled");
        this.hideTableSpinner();
      }.bind(this)
    );
  }
}
export default new View();
