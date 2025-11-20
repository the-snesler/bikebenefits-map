export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // Handle API routes
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      return handleChat(request, env)
    }

    // For all other requests, let the static assets handle it
    return env.ASSETS.fetch(request)
  }
}

async function handleChat(request, env) {
  try {
    const { message, businesses } = await request.json()

    // Create context about businesses
    const businessContext = businesses
      .map(b => `- ${b.name} (${b.category?.name || 'Business'}): ${b.discount} - ${b.address}${b.distance ? ` - ${Math.round(b.distance * 7)} min by bike` : ''}`)
      .join('\n')

    const systemPrompt = `You are a helpful assistant for Bicycle Benefits in Madison, WI. You help cyclists find businesses that offer discounts to people who arrive by bicycle.

Here are the nearby participating businesses:
${businessContext}

Be concise and friendly. When recommending businesses, mention their discount and approximate bike time. If asked about categories, list relevant options. Keep responses brief (2-3 sentences max).`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-20250514',
        max_tokens: 300,
        system: systemPrompt,
        messages: [
          { role: 'user', content: message }
        ]
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Claude API error:', error)
      throw new Error('Claude API request failed')
    }

    const data = await response.json()
    const assistantMessage = data.content[0].text

    return new Response(JSON.stringify({ response: assistantMessage }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Chat error:', error)
    return new Response(JSON.stringify({ error: 'Failed to process chat' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
