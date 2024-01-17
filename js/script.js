openButton.addEventListener('click', function () {
    popMenu.classList.toggle('hidden');
});

menuButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        popMenu.classList.add('hidden');
    });
});