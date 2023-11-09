var selector, elems, makeActive;
selector = '.action-list li';
elems = document.querySelectorAll(selector);

// Add 'active' class to the first element
elems[0].classList.add('active');

makeActive = function () {
    for (var i = 0; i < elems.length; i++)
        elems[i].classList.remove('active');
    this.classList.add('active');
};

for (var i = 0; i < elems.length; i++)
    elems[i].addEventListener('mousedown', makeActive);

document.addEventListener('DOMContentLoaded', function () {
    const pendingButton = document.getElementById('pending');
    const completedButton = document.getElementById('completed');

    // pendingButton.addEventListener('click', function (event) {
    //     pendingButton.classList.add("active");

    //     alert("clicked:" + this.id);
    // });
});