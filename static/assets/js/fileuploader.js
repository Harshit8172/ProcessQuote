document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('files');
    const dropArea = document.getElementById('drop-area');
    const errorMessage = document.getElementById('error-message');

    if (fileInput && dropArea && errorMessage) {
        dropArea.addEventListener('click', () => {
            fileInput.click();
        });

        dropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropArea.classList.add('dragover');
        });

        dropArea.addEventListener('dragleave', () => {
            dropArea.classList.remove('dragover');
        });

        dropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            dropArea.classList.remove('dragover');

            const files = e.dataTransfer.files;
            if (validateFiles(files)) {
                fileInput.files = files;
                updateFileList(files);
            } else {
                showError("Only Excel or CSV files are allowed.");
            }
        });

        fileInput.addEventListener('change', () => {
            if (validateFiles(fileInput.files)) {
                updateFileList(fileInput.files);
                clearError();
            } else {
                showError("Only Excel or CSV files are allowed.");
                fileInput.value = "";  // Reset the input
            }
        });

        function validateFiles(files) {
            const validExtensions = ['xls', 'xlsx', 'csv'];
            for (let file of files) {
                const fileExtension = file.name.split('.').pop().toLowerCase();
                if (!validExtensions.includes(fileExtension)) {
                    return false;
                }
            }
            return true;
        }

        function updateFileList(files) {
            const fileNames = Array.from(files).map(file => file.name).join(', ');
            const message = document.querySelector('.file-drop-message');
            if (message) {
                message.textContent = `Selected files: ${fileNames}`;
            }
        }

        function showError(message) {
            if (errorMessage) {
                errorMessage.textContent = message;
            }
        }

        function clearError() {
            if (errorMessage) {
                errorMessage.textContent = '';
            }
        }
    } else {
        console.error('Required DOM elements are missing. Ensure that "files", "drop-area", and "error-message" elements exist in the HTML.');
    }
});



async function uploadFiles(files) {
    const formData = new FormData();
    for (let file of files) {
        formData.append('files[]', file);
    }

    try {
        const response = await fetch('https://processquote.onrender.com/process', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json(); // Ensure data is defined before using
            console.log('Upload successful', data);
        } else {
            showError('Failed to upload files. Server returned an error.');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showError('An error occurred during the upload.');
    }
}
