const RPC = require('discord-rich-presence');
const axios = require('axios');
const chalk = require('chalk');

// Time configuration
const TIME_CONFIG = {
    status_update_interval: 5000, // Thời gian cập nhật status (ms)
    rpc_rotation_interval: 5000   // Thời gian duy trì mỗi RPC trước khi chuyển (ms)
};

// RPC configurations
const RPC_CONFIGS = [
    {
        client_id: "",
        showTime: true,
        state: "Roblox Script",
        details: "DevYoungster Project",
        firstButtonName: "Our Member!",
        firstButtonUrl: "https://devyoungsters.x10.mx/",
        secondButtonName: "ChatBotAI",
        secondButtonUrl: "https://devchatbotai.myvnc.com/",
        largeImage: "sakura_nene_cpp",
        largeText: "DevYoungster",
        smallImage: "sakura_nene_cpp",
        smallText: "npdk1 on top"
    },
    {
        client_id: "",
        showTime: true,
        state: "Shopping",
        details: "KTOOLS MARKET",
        firstButtonName: "My Shop !",
        firstButtonUrl: "https://ktools.site/",
        secondButtonName: "Payment !",
        secondButtonUrl: "https://payment.npdk.nguyenphandangkhoa.site/",
        largeImage: "ktools",
        largeText: "Shop",
        smallImage: "ktools",
        smallText: "Payment"
    },
    {
        client_id: "",
        showTime: true,
        state: "Fixing Bot",
        details: "Fixing discord bot :3",
        firstButtonName: "Join Us!",
        firstButtonUrl: "https://devyoungsters.x10.mx/",
        secondButtonName: "GitHub",
        secondButtonUrl: "https://github.com/npdk1",
        largeImage: "anyacry",
        largeText: "Fixing",
        smallImage: "anyacry",
        smallText: "Coder Life"
    }
];

// Hardcoded configuration
const CONFIG = {
    token: "tokenAcc",
    timeZone: "Asia/Kolkata",
    name: "Coding!"
};

// Hardcoded statuses and emojis
const STATUSES = [
    "Chào các bạn xD", "Mod of Snooze Hub :D", "Bán nguyên liệu tools, selfbot discord",
    "Tôi yêu code vãi cả lul :3", "Tiền là tất cả"
];
const EMOJIS = [
    "Money:1278290281753477171", "yay:986182112262651954", "discord:1344349225852604570",
    "cat_twerk:1218791613162192896", "dontcare:997176238558949476"
];

// Function to get user info
async function getUserInfo(token) {
    try {
        const response = await axios.get("https://discord.com/api/v10/users/@me", {
            headers: { "Authorization": token },
            timeout: 5000,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) // Bỏ qua SSL (testing only)
        });
        return [response.data.username, true];
    } catch (e) {
        if (e.response) {
            console.log(chalk.yellow(`User info request failed with status: ${e.response.status}`));
            return ["Invalid token", false];
        } else {
            console.log(chalk.red(`Error getting user info: ${e.message}`));
            return ["Unknown", false];
        }
    }
}

// Function to change custom status
async function changeStatus(token, message, emojiName, emojiId) {
    try {
        const customStatus = { text: message, emoji_name: emojiName };
        if (emojiId) customStatus.emoji_id = emojiId;

        const response = await axios.patch(
            "https://discord.com/api/v10/users/@me/settings",
            {
                custom_status: customStatus,
                status: "online"
            },
            {
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                },
                timeout: 5000,
                httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) // Bỏ qua SSL
            }
        );
        if (response.status !== 200) {
            console.log(chalk.yellow(`Status update failed with code: ${response.status}`));
        }
        return response.status;
    } catch (e) {
        console.log(chalk.red(`Error changing status: ${e.message}`));
        return 500;
    }
}

// Function to set Rich Presence
function setRichPresence(stopEvent) {
    let currentConfigIdx = 0;
    let rpc = null;

    const updateRPC = async () => {
        const config = RPC_CONFIGS[currentConfigIdx];

        // Disconnect previous RPC if exists
        if (rpc) {
            rpc.disconnect();
            rpc = null;
        }

        // Connect to new RPC
        try {
            rpc = new RPC(config.client_id);
            rpc.on('connected', () => {
                console.log(chalk.green(`Rich Presence connected for client ${config.client_id}`));
            });

            const presenceData = {
                state: config.state,
                details: config.details,
                largeImageKey: config.largeImage,
                largeImageText: config.largeText,
                smallImageKey: config.smallImage,
                smallImageText: config.smallText,
                buttons: [
                    { label: config.firstButtonName, url: config.firstButtonUrl },
                    { label: config.secondButtonName, url: config.secondButtonUrl }
                ]
            };
            if (config.showTime) presenceData.startTimestamp = Math.floor(Date.now() / 1000);

            rpc.updatePresence(presenceData);
            console.log(chalk.cyan(`Updated RPC: ${config.details}`));
        } catch (e) {
            console.log(chalk.red(`Failed to connect RPC for client ${config.client_id}: ${e.message}`));
            rpc = null;
            setTimeout(updateRPC, 5000); // Retry after 5s
            return;
        }

        // Schedule next rotation
        setTimeout(() => {
            if (!stopEvent) {
                currentConfigIdx = (currentConfigIdx + 1) % RPC_CONFIGS.length;
                updateRPC();
            }
        }, TIME_CONFIG.rpc_rotation_interval);
    };

    updateRPC();

    // Handle process exit
    process.on('SIGINT', () => {
        if (rpc) rpc.disconnect();
        console.log(chalk.yellow("Stopping program..."));
        process.exit();
    });
}

// Main execution
console.log(chalk.green("Starting Discord status rotator and Rich Presence..."));

// Start Rich Presence in a separate thread-like behavior
let stopEvent = false;
setRichPresence(stopEvent);

// Status rotation loop
let statusCount = 0;
let emojiCount = 0;

async function runStatusLoop() {
    while (true) {
        const [userInfo, isValidToken] = await getUserInfo(CONFIG.token);
        const status = STATUSES[statusCount % STATUSES.length];
        const timeFormatted = chalk.magenta(new Date().toLocaleTimeString('en-US', { hour12: true }));
        const tokenColor = isValidToken ? chalk.green : chalk.red;
        const tokenMasked = CONFIG.token.slice(0, 6) + "******";
        const tokenInfo = `${tokenMasked} | ${userInfo}`;
        const statusColored = chalk.cyan(status);

        const emojiData = EMOJIS[emojiCount % EMOJIS.length].split(':');
        let emojiName, emojiId;
        if (emojiData.length === 2) {
            [emojiName, emojiId] = emojiData;
        } else if (emojiData.length === 1) {
            emojiName = emojiData[0];
            emojiId = null;
        } else {
            console.log(chalk.red(`Invalid emoji: ${EMOJIS[emojiCount % EMOJIS.length]}`));
            emojiCount++;
            continue;
        }

        console.log(`${timeFormatted} Status changed for: ${tokenColor(tokenInfo)}. ` +
            `New status message: ${statusColored}. | Emoji: (${emojiName}) | Status: online`);
        await changeStatus(CONFIG.token, status, emojiName, emojiId);

        statusCount++;
        emojiCount++;
        await new Promise(resolve => setTimeout(resolve, TIME_CONFIG.status_update_interval));
    }
}

runStatusLoop().catch(err => {
    console.error(chalk.red(`Error in status loop: ${err.message}`));
});
