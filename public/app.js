// const tabBodyItems = document.querySelectorAll('.tab-body-item');

// tabBodyItems.forEach(tabBodyItem => {
//   tabBodyItem.addEventListener('click', () => {
//     const modal = document.querySelector('.modal')
//     openModal(modal)
//   })
// });


// const wrapper = document.querySelector('.wrapper');
// const closeBtn = document.querySelector('.close');

// const signup = document.querySelector('.signup');
// const login = document.querySelector('.loginB');

// const login_a = document.querySelector('.login-a');
// const signup_a = document.querySelector('.signup-a');


// signup.addEventListener('click', () => {
//   wrapper.classList.add('active-popup');
//   wrapper.classList.remove('active');
// })

// login.addEventListener('click', () => {
//   wrapper.classList.add('active-popup')
//   wrapper.classList.add('active');
// })

// login_a.addEventListener('click', () => {
//   wrapper.classList.add('active');
// })

// signup_a.addEventListener('click', () => {
//   wrapper.classList.remove('active');
// })

// closeBtn.addEventListener('click', () => {
//   wrapper.classList.remove('active-popup');
// })




// updating list title via fetch 

const titleInputs = document.querySelectorAll('[data-list-title]');
titleInputs.forEach(titleInput => {
  titleInput.addEventListener('blur', async () => {
    const taskId = titleInput.dataset.taskId;
    const newTitle = titleInput.value;
    try {
      const response = await fetch(`/update-title/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newTitle }),
      });
    } catch (error) {
      console.error('Error:', error);
    }
  });

  titleInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      titleInput.blur();
    }
  });
});

// adding list

const addlistbtn = document.getElementById('addlistbtn');
const addListDetails = document.getElementById('addListDetails');
const cancelList = document.getElementById('cancelList');
const list_title = document.getElementById('list_title');
const addList = document.getElementById('addList');
const contentBody = document.querySelector('.child-content-body');


function toggleListDetails() {
  addlistbtn.classList.toggle('proactive');
  addListDetails.classList.toggle('proactive');
}

addlistbtn.addEventListener('click', () => {
  toggleListDetails();
  list_title.focus();
});

cancelList.addEventListener('click', () => {
  toggleListDetails();
  list_title.value = "";
});

addList.addEventListener('click', async function () {
  const existinghtml = contentBody.innerHTML;
  const title = list_title.value;
  console.log(title)
  const html = `
  <div class="tab-container">

                <div class="tab-body-block">

                  <div class="body-item-head">

                    <script>
                      var taskId = '<%= task._id %>';
                    </script>
                    <!-- update title -->
                    <form class="formclass" method="post" action="/update-title/<%= task._id %>?_method=PATCH">
                      <h4 class="body-item-head-title">
                        <input type="text" data-list-title="#listTitle-<%= task._id %>" data-task-id="<%= task._id %>"
                          class="titleInput bg-transparent pl-1" value="${title}">
                      </h4>
                    </form>
                    <!-- Delete list -->
                    <div class="listDelete">
                      <form action="/<%= task._id %>?_method=DELETE" method="post">
                        <button type="submit" class="xmark"><i class="fa-solid fa-trash"></i></button>
                      </form>
                    </div>
                    <!-- <button class="body-item-head-btn group">
                      <img class="group-hover:invert">
                    </button> -->
                  </div>

                  <!-- tab body container -->
                  <div id="tab-body-container" class="tab-body-container">

                  </div>

                  <div class="" id="overlay"></div>

                  <div class="addcard rounded-lg ml-1">
                    <button
                      class="addcardbtn rounded-lg hover-bg-gray-200 transition-all duration-300 ease-in-out w-full text-left pl-2 py-1">
                      <i class="fa-solid fa-plus mr-2"></i>
                      Add a card
                    </button>
                    <div class="addCardDetails proactive">
                      <form class="formclass" method="post" action="/?_method=PATCH">
                        <input type="hidden" name="id" value="<%= task._id %>">
                        <textarea name="cardDetails"
                          class="cardDetails rounded-lg bg-white shadow-tab-item p-4 border-solid border-[1px] border-black/5 mb-2"
                          placeholder="Enter a title..."></textarea>
                        <button class="addCard rounded-[4px] bg-[#579DFF] px-3 py-1 mr-2">Add card</button>
                        <button class="cancelCard" type="button"><i
                            class="fa-solid fa-xmark fa-lg cursor-pointer"></i></button>
                      </form>
                    </div>
                    <!-- <div class="" id="overlay2"></div> -->
                  </div>

                </div>

              </div>
      `
  contentBody.innerHTML = existinghtml + html;
  toggleListDetails();
});



// adding card

const addCards = document.querySelectorAll('.addCard');
const addCardBtns = document.querySelectorAll('.addcardbtn');
const addCardDetails = document.querySelectorAll('.addCardDetails');
const cancelBtns = document.querySelectorAll('.cancelCard');
const tabBodyContainer = document.querySelectorAll('.tab-body-container');
const cardDetails = document.querySelectorAll('.cardDetails');

// const overlay2 = document.getElementById('overlay2');
// overlay2.addEventListener('click', (e) => {
//   if (addCardDetails[index].classList.contains('proactive')) {
//     toggleCardDetails(index);
//     cardDetails[index].value = "";
//   }
// });

function toggleCardDetails(index) {
  addCardBtns[index].classList.toggle('proactive');
  addCardDetails[index].classList.toggle('proactive');
}

addCardBtns.forEach((addCardBtn, index) => {
  addCardBtn.addEventListener('click', () => {
    toggleCardDetails(index);
    cardDetails[index].focus();
  });

  cancelBtns[index].addEventListener('click', () => {
    toggleCardDetails(index);
    cardDetails[index].value = "";
  });
});


addCards.forEach((addCard, index) => {
  addCard.addEventListener('click', async function () {
    const tabBodyContainer = document.querySelectorAll('.tab-body-container')[index];
    const cardDetails = document.querySelectorAll('.cardDetails')[index];

    const text = cardDetails.value;

    const html = `
    <div class="tab-body-list">
    <!-- tab item -->
    <div class="tab-body-item">

      <div class="item-top">
        <div class="item-top-title">
          <div class="checkbox-wrapper">
            <input type="checkbox">
            <span class="checkmark"></span>
          </div>
        </div>

        <!-- edit task details-popup btn -->
        <div class="edit-icon">
          <button data-modal-target="#modal-<%= nestedTask._id %>" class="popup-open">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <!-- <div class="cancel ml-2">
          <form action="/<%= task._id %>/nested/<%= nestedTask._id %>?_method=DELETE"
            method="post">
            <button type="submit" class="xmark"><i class="fa-solid fa-xmark"></i></button>
          </form>
        </div> -->
        </div>

      </div>

      <div class="item-body">
        <p class="item-body-text break-words">
          <%= nestedTask.taskTitle %>
        </p>
        <div class="badge-group">
          <span class="badge-brown">Optimalization</span>
          <span class="badge-blue">New Project</span>
          <span class="badge-green">Design</span>
        </div>
      </div>
    </div>

    <!-- edit pop-up -->
    <div data-id="<%= nestedTask._id %>" class="modal  pl-10 pt-2" id="modal-<%= nestedTask._id %>">

      <form class="formclass" method="post"
        action="/<%= task._id %>/nested/<%= nestedTask._id %>?_method=PATCH">

        <div class="modal-header">
          <div class="modal-title">
            <div class="input">
              <input type="text" name="taskTitle" id="" class="text-2xl break-words w-full"
                value="<%=nestedTask.taskTitle%>">
              <p class="text-[13px] font-semibold ">in list
                <span class="underline">
                  <%=task.listTitle%>
                </span>
              </p>
            </div>
          </div>
          <div data-close-btn class="close-btn">&times;</div>
        </div>

        <div class="modal-body">
          <div class="edit-form">

            <div class="create-task">

              <div class="create-container">

                <div class="input">
                  <label class="desc font-semibold underline" for="description">Description</label>
                  <br>
                  <textarea name="description" id="" placeholder="Add description..."
                    class="edit_desc"><%=nestedTask.description%></textarea>
                </div>

                <br>
                <div class="input">
                  <label class="stat font-semibold underline" for="Status">Status</label>
                  <select name="status" id="">
                    <% for(let category of categories) { %>
                      <option value="<%=category%>" <%=nestedTask.status===category ? 'selected'
                        : '' %>>
                        <%=category%>
                      </option>
                      <% } %>
                  </select>
                </div>

                <br>
                <div class="date">
                  <label class="due font-semibold underline" for="due-date">Due date</label>
                  <input type="date" name="duedate" id="" value="<%=nestedTask.duedate%>">
                  <div class="line"></div>
                </div>

              </div>

            </div>

            <div class="save-btn"><button
                class="save bg-green hover:bg-opacity-80 text-white px-4 py-1 rounded-lg">Save</button>
            </div>
          </div>
        </div>

      </form>

      <div class="cancel ml-96">
        <form action="/<%= task._id %>/nested/<%= nestedTask._id %>?_method=DELETE" method="post">
          <button type="submit"
            class="xmark bg-red-700 hover:bg-opacity-80 text-white px-4 py-1 rounded-lg">Delete
            Card</button>
        </form>
      </div>

    </div>

  </div>`;

    const taskElement = document.createElement('div');
    taskElement.innerHTML = html;
    tabBodyContainer.appendChild(taskElement);
    try {
      await waitingToSaveInMongo(text);
      cardDetails.value = '';
    }
    catch (error) {
      console.error('Error:', error);
    }
    toggleCardDetails(index);
  });
});


// edit pop up

const openModalBtn = document.querySelectorAll('[data-modal-target]');
const closeModalBtn = document.querySelectorAll('[data-close-btn]');
const overlay = document.getElementById('overlay');
const tabBodyItems = document.querySelectorAll('.tab-body-item');
const edit_forms = document.querySelectorAll('.edit_form');
const edit_form = document.getElementById('edit_form');


// edit_forms.forEach(form => {
//   const inputs = form.querySelectorAll('input, textarea, select');
//   inputs.forEach(input => {
//     input.readOnly = true;
//   });
// });
// edit_forms.forEach(form => {
//   const inputs = form.querySelectorAll('input, textarea, select');
//   const saveButton = form.querySelector('.save');

//   inputs.forEach(input => {
//     input.readOnly = true;
//   });

//   if (saveButton) {
//     saveButton.style.display = 'none';
//   }
// });

// tabBodyItems.forEach(body => {
//   body.addEventListener('click', () => {
//     edit_form.style.pointerEvents = edit_form.style.pointerEvents === 'none' ? 'auto' : 'none';
//   });
// });



tabBodyItems.forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = document.querySelector(btn.dataset.modalTarget);
    openModal(modal);
  });
});

openModalBtn.forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = document.querySelector(btn.dataset.modalTarget)
    openModal(modal)
  })
})

closeModalBtn.forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = btn.closest('.modal')
    closeModal(modal)
  })
})

function openModal(modal) {
  if (modal == null) return;
  modal.classList.add('active');
  overlay.classList.add('active')
}

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove('active');
  overlay.classList.remove('active')
}

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active');
  modals.forEach(modal => {
    closeModal(modal);
  })
})
