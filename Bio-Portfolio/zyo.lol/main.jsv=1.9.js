iziToast.settings({
    class: 'izitoast_notify',
    displayMode: 0,
    maxWidth: '500px',
    position: 'topCenter',
    transitionInMobile: 'fadeInDown',
    transitionIn: 'fadeInDown',
    color: '#1E1E1E',
    messageColor: '#fff',
    titleColor: '#fff',
    timeout: 3000,
});
// 
function showErrPopup(message) {
    iziToast.show({
        message: message,
        icon: 'fa-solid fa-xmark',
        iconColor: '#ff0303',
        progressBar: false,
        close: true,
    });
}
function showSuccessPopup(message) {
    iziToast.show({
        message: message,
        icon: 'fa-solid fa-check',
        iconColor: '#0ad406',
        progressBar: false,
        close: true,
    });
}

function toggleList(id) {
    const listItem = document.getElementById(id);
    const height = listItem.scrollHeight;
    const dashboardList = document.getElementById('dashboard_list');
    const isCollapsed = listItem.style.height === '0px' || !listItem.style.height;
    const onClickArr = document.querySelectorAll('[onclick^="toggleList"]');
    const activeArrowArr = document.querySelectorAll('[onclick*="toggleArrow"]');
    const dashboardIsOpen = dashboardList.style.height !== '0px' && dashboardList.style.height !== '';
    
    let listActive = false;
    let listToggle = [];
    let arrowToggle = [];

    onClickArr.forEach(item => {
        const onclickValue = item.getAttribute('onclick');
        const value = onclickValue.split("'")[1];
        const element = document.getElementById(value);

        if (element.id !== id && element.style.height !== '0px' && element.id !== 'dashboard_list') {
            listToggle.push(element);
            listActive = true;
        }
    });

    activeArrowArr.forEach(item => {
        const onclickValue = item.getAttribute('onclick');
        const regex = /toggleArrow\('([^']+)'\)/g;
        let match;

        while ((match = regex.exec(onclickValue)) !== null) {
            const value = match[1];
            const element = document.getElementById(value);
            
            if (element && element.classList.contains('active')) {
                arrowToggle.push(element);
            }
        }
    });
    if (listActive) {
        listToggle.forEach(item => {
            item.style.height = '0px';
            item.style.marginTop = '0px';
            item.style.opacity = '0';
        });
        arrowToggle.forEach(item => {
            item.classList.toggle('active');
        });
        listItem.style.height = `${height}px`;
        listItem.style.marginTop = '20px';
        listItem.style.opacity = '1';
    } else {
        if (isCollapsed) {
            listItem.style.height = `${height}px`;
            listItem.style.marginTop = '20px';
            listItem.style.opacity = '1';
        } else {
            listItem.style.height = '0px';
            listItem.style.marginTop = '0px';
            listItem.style.opacity = '0';
        }
    }
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && !dashboardIsOpen) {
            dashboardList.style.height = '0px';
            dashboardList.style.marginTop = '0px';
        }
    });
}


function setupToggle(toggleButtonId, toggleListId) {
    const toggleButton = document.getElementById(toggleButtonId);
    const toggleList = document.getElementById(toggleListId);

    // Lấy tất cả các menu
    const allToggles = document.querySelectorAll('.menu-edit-link-preview');

    toggleButton.addEventListener("click", function (event) {
        event.stopPropagation();

        // Đóng tất cả các danh sách trừ danh sách hiện tại
        allToggles.forEach(list => {
            if (list !== toggleList) {
                list.style.height = 0;
                list.classList.remove('open');
            }
        });

        // Mở hoặc đóng danh sách hiện tại
        const currentHeight = toggleList.offsetHeight;
        if (currentHeight === 0) {
            toggleList.style.height = toggleList.scrollHeight + "px";
            toggleList.classList.add('open');
        } else {
            toggleList.style.height = 0;
            setTimeout(() => {
                toggleList.classList.remove('open');
            }, 250);
        }
    });

    // Đóng tất cả nếu nhấn ra ngoài
    document.addEventListener("click", function (event) {
        if (!toggleList.contains(event.target) && !toggleButton.contains(event.target)) {
            allToggles.forEach(list => {
                list.style.height = 0;
                list.classList.remove('open');
            });
        }
    });
}

function removeCrossDashboard(){
    const el = document.getElementById('dashboard_bar_respon');
    window.addEventListener('resize', () => { 
        if(window.innerWidth >= '768' && el){
            el.classList.remove('cross');
        }
    })
}

removeCrossDashboard();

function toggleBar(element) {
    element.classList.toggle('cross');
}

function toggleArrow(element) {
    const targetElement = document.getElementById(element);
    targetElement.classList.toggle('active');
}

function toggleShowInput(dadElement, inputElement, iconEl, id){
    const inputEl = document.getElementById(inputElement);
    const dadEl = document.getElementById(dadElement);
    const hideIcon = document.getElementById(iconEl)
    const ShowOrHide = hideIcon !== null
    if(ShowOrHide){
        inputEl.type = "text";
        dadEl.innerHTML = `
        <svg id="show-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_2_41)">
            <path d="M12 6C8.04856 6 4.65436 8.37401 3.15195 11.7727C3.04957 12.0043 3.04957 12.2684 3.15195 12.5C4.65436 15.8987 8.04856 18.2727 12 18.2727C15.9514 18.2727 19.3456 15.8987 20.848 12.5C20.9504 12.2684 20.9504 12.0043 20.848 11.7727C19.3456 8.37401 15.9514 6 12 6ZM12 16.2273C9.74182 16.2273 7.90909 14.3945 7.90909 12.1364C7.90909 9.87818 9.74182 8.04545 12 8.04545C14.2582 8.04545 16.0909 9.87818 16.0909 12.1364C16.0909 14.3945 14.2582 16.2273 12 16.2273ZM12 9.68182C10.6418 9.68182 9.54545 10.7782 9.54545 12.1364C9.54545 13.4945 10.6418 14.5909 12 14.5909C13.3582 14.5909 14.4545 13.4945 14.4545 12.1364C14.4545 10.7782 13.3582 9.68182 12 9.68182Z" fill="#b3b3b3"/>
            </g>
            <defs>
            <clipPath id="clip0_2_41">
            <rect width="24" height="24" fill="#b3b3b3"/>
            </clipPath>
            </defs>
        </svg><p id="show-text" class="hide-show">Show</p>
        `
    } else {
        inputEl.type = "password";
        dadEl.innerHTML = `
            <svg id="hide-icon" width="18" height="18" viewBox="0 0 24 24" fill="#b3b3b3" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.8824 4.88129L19.1465 4.14535C18.9385 3.93736 18.5545 3.96937 18.3145 4.25731L15.7543 6.80128C14.6022 6.30533 13.3384 6.06533 12.0103 6.06533C8.05819 6.08127 4.63441 8.38524 2.9863 11.6974C2.89027 11.9054 2.89027 12.1614 2.9863 12.3374C3.75423 13.9054 4.9063 15.2014 6.3463 16.1774L4.25031 18.3053C4.01031 18.5453 3.9783 18.9293 4.13835 19.1373L4.87429 19.8733C5.08228 20.0812 5.46627 20.0492 5.70627 19.7613L19.7542 5.7134C20.0582 5.47354 20.0902 5.08958 19.8822 4.88156L19.8824 4.88129ZM12.8583 9.71318C12.5863 9.64916 12.2983 9.5692 12.0263 9.5692C10.6663 9.5692 9.57839 10.6572 9.57839 12.0171C9.57839 12.2891 9.64241 12.5771 9.72236 12.8491L8.65025 13.9051C8.33029 13.3452 8.1543 12.7211 8.1543 12.0172C8.1543 9.88919 9.86633 8.17717 11.9943 8.17717C12.6984 8.17717 13.3223 8.35315 13.8823 8.67311L12.8583 9.71318Z" fill="#b3b3b3"/>
                <path d="M21.0344 11.6974C20.4745 10.5773 19.7384 9.56941 18.8265 8.75338L15.8505 11.6974V12.0173C15.8505 14.1453 14.1384 15.8573 12.0104 15.8573H11.6905L9.80251 17.7453C10.5066 17.8893 11.2425 17.9853 11.9625 17.9853C15.9146 17.9853 19.3384 15.6814 20.9865 12.3532C21.1305 12.1291 21.1305 11.9052 21.0345 11.6972L21.0344 11.6974Z" fill="#b3b3b3"/>
            </svg>
            <p id="hide-text" class="hide-show">Hide</p>
        `;
    }
}

function toggleShowInput2(dadElement, inputElement, iconEl, id){
    const inputEl = document.getElementById(inputElement);
    const dadEl = document.getElementById(dadElement);
    const hideIcon = document.getElementById(iconEl)
    const ShowOrHide = hideIcon !== null
    if(ShowOrHide){
        inputEl.type = "text";
        dadEl.innerHTML = `
        <svg id="show-icon-1" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_2_41)">
            <path d="M12 6C8.04856 6 4.65436 8.37401 3.15195 11.7727C3.04957 12.0043 3.04957 12.2684 3.15195 12.5C4.65436 15.8987 8.04856 18.2727 12 18.2727C15.9514 18.2727 19.3456 15.8987 20.848 12.5C20.9504 12.2684 20.9504 12.0043 20.848 11.7727C19.3456 8.37401 15.9514 6 12 6ZM12 16.2273C9.74182 16.2273 7.90909 14.3945 7.90909 12.1364C7.90909 9.87818 9.74182 8.04545 12 8.04545C14.2582 8.04545 16.0909 9.87818 16.0909 12.1364C16.0909 14.3945 14.2582 16.2273 12 16.2273ZM12 9.68182C10.6418 9.68182 9.54545 10.7782 9.54545 12.1364C9.54545 13.4945 10.6418 14.5909 12 14.5909C13.3582 14.5909 14.4545 13.4945 14.4545 12.1364C14.4545 10.7782 13.3582 9.68182 12 9.68182Z" fill="#b3b3b3"/>
            </g>
            <defs>
            <clipPath id="clip0_2_41">
            <rect width="24" height="24" fill="#b3b3b3"/>
            </clipPath>
            </defs>
        </svg><p id="show-text-1" class="hide-show">Show</p>
        `
    } else {
        inputEl.type = "password";
        dadEl.innerHTML = `
            <svg id="hide-icon-1" width="18" height="18" viewBox="0 0 24 24" fill="#b3b3b3" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.8824 4.88129L19.1465 4.14535C18.9385 3.93736 18.5545 3.96937 18.3145 4.25731L15.7543 6.80128C14.6022 6.30533 13.3384 6.06533 12.0103 6.06533C8.05819 6.08127 4.63441 8.38524 2.9863 11.6974C2.89027 11.9054 2.89027 12.1614 2.9863 12.3374C3.75423 13.9054 4.9063 15.2014 6.3463 16.1774L4.25031 18.3053C4.01031 18.5453 3.9783 18.9293 4.13835 19.1373L4.87429 19.8733C5.08228 20.0812 5.46627 20.0492 5.70627 19.7613L19.7542 5.7134C20.0582 5.47354 20.0902 5.08958 19.8822 4.88156L19.8824 4.88129ZM12.8583 9.71318C12.5863 9.64916 12.2983 9.5692 12.0263 9.5692C10.6663 9.5692 9.57839 10.6572 9.57839 12.0171C9.57839 12.2891 9.64241 12.5771 9.72236 12.8491L8.65025 13.9051C8.33029 13.3452 8.1543 12.7211 8.1543 12.0172C8.1543 9.88919 9.86633 8.17717 11.9943 8.17717C12.6984 8.17717 13.3223 8.35315 13.8823 8.67311L12.8583 9.71318Z" fill="#b3b3b3"/>
                <path d="M21.0344 11.6974C20.4745 10.5773 19.7384 9.56941 18.8265 8.75338L15.8505 11.6974V12.0173C15.8505 14.1453 14.1384 15.8573 12.0104 15.8573H11.6905L9.80251 17.7453C10.5066 17.8893 11.2425 17.9853 11.9625 17.9853C15.9146 17.9853 19.3384 15.6814 20.9865 12.3532C21.1305 12.1291 21.1305 11.9052 21.0345 11.6972L21.0344 11.6974Z" fill="#b3b3b3"/>
            </svg>
            <p id="hide-text-1" class="hide-show">Hide</p>
        `;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    function initFormSubmit(form, redirect = null) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const formData = new FormData(form);
            const actionUrl = form.getAttribute('action');
            const submitButton = form.querySelector('button[data-buttonLoading]');
            if(submitButton){
                var buttonValue = submitButton.textContent;
            }

            // Check if the submit button exists
            if (submitButton) {
                // Add loading state
                submitButton.disabled = true;
                submitButton.classList.add('loading');
                submitButton.textContent = '';
            }

            fetch(actionUrl, {
                method: 'POST',
                body: formData
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (responseData) {
                    // Check if the submit button exists
                    if (submitButton) {
                        // Remove loading state
                        submitButton.disabled = false;
                        submitButton.classList.remove('loading');
                        submitButton.textContent = buttonValue;
                    }

                    if (responseData.type == "error") {
                        showErrPopup(responseData.message);
                    } else if (responseData.type === "success") {
                        showSuccessPopup(responseData.message);
                        if (redirect === 'true') {
                            setTimeout(function () {
                                window.location.reload();
                            }, 1000);
                        } else if (typeof redirect === "string") {
                            window.location.replace(redirect);
                        } else {
                            
                        }
                    } else {
                        console.warn('Unhandled response type:', responseData.type);
                    }
                })
                .catch(function (error) {
                    // Check if the submit button exists
                    if (submitButton) {
                        // Remove loading state
                        submitButton.disabled = false;
                        submitButton.classList.remove('loading');
                        submitButton.textContent = buttonValue;
                    }

                    console.error('Error:', error);
                });
        });
    }

    document.querySelectorAll('form[data-formSubmit]').forEach((form) => {
        const dataAttribute = form.getAttribute('data-formSubmit');
        if (!dataAttribute) {
            initFormSubmit(form);
        } else if (dataAttribute) {
            initFormSubmit(form, dataAttribute);
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    function formAutoSubmit(form, debounceTime) {
        let timeout;

        form.addEventListener('submit', function (event) {
            event.preventDefault();
        });

        function submitForm() {
            const formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: formData
            })
                .then(response => response.text())
                .then(data => {
                })
                .catch(error => {
                    console.error('Form submission failed:', error);
                });
        }

        form.querySelectorAll('input').forEach(function (input) {
            input.addEventListener('input', function () {
                triggerSubmit();
            });

            input.addEventListener('valueChanged', function () {
                triggerSubmit();
            });
        });

        function triggerSubmit() {
            clearTimeout(timeout);
            timeout = setTimeout(submitForm, debounceTime);
        }
    }

    document.querySelectorAll('form[data-formAutoSubmit]').forEach((form) => {
        const dataAttribute = form.getAttribute('data-formAutoSubmit');
        const debounceTime = parseInt(dataAttribute, 10) || 500;
        formAutoSubmit(form, debounceTime);
    });

    function changeValueInput(editableParagraph, inputChange) {
        const inputChangeValue = document.getElementById(inputChange);

        editableParagraph.addEventListener('input', function () {
            inputChangeValue.value = editableParagraph.textContent;
            const event = new Event('valueChanged');
            inputChangeValue.dispatchEvent(event);
        });

        editableParagraph.addEventListener('blur', function () {
            inputChangeValue.value = editableParagraph.textContent;
            const event = new Event('valueChanged');
            inputChangeValue.dispatchEvent(event);
        });
    }

    document.querySelectorAll('p[data-changeValueInput]').forEach((item) => {
        const dataAttribute = item.getAttribute('data-changeValueInput');
        changeValueInput(item, dataAttribute);
    });

    document.querySelectorAll('h1[data-changeValueInput]').forEach((item) => {
        const dataAttribute = item.getAttribute('data-changeValueInput');
        changeValueInput(item, dataAttribute);
    });
    
    function previewImage(fileInput, img) {
        const previewImage = document.getElementById(img);
        const allowedExtensions = ['png', 'jpeg', 'jpg', 'gif', 'webp', 'cur'];
    
        fileInput.addEventListener('change', function () {
            const file = fileInput.files[0];
    
            if (file) {
                const fileExtension = file.name.split('.').pop().toLowerCase(); // Lấy phần đuôi file
                // Kiểm tra định dạng file
                if (allowedExtensions.includes(fileExtension)) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        previewImage.src = e.target.result; // Hiển thị ảnh
                    }
                    reader.readAsDataURL(file); // Đọc file ảnh
                }
            }
        });
    }
    
    document.querySelectorAll('input[type="file"][data-inputPreview]').forEach((item) => {
        const dataAttribute = item.getAttribute('data-inputPreview');
        previewImage(item, dataAttribute);
    });
});


function closePopupOnOutsideClick(event) {
    const popups = document.querySelectorAll('.show[closeoutsidepopup]');
    const overlay = document.querySelector('.overlay');
    let clickedOutside = true;

    popups.forEach(popup => {
        if (popup.contains(event.target) || event.target.closest('button')) {
            clickedOutside = false;
        }
    });

    if (clickedOutside) {
        popups.forEach(popup => {
            closePopup(popup.id, false);
        });
        if (overlay) {
            closeOverlay(overlay);
        }
    }
}

function openPopup(popupId) {
    const popup = document.getElementById(popupId);
    const overlay = document.querySelector('.overlay');


    const openPopups = document.querySelectorAll('.popup.show');
    if (openPopups.length > 0) {
        openPopups.forEach(openPopup => {
            if (openPopup.id !== popupId) {
                closePopup(openPopup.id, false);
            }
        });

        setTimeout(() => {
            showPopup(popup, overlay);
        }, 300);
    } else {
        showPopup(popup, overlay);
    }
}


function showPopup(popup, overlay) {
    if (popup) {
        popup.classList.remove('hide');
        popup.classList.add('show');
        popup.style.display = 'block';
        if (overlay && !overlay.classList.contains('show')) {
            overlay.classList.remove('hide');
            overlay.classList.add('show');
            overlay.style.display = 'block';
        }
        document.addEventListener('click', closePopupOnOutsideClick);
    } else {
        console.error(`Popup not found.`);
    }
}

function closePopupWithoutOverlay(popupId) {
    const popup = document.getElementById(popupId);

    if (popup) {
        popup.classList.remove('show');
        popup.classList.add('hide');
        popup.addEventListener('animationend', () => {
            if (popup.classList.contains('hide')) {
                popup.style.display = 'none';
            }
        }, { once: true });
    } else {
        console.error(`Popup with ID ${popupId} not found.`);
    }
}

function closePopup(popupId, hideOverlay = true) {
    const popup = document.getElementById(popupId);
    const overlay = document.querySelector('.overlay');
    if (popup) {
        popup.classList.remove('show');
        popup.classList.add('hide');
        popup.addEventListener('animationend', () => {
            if (popup.classList.contains('hide')) {
                popup.style.display = 'none';
            }
        }, { once: true });
        if (overlay && hideOverlay) {
            overlay.classList.remove('show');
            overlay.classList.add('hide');
            overlay.addEventListener('transitionend', () => {
                if (overlay.classList.contains('hide')) {
                    overlay.style.display = 'none';
                }
            }, { once: true });
        }
        document.removeEventListener('click', closePopupOnOutsideClick);
    } else {
        console.error(`Popup with ID ${popupId} not found.`);
    }
}

function closeOverlay(overlay) {
    if (overlay) {
        overlay.classList.remove('show');
        overlay.classList.add('hide');
        overlay.addEventListener('transitionend', () => {
            if (overlay.classList.contains('hide')) {
                overlay.style.display = 'none';
            }
        }, { once: true });
    }
}

function toggleActive(element) {
    if (element.classList.contains('active')) {
        element.classList.remove('active');
        element.classList.add('unactive');
    } else if (element.classList.contains('unactive')) {
        element.classList.remove('unactive');
        element.classList.add('active');
    } else {
        element.classList.add('active');
    }
}

document.querySelectorAll('i[data-tooltip]').forEach((item) => {
    const tooltipContent = item.getAttribute('data-tooltip');
    
    tippy(item, {
      content: tooltipContent,
      interactive: true,
      animation: 'scale',
      theme: 'translucent',
      allowHTML: true,
    });
});

function createRainEffect(canvasId, rainAmount, rainColor) {
    const canvas = document.getElementById(canvasId);

    if (!canvas) {
        console.error('Canvas element not found with id:', canvasId);
        return;
    }

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const raindrops = [];

    // Tạo giọt mưa
    for (let i = 0; i < rainAmount; i++) {
        raindrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 20 + 10,
        velocityY: Math.random() * 5 + 2,
        });
    }

    // Hàm vẽ mưa
    function drawRain() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = rainColor;
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';

        raindrops.forEach(drop => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.velocityY;

        if (drop.y > canvas.height) {
            drop.y = -drop.length;
            drop.x = Math.random() * canvas.width;
        }
        });

        requestAnimationFrame(drawRain);
    }

    drawRain();
}

function generateBoxShadow(numStars, parentElement, starsColor) {
    let boxShadowValue = '';
    const parentWidth = parentElement ? parentElement.clientWidth : 2000;
    const parentHeight = 2000;
    for (let i = 0; i < numStars; i++) {
        const x = Math.floor(Math.random() * parentWidth) + 'px';
        const y = Math.floor(Math.random() * parentHeight) + 'px';
        const shadow = `${x} ${y} ${starsColor}`;
        boxShadowValue += i === 0 ? shadow : `, ${shadow}`;
    }

    return boxShadowValue;
}

function createStars(parentSelector, selector, numStars, starsColor = '#fff') {
    const parentElement = document.getElementById(parentSelector);
    const element = parentElement ? parentElement.querySelector(`#${selector}`) : null;

    if (!element || !parentElement) return;

    let lastWidth = parentElement.clientWidth; // Lưu chiều rộng hiện tại

    function updateStars() {
        const boxShadow = generateBoxShadow(numStars, parentElement, starsColor);
        element.style.boxShadow = boxShadow;
    }

    // Sử dụng ResizeObserver để theo dõi sự thay đổi kích thước phần tử cha
    const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
            const newWidth = entry.contentRect.width; // Chiều rộng mới của phần tử cha
            if (newWidth !== lastWidth) { // Kiểm tra nếu chiều rộng thay đổi
                lastWidth = newWidth; // Cập nhật chiều rộng cuối cùng
                updateStars(); // Chỉ cập nhật khi width thay đổi
            }
        }
    });

    // Quan sát phần tử cha
    resizeObserver.observe(parentElement);

    // Khởi tạo lần đầu khi trang được tải
    updateStars();
}

function typeWriterEffect(elementId, textContent) {
    var app = document.getElementById(elementId);
    var typewriterContent = textContent;
    var typewriter = new Typewriter(app, {
        loop: true,
    });

    typewriter
        .typeString(typewriterContent)
        .pauseFor(2500)
        .deleteAll()
        .start();
}

let targets = document.querySelectorAll('[data-target]')
targets.forEach(element => {
    element.addEventListener('click', () => {
        var target = document.querySelector(element.dataset.target)
        targets.forEach(element2 => {
            var target2 = document.querySelector(element2.dataset.target)
            target2.style.display = 'none'
        });
        target.style.display = 'block'
    })
})

function setElementPosition(buttonId, elementId) {
    const button = document.getElementById(buttonId);
    const element = document.getElementById(elementId);
    if(!button){
        console.log('button missing '+button);
        return;
    } else if (!element){
        console.log('element missing '+element+elementId)
        return
    }
    const buttonRect = button.getBoundingClientRect();

    const top = buttonRect.top + 30 + window.scrollY;
    const left = buttonRect.left + 10 + window.scrollX;

    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
}

function getDomain(inputUrl) {
    // Thêm http:// nếu người dùng chỉ nhập tên miền
    if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
        inputUrl = 'http://' + inputUrl; // Thêm giao thức mặc định
    }

    // Sử dụng URL API
    const url = new URL(inputUrl);

    // Lấy hostname
    const hostname = url.hostname;

    // Loại bỏ 'www.' nếu có
    const domain = hostname.startsWith('www.') ? hostname.slice(4) : hostname;

    return domain;
}