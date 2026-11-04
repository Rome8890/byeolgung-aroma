// Vercel Serverless Function: 토스페이먼츠 결제 승인 API
// POST /api/confirm
// Body: { paymentKey, orderId, amount }

export default async function handler(req, res) {
  // CORS 및 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { paymentKey, orderId, amount } = req.body;

    if (!paymentKey || !orderId || !amount) {
      return res.status(400).json({
        message: '결제 승인에 필요한 필수 정보(paymentKey, orderId, amount)가 누락되었습니다.'
      });
    }

    // Vercel 환경 변수에 설정된 라이브 시크릿 키, 없으면 기본 테스트 시크릿 키 사용
    const secretKey = process.env.TOSS_SECRET_KEY || 'test_sk_zXLkKEypNArWmo50nX3VQmNoyrQm';
    const basicAuth = Buffer.from(secretKey + ':').toString('base64');

    // 토스페이먼츠 공식 결제 승인 API 호출
    const tossResponse = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) })
    });

    const data = await tossResponse.json();

    if (!tossResponse.ok) {
      console.error('Toss payment confirm failed:', data);
      return res.status(tossResponse.status).json(data);
    }

    // 실시간 텔레그램 매출 알림 (옵션: TELEGRAM_BOT_TOKEN과 TELEGRAM_CHAT_ID 환경변수 설정 시)
    const tgBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;
    if (tgBotToken && tgChatId) {
      try {
        const text = `🌸 [별궁시아 아로마타로 결제 알림]\n\n` +
          `• 결제 항목: ${data.orderName || '세 장 심층 리딩'}\n` +
          `• 결제 금액: ${Number(amount).toLocaleString()}원\n` +
          `• 주문 번호: ${orderId}\n` +
          `• 결제 수단: ${data.method || '간편결제'}\n` +
          `• 결제 시각: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`;

        await fetch(`https://api.telegram.org/bot${tgBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: tgChatId, text: text })
        });
      } catch (tgError) {
        console.error('Telegram push notification error:', tgError);
      }
    }

    return res.status(200).json({
      success: true,
      message: '결제가 성공적으로 승인되었습니다.',
      data
    });
  } catch (error) {
    console.error('Server error during payment confirmation:', error);
    return res.status(500).json({
      message: '결제 승인 처리 중 서버 내부 오류가 발생했습니다.',
      error: error.message
    });
  }
}
