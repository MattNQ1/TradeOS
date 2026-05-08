// Server-only fetch for the prop firm config.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_CONFIG, type PropFirmConfig } from "./types";

/** Returns the user's config, or a default config if none has been saved yet. */
export async function fetchPropFirmConfig(): Promise<PropFirmConfig> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        // Layout already redirects unauthenticated users — this is a safety fallback.
        return { user_id: "", updated_at: new Date().toISOString(), ...DEFAULT_CONFIG };
    }

    const { data, error } = await supabase
        .from("prop_firm_config")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

    if (error) {
        console.error("fetchPropFirmConfig error:", error.message);
    }

    if (data) return data as PropFirmConfig;

    // No row yet — return defaults; row will be created on first save.
    return {
        user_id: user.id,
        updated_at: new Date().toISOString(),
        ...DEFAULT_CONFIG,
    };
}
