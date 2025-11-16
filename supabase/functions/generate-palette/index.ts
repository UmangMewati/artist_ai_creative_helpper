import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PaletteRequest {
  imageUrl?: string;
  description?: string;
  mood?: string;
}

interface PaletteTheme {
  name: string;
  colors: string[];
  mood: string;
  lighting: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { imageUrl, description, mood }: PaletteRequest = await req.json();

    const themes: PaletteTheme[] = [
      {
        name: "Pastel Dream",
        colors: ["#FFB3BA", "#BAFFC9", "#BAE1FF", "#FFFFBA", "#FFDFBA"],
        mood: "Soft, whimsical, calming",
        lighting: "Warm, diffused natural light",
      },
      {
        name: "Noir Mystery",
        colors: ["#1A1A1D", "#4E4E50", "#6F2232", "#C3073F", "#950740"],
        mood: "Dramatic, mysterious, intense",
        lighting: "High contrast, dramatic shadows",
      },
      {
        name: "Sunset Warmth",
        colors: ["#FF6B6B", "#FFA07A", "#FFD93D", "#F95700", "#FF4E50"],
        mood: "Warm, energetic, vibrant",
        lighting: "Golden hour, warm backlight",
      },
      {
        name: "Cyberpunk Neon",
        colors: ["#0A0E27", "#B400FF", "#00FFF0", "#FF006E", "#FFBE0B"],
        mood: "Futuristic, electric, bold",
        lighting: "Neon glow, cool rim lights",
      },
      {
        name: "Forest Serenity",
        colors: ["#2D4A3E", "#6B9080", "#A4C3B2", "#CCE3DE", "#F6FFF8"],
        mood: "Natural, peaceful, grounded",
        lighting: "Dappled sunlight, cool shadows",
      },
      {
        name: "Desert Mirage",
        colors: ["#E76F51", "#F4A261", "#E9C46A", "#2A9D8F", "#264653"],
        mood: "Earthy, warm, adventurous",
        lighting: "Harsh sunlight, warm tones",
      },
    ];

    return new Response(
      JSON.stringify({ themes }),
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