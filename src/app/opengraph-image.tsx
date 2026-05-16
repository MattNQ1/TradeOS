// Open Graph image for / (the landing page).
// Generated at request time via next/og. 1200x630 is the recommended size
// for OG / Twitter cards — both render this same image.
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TradeOS — Built by traders, for traders";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    background:
                        "linear-gradient(135deg, #050505 0%, #062e26 70%, #0a3d34 100%)",
                    color: "white",
                    fontFamily: "sans-serif",
                    padding: "80px 90px",
                }}
            >
                {/* Top row: triangle mark + wordmark */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 18,
                        marginBottom: 60,
                    }}
                >
                    <div
                        style={{
                            fontSize: 56,
                            color: "#10b981",
                            lineHeight: 1,
                        }}
                    >
                        ▲
                    </div>
                    <div
                        style={{
                            fontSize: 40,
                            fontWeight: 700,
                            color: "white",
                            letterSpacing: -1,
                        }}
                    >
                        TradeOS
                    </div>
                </div>

                {/* Headline */}
                <div
                    style={{
                        fontSize: 76,
                        fontWeight: 800,
                        lineHeight: 1.05,
                        letterSpacing: -2,
                        color: "white",
                        maxWidth: 980,
                    }}
                >
                    The trading toolkit prop firms hope you don&rsquo;t have.
                </div>

                {/* Tagline */}
                <div
                    style={{
                        marginTop: 36,
                        fontSize: 30,
                        color: "#a8b8b3",
                        fontWeight: 500,
                    }}
                >
                    Built by traders, for traders. Topstep · Apex · MFF · FTMO.
                </div>
            </div>
        ),
        { ...size }
    );
}
