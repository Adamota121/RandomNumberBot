import TelegramBot from "node-telegram-bot-api";
import config from './config.json' assert { type: "json" };
import { User } from "./model/model.js";

const bot = new TelegramBot(config.token, { polling: true });

async function notifyUsers(users, message) {
    for (const user of users) {
        await bot.sendMessage(user.dataValues.userID, message);
    }
}

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    
    try {
        let user = await User.findOne({ where: { userID: chatId } });
        if (!user) {
            user = await User.create({ userID: chatId, admin: false });
        }

        if (!user.admin) {
            switch (text) {
                case '/start':
                    await bot.sendMessage(chatId, "Для получения числа нажмите кнопку", {
                        reply_markup: {
                            keyboard: [[{ text: "Получить число" }]]
                        }
                    });
                    break;
                case "Получить число":
                    const num = Math.floor(Math.random() * 999999) + 1;
                    await bot.sendMessage(chatId, `Ваше число: ${num}`);
                    const admins = await User.findAll({ where: { admin: true } });
                    const notification = `${msg.from.id} получил число: ${num}`;
                    await notifyUsers(admins, notification);
                    break;
            }
        } else {
            const nonAdmins = await User.findAll({ where: { admin: false } });
            await notifyUsers(nonAdmins, text);
        }
    } catch (err) {
        console.error(err);
        await bot.sendMessage(chatId, "Произошла ошибка, попробуйте еще раз.");
    }
});