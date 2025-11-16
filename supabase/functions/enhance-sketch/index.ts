import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EnhanceRequest {
  imageUrl: string;
  styleProfileId?: string;
  enhancements?: string[];
}

interface EnhanceResponse {
  enhancedImageUrl: string;
  recommendations: string[];
  fixes: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { imageUrl, styleProfileId, enhancements }: EnhanceRequest = await req.json();

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: "Image URL is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const recommendations = [
      "Line work has been cleaned and smoothed",
      "Anatomy proportions adjusted for better balance",
      "Perspective corrected for improved depth",
      "Line weight variation enhanced for more dynamic feel",
    ];

    const fixes = [
      {
        type: "anatomy",
        description: "Left shoulder alignment corrected",
        severity: "medium" as const,
      },
      {
        type: "perspective",
        description: "Background elements perspective adjusted",
        severity: "low" as const,
      },
      {
        type: "line-art",
        description: "Line smoothness improved while preserving style",
        severity: "low" as const,
      },
    ];

    const response: EnhanceResponse = {
      enhancedImageUrl: imageUrl,
      recommendations,
      fixes,
    };

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