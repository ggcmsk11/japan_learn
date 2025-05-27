import { SmtpClient } from "npm:smtp@0.1.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function sendEmail(email: string) {
  const client = new SmtpClient()

  await client.connectTLS({
    hostname: "smtp.gmail.com",
    port: 465,
    username: Deno.env.get('SMTP_USERNAME'),
    password: Deno.env.get('SMTP_PASSWORD'),
  })

  await client.send({
    from: "no-reply@chunshuariyu.com",
    to: email,
    subject: "感谢订阅纯刷日语",
    content: `
      感谢您订阅纯刷日语！
      
      我们会定期为您发送优质的日语学习资讯和独家内容。
      
      如果您想要取消订阅，请联系我们的客服。
      
      祝您学习愉快！
      纯刷日语团队
    `,
  })

  await client.close()
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()

    if (!email) {
      throw new Error('请输入邮箱地址')
    }

    if (!validateEmail(email)) {
      throw new Error('邮箱格式不正确')
    }

    // Send welcome email
    await sendEmail(email)

    return new Response(
      JSON.stringify({ 
        success: true,
        message: '订阅成功！我们已向您发送了一封欢迎邮件。'
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : '订阅失败，请稍后重试'
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
})