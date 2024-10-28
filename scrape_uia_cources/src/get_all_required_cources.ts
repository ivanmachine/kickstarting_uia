import type { Cource } from "./datatypes.d.ts";

const UIA_URL = ""
export async function get_all_required_cources(): Promise<Cource[]> {
    const res = await fetch(UIA_URL);
    const html = await res.text();
    return [];
}