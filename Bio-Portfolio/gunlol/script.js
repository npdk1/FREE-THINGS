document.addEventListener("DOMContentLoaded", () => {
    // Handle loading screen
    const loadingScreen = document.getElementById("loading-screen");
    const container = document.querySelector(".container");

    // Update transition duration for loading-screen from config
    loadingScreen.style.transition = `opacity ${config.loadingFadeOutDuration}ms ease-in-out`;

    loadingScreen.addEventListener("click", () => {
        // Fade out loading-screen
        loadingScreen.style.opacity = "0";

        // After fade-out effect completes, hide loading-screen and show main interface
        setTimeout(() => {
            loadingScreen.style.display = "none"; // Hide loading screen
            container.style.display = "flex"; // Show main interface
            container.classList.add("visible"); // Activate transition effect for container
        }, config.loadingFadeOutDuration); // Wait time matches fade-out duration
    });

    // View counter
    let viewCount = localStorage.getItem("viewCount");
    if (!viewCount) {
        viewCount = parseInt(config.statsNumber); // Initial value from config
    } else {
        viewCount = parseInt(viewCount) + 1; // Increment view count
    }
    localStorage.setItem("viewCount", viewCount);
    config.statsNumber = viewCount; // Update value in config

    // Apply background image
    document.body.style.backgroundImage = `url('${config.backgroundImage}')`;

    // Apply avatar image
    document.getElementById("avatar").src = config.avatarImage;

    // Apply status avatar image
    document.getElementById("status-avatar").src = config.statusAvatarImage;

    // Apply username
    const usernameElement = document.getElementById("username");
    usernameElement.textContent = config.username;

    // Update web tab title with @username and text animation
    const pageTitle = document.getElementById("page-title");
    const titleUsername = config.username; // Rename variable to avoid conflict
    const titlePrefix = "@"; // @ prefix
    const maxLength = titleUsername.length; // Maximum length of username
    let currentLength = 1; // Start with first character
    let direction = 1; // 1: increase length, -1: decrease length

    setInterval(() => {
        // Get substring from start to currentLength
        const displayText = titlePrefix + titleUsername.substring(0, currentLength);
        pageTitle.textContent = displayText;

        // Update length based on direction
        currentLength += direction;

        // Reverse direction if max or min length is reached
        if (currentLength > maxLength) {
            currentLength = maxLength - 1; // Start decreasing
            direction = -1;
        } else if (currentLength < 1) {
            currentLength = 1; // Start increasing
            direction = 1;
        }
    }, 300); // Text animation speed (300ms)

    // Apply rainbow text effect if textRainbow is true
    if (config.textRainbow) {
        usernameElement.classList.add("rainbow");
    }

    // Apply bio
    document.getElementById("bio").textContent = config.bio;

    // Apply status
    document.getElementById("status-text").textContent = config.statusText;
    document.getElementById("status-label").textContent = config.statusLabel;

    // Apply stats (view count)
    document.getElementById("stats-number").textContent = config.statsNumber;

    // Dynamically create social media buttons
    const socialLinksContainer = document.getElementById("social-links");
    config.socialLinks.forEach(link => {
        const anchor = document.createElement("a");
        anchor.href = link.url;
        anchor.className = "social-icon";
        const img = document.createElement("img");
        img.src = link.image;
        img.alt = "Social Icon";
        anchor.appendChild(img);
        socialLinksContainer.appendChild(anchor);
    });

    // Apply colors from config
    const profileBox = document.querySelector(".profile-box");
    profileBox.style.background = config.colors.profileBoxBackground;
    profileBox.style.border = `1px solid ${config.colors.profileBoxBorder}`;

    const avatar = document.querySelector(".avatar");
    avatar.style.border = `2px solid ${config.colors.avatarBorder}`;
    avatar.style.boxShadow = `0 0 15px 5px ${config.colors.avatarGlow}`;

    const status = document.querySelector(".status");
    status.style.background = config.colors.statusBackground;
    status.style.border = `1px solid ${config.colors.statusBorder}`;

    const username = document.querySelector(".username");
    username.style.color = config.colors.usernameText;

    const bio = document.querySelector(".bio");
    bio.style.color = config.colors.bioText;

    const statusText = document.querySelector(".status-text");
    statusText.style.color = config.colors.statusText;

    const statusLabel = document.querySelector(".status-label");
    statusLabel.style.color = config.colors.statusLabelText;

    const socialIcons = document.querySelectorAll(".social-icon");
    socialIcons.forEach(icon => {
        icon.style.background = config.colors.socialIconBackground;
    });

    const statsNumber = document.querySelector(".stats-number");
    statsNumber.style.color = config.colors.statsText;

    const statsIcon = document.querySelector(".stats-icon");
    statsIcon.style.color = config.colors.statsIcon;
});