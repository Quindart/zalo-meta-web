import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject} from "ai";
import { z } from "zod";

export class AIService {
  private model;

  constructor(apiKey = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY) {
    const googleAI = createGoogleGenerativeAI({
      apiKey,
    });

    this.model = googleAI("gemini-2.0-flash");
  }

  async checkImage(file: File) {
    try {
      const imageBuffer = await file.arrayBuffer();
      const base64Image = btoa(
        new Uint8Array(imageBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      const { object } = await generateObject({
        model: this.model,
        messages: [
          {
            role: "system",
            content: `Bạn là một AI đánh giá hình ảnh, nhiệm vụ của bạn là kiểm tra xem hình ảnh có chứa nội dung vi phạm như: thuốc lá, rượu bia, chất cấm, vũ khí hoặc hình ảnh trái phép hay không; nếu ảnh vi phạm, hãy trả về lý do mô tả rõ nội dung vi phạm (ví dụ: ảnh có chứa điếu thuốc, chai rượu, vũ khí, hoa...); luôn trả lời bằng tiếng Việt, trình bày rõ ràng, dễ hiểu, có sử dụng emoji phù hợp nếu cần.`,
          },
          {
            role: "user",
            content: [
              {
                type: "image",
                image: base64Image,
              },
            ],
          },
        ],

        schema: z.object({
          isValid: z.boolean(),
          reason: z.string().optional().describe("Lý do nếu isValid là false"),
        }),
      });

      return object;
    } catch (error) {
      console.error("Lỗi khi phân tích hình ảnh:", error);
      throw error;
    }
  }

  
}

export const aiService = new AIService();
