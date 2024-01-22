// const openButton = document.getElementById('openbutton');
// const popMenu = document.getElementById('popmenu');
// const menuButtons = popMenu.querySelectorAll('a');
// const headBar = document.querySelector("#head-area");

let barTransparency = 1;

// openButton.addEventListener('click', function () {
//     popMenu.classList.toggle('hidden');
// });

// menuButtons.forEach(function(button) {
//     button.addEventListener('click', function() {
//         popMenu.classList.add('hidden');
//     });
// });

console.log("hello!");

    // transitionTopBar();

let fade = 1; // start with the background of the header as transparent
function transitionTopBar() {
    if (barTransparency == 1) {
        fade = -1;
    }
    barTransparency = Math.max(0, barTransparency + 0.05 * fade);
    headBar.style.backgroundColor = `rgba(0, 0, 0, ${barTransparency})`;
    if (barTransparency > 0) {
        setTimeout(transitionTopBar, 10);
    }

    else {
        fade = 1;
    }
}

