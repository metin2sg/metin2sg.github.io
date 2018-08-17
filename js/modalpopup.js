var modal;
var modalbody;
var span;
function initModal() {
    // Get the modal
    modal = document.getElementById('myModal');
    modalbody = document.getElementById('modal-body');

    // Get the <span> element that closes the modal
    span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        HideModal();
    }
    HideModal();
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        HideModal();
    }
}

function ShowModal() {
    modal.style.display = "block";
}

function HideModal() {
    modal.style.display = "none";
}