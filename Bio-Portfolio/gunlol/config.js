const config = {
    // Developed by NPDK1
    backgroundImage: "background/background.gif", // Load from local file
    avatarImage: "avatar/avatar.gif", // Ensure this file exists
    statusAvatarImage: "avatar/statusAvatar.gif", // Ensure this file exists
    username: "Đăng Khoa", // Username (preserves case sensitivity) - Note: Left unchanged as it's a proper name
    bio: "Dep Trai 2 mai,Nhung khong co nguoi iu :<", // Description
    statusText: "npdk1", // Status name
    statusLabel: "Coding!", // Status label
    statsNumber: "1302", // Initial stats number (will be updated by counter)
    textRainbow: false, // Enable/disable rainbow text effect (true/false)
    loadingFadeOutDuration: 500, // Loading screen fade-out duration (milliseconds)

    // List of social media buttons
    socialLinks: [
        {
            image: "img/icon/github.png", // GitHub PNG
            url: "https://github.com/npdk1"
        },
        {
            image: "img/icon/devyoung.webp", // DevYoungsters PNG
            url: "https://devyoungsters.x10.mx/"
        },
        {
            image: "img/icon/ktools.png", // KTools PNG
            url: "https://ktools.site/"
        },
        {
            image: "img/icon/bank.png", // Bank PNG
            url: "https://nguyenphandangkhoa.site/payment/MyPayment.html"
        },
        {
            image: "img/icon/facebook.png", // Facebook PNG
            url: "https://www.facebook.com/tran.inh.88611/"
        },
        {
            image: "img/icon/discord.png", // Discord PNG
            url: "https://discord.gg/6KKqgQDY"
        },
    ],

    // Color configuration
    colors: {
        profileBoxBackground: "rgba(238, 227, 227, 0.1)", // Profile box background color
        profileBoxBorder: "rgba(247, 247, 247, 0.3)", // Profile box border color
        avatarBorder: "white", // Avatar border color
        avatarGlow: "#000000", // Avatar glow border color
        statusBackground: "rgba(255, 255, 255, 0.1)", // Status box background color
        statusBorder: "rgba(255, 255, 255, 0.3)", // Status box border color
        usernameText: "white", // Username text color
        bioText: "white", // Bio text color
        statusText: "#000000", // Status name text color
        statusLabelText: "white", // Status label text color
        socialIconBackground: "white", // Social media buttons background color
        statsText: "white", // Stats text color
        statsIcon: "white" // Stats icon color
    }
};