import discord
import json
import os
from discord.ext import commands
import random
import asyncio

# Cấu hình bot
TOKEN = 'tokenbotcuaban'  # Token của bot
DELAY_MIN = 0.3  # Thời gian delay tối thiểu giữa các tin nhắn (giây)
DELAY_MAX = 1.0  # Thời gian delay tối đa giữa các tin nhắn (giây)
PRIVATE_MESSAGE = True  # True: Ảnh chỉ hiển thị cho người dùng (ephemeral cho slash, DM cho prefix); False: Ảnh công khai

# Cấu hình intents
intents = discord.Intents.default()
intents.message_content = True
intents.guilds = True
intents.messages = True
intents.dm_messages = True  # Bật intent để gửi DM

# Khởi tạo bot với prefix '!'
bot = commands.Bot(command_prefix='!', intents=intents)

# Xác định thư mục hiện tại của file Python
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, 'segspam.json')

# Dictionary để lưu các task spam của từng user
spam_tasks = {}

# Hàm kiểm tra và tạo file segspam.json
def load_or_create_config():
    if not os.path.exists(CONFIG_FILE):
        print(f"File {CONFIG_FILE} không tồn tại. Đang tạo file mới...")
        empty_config = {}
        with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
            json.dump(empty_config, f, indent=4, ensure_ascii=False)
        print(f"Đã tạo file {CONFIG_FILE} rỗng. Vui lòng thêm dữ liệu theo định dạng!")
    else:
        print(f"Đã tìm thấy file {CONFIG_FILE}. Đang tải dữ liệu...")

    with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError as e:
            print(f"Lỗi cú pháp trong file {CONFIG_FILE}: {e}")
            return {}

# Tải dữ liệu từ file segspam.json
image_data = load_or_create_config()
print(f"Dữ liệu lệnh đã tải: {list(image_data.keys())}")

# Hàm spam ảnh/video
async def spam_images(channel, command, amount, context):
    user = context.author if hasattr(context, 'author') else context.user
    user_id = user.id
    image_list = image_data.get(command, [])
    if not image_list:
        if isinstance(context, discord.Interaction):
            await context.response.send_message("Không có nội dung để spam cho lệnh này!", ephemeral=True)
        else:
            if PRIVATE_MESSAGE:
                await channel.send("Không thể gửi DM. Vui lòng dùng slash command hoặc cho phép DM!", delete_after=5.0)
            else:
                await channel.send("Không có nội dung để spam cho lệnh này!")
        return

    max_amount = min(amount, 100)
    sent = 0

    task = asyncio.create_task(spam_images_task(channel, command, max_amount, context, user))
    if user_id not in spam_tasks:
        spam_tasks[user_id] = set()
    spam_tasks[user_id].add(task)

    try:
        await task
    except asyncio.CancelledError:
        if isinstance(context, discord.Interaction):
            await context.followup.send("Quá trình spam đã bị hủy!", ephemeral=True)
        else:
            if PRIVATE_MESSAGE:
                await channel.send("Quá trình spam đã bị hủy!", delete_after=5.0)
            else:
                await channel.send("Quá trình spam đã bị hủy!")
    finally:
        if user_id in spam_tasks and task in spam_tasks[user_id]:
            spam_tasks[user_id].remove(task)
            if not spam_tasks[user_id]:
                del spam_tasks[user_id]

async def spam_images_task(channel, command, amount, context, user):
    image_list = image_data.get(command, [])
    used_contents = set()  # Theo dõi nội dung đã dùng để tránh lặp lại
    is_dm = isinstance(channel, discord.DMChannel)

    for _ in range(amount):
        if len(used_contents) >= len(image_list):
            used_contents.clear()  # Reset nếu đã dùng hết
        available_contents = [item for item in image_list if item not in used_contents]
        if not available_contents:
            random_content = random.choice(image_list)
        else:
            random_content = random.choice(available_contents)
        used_contents.add(random_content)

        if PRIVATE_MESSAGE:
            # Logic private: Gửi tại vị trí gọi lệnh nhưng chỉ cho người dùng
            if isinstance(context, discord.Interaction):
                # Slash command: Sử dụng ephemeral trong server hoặc DM
                await context.followup.send(random_content, ephemeral=True)
            else:
                # Prefix command: Gửi qua DM nếu trong server, hoặc trong channel nếu trong DM
                try:
                    await channel.send(random_content)  # Gửi trong channel/DM, nhưng không public
                except discord.Forbidden:
                    await user.send(random_content)  # Fallback to DM if channel send fails
        else:
            # Gửi công khai nếu PRIVATE_MESSAGE = False
            await channel.send(random_content)
        await asyncio.sleep(random.uniform(DELAY_MIN, DELAY_MAX))  # Delay ngẫu nhiên

# Event khi bot sẵn sàng
@bot.event
async def on_ready():
    print(f'Đã đăng nhập với tên: {bot.user}')
    try:
        # Xóa toàn bộ slash commands hiện tại (global và guild-specific)
        bot.tree.clear_commands(guild=None)
        for guild in bot.guilds:
            bot.tree.clear_commands(guild=guild)
        print("Đã xóa tất cả slash commands cũ.")

        # Đăng ký slash commands thủ công cho /help và /stop
        bot.tree.add_command(
            discord.app_commands.Command(
                name="help",
                description="Hiển thị danh sách các lệnh hỗ trợ",
                callback=help_command
            )
        )
        bot.tree.add_command(
            discord.app_commands.Command(
                name="stop",
                description="Dừng tất cả các quá trình spam ảnh/video của bạn",
                callback=stop_command
            )
        )

        # Đăng ký dynamic slash commands từ image_data
        for command_name, content_list in image_data.items():
            if command_name not in ['!help', '!menu'] and content_list:
                command_name_slash = command_name[1:]
                @bot.tree.command(name=command_name_slash, description=f"Spam ảnh/video cho lệnh {command_name_slash} (Ví dụ: /{command_name_slash} amount: 5)")
                @discord.app_commands.describe(amount="Số lượng ảnh/video cần spam (tối đa 100)")
                async def dynamic_command(interaction: discord.Interaction, amount: int = 1):
                    if amount < 1:
                        await interaction.response.send_message("Số lượng phải lớn hơn 0!", ephemeral=True)
                        return
                    await interaction.response.defer(ephemeral=True)
                    await spam_images(interaction.channel, f"!{command_name_slash}", min(amount, 100), interaction)
                    await interaction.followup.send(f"Đã spam {min(amount, 100)} ảnh/video!", ephemeral=True)

                print(f"Đã đăng ký slash command: /{command_name_slash}")

        # Đồng bộ slash commands
        synced = await bot.tree.sync()
        print(f'Đã đồng bộ {len(synced)} slash commands.')
        print(f"Danh sách commands đã đồng bộ: {[cmd.name for cmd in synced]}")
    except Exception as e:
        print(f'Lỗi khi đồng bộ slash commands: {e}')

# Xử lý prefix commands
@bot.event
async def on_message(message):
    if message.author.bot:
        return

    if message.content.startswith('!'):
        args = message.content.split()
        command = args[0].lower()
        amount = int(args[1]) if len(args) > 1 and args[1].isdigit() else 1

        full_command = command
        if full_command in image_data:
            if full_command == '!help':
                await send_help(message.channel)
            else:
                await spam_images(message.channel, full_command, amount, message)
        elif full_command == '!stop':
            user_id = message.author.id
            if user_id in spam_tasks and spam_tasks[user_id]:
                for task in spam_tasks[user_id].copy():
                    task.cancel()
                del spam_tasks[user_id]
                await message.channel.send("Đã hủy tất cả các quá trình spam của bạn!")
            else:
                await message.channel.send("Bạn chưa có quá trình spam nào để dừng!")

# Xử lý slash commands
async def help_command(interaction: discord.Interaction):
    await interaction.response.send_message(get_help_text(), ephemeral=True)

async def stop_command(interaction: discord.Interaction):
    user_id = interaction.user.id
    if user_id in spam_tasks and spam_tasks[user_id]:
        for task in spam_tasks[user_id].copy():
            task.cancel()
        del spam_tasks[user_id]
        await interaction.response.send_message("Đã hủy tất cả các quá trình spam của bạn!", ephemeral=True)
    else:
        await interaction.response.send_message("Bạn chưa có quá trình spam nào để dừng!", ephemeral=True)

# Hàm gửi help
async def send_help(channel):
    await channel.send(get_help_text())

def get_help_text():
    return f"**Danh sách lệnh hỗ trợ:**\n" \
           f"Dùng prefix \`!\` hoặc slash command \`/\`.\n" \
           f"- Ví dụ prefix: `!boobs 5` (spam 5 ảnh/video)\n" \
           f"- Ví dụ slash command: `/boobs amount: 5` (spam 5 ảnh/video)\n" \
           f"- Dừng spam: `!stop` hoặc `/stop` (hủy tất cả spam của bạn)\n" \
           f"- Số lượng tối đa: 100 ảnh/video\n" \
           f"- Các lệnh:\n" \
           f"{chr(10).join([f'  - {cmd} hoặc /{cmd[1:]}' for cmd in image_data.keys() if image_data[cmd]])}"

# Chạy bot
bot.run(TOKEN)