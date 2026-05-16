// Apple touch icon — what iOS uses when adding the PWA to home screen.
// Larger than the favicon, dark background with the emerald triangle mark.
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
                    fontSize: 120,
                    fontWeight: 700,
                }}
            >
                ▲
            </div>
        ),
        { ...size }
    );
}
