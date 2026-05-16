// App icon (favicon). Auto-served as /icon by Next.js.
// Generated via next/og so we don't ship a PNG.
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#050505",
                    color: "#10b981",
                    fontSize: 24,
                    fontWeight: 700,
                    borderRadius: 6,
                }}
            >
                ▲
            </div>
        ),
        { ...size }
    );
}
