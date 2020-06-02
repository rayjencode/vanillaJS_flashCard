document.addEventListener('DOMContentLoaded', function () {
    EventListener();
});

function EventListener() {
    const showBtn = document.getElementById('show-btn');
    const questionCard = document.querySelector('.question-card');
    const closeBtn = document.querySelector('.close-btn');
    const form = document.getElementById('question-form');
    const feedback = document.querySelector('.feedback');
    const questionInput = document.getElementById('question-input');
    const answerInput = document.getElementById('answer-input');
    const questionList = document.getElementById('questions-list');
    let data = [];

    let id = () => {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
        return (
            s4() +
            s4() +
            '-' +
            s4() +
            '-' +
            s4() +
            '-' +
            s4() +
            '-' +
            s4() +
            s4() +
            s4()
        );
    };

    const ui = new UI();

    showBtn.addEventListener('click', function () {
        ui.showQuestion(questionCard);
    });

    closeBtn.addEventListener('click', function () {
        ui.hideQuestion(questionCard);
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (questionInput.value === '' || answerInput.value === '') {
            feedback.classList.add('showItem', 'alert', 'alert-danger');
            feedback.innerHTML = `Question and Answer fields are required!`;

            setTimeout(() => {
                feedback.classList.remove('showItem', 'alert', 'alert-danger');
                feedback.innerHTML = ``;
            }, 3000);
        } else {
            const question = new Question(
                id(),
                questionInput.value,
                answerInput.value
            );
            data.push(question);

            ui.addQuestion(questionList, question);

            ui.clearField(questionInput, answerInput);

            ui.hideQuestion(questionCard);
        }

        console.log(data);
    });

    questionList.addEventListener('click', function (e) {
        const target = e.target;

        // Delete Item
        if (target.classList.contains('delete-flashcard')) {
            let dataId = target.dataset.id;

            questionList.removeChild(
                target.parentElement.parentElement.parentElement
            );

            let tempData = data.filter(function (item) {
                return item.id !== dataId;
            });

            data = tempData;

            console.log(data);
        } else if (target.classList.contains('edit-flashcard')) {
            let dataId = target.dataset.id;

            // Remove Element
            questionList.removeChild(
                target.parentElement.parentElement.parentElement
            );
            // Remove from data array
            let tempData = data.filter(function (item) {
                return item.id !== dataId;
            });

            // filter the data that match to our ID
            let getQuestion = data.filter(function (item) {
                return item.id === dataId;
            });

            data = tempData;

            ui.showQuestion(questionCard);

            getQuestion.forEach(function (item) {
                questionInput.value = item.title;
                answerInput.value = item.answer;
            });
        } else if (target.classList.contains('show-answer')) {
            target.nextElementSibling.classList.toggle('showItem');
        }
    });
}

// UI Constructor Function
function UI() {}
UI.prototype.showQuestion = function (element) {
    element.classList.add('showItem');
    document.body.style.background = 'rgb(100, 100, 100)';
};
UI.prototype.hideQuestion = function (element) {
    element.classList.remove('showItem');
    document.body.style.background = 'none';
};

UI.prototype.addQuestion = function (element, question) {
    const div = document.createElement('div');
    div.classList.add('col-md-4');
    div.innerHTML = `
    <div class="card card-body flashcard my-3">
     <h4 class="text-capitalize">${question.title}</h4>
     <a href="#" class="text-capitalize my-3 show-answer">show/hide answer</a>
     <h5 class="answer mb-3">${question.answer}</h5>
     <div class="flashcard-btn d-flex justify-content-between">

      <a href="#" id="edit-flashcard" class=" btn my-1 edit-flashcard text-uppercase" data-id="${question.id}">edit</a>
      <a href="#" id="delete-flashcard" class=" btn my-1 delete-flashcard text-uppercase" data-id="${question.id}">delete</a>
     </div>
    </div>
    `;
    element.appendChild(div);
};

UI.prototype.clearField = function (q, a) {
    q.value = '';
    a.value = '';
};

// Question Constructor function
function Question(id, title, answer) {
    this.id = id;
    this.title = title;
    this.answer = answer;
}
