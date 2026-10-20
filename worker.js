// Cloudflare Worker: 텔레그램 봇 웹훅
// /start 를 받으면 환영 메시지 + "게임 열기" 버튼으로 답한다.
// 필요한 환경 변수(Secret): BOT_TOKEN, WEBHOOK_SECRET

const APP_URL = 'https://dongjun2661-beep.github.io/telegram-games/';

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('ok');

    // 텔레그램이 보낸 요청인지 확인
    if (request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== env.WEBHOOK_SECRET) {
      return new Response('forbidden', { status: 403 });
    }

    const update = await request.json();
    const msg = update.message;
    if (!msg?.text) return new Response('ok');

    if (msg.text.startsWith('/start') || msg.text.startsWith('/play')) {
      const name = msg.from?.first_name || '플레이어';
      await sendMessage(env, {
        chat_id: msg.chat.id,
        text:
          `🎮 ${name}님, 미니 보드게임에 오신 걸 환영해요!\n\n` +
          `💣 지뢰찾기  🔢 스도쿠  ♟️ 체스\n🪩 핀볼  🏇 경마\n\n` +
          `아래 버튼을 눌러 바로 시작하세요 👇`,
        reply_markup: {
          inline_keyboard: [[{ text: '🎮 게임 열기', web_app: { url: APP_URL } }]],
        },
      });
    }

    return new Response('ok');
  },
};

function sendMessage(env, body) {
  return fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}
