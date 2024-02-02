function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();

    const dropZone = document.getElementById('dropZone');
    const files = event.dataTransfer.files;

    if (files.length > 0) {
        const file = files[0];

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = function (e) {
                dropZone.innerHTML = `<img src="${e.target.result}" alt="Your Image" style="max-width: 90%; max-height: 90%;">`;

                showPopupMessage('Your photo is added');
            };

            reader.readAsDataURL(file);
        } else {
            alert('Please drop an image file.');
        }
    }
}

function openFilePicker() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
}

function showPopupMessage(message, duration = 5000) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = message;
    document.body.appendChild(popup);
    
    popup.offsetHeight;

    popup.style.transition = 'opacity 0.5s ease-in-out';
    popup.style.opacity = 1;

    setTimeout(() => {
        popup.style.opacity = 0;
    }, duration - 500);

    setTimeout(() => {
        document.body.removeChild(popup);
    }, duration);
}

function openFileInput() {
    document.getElementById('photoInput').click();
  }
  
  function displaySelectedPhoto(input) {
    const file = input.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = function (e) { 
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '100%';
        document.body.appendChild(img);
      };
  
      reader.readAsDataURL(file);
    }
  }
  
