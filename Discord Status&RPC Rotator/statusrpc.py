import requests
import time
import json
from pypresence import Presence
from colorama import init, Fore
import threading
import ssl
import urllib3
import warnings

# Suppress ResourceWarning about unclosed transports
warnings.filterwarnings("ignore", category=ResourceWarning, message="unclosed transport*")

# Initialize colorama
init()

# Disable SSL warnings (for testing only)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Time configuration
TIME_CONFIG = {
    "status_update_interval": 5,   # Thời gian cập nhật status (giây)
    "rpc_rotation_interval": 5    # Thời gian duy trì mỗi RPC trước khi chuyển (giây, tăng lên để ổn định hơn)
}

# RPC configurations
RPC_CONFIGS = [
    {
        "client_id": "1347747968807080026",
        "showTime": True,
        "state": "Roblox Script",
        "details": "DevYoungster Project",
        "firstButtonName": "Our Member!",
        "firstButtonUrl": "https://devyoungsters.x10.mx/",
        "secondButtonName": "ChatBotAI",
        "secondButtonUrl": "https://devchatbotai.myvnc.com/",
        "largeImage": "sakura_nene_cpp",
        "largeText": "DevYoungster",
        "smallImage": "sakura_nene_cpp",
        "smallText": "npdk1 on top"
    },
    {
        "client_id": "1320967732409143366",
        "showTime": True,
        "state": "Shopping",
        "details": "KTOOLS MARKET",
        "firstButtonName": "My Shop !",
        "firstButtonUrl": "https://ktools.site/",
        "secondButtonName": "Payment !",
        "secondButtonUrl": "https://payment.npdk.nguyenphandangkhoa.site/",
        "largeImage": "ktools",
        "largeText": "Shop",
        "smallImage": "ktools",
        "smallText": "Payment"
    },
    {
        "client_id": "1348014406134403082",
        "showTime": True,
        "state": "Fixing Bot",
        "details": "Fixing discord bot :3",
        "firstButtonName": "Join Us!",
        "firstButtonUrl": "https://devyoungsters.x10.mx/",
        "secondButtonName": "GitHub",
        "secondButtonUrl": "https://github.com/npdk1",
        "largeImage": "anyacry",
        "largeText": "Fixing",
        "smallImage": "anyacry",
        "smallText": "Coder Life"
    }
]

# Hardcoded configuration
CONFIG = {
    "token": "",
    "timeZone": "Asia/Kolkata",
    "name": "Coding!"
}

# Hardcoded statuses and emojis
STATUSES = [
    "Chào các bạn xD", "Mod of Snooze Hub :D", "Bán nguyên liệu tools, selfbot discord",
    "Tôi yêu code vãi cả lul :3", "Tiền là tất cả"
]
EMOJIS = [
    "Money:1278290281753477171", "yay:986182112262651954", "discord:1344349225852604570",
    "cat_twerk:1218791613162192896", "dontcare:997176238558949476"
]

# Function to get user info
def get_user_info(token):
    headers = {"authorization": token}
    try:
        response = requests.get("https://discord.com/api/v10/users/@me", headers=headers, verify=False, timeout=5)
        if response.status_code == 200:
            user_info = response.json()
            return user_info["username"], True
        else:
            print(f"{Fore.YELLOW}User info request failed with status: {response.status_code}{Fore.RESET}")
            return "Invalid token", False
    except Exception as e:
        print(f"{Fore.RED}Error getting user info: {e}{Fore.RESET}")
        return "Unknown", False

# Function to change custom status
def change_status(token, message, emoji_name, emoji_id):
    headers = {"authorization": token, "Content-Type": "application/json"}
    try:
        custom_status = {"text": message, "emoji_name": emoji_name}
        if emoji_id:
            custom_status["emoji_id"] = emoji_id

        json_data = {
            "custom_status": custom_status,
            "status": "online"
        }

        response = requests.patch(
            "https://discord.com/api/v10/users/@me/settings",
            headers=headers,
            json=json_data,
            verify=False,
            timeout=5)
        if response.status_code != 200:
            print(f"{Fore.YELLOW}Status update failed with code: {response.status_code}{Fore.RESET}")
        return response.status_code
    except Exception as e:
        print(f"{Fore.RED}Error changing status: {e}{Fore.RESET}")
        return 500

# Function to set Rich Presence with improved stability
def set_rich_presence(stop_event):
    current_config_idx = 0
    rpc = None

    while not stop_event.is_set():
        config = RPC_CONFIGS[current_config_idx]

        # Attempt to connect RPC if not already connected
        if not rpc or not rpc.sock_writer:
            try:
                if rpc:
                    rpc.close()  # Ensure old connection is closed
                rpc = Presence(config["client_id"])
                rpc.connect()
                print(f"{Fore.GREEN}Rich Presence connected for client {config['client_id']}{Fore.RESET}")
            except Exception as e:
                print(f"{Fore.RED}Failed to connect RPC for client {config['client_id']}: {e}{Fore.RESET}")
                time.sleep(5)  # Wait longer before retrying
                continue

        # Update RPC
        try:
            start_time = int(time.time()) if config["showTime"] else None
            rpc.update(
                state=config["state"],
                details=config["details"],
                large_image=config["largeImage"],
                large_text=config["largeText"],
                small_image=config["smallImage"],
                small_text=config["smallText"],
                buttons=[
                    {"label": config["firstButtonName"], "url": config["firstButtonUrl"]},
                    {"label": config["secondButtonName"], "url": config["secondButtonUrl"]}
                ],
                start=start_time
            )
            print(f"{Fore.CYAN}Updated RPC: {config['details']}{Fore.RESET}")
        except Exception as e:
            print(f"{Fore.YELLOW}RPC update failed for client {config['client_id']}: {e}{Fore.RESET}")
            rpc.close()
            rpc = None
            time.sleep(2)
            continue

        # Wait for the rotation interval before switching
        for _ in range(int(TIME_CONFIG["rpc_rotation_interval"])):
            if stop_event.is_set():
                break
            time.sleep(1)

        # Rotate to the next config
        current_config_idx = (current_config_idx + 1) % len(RPC_CONFIGS)
        if rpc:
            rpc.close()
            rpc = None
            print(f"{Fore.YELLOW}Disconnected RPC for rotation{Fore.RESET}")
        time.sleep(1)  # Brief delay to ensure clean disconnection

# Main execution
if __name__ == "__main__":
    print(f"{Fore.GREEN}Starting Discord status rotator and Rich Presence...{Fore.RESET}")

    # Event to stop the RPC thread cleanly
    stop_event = threading.Event()

    # Start Rich Presence in a separate thread
    rich_presence_thread = threading.Thread(target=set_rich_presence, args=(stop_event,), daemon=True)
    rich_presence_thread.start()

    # Status rotation loop
    status_count = 0
    emoji_count = 0

    try:
        while True:
            user_info, is_valid_token = get_user_info(CONFIG["token"])
            status = STATUSES[status_count % len(STATUSES)]
            time_formatted = f"{Fore.MAGENTA}{time.strftime('%I:%M %p', time.localtime())}{Fore.RESET}"
            token_color = f"{Fore.GREEN}" if is_valid_token else f"{Fore.RED}"
            token_masked = CONFIG["token"][:6] + "******"
            token_info = f"{token_masked} | {user_info}"
            status_colored = f"{Fore.CYAN}{status}{Fore.RESET}"

            emoji_data = EMOJIS[emoji_count % len(EMOJIS)].split(':')
            if len(emoji_data) == 2:
                emoji_name, emoji_id = emoji_data
            elif len(emoji_data) == 1:
                emoji_name = emoji_data[0]
                emoji_id = None
            else:
                print(f"{Fore.RED}Invalid emoji: {EMOJIS[emoji_count % len(EMOJIS)]}{Fore.RESET}")
                emoji_count += 1
                continue

            print(f"{time_formatted} Status changed for: {token_color}{token_info}{Fore.RESET}. "
                  f"New status message: {status_colored}. | Emoji: ({emoji_name}) | Status: online")
            change_status(CONFIG["token"], status, emoji_name, emoji_id)

            status_count += 1
            emoji_count += 1
            time.sleep(TIME_CONFIG["status_update_interval"])

    except KeyboardInterrupt:
        print(f"{Fore.YELLOW}Stopping program...{Fore.RESET}")
        stop_event.set()  # Signal the RPC thread to stop
        time.sleep(2)  # Give time for the thread to clean up