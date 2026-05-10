export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 管理端：获取/更新模型列表
    if (url.pathname === "/api/models") {
      if (request.method === "GET") {
        return new Response(await env.MODEL_CONFIG.get("LIST") || "[]");
      }
      if (request.method === "POST") {
        const body = await request.json();
        await env.MODEL_CONFIG.put("LIST", JSON.stringify(body));
        return new Response("Success");
      }
    }

    // 客户端：AI 聊天逻辑 (集成 AI Gateway)
    if (url.pathname === "/api/chat" && request.method === "POST") {
      const { prompt, model, fileKey } = await request.json();
      
      // 调用通过 AI Gateway 包装的路径
      const aiResponse = await fetch(`${env.AI_GATEWAY_URL}/workers-ai/${model}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      return aiResponse;
    }
    
    return new Response("Not Found", { status: 404 });
  }
}

///**
// * Welcome to Cloudflare Workers! This is your first worker.
// *
// * - Run `npm run dev` in your terminal to start a development server
// * - Open a browser tab at http://localhost:8787/ to see your worker in action
// * - Run `npm run deploy` to publish your worker
// *
// * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
// * `Env` object can be regenerated with `npm run cf-typegen`.
// *
// * Learn more at https://developers.cloudflare.com/workers/
// */

//export default {
//	async fetch(request, env, ctx): Promise<Response> {
//		return new Response('Hello World!');
//	},
//} satisfies ExportedHandler<Env>;
