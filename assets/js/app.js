const studentForm = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const addStdBtn = document.getElementById("addStudentBtn");
const updateStdBtn = document.getElementById("updateStudentBtn");
const nameControl = document.getElementById("name");
const addressControl = document.getElementById("address");
const batchControl = document.getElementById("batch");
const feesPaidControl = document.getElementById("feesPaid");
const feesPendingControl = document.getElementById("feesPending");
const contactControl = document.getElementById("contact");

const defaultStudents = [
    {
        studentId: "std-001",
        name: "Syed Haseeb",
        address: "Udgir, Maharashtra",
        batch: "B22 2026",
        feesPaid: 25000,
        feesPending: 5000,
        contact: "8767403773"
    },
    {
        studentId: "std-002",
        name: "Rahul Sharma",
        address: "Nagpur, Maharashtra",
        batch: "B23 2026",
        feesPaid: 20000,
        feesPending: 10000,
        contact: "9876543210"
    },
    {
        studentId: "std-003",
        name: "Ayesha Khan",
        address: "Amravati, Maharashtra",
        batch: "B21 2026",
        feesPaid: 30000,
        feesPending: 0,
        contact: "9123456780"
    }
];

const storedStudents = localStorage.getItem("studentArr");

let stdsArr;

if (storedStudents) {
    stdsArr = JSON.parse(storedStudents);
} else {
    stdsArr = defaultStudents;
    localStorage.setItem("studentArr", JSON.stringify(stdsArr));
}


// let stdsArr = JSON.parse(localStorage.getItem("studentArr")) || [];


function createStudent(arr) {
  let res = ``;
  arr.forEach((el, idx) => {
    res += `<tr id="${el.studentId}">
                         <td>${idx + 1}</td>
                         <td>${el.name}</td>
                         <td>${el.address}</td>
                         <td>${el.batch}</td>
                         <td class="text-success">${el.feesPaid}</td>
                         <td class="text-danger">${el.feesPending}</td>
                         <td>${el.contact}</td>
                         <td class="text-center"><button onclick="onStudentEditHandler(this)" class="btn btn-sm btn-primary" data-edit-id="${el.studentId}">Edit</button></td>
                         <td class="text-center"><button onclick="onStdDeleteHandler(this)" class="btn btn-sm btn-danger" data-delete-id="${el.studentId}">Delete</button></td>
                      </tr>`;
  });

  studentTable.innerHTML = res;
}

createStudent(stdsArr);

function onFormSubHandler(event) {
  event.preventDefault();
  let newStd = {
    studentId: Date.now().toString(),
    name: nameControl.value,
    address: addressControl.value,
    batch: batchControl.value,
    feesPaid: feesPaidControl.value,
    feesPending: feesPendingControl.value,
    contact: contactControl.value,
  };

  stdsArr.push(newStd);
  localStorage.setItem("studentArr", JSON.stringify(stdsArr));
  studentForm.reset();

  //show on ui
  let tr = document.createElement("tr");
  tr.id = newStd.studentId;
  tr.innerHTML = `  <td>${stdsArr.length}</td>
                        <td>${newStd.name}</td>
                        <td>${newStd.address}</td>
                        <td>${newStd.batch}</td>
                        <td class="text-success">${newStd.feesPaid}</td>
                        <td class="text-danger">${newStd.feesPending}</td>
                        <td>${newStd.contact}</td>
                        <td class="text-center"><button onclick="onStudentEditHandler(this)" class="btn btn-sm btn-primary" data-edit-id="${newStd.studentId}">Edit</button></td>
                        <td class="text-center"><button onclick="onStdDeleteHandler(this)" type="button" class="btn btn-sm btn-danger" data-delete-id="${newStd.studentId}">Delete</button>
                        </td>`;

  studentTable.append(tr);

  Swal.fire({
    text: `New student ${newStd.name} added successfully.`,
    icon: "success",
    timer: 2000,
  });
}

//edit

function onStudentEditHandler(ele) {
  const edit_id = ele.dataset.editId;
  const edit_obj = stdsArr.find((el) => el.studentId === edit_id);
  localStorage.setItem("update_id", edit_id);
  nameControl.value = edit_obj.name;
  addressControl.value = edit_obj.address;
  batchControl.value = edit_obj.batch;
  feesPaidControl.value = edit_obj.feesPaid;
  feesPendingControl.value = edit_obj.feesPending;
  contactControl.value = edit_obj.contact;

  addStdBtn.classList.add("d-none");
  updateStdBtn.classList.remove("d-none");
}

//update
function onStudentUpdateHandler() {
  let update_id = localStorage.getItem("update_id");
  localStorage.removeItem("update_id");
  let updated_obj = {
    studentId: update_id,
    name: nameControl.value,
    address: addressControl.value,
    batch: batchControl.value,
    feesPaid: feesPaidControl.value,
    feesPending: feesPendingControl.value,
    contact: contactControl.value
  }

  let update_idx = stdsArr.findIndex(el => el.studentId === update_id);
  stdsArr[update_idx] = updated_obj;
  localStorage.setItem("studentArr", JSON.stringify(stdsArr));

  let update_tr = document.getElementById(update_id).children;
  update_tr[1].innerText = nameControl.value;
  update_tr[2].innerText = addressControl.value;
  update_tr[3].innerText = batchControl.value;
  update_tr[4].innerText = feesPaidControl.value;
  update_tr[5].innerText = feesPendingControl.value;
  update_tr[6].innerText = contactControl.value;

  updateStdBtn.classList.add("d-none");
  addStdBtn.classList.remove("d-none");
  studentForm.reset();

  Swal.fire({
    text : `Student ${updated_obj.name} updated successfully`,
    icon : "success",
    timer : 2000
  })
}

function onStdDeleteHandler(ele) {
  let dlt_id = ele.dataset.deleteId;
  let dlt_obj = stdsArr.find((el) => el.studentId === dlt_id);
  if (!dlt_obj) return;

  let getIndex = stdsArr.findIndex((e) => e.studentId === dlt_id);

  Swal.fire({
    title: "Are you sure?",
    text: `You are about to delete ${dlt_obj.name}. This action cannot be reverted!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      stdsArr.splice(getIndex, 1);
      localStorage.setItem("studentArr", JSON.stringify(stdsArr));
      document.getElementById(dlt_id).remove();
      Swal.fire({
        title: "Deleted!",
        text: `${dlt_obj.name} has been deleted.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  });
}

studentForm.addEventListener("submit", onFormSubHandler);
updateStdBtn.addEventListener("click", onStudentUpdateHandler);
