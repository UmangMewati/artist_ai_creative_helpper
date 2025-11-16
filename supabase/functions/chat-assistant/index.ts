import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are an AI art assistant helping artists improve their work. Follow these strict rules:

1. ASSIST, DON'T REPLACE: Never generate complete artwork or overpaint with AI style
2. PRESERVE STYLE: Respect and maintain the artist's unique style and vision
3. FOCUS ON: Feedback, corrections, suggestions, and technical improvements
4. BE CONSTRUCTIVE: Point out issues gently and offer actionable solutions
5. TECHNICAL ONLY: Help with anatomy, perspective, composition, color theory, lighting
6. NO CREATIVITY THEFT: Never suggest removing the artist's creative choices
7. EDUCATE: Explain the 'why' behind your suggestions
8. ENCOURAGE: Be supportive and recognize what works well

Give specific, actionable feedback that empowers the artist to improve their own work.`;

interface ChatRequest {
  message: string;
  imageUrl?: string;
  context?: string[];
}

interface ChatResponse {
  message: string;
  suggestions: string[];
  tips?: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { message, imageUrl, context }: ChatRequest = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const lowerMessage = message.toLowerCase();
    let response: ChatResponse;

    if (lowerMessage.includes('composition') || lowerMessage.includes('layout')) {
      response = {
        message: "Your composition has good potential! I notice the main subject is centered, which works but can feel static. Consider using the rule of thirds - placing your focal point at one of the intersection points creates more visual interest and guides the viewer's eye naturally through the piece. The negative space on the left could be used to add depth or lead the viewer toward your subject.",
        suggestions: [
          "Apply rule of thirds overlay",
          "Show dynamic composition examples",
          "Analyze current balance",
        ],
        tips: [
          "Leading lines naturally guide the viewer's eye",
          "Asymmetrical compositions often feel more dynamic",
          "Leave breathing room around your focal point",
        ],
      };
    } else if (lowerMessage.includes('color') || lowerMessage.includes('palette')) {
      response = {
        message: "Let's talk about color harmony! For your current piece, I'd suggest building a palette around complementary colors to create visual interest. If your main subject uses warm tones (oranges, reds), try introducing cool blues or greens in the background for contrast. This creates depth and makes your subject pop without fighting for attention. Consider the mood you want - warm palettes feel inviting, cool palettes feel calm or mysterious.",
        suggestions: [
          "Generate complementary palette",
          "Show color theory basics",
          "Preview palette on sketch",
        ],
        tips: [
          "Use the 60-30-10 rule: 60% dominant color, 30% secondary, 10% accent",
          "Desaturated colors recede, saturated colors advance",
          "Limit your palette to 3-5 main colors for cohesion",
        ],
      };
    } else if (lowerMessage.includes('anatomy') || lowerMessage.includes('proportion') || lowerMessage.includes('body')) {
      response = {
        message: "Your anatomy is looking solid overall! I notice the shoulders could use a small adjustment - the left one appears slightly elevated compared to the right. When the body is in a neutral stance, shoulders should align horizontally unless there's intentional weight shift. The proportions are good - just lowering that shoulder about 5-10% would create better balance. Everything else is working well, especially the arm lengths and torso proportion!",
        suggestions: [
          "Show anatomy reference overlay",
          "View correct shoulder alignment",
          "Find pose references",
        ],
        tips: [
          "Use a mirror to check your own body proportions",
          "The elbow typically aligns with the bottom of the ribcage",
          "Shoulders are wider than hips in most body types",
        ],
      };
    } else if (lowerMessage.includes('lighting') || lowerMessage.includes('shadow') || lowerMessage.includes('light')) {
      response = {
        message: "Great question about lighting! Right now your light source seems to be coming from above-right, which is a classic setup. To make your subject really pop, consider adding rim lighting - a subtle highlight along the edges opposite your main light source. This separates the subject from the background and adds dimension. For the shadows, they could be a bit deeper to increase contrast. Remember: shadows aren't just black - they pick up reflected light and colors from nearby surfaces.",
        suggestions: [
          "Add rim light effect",
          "Show lighting reference diagrams",
          "Adjust shadow intensity",
        ],
        tips: [
          "Warm light creates cool shadows, cool light creates warm shadows",
          "Cast shadows are sharper closer to the object",
          "Indirect lighting (bounce light) softens harsh shadows",
        ],
      };
    } else if (lowerMessage.includes('perspective') || lowerMessage.includes('depth') || lowerMessage.includes('3d')) {
      response = {
        message: "Let's enhance the sense of depth in your piece! The foreground elements are working well, but the background could use some atmospheric perspective. Objects further away should be: 1) Less detailed, 2) Lower contrast, 3) Slightly bluer/cooler in tone, 4) Lighter in value. This tricks the eye into perceiving distance. Also, check your vanishing points - the lines on the left side seem to converge slightly differently than the right side.",
        suggestions: [
          "Show perspective grid overlay",
          "Demonstrate atmospheric perspective",
          "Fix vanishing point alignment",
        ],
        tips: [
          "Use 1-point perspective for calm, frontal views",
          "2-point perspective adds dynamism to scenes",
          "Overlap objects to create depth layers",
        ],
      };
    } else if (lowerMessage.includes('line') || lowerMessage.includes('sketch') || lowerMessage.includes('drawing')) {
      response = {
        message: "Your line work shows good control! The main lines are confident and clean. For more visual interest, try varying your line weight - thicker lines for areas closer to the viewer or where forms overlap, thinner lines for edges further away or lighter details. This technique, called line weight variation, adds depth without color or shading. Some lines could also be more gestural in areas that aren't the focal point.",
        suggestions: [
          "Apply line weight suggestions",
          "Show line quality examples",
          "Clean up construction lines",
        ],
        tips: [
          "Thick lines come forward, thin lines recede",
          "Vary pressure for more organic, natural lines",
          "Use thicker outlines to separate overlapping forms",
        ],
      };
    } else {
      response = {
        message: "I'm here to help with your artwork! I can provide feedback on composition, color theory, anatomy, lighting, perspective, and line work. What specific aspect would you like me to focus on? You can also upload your sketch and I'll analyze it to give you targeted suggestions. Remember, my goal is to help you improve your skills, not to change your artistic vision!",
        suggestions: [
          "Analyze composition",
          "Review color palette",
          "Check anatomy proportions",
          "Evaluate lighting setup",
        ],
        tips: [
          "Save your work in stages to track progress",
          "Study references but don't copy them directly",
          "Take breaks to see your work with fresh eyes",
        ],
      };
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});